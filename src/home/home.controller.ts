import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HomeService } from './home.service';
import { CreateHomeDto } from './dto/home.dto';

@ApiTags('home')
@Controller('home')
export class HomeController {
  constructor(private homesService: HomeService) {}

  @Post('/create-home')
  @UsePipes(new ValidationPipe())
  createHome(@Body() createHomeDto: CreateHomeDto) {
    return this.homesService.createHome(createHomeDto);
  }
}
