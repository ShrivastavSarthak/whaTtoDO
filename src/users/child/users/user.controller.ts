import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUsrDto, LoginUserDto } from './dtos/User.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('child-auth')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/signup')
  @UsePipes(new ValidationPipe())
  createUser(@Body() createUser: CreateUsrDto) {
    console.log(createUser);
    return this.userService.signupUser(createUser);
  }

  @Post('/signin')
  @UsePipes(new ValidationPipe())
  LoginUser(@Body() loginUser: LoginUserDto) {
    console.log(loginUser);

    return this.userService.loginUser(loginUser);
  }

  @Get('/verified/:id')
  verifyUser(@Param('id') id: string) {
    return this.userService.verifyUser({ id });
  }

  @Get('/resend-verification-mail/:id')
  resendVerificationMail(@Param('id') id: string) {
    return this.userService.resendVerificationEmail({ id });
  }
}
