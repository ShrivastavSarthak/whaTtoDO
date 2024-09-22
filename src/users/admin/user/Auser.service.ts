import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { aUser } from 'src/Schemas/aSchema/aUser.schema';
import { CreateAdminDto, LoginAdminDto } from './dto/Auser.dto';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminUserService {
  constructor(
    @InjectModel(aUser.name) private adminUserModel: Model<aUser>,
    private jwtService: JwtService,
  ) {}

  async signup(createAdminDto: CreateAdminDto):Promise<{
    message: string;
    access_token: string,
    userId:any,
    status: number | string
  }> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(createAdminDto.password, salt);

      const newAdmin = await this.adminUserModel.create({
        name: createAdminDto.name,
        userName: createAdminDto.userName,
        email: createAdminDto.email,
        password: hashedPassword,
      });

      const payload = {
        id: newAdmin._id
      }

      return {
        message: ' Admin created successfully',
        access_token: await this.jwtService.signAsync(payload),
        userId: newAdmin._id,
        status: 201,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async login(
    loginAdminDto: LoginAdminDto,
  ): Promise<{
    message: string;
    access_token: string;
    userId: any;
    status: number| string
  }> {
    try {
      const findAdmin =await  this.adminUserModel.findOne({
        $or: [
          { userName: loginAdminDto.userNameOrEmail },
          { email: loginAdminDto.userNameOrEmail },
        ],
      });

      if (!findAdmin) {
        throw new Error('Invalid Credentials');
      }

      const checkPassword = await bcrypt.compare(
        loginAdminDto.password,
        findAdmin.password,
      );

      if (!checkPassword) {
        throw new Error('Invalid Credentials');
      }

      const payload = {
        id: findAdmin._id,
      };

      return {
        message: 'Logged in successfully',
        access_token: await this.jwtService.signAsync(payload),
        userId: payload.id,
        status: 201
      };
    } catch (error) {
        console.log(error);
        
      throw new Error('Something went wrong ');
    }
  }
}
