import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import {
  UserRoleEnum
} from 'src/lib/enums/common.enums';
import { Child } from 'src/Schemas/cSchema/child.schema';
import { pUser } from 'src/Schemas/pSchema/pUser.schema';
import { EmailOptions } from 'src/type';
import { EmailService } from 'src/utils/services/email';
import { ParentSignupFieldValidators } from 'src/utils/validators/fieldValidators';
import {
  AddChild,
  CreatePatentDto,
  LoginUserDto,
  ResendVerificationEmail
} from './dto/Puser.dto';

@Injectable()
export class pUserService {
  constructor(
    @InjectModel(pUser.name) private pUserModel: Model<pUser>,
    @InjectModel(Child.name) private userModel: Model<Child>,
    
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async signupParent(createParentDto: CreatePatentDto) {
    const user = {
      name: createParentDto.name,
      username: createParentDto.username,
      email: createParentDto.email,
      phoneNo: createParentDto.phoneNo,
      password: createParentDto.password,
      gender: createParentDto.gender,
      occupation: createParentDto.occupation,
    };

    if (!ParentSignupFieldValidators(user)) {
      return;
    }

    const isUserExist = await this.pUserModel.aggregate([
      {
        $match: {
          $or: [
            { email: createParentDto.email },
            { phoneNo: createParentDto.phoneNo },
            { username: createParentDto.username },
          ],
        },
      },
    ]);

    if (isUserExist.length > 0) {
      throw new BadRequestException('User already exist');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createParentDto.password, salt);

    const newParent = await this.pUserModel.create({
      name: createParentDto.name,
      username: createParentDto.username,
      email: createParentDto.email,
      phoneNo: createParentDto.phoneNo,
      password: hashedPassword,
      gender: createParentDto.gender,
      occupation: createParentDto.occupation,
    });

    if (newParent) {
      const emailToken = this.jwtService.sign(
        { id: newParent._id },
        { secret: process.env.JWT_SECRET, expiresIn: '5M' },
      );

      await this.pUserModel.findByIdAndUpdate(newParent._id, {
        verificationToken: emailToken,
        tokenExpiry: new Date(Date.now() + 5 * 60 * 1000),
      });

      const verificationLink = `${process.env.FRONTEND_DEV_URL}/${newParent._id}/${emailToken}`;
      const mailOptions: EmailOptions = {
        to: newParent.email,
        subject: 'Just one step away!!',
        body: `Hey!! click on the this link to verify your account: ${verificationLink}`,
      };
      this.emailService.sendMail(mailOptions);
    }

    const payload = { id: newParent._id, isVerified: newParent.isVerified };
    return {
      message: 'user created successfully',
      user_id: newParent._id,
      role: UserRoleEnum.PARENT,
      homeId: newParent.homeId,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async loginParent(loginUser: LoginUserDto): Promise<{
    access_token: string;
    user_id: any;
    role: string;
    homeId: string;
  }> {
    try {
      const isParent = await this.pUserModel.findOne({
        $or: [{ username: loginUser.username }, { email: loginUser.username }],
      });

      if (isParent) {
        const password = await bcrypt.compare(
          loginUser.password,
          isParent.password,
        );

        if (!password) {
          throw new UnauthorizedException();
        }
        const payload = { id: isParent._id };

        return {
          access_token: await this.jwtService.signAsync(payload),
          user_id: isParent._id,
          homeId: isParent.homeId,
          role: UserRoleEnum.PARENT,
        };
      }
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async addChildren(addChild: AddChild) {
    try {
      const findChild: any = await this.userModel.findOne({
        username: addChild.childUsername,
      });

      const findParent: any = await this.pUserModel.findById(addChild.parentId);

      if (!findChild && !findParent) {
        throw new Error(
          'child or parent not exist please try with different username .',
        );
      }

      // const checkParentAdded = findParent.children;

      if (findChild.parent.length >= 2) {
        return {
          message: 'Sorry only two parent are allowed',
          status: 400,
        };
      }

      const checkChildExist = await this.pUserModel.findOne({
        children: { $in: [findChild._id] },
      });

      if (checkChildExist) {
        return {
          message: 'Sorry this child is already added with you',
          status: 400,
        };
      }

      const addChildToPatent = await this.pUserModel.findByIdAndUpdate(
        addChild.parentId,
        {
          $push: { children: findChild._id },
        },
      );

      const addParentToChild = await this.userModel.findByIdAndUpdate(
        findChild._id,
        {
          $push: { parent: addChild.parentId },
        },
      );

      if (!addChildToPatent && !addParentToChild) {
        throw new Error(
          'something went wrong please try again after some time ',
        );
      }

      return {
        message: 'parent and child connection successfully established',
        child: findChild,
        parent: findParent,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getParentById(id: string) {
    try {
      const getParent = await this.pUserModel.findById(id).select('-password');
      if (!getParent) {
        throw new UnauthorizedException('User not found.');
      }
      return {
        message: 'User fetched successfully',
        user: getParent,
      };
    } catch (error) {
      throw new UnauthorizedException('User not found.');
    }
  }

  async resendVerificationEmail(
    ResendVerificationEmail: ResendVerificationEmail,
  ) {
    try {
      const findUser = await this.pUserModel.findById(
        ResendVerificationEmail.id,
      );

      if (findUser) {
        const emailToken = this.jwtService.sign(
          { id: findUser._id },
          { secret: process.env.JWT_SECRET, expiresIn: '5M' },
        );

        await this.pUserModel.findByIdAndUpdate(findUser._id, {
          verificationToken: emailToken,
          tokenExpiry: new Date(Date.now() + 5 * 60 * 1000),
        });

        const verificationLink = `${process.env.FRONTEND_DEV_URL}/${findUser._id}/${emailToken}`;
        const mailOptions: EmailOptions = {
          to: findUser.email,
          subject: 'Just one step away!!',
          body: `Hey!! click on the this link to verify your account: ${verificationLink}`,
        };
        this.emailService.sendMail(mailOptions);
        await this.emailService.sendMail(mailOptions);

        return {
          message: 'Mail send successfully',
          status: 200,
        };
      }
      return {
        message: 'User not found',
        status: 404,
      };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

}
