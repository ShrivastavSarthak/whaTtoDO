import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/utils/guards/auth.guard';
import { EmailVerifyInterceptor } from 'src/utils/interceptors/verify.interceptor';
import { CreateUsrDto, LoginUserDto } from './dtos/User.dto';
import { UserService } from './user.service';

@ApiTags('child-auth')
@Controller('api/v1/child')
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

  // @UseGuards(EmailVerifyGuard)
  @UseInterceptors(EmailVerifyInterceptor)
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
