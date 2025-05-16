import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Child, UserSchema } from 'src/Schemas/cSchema/child.schema';
import { ChildTask, ChildTaskSchema } from 'src/Schemas/cSchema/childTask.schema';
import { pUser, pUserSchema } from 'src/Schemas/pSchema/pUser.schema';
// import { pUser, pUserSchema } from 'src/Schemas/pSchema/pUser.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ChildTask.name,
        schema: ChildTaskSchema,
      },
      {
        name: Child.name,
        schema: UserSchema,
      },
      {
        name: pUser.name,
        schema: pUserSchema,
      },
    ]),
  ],
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
