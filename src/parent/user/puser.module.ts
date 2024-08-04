
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { pUser, pUserSchema } from 'src/Schemas/pSchema/pUser.schema';
import { pUserService } from './puser.service';
import { pUserController } from './puser.controller';
import { User, UserSchema } from 'src/Schemas/cSchema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: pUser.name,
        schema: pUserSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    JwtModule.register({
      global: true,
      secret: 'IamSecret',
      signOptions: { expiresIn: '59m' },
    }),
  ],
  providers: [pUserService],
  controllers: [pUserController],
})
export class pUserModule {}
