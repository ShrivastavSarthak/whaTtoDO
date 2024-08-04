import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/Schemas/cSchema/user.schema';
import { pUser, pUserSchema } from 'src/Schemas/pSchema/pUser.schema';
import { adminTaskController } from './Atask.controller';
import { AdminTaskService } from './Atask.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: pUser.name,
        schema: pUserSchema,
      },
    ]),
    JwtModule.register({
      global: true,
      secret: 'IamSecret',
      signOptions: { expiresIn: '59m' },
    }),
  ],
  providers: [AdminTaskService],
  controllers: [adminTaskController],
})
export class AdminTaskModule {}
