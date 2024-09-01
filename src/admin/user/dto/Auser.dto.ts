import { ApiProperty } from '@nestjs/swagger';


export class CreateAdminDto {
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
    type: String,
    description: 'This is important',
  })
  password: string;
}

export class LoginAdminDto {
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
