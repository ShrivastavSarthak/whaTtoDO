import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { homeSchema, HomeSchema } from 'src/Schemas/homeSchema/homeSchema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: homeSchema.name,
        schema: HomeSchema,
      },
    ]),
  ],
  providers: [],
  controllers: [],
})
export class HomeModule {}
