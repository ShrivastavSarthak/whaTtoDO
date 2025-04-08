import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { UserRoleEnum } from 'src/lib/enums/common.enums';
import { User } from 'src/Schemas/cSchema/user.schema';
import { ChildSignupInterface } from 'src/shared/interface/user-interface';
import { EmailOptions } from 'src/type';
import { EventsGateway } from 'src/utils/events/events.gateway';
import { EmailService } from 'src/utils/services/email';
import { ChildSignupFieldValidators } from 'src/utils/validators/fieldValidators';
import {
  CreateUsrDto,
  LoginUserDto,
  ResendVerificationEmail
} from './dtos/User.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
    private eventGateway: EventsGateway,
  ) {}

  async signupUser(createUserDto: CreateUsrDto) {
    const userField: ChildSignupInterface = {
      email: createUserDto.email,
      username: createUserDto.username,
      phoneNo: createUserDto.phoneNo,
      password: createUserDto.password,
    };

    const checkValidation = ChildSignupFieldValidators(userField);

    console.log(checkValidation);

    // if (!checkValidation) {
    //   throw new BadRequestException(checkValidation);
    // }
    // TODO: NEED TO IMPROVE
    const isUserExist = await this.userModel.find({
      $or: [
        { email: createUserDto.email },
        { phoneNo: createUserDto.phoneNo },
        { username: createUserDto.username },
      ],
    });
    if (isUserExist.length > 0) {
      throw new BadRequestException('User already exist');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const newChild = await this.userModel.create({
      email: createUserDto.email,
      username: createUserDto.username,
      phoneNo: createUserDto.phoneNo,
      password: hashedPassword,
    });

    if (newChild) {
      const emailToken = this.jwtService.sign(
        { id: newChild._id },
        { secret: process.env.JWT_SECRET, expiresIn: '5M' },
      );

      await this.userModel.findByIdAndUpdate(newChild._id, {
        verificationToken: emailToken,
        tokenExpiry: new Date(Date.now() + 5 * 60 * 1000),
      });

      const verificationLink = `${process.env.FRONTEND_DEV_URL}/${newChild._id}/${emailToken}`;
      const mailOptions: EmailOptions = {
        to: newChild.email,
        subject: 'Just one step away!!',
        body: `Hey!! click on the this link to verify your account: ${verificationLink}`,
      };
      this.emailService.sendMail(mailOptions);
    }

    const payload = { id: newChild._id, isVerified: newChild.isVerified };
    return {
      message: 'user created successfully',
      user_id: newChild._id,
      role: UserRoleEnum.CHILD,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async loginUser(
    loginUser: LoginUserDto,
  ): Promise<{ access_token: string; user_id: string; role: string }> {
    const isEmail: any = await this.userModel.findOne({
      email: loginUser.username,
    });

    const isUsername: any = await this.userModel.findOne({
      username: loginUser.username,
    });

    const isUser = isEmail || isUsername;

    if (isUser) {
      const checkPassword = await bcrypt.compare(
        loginUser.password,
        isUser.password,
      );
      if (checkPassword) {
        const payload = { id: isUser._id, isVerified: isUser.isVerified };
        return {
          access_token: await this.jwtService.signAsync(payload),
          user_id: isUser._id,
          role: UserRoleEnum.CHILD,
        };
      } else {
        throw new UnauthorizedException('Invalid password or username');
      }
    } else {
      throw new UnauthorizedException('Invalid password or username');
    }
  }

  async fetchUserById(id: string) {
    try {
      const user = await this.userModel.findById(id).select('-password');
      if (user) {
        return {
          message: 'User fetched successfully',
          user,
        };
      }
    } catch (err) {
      throw new UnauthorizedException();
    }
  }


  async resendVerificationEmail(
    ResendVerificationEmail: ResendVerificationEmail,
  ) {
    try {
      const findUser = await this.userModel.findById(
        ResendVerificationEmail.id,
      );

      if (findUser) {
        const emailToken = this.jwtService.sign(
          { id: findUser._id },
          { secret: process.env.JWT_SECRET, expiresIn: '5M' },
        );

        await this.userModel.findByIdAndUpdate(findUser._id, {
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
