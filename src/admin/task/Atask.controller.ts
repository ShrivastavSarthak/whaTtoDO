import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AdminTaskService } from './Atask.service';
import { AuthGuard } from 'src/auth/auth.gurd';
import {
  DeleteTaskByIdDto,
  ReadChildTaskByIdDto,
  RemoveParentChildRelationDto,
} from './dto/Atask.dto';

@UseGuards(AuthGuard)
@Controller('admin-task')
export class adminTaskController {
  constructor(private adminTaskService: AdminTaskService) {}

  @UseGuards(AuthGuard)
  @Get('/get-parent')
  fetchParent() {
    return this.adminTaskService.getAllParent();
  }

  @UseGuards(AuthGuard)
  @Get('/get-children')
  fetchChildren() {
    return this.adminTaskService.getAllChildren();
  }

  @UseGuards(AuthGuard)
  @Get('/get-parent/:id')
  fetchPatentById(@Param('id') id: string) {
    return this.adminTaskService.fetchParentById({ id });
  }

  @UseGuards(AuthGuard)
  @Get('/get-children/:id')
  fetchChildById(@Param('id') id: string) {
    return this.adminTaskService.fetchChildById({ id });
  }

  @UseGuards(AuthGuard)
  @Patch('/remove-relation')
  removeRelation(@Body() removeRelation: RemoveParentChildRelationDto) {
    return this.adminTaskService.removeParentChildRelation(removeRelation);
  }

  @UseGuards(AuthGuard)
  @Post('/read-child-task')
  readTaskById(@Body() readChildTaskByIdDto: ReadChildTaskByIdDto) {
    return this.adminTaskService.readChildData(readChildTaskByIdDto);
  }

  @UseGuards(AuthGuard)
  @Post('/delete-child-task')
  deleteTask(@Body() deleteTaskByIdDto: DeleteTaskByIdDto) {
    return this.adminTaskService.deleteTaskById(deleteTaskByIdDto);
  }
}
