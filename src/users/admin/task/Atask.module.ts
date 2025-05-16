import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Child, UserSchema } from 'src/Schemas/cSchema/child.schema';
import { pUser, pUserSchema } from 'src/Schemas/pSchema/pUser.schema';
import { adminTaskController } from './Atask.controller';
import { AdminTaskService } from './Atask.service';
import { ChildTask, ChildTaskSchema } from 'src/Schemas/cSchema/childTask.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Child.name,
        schema: UserSchema,
      },
      {
        name: pUser.name,
        schema: pUserSchema,
      },
      {
        name: ChildTask.name,
        schema: ChildTaskSchema,
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
