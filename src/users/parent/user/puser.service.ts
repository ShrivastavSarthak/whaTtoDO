import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { pUser } from 'src/Schemas/pSchema/pUser.schema';
import {
  AddChild,
  CreatePatentDto,
  LoginUserDto,
  VerifyUser,
} from './dto/Puser.dto';
import { User } from 'src/Schemas/cSchema/user.schema';
import bcrypt from 'bcryptjs';
import { EmailService } from 'src/utils/email';
import { EmailOptions } from 'src/type';

@Injectable()
export class pUserService {
  constructor(
    @InjectModel(pUser.name) private pUserModel: Model<pUser>,
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async signupParent(createParentDto: CreatePatentDto) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(createParentDto.password, salt);

      const newParent = await this.pUserModel.create({
        name: createParentDto.name,
        userName: createParentDto.userName,
        email: createParentDto.email,
        phoneNo: createParentDto.phoneNo,
        password: hashedPassword,
        gender: createParentDto.gender,
        occupation: createParentDto.occupation,
      });

      if (newParent) {
        const mailOptions: EmailOptions = {
          to: newParent.email,
          subject: 'One step away!!',
          body: 'Hey!! click on the below link to verify your email',
        };
        this.emailService.sendMail(mailOptions);
      }

      return {
        message: 'parent created successfully',
        newParent,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async loginParent(
    loginUser: LoginUserDto,
  ): Promise<{ access_token: string; user_id: any }> {
    try {
      const isParent = await this.pUserModel.findOne({
        $or: [{ userName: loginUser.userNameOrEmail }, { email: loginUser.userNameOrEmail }],
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
        };
      }
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async addChildren(addChild: AddChild) {
    try {
      const findChild: any = await this.userModel.findOne({
        userName: addChild.childUsername,
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

  async verifyUser(verifyUser: VerifyUser) {
    try {
      const check = await this.pUserModel.findByIdAndUpdate(verifyUser.id, {
        verified: true,
      });

      if (check) {
        return {
          message: 'User verified successfully',
          check,
        };
      }
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  async resendVerificationEmail(verifyUser: VerifyUser) {
    try {
      const findUser = await this.pUserModel.findById(verifyUser.id);

      if (findUser) {
        const mailOptions: EmailOptions = {
          to: findUser.email,
          subject: 'Just one step away!!',
          body: 'Hey!! click on the below link to verify your email',
        };
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
