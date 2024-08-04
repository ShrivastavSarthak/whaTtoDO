import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/Schemas/cSchema/user.schema';
import { CreateUsrDto, LoginUserDto } from './dtos/User.dto';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signupUser(createUserDto: CreateUsrDto) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

      const newUser = await this.userModel.create({
        email: createUserDto.email,
        userName: createUserDto.userName,
        phoneNo: createUserDto.phoneNo,
        password: hashedPassword,
      });

      return {
        message: 'user created successfully',
        newUser,
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
}
