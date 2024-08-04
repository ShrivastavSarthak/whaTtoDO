import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { gender, occupation } from 'src/enum/parent.enum';

export class CreatePatentDto {
  @IsString()
  name: string;

  @IsString()
  userName: string;

  @IsString()
  email: string;

  @IsNumber()
  phoneNo: number;

  @IsString()
  password: string;

  @IsEnum(gender)
  gender: gender;

  @IsEnum(occupation)
  occupation: occupation;
}

export class LoginUserDto {
  @IsString()
  @IsOptional()
  userName: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  password: string;
}


export class AddChild{
  @IsString()
  childUsername: string;
  parentId:string
}