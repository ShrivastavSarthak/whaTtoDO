import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AdminTaskService } from './Atask.service';
import { AuthGuard } from 'src/auth/auth.gurd';
import {
  DeleteTaskByIdDto,
  RemoveParentChildRelationDto,
} from './dto/Atask.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('admin-task')
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
@Controller('api/v1/admin-task')
export class adminTaskController {
  constructor(private adminTaskService: AdminTaskService) {}

  @UseGuards(AuthGuard)
  @Get('/get-parent/pageno/:pageNo/pagesize/:pageSize')
  fetchParent(
    @Param('pageSize') pageSize: number,
    @Param('pageNo') pageNo: number,
  ) {
    return this.adminTaskService.getAllParent({ pageSize, pageNo });
  }

  @UseGuards(AuthGuard)
  @Get('/get-children/pageno/:pageNo/pagesize/:pageSize')
  fetchChildren(
    @Param('pageSize') pageSize: number,
    @Param('pageNo') pageNo: number,
  ) {
    return this.adminTaskService.getAllChildren({ pageSize, pageNo });
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
  @Get('/read-child-task/:childId/pageno/:pageNo/pagesize/:pageSize')
  readTaskById(
    @Param('childId') childId: string,
    @Param('pageSize') pageSize: number,
    @Param('pageNo') pageNo: number,
  ) {
    return this.adminTaskService.readChildData(pageNo, pageSize, childId);
  }

  @UseGuards(AuthGuard)
  @Delete('/delete-child-task')
  deleteTask(@Body() deleteTaskByIdDto: DeleteTaskByIdDto) {
    return this.adminTaskService.deleteTaskById(deleteTaskByIdDto);
  }
}
