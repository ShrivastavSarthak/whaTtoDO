import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.gurd';
import { AddChild, CreatePatentDto, LoginUserDto } from './dto/Puser.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { pUserService } from './puser.service';

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
}
