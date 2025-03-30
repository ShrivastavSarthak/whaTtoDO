import { ApiProperty } from "@nestjs/swagger";


export class VerifyUser {
  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  verifyToken: string;
}
