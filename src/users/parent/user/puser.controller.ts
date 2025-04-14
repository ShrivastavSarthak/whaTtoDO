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
import { AddChild, CreatePatentDto, LoginUserDto } from './dto/Puser.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EmailVerifyInterceptor } from 'src/utils/interceptors/verify.interceptor';
import { pUserService } from './puser.service';

@ApiTags('parent-auth')
@Controller('pUser')
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
  @Post('/add-child')
  @UsePipes(new ValidationPipe())
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
}
