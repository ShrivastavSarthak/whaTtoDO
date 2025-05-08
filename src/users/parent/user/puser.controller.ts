import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from 'src/utils/guards/auth.guard';
import {
  AcceptInviteDto,
  AddChild,
  ChildInviteDto,
  CreatePatentDto,
  LoginUserDto,
  ParentInvite,
} from './dto/Puser.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EmailVerifyInterceptor } from 'src/utils/interceptors/verify.interceptor';
import { pUserService } from './puser.service';

@ApiTags('parent-auth')
@Controller('api/v1/pUser')
export class pUserController {
  constructor(private ParentUserService: pUserService) {}

  @Post('/parent-signup')
  @UsePipes(new ValidationPipe())
  createParent(@Body() createParent: CreatePatentDto) {
    return this.ParentUserService.signupParent(createParent);
  }

  @Post('/parent-login')
  @UsePipes(new ValidationPipe())
  loginParent(@Body() loginUser: LoginUserDto) {
    return this.ParentUserService.loginParent(loginUser);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @UsePipes(new ValidationPipe())
  @Post('/add-child')
  addChildren(@Body() addChild: AddChild) {
    return this.ParentUserService.addChildren(addChild);
  }

  @UseInterceptors(EmailVerifyInterceptor)
  @Get('/:id')
  getParentById(@Param('id') id: string) {
    return this.ParentUserService.getParentById(id);
  }

  @Get('/resend-verification-mail/:id')
  resendVerificationMail(@Param('id') id: string) {
    return this.ParentUserService.resendVerificationEmail({ id });
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @UsePipes(new ValidationPipe())
  @Post('/parent/invite')
  parentInvite(@Body() parentInvite: ParentInvite) {
    return this.ParentUserService.sendParentInvite(parentInvite);
  }
  
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @UsePipes(new ValidationPipe())
  @Post('/child/invite')
  sendChildInvite(@Body() childInvitesDto: ChildInviteDto) {
    return this.ParentUserService.sendChildrenInvites(childInvitesDto);
  }

  @Get('invite/:id/:token')
  acceptInvite(@Param('id') id: string, @Param('token') token: string) {
    const invite: { id: string; token: string } = { id, token };
    return this.ParentUserService.acceptHomeInvite(invite);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @Post('invite-accepted')
  inviteAccepted(@Body() acceptInviteDto: AcceptInviteDto) {
    return this.ParentUserService.acceptCoLeaderInvite(acceptInviteDto);
  }
}
