import {
  Controller,
  ValidationPipe,
  UsePipes,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';

import { pTaskUserService } from './Ptask.service';
import {
  CreateParentTaskDto,
  DeleteParentTaskDto,
  ReadParentTaskDto,
  UpdateParentTaskDto,
} from './dtos/Ptask.dto';
import { AuthGuard } from 'src/auth/auth.gurd';

@Controller('ptask')
export class pTaskController {
  constructor(private pTaskService: pTaskUserService) {}

  @UseGuards(AuthGuard)
  @Post('/create-Task-by-parent')
  @UsePipes(new ValidationPipe())
  createdTaskByParent(@Body() createTaskByParent: CreateParentTaskDto) {
    return this.pTaskService.createTaskByParent(createTaskByParent);
  }

  @UseGuards(AuthGuard)
  @Post('/read-Task-by-parent')
  @UsePipes(new ValidationPipe())
  readTaskByParent(@Body() readTaskByParent: ReadParentTaskDto) {
    return this.pTaskService.readTaskByParent(readTaskByParent);
  }

  @UseGuards(AuthGuard)
  @Post('/delete-Task-by-parent')
  @UsePipes(new ValidationPipe())
  deleteTaskByParent(@Body() deleteTaskByParent: DeleteParentTaskDto) {
    return this.pTaskService.deleteTaskByParent(deleteTaskByParent);
  }

  @UseGuards(AuthGuard)
  @Post('/update-Task-by-parent')
  @UsePipes(new ValidationPipe())
  updateTaskByParent(@Body() updateTaskByParent: UpdateParentTaskDto) {
    return this.pTaskService.updateTaskByParent(updateTaskByParent);
  }
}
