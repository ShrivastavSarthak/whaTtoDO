import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto, DeleteTaskDto, UpdateTaskDto } from './dtos/Task.dto';
import { AuthGuard } from 'src/utils/guards/auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('child-task')
@ApiBearerAuth('access-token')
@Controller('api/v1/task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @UseGuards(AuthGuard)
  @Get('/get_all_tasks/:id')
  getAllTasks(
    @Param('id') id: string,
    @Query('pageSize') pageSize: number,
    @Query('pageNo') pageNo: number,
  ) {
    const taskData = { id: id, pageSize: pageSize, pageNo: pageNo };
    return this.taskService.getAllTasks(taskData);
  }

  @UseGuards(AuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateTaskDto })
  @UseInterceptors(FileInterceptor('media'))
  @Post('/create_task')
  @UsePipes(new ValidationPipe())
  createTask(@Body() createTask: CreateTaskDto) {
    return this.taskService.createTask(createTask);
  }

  
  @UseGuards(AuthGuard)
  @Get('/get_task/:task_id')
  getTask(@Param('task_id') task_id: string) {
    return this.taskService.getUserTask(task_id);
  }
  @UseGuards(AuthGuard)
  @ApiBody({ type: DeleteTaskDto })
  @UsePipes(new ValidationPipe())
  @Delete('delete/:id')
  deleteTask(@Param('id') id: string, @Body() task: DeleteTaskDto) {
    return this.taskService.deleteTask(id, task);
  }
  @UseGuards(AuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateTaskDto })
  @UseInterceptors(FileInterceptor('media'))
  @Patch('/update/:id')
  updateTask(@Param('id') id: string, @Body() updateTask: UpdateTaskDto) {
    const task: string = updateTask.taskName;
    return this.taskService.updateTask(id, task);
  }
}
