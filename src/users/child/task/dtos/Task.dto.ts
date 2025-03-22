import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  // @IsString()
  // childId: string;

  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  taskName: string;

  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  taskDetails: string;

  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  created_by: string;

  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  updated_by: string;

  @ApiProperty({
    type: Boolean,
    description: 'This is important',
  })
  isCompleted: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'This is important',
  })
  isDeleted: boolean;

  @ApiProperty({
    type: Date,
    description: 'This is important',
  })
  completed_at: Date;

  @ApiProperty({
    type: Date,
    description: 'This is important',
  })
  started_at: Date;

  @ApiProperty({
    type: Number,
    description: 'This is important',
  })
  points: number;

  @ApiProperty({
    type: 'string',
    format: 'binary', 
    description: 'Upload media file',
  })
  media?: any;
}

export class DeleteTaskDto {
  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  updated_by: string;

}


export class UpdateTaskDto {
  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  taskName: string;

  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  taskDetails: string;

  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  updated_by: string;

  @ApiProperty({
    type: Boolean,
    description: 'This is important',
  })
  isCompleted: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'This is important',
  })
  isDeleted: boolean;

  @ApiProperty({
    type: Date,
    description: 'This is important',
  })
  completed_at: Date;

  @ApiProperty({
    type: Date,
    description: 'This is important',
  })
  started_at: Date;

  @ApiProperty({
    type: Number,
    description: 'This is important',
  })
  points: number;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Upload media file',
  })
  media?: any;
}
