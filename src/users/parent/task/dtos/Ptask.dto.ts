import { ApiProperty } from '@nestjs/swagger';


export class CreateParentTaskDto {
  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  pId: string;

  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  cId: string;

  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  task: string;
}

export class ReadParentTaskDto {
  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  pId: string;

  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  cId: string;
}

export class UpdateParentTaskDto {
  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  pId: string;

  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  cId: string;

  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  taskId: string;

  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  taskName: string;
}
export class DeleteParentTaskDto {
  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  pId: string;

  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  cId: string;

  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  taskId: string;
}
