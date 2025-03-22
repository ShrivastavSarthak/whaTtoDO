import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsModule } from './Payment/payments.module';
import { AdminTaskModule } from './users/admin/task/Atask.module';
import { AdminModule } from './users/admin/user/Auser.module';
import { TaskModule } from './users/child/task/task.module';
import { UsersModule } from './users/child/users/user.module';
import { pTaskModule } from './users/parent/task/Ptask.module';
import { pUserModule } from './users/parent/user/puser.module';
import { EventsGateway } from './utils/events/events.gateway';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://sarthak:sarthak@cluster0.yftq0jg.mongodb.net/',
    ),
    UsersModule,
    TaskModule,
    pUserModule,
    AdminModule,
    AdminTaskModule,
    pTaskModule,
    PaymentsModule,
    ConfigModule.forRoot({
      envFilePath: './env',
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [EventsGateway],
})
export class AppModule {}
