import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  // @IsString()
  // childId: string;

  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  created_by: string;

  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  taskName: string;
}

export class UpdateTaskDto {
  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  taskName: string;
}