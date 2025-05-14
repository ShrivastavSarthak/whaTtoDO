import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HomeService } from './home.service';
import { CreateHomeDto } from './dto/home.dto';
import { AuthGuard } from 'src/utils/guards/auth.guard';

@ApiTags('home')
@Controller('home')
@ApiBearerAuth('access-token')
export class HomeController {
  constructor(private homesService: HomeService) {}

  @UseGuards(AuthGuard)
  @Post('/create-home')
  @UsePipes(new ValidationPipe())
  createHome(@Body() createHomeDto: CreateHomeDto) {
    return this.homesService.createHome(createHomeDto);
  }

  @Get('/get-home/:id')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async getHomeByLeaderId(@Param('id') id: string) {
    return this.homesService.getHomeByLeaderId(id);
  }

  @Delete('/delete-home/:homeId')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async deleteHome(@Param('homeId') homeId: string) {
    return this.homesService.deleteHome(homeId);
  }
}
