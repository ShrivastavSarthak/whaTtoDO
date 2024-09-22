import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/Schemas/cSchema/user.schema';
import { CreateUsrDto, LoginUserDto, VerifyUser } from './dtos/User.dto';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { EmailService } from 'src/utils/email';
import { EmailOptions } from 'src/type';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async signupUser(createUserDto: CreateUsrDto) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

      const newChild = await this.userModel.create({
        email: createUserDto.email,
        userName: createUserDto.userName,
        phoneNo: createUserDto.phoneNo,
        password: hashedPassword,
      });

      if (newChild) {
        const mailOptions: EmailOptions = {
          to: newChild.email,
          subject: 'Just one step away!!',
          body: 'Hey!! click on the below link to verify your email',
        };
        this.emailService.sendMail(mailOptions);
      }

      return {
        message: 'user created successfully',
        newChild,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
  async loginUser(
    loginUser: LoginUserDto,
  ): Promise<{ access_token: string; user_id: string }> {
    const isEmail: any = await this.userModel.findOne({
      email: loginUser.userNameOrEmail,
    });

    const isUsername: any = await this.userModel.findOne({
      userName: loginUser.userNameOrEmail,
    });

    const isUser = isEmail || isUsername;

    if (isUser) {
      const checkPassword = await bcrypt.compare(
        loginUser.password,
        isUser.password,
      );
      if (checkPassword) {
        const payload = { id: isUser._id };
        console.log(isUser._id);
        return {
          access_token: await this.jwtService.signAsync(payload),
          user_id: isUser._id,
        };
      }
    } else {
      throw new UnauthorizedException();
    }
  }

  async verifyUser(verifyUser: VerifyUser) {
    try {
      const check = await this.userModel.findByIdAndUpdate(verifyUser.id, {
        isVerified: true,
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
      const findUser = await this.userModel.findById(verifyUser.id);

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
