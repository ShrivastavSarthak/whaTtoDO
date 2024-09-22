import { ApiProperty } from '@nestjs/swagger';
import { gender, occupation } from 'src/enum/parent.enum';

export class CreatePatentDto {
  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  name: string;

  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  userName: string;

  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  email: string;

  @ApiProperty({
    type: Number,
    description: 'This is important',
  })
  phoneNo: number;

  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  password: string;

  @ApiProperty({
    enum: gender,
    description: 'This is important',
  })
  gender: gender;

  @ApiProperty({
    enum: occupation,
    description: 'This is important',
    example: occupation.GOVERNMENT_EMPLOYEE
  })
  occupation: occupation;
}

export class LoginUserDto {
  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  userNameOrEmail: string;

  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  password: string;
}

export class AddChild {
  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  childUsername: string;
  parentId: string;
}

export class VerifyUser {
  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  id: string;
}
