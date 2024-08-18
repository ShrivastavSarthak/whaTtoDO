import { IsString } from 'class-validator';

export class CreateParentTaskDto {
  @IsString()
  pId: string;

  @IsString()
  cId: string;

  @IsString()
  task: string;
}

export class ReadParentTaskDto {
  @IsString()
  pId: string;

  @IsString()
  cId: string;
}

export class UpdateParentTaskDto {
  @IsString()
  pId: string;

  @IsString()
  cId: string;

  @IsString()
  taskId: string;

  @IsString()
  taskName: string;
  
}
export class DeleteParentTaskDto {
  @IsString()
  pId: string;

  @IsString()
  cId: string;

  @IsString()
  taskId: string;
}
