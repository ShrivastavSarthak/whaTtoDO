import { IsString } from 'class-validator';

export class CreateTaskDto {

  // @IsString()
  // childId: string;
  
  @IsString()
  created_by: string;

  @IsString()
  taskName: string;
}

export class UpdateTaskDto{
  @IsString()
  taskName: string;
}