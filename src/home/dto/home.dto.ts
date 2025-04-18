import { ApiProperty } from '@nestjs/swagger';

export class CreateHomeDto {
  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  leader: string;

  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  homeName: string;

  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  homeDesc: string;

  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  homePhoto: string;
}
