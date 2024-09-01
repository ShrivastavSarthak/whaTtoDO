import { ApiProperty } from '@nestjs/swagger';

export class FetchByIdDto {
  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  id: string;
}

export class RemoveParentChildRelationDto {
  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  parentId: string;

  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  childId: string;
}

export class ReadChildTaskByIdDto {
  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  id: string;
}

export class DeleteTaskByIdDto {
  @ApiProperty({
    type: String,
    description: 'This is important',
  })
  id: string;
}
