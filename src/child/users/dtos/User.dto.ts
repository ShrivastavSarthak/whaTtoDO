import { IsNumber, IsString } from 'class-validator';

export class CreateUsrDto {
  @IsString()
  userName: string;

  @IsString()
  email: string;

  @IsNumber()
  phoneNo: number;

  @IsString()
  password: string;
}

export class LoginUserDto {
  @IsString()
  userNameOrEmail: string;

  @IsString()
  password: string;
}
