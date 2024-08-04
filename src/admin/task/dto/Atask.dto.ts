import { IsString } from 'class-validator';

export class FetchByIdDto {
  @IsString()
  id: string;
}

export class RemoveParentChildRelationDto {
  @IsString()
  parentId: string;

  @IsString()
  childId: string;
}
