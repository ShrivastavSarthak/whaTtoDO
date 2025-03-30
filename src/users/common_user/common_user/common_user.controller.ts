import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VerifyUser } from '../dto/common.user.dto';
import { CommonUserService } from './common_user.service';

@ApiTags('common-user')
@Controller('user')
export class CommonUserController {
  constructor(private commonUserService: CommonUserService) {}

  @Post('/verify')
  verifyUser(@Body() verifyUser: VerifyUser) {
    return this.commonUserService.verifyUser(verifyUser);
  }
}
