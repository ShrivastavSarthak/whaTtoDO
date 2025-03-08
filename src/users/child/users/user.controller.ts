import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUsrDto, LoginUserDto } from './dtos/User.dto';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { EmailVerifyGuard } from 'src/auth/emailVerify.guard';

@ApiTags('child-auth')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/signup')
  @UsePipes(new ValidationPipe())
  createUser(@Body() createUser: CreateUsrDto) {
    return this.userService.signupUser(createUser);
  }

  @Post('/signin')
  @UsePipes(new ValidationPipe())
  LoginUser(@Body() loginUser: LoginUserDto) {
    return this.userService.loginUser(loginUser);
  }

  @UseGuards(AuthGuard)
  @Get('/verified/:id')
  @ApiBearerAuth('access-token')
  verifyUser(@Param('id') id: string) {
    return this.userService.verifyUser({ id });
  }

  
  @UseGuards(EmailVerifyGuard)
  @ApiBearerAuth('access-token')
  @Get('/:id')
  @UsePipes(new ValidationPipe())
  fetchUserById(@Param('id') id: string) {
    return this.userService.fetchUserById(id);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @Get('/resend-verification-mail/:id')
  resendVerificationMail(@Param('id') id: string) {
    return this.userService.resendVerificationEmail({ id });
  }
}
