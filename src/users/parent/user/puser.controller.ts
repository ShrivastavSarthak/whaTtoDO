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
  constructor(private pUserService: pUserService) {}

  @Post('/parent-signup')
  @UsePipes(new ValidationPipe())
  createParent(@Body() createParent: CreatePatentDto) {
    return this.pUserService.signupParent(createParent);
  }

  @Post('/parent-login')
  @UsePipes(new ValidationPipe())
  loginParent(@Body() loginUser: LoginUserDto) {
    return this.pUserService.loginParent(loginUser);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('api/v1/access-token')
  @Post('/add-child')
  @UsePipes(new ValidationPipe())
  addChildren(@Body() addchild: AddChild) {
    return this.pUserService.addChildren(addchild);
  }

  @UseInterceptors(EmailVerifyInterceptor)
  @Get('/:id')
  getParentById(@Param('id') id: string) {
    return this.pUserService.getParentById(id);
  }

  @Get('/resend-verification-mail/:id')
  resendVerificationMail(@Param('id') id: string) {
    return this.pUserService.resendVerificationEmail({ id });
  }
}
