import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AdminTaskService } from './Atask.service';
import { AuthGuard } from 'src/auth/auth.gurd';
import { RemoveParentChildRelationDto } from './dto/Atask.dto';

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
    return this.adminTaskService.removeParentChildRelation(removeRelation)
  }


}
