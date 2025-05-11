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

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/utils/guards/auth.guard';
import {
  AcceptInviteDto,
  ChildInviteDto,
  ParentInvite,
} from '../user/dto/Puser.dto';
import { pTaskUserService } from './Ptask.service';
import {
  CreateParentTaskDto,
  DeleteParentTaskDto,
  UpdateParentTaskDto,
} from './dtos/Ptask.dto';

@ApiTags('parent-task')
@Controller('api/v1/ptask')
@ApiBearerAuth('access-token')
export class pTaskController {
  constructor(private parentTaskService: pTaskUserService) {}

  @UseGuards(AuthGuard)
  @Post('/create-Task-by-parent')
  @UsePipes(new ValidationPipe())
  createdTaskByParent(@Body() createTaskByParent: CreateParentTaskDto) {
    return this.parentTaskService.createTaskByParent(createTaskByParent);
  }

  @UseGuards(AuthGuard)
  @Get('/read-Task-by-parent/pid=:pId/cid=:cId')
  @UsePipes(new ValidationPipe())
  readTaskByParent(@Param('pId') pId: string, @Param('cId') cId: string) {
    const readTaskByParent = { pId, cId };
    return this.parentTaskService.readTaskByParent(readTaskByParent);
  }

  @UseGuards(AuthGuard)
  @Get('/read-Task-by-parent/:homeId')
  @UsePipes(new ValidationPipe())
  readAllChildTaskByParent(@Param('homeId') homeId: string) {
    return this.parentTaskService.readAllChildTaskByParent(homeId);
  }

  @UseGuards(AuthGuard)
  @Delete('/delete-Task-by-parent')
  @UsePipes(new ValidationPipe())
  deleteTaskByParent(@Body() deleteTaskByParent: DeleteParentTaskDto) {
    return this.parentTaskService.deleteTaskByParent(deleteTaskByParent);
  }

  @UseGuards(AuthGuard)
  @Patch('/update-Task-by-parent')
  @UsePipes(new ValidationPipe())
  updateTaskByParent(@Body() updateTaskByParent: UpdateParentTaskDto) {
    return this.parentTaskService.updateTaskByParent(updateTaskByParent);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @UsePipes(new ValidationPipe())
  @Post('/parent/invite')
  parentInvite(@Body() parentInvite: ParentInvite) {
    return this.parentTaskService.sendParentInvite(parentInvite);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @UsePipes(new ValidationPipe())
  @Post('/child/invite')
  sendChildInvite(@Body() childInvitesDto: ChildInviteDto) {
    return this.parentTaskService.sendChildrenInvites(childInvitesDto);
  }

  @Get('invite/:id/:token')
  acceptInvite(@Param('id') id: string, @Param('token') token: string) {
    const invite: { id: string; token: string } = { id, token };
    return this.parentTaskService.acceptHomeInvite(invite);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @Post('invite-accepted')
  inviteAccepted(@Body() acceptInviteDto: AcceptInviteDto) {
    return this.parentTaskService.acceptCoLeaderInvite(acceptInviteDto);
  }

  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @Get('/get-invite/:homeId')
  getAllRequest(@Param('homeId') homeId: string) {
    return this.parentTaskService.getAllRequest(homeId);
  }

  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @Get('/resend-invite/:homeId/:inviteId')
  resendInvite(
    @Param('homeId') homeId: string,
    @Param('inviteId') inviteId: string,
  ) {
    return this.parentTaskService.resendInvite({ homeId, inviteId });
  }

  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @Delete('/delete-invite/:inviteId')
  deleteInvite(@Param('inviteId') inviteId: string) {
    return this.parentTaskService.deleteInvite(inviteId);
  }
}
