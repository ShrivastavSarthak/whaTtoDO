import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from 'src/Schemas/cSchema/task.schema';
import { User, UserSchema } from 'src/Schemas/cSchema/user.schema';
import { pUser, pUserSchema } from 'src/Schemas/pSchema/pUser.schema';
import { pTaskUserService } from './Ptask.service';
import { pTaskController } from './Ptask.controller';
import { checkVerification } from 'src/utils/middleware/verified.middleware';
import { CheckRelation } from 'src/utils/middleware/relation.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Task.name,
        schema: TaskSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: pUser.name,
        schema: pUserSchema,
      },
    ]),
  ],
  providers: [pTaskUserService],
  controllers: [pTaskController],
})
export class pTaskModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CheckRelation, checkVerification).forRoutes(pTaskController);
  }
}
