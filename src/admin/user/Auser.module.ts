import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { aUser, aUserSchema } from 'src/Schemas/aSchema/aUser.schema';
import { AdminUserService } from './Auser.service';
import { AdminController } from './Auser.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: aUser.name,
        schema: aUserSchema,
      },
    ]),
    JwtModule.register({
      global: true,
      secret: 'IamSecret',
      signOptions: { expiresIn: '59m' },
    }),
  ],
  providers: [AdminUserService],
  controllers: [AdminController],
})
export class AdminModule {}
