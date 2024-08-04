import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUsrDto, LoginUserDto } from './dtos/User.dto';

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
  loginUser(@Body() loginUser: LoginUserDto) {
    console.log(loginUser);

    return this.userService.loginUser(loginUser);
  }



}
