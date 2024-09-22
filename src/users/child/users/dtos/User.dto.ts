import { ApiProperty } from '@nestjs/swagger';


export class CreateUsrDto {
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

export class VerifyUser{
  @ApiProperty({
      type: String,
      description: 'This is important',
    })
    id:string

}
