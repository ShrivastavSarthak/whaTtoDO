import { ApiProperty } from '@nestjs/swagger';


export class CreateUsrDto {
  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  username: string;

  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  email: string;

  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  phoneNo: string;

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
  username: string;

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
