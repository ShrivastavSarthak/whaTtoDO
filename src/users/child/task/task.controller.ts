import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto } from './dtos/Task.dto';
import { AuthGuard } from 'src/auth/auth.gurd';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('child-task')
@ApiBearerAuth('access-token')
@Controller('api/v1/task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @UseGuards(AuthGuard)
  @Post('/create_task')
  @UsePipes(new ValidationPipe())
  createTask(@Body() createTask: CreateTaskDto) {
    console.log(createTask);
    return this.taskService.addTask(createTask);
  }

  @UseGuards(AuthGuard)
  @Get('/get_task/:id')
  getTask(@Param('id') id: string) {
    return this.taskService.getUserTask(id);
  }
  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  deleteTask(@Param('id') id: string) {
    return this.taskService.deleteTask(id);
  }
  @UseGuards(AuthGuard)
  @Patch('/update/:id')
  updateTask(@Param('id') id: string, @Body() updateTask: UpdateTaskDto) {
    console.log(updateTask);
    const task: string = updateTask.taskName;
    return this.taskService.updateTask(id, task);
  }
}
