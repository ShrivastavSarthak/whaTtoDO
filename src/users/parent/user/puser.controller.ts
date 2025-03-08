import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AddChild, CreatePatentDto, LoginUserDto } from './dto/Puser.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { pUserService } from './puser.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

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

  @Get('/verified/:id')
  verifyUser(@Param('id') id: string) {
    return this.pUserService.verifyUser({ id });
  }

  @Get('/resend-verification-mail/:id')
  resendVerificationMail(@Param('id') id: string) {
    return this.pUserService.resendVerificationEmail({ id });
  }
}
