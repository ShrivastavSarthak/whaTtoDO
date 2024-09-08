import {
  Controller,
  ValidationPipe,
  UsePipes,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  Get,
  Delete,
} from '@nestjs/common';

import { pTaskUserService } from './Ptask.service';
import {
  CreateParentTaskDto,
  DeleteParentTaskDto,
  UpdateParentTaskDto,
} from './dtos/Ptask.dto';
import { AuthGuard } from 'src/auth/auth.gurd';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('parent-task')
@Controller('ptask')
@ApiBearerAuth('api/v1/access-token')
export class pTaskController {
  constructor(private pTaskService: pTaskUserService) {}

  @UseGuards(AuthGuard)
  @Post('/create-Task-by-parent')
  @UsePipes(new ValidationPipe())
  createdTaskByParent(@Body() createTaskByParent: CreateParentTaskDto) {
    return this.pTaskService.createTaskByParent(createTaskByParent);
  }

  @UseGuards(AuthGuard)
  @Get('/read-Task-by-parent/pid=:pId/cid=:cId')
  @UsePipes(new ValidationPipe())
  readTaskByParent(@Param('pId') pId: string, @Param('cId') cId: string) {
    console.log(pId, cId);
    const readTaskByParent = { pId, cId };
    return this.pTaskService.readTaskByParent(readTaskByParent);
  }

  @UseGuards(AuthGuard)
  @Delete('/delete-Task-by-parent')
  @UsePipes(new ValidationPipe())
  deleteTaskByParent(@Body() deleteTaskByParent: DeleteParentTaskDto) {
    return this.pTaskService.deleteTaskByParent(deleteTaskByParent);
  }

  @UseGuards(AuthGuard)
  @Patch('/update-Task-by-parent')
  @UsePipes(new ValidationPipe())
  updateTaskByParent(@Body() updateTaskByParent: UpdateParentTaskDto) {
    return this.pTaskService.updateTaskByParent(updateTaskByParent);
  }
}
