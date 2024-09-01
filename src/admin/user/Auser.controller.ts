import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AdminUserService } from './Auser.service';
import { CreateAdminDto, LoginAdminDto } from './dto/Auser.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("admin-auth")
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminUserService) {}

  @Post('/admin-signup')
  @UsePipes(new ValidationPipe())
  createAdmin(@Body() createAdmin: CreateAdminDto) {
    console.log(createAdmin);
    return this.adminService.signup(createAdmin);
  }

  @Post('/admin-singin')
  @UsePipes(new ValidationPipe())
  loginAdmin(@Body() loginAdminDto: LoginAdminDto) {
    console.log(loginAdminDto);
    return this.adminService.login(loginAdminDto);
  }
}
