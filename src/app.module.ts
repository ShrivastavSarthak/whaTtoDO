import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './child/users/user.module';
import { TaskModule } from './child/task/task.module';
import { pUserModule } from './parent/user/puser.module';
import { AdminModule } from './admin/user/Auser.module';
import { AdminTaskModule } from './admin/task/Atask.module';


@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://Sarthak:sarthak2002@cluster0.12szh4h.mongodb.net/',
    ),
    UsersModule,
    TaskModule,
    pUserModule,
    AdminModule,
    AdminTaskModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
