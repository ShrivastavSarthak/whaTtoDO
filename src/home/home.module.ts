import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { home, HomeSchema } from 'src/Schemas/homeSchema/homeSchema';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { pUser, pUserSchema } from 'src/Schemas/pSchema/pUser.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: home.name,
        schema: HomeSchema,
      },
      {
        name: pUser.name,
        schema: pUserSchema
      }
    ]),
  ],
  providers: [HomeService],
  controllers: [HomeController],
})
export class HomeModule {}
