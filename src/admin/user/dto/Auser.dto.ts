import { IsString } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  name: string;
  
  @IsString()
  userName: string;

  @IsString()
  email: string;

  @IsString()
  password: string;
}

export class LoginAdminDto {
  @IsString()
  userNameOrEmail: string;

  @IsString()
  password: string;
}