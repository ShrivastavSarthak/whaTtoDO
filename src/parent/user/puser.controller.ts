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
import { AuthGuard } from 'src/auth/auth.gurd';
import { AddChild, CreatePatentDto, LoginUserDto } from './dto/Puser.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { pUserService } from './puser.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('parent-auth')
@Controller('pUser')
export class pUserController {
  constructor(private pUserService: pUserService) {}

  @Post('/parent-signup')
  @UsePipes(new ValidationPipe())
  createParent(@Body() createParent: CreatePatentDto) {
    console.log(createParent);
    return this.pUserService.signupParent(createParent);
  }

  @Post('/parent-login')
  @UsePipes(new ValidationPipe())
  loginParent(@Body() loginUser: LoginUserDto) {
    console.log(loginUser);
    return this.pUserService.loginParent(loginUser);
  }

  @UseGuards(AuthGuard)
  @Post('/add-child')
  @UsePipes(new ValidationPipe())
  addChildren(@Body() addchild: AddChild) {
    console.log(AddChild);
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
