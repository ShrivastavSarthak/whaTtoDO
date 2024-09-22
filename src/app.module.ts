import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/child/users/user.module';
import { TaskModule } from './users/child/task/task.module';
import { pUserModule } from './users/parent/user/puser.module';
import { AdminModule } from './users/admin/user/Auser.module';
import { AdminTaskModule } from './users/admin/task/Atask.module';
import { pTaskModule } from './users/parent/task/Ptask.module';
import { ConfigModule } from '@nestjs/config';
import { PaymentsModule } from './Payment/payments.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://Sarthak:sarthak2002@cluster0.12szh4h.mongodb.net/',
    ),
    UsersModule,
    TaskModule,
    pUserModule,
    AdminModule,
    AdminTaskModule,
    pTaskModule,
    PaymentsModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
