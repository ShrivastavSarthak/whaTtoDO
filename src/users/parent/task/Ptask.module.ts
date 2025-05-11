import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from 'src/Schemas/cSchema/task.schema';
import { User, UserSchema } from 'src/Schemas/cSchema/user.schema';
import { pUser, pUserSchema } from 'src/Schemas/pSchema/pUser.schema';
import { pTaskUserService } from './Ptask.service';
import { pTaskController } from './Ptask.controller';
import { checkVerification } from 'src/utils/middleware/verified.middleware';
import { CheckRelation } from 'src/utils/middleware/relation.middleware';
import { Invite, InviteSchema } from 'src/Schemas/inviteSchema/inviteSchema';
import { Home, HomeSchema } from 'src/Schemas/homeSchema/homeSchema';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/utils/services/email';
import { EventsGateway } from 'src/utils/events/events.gateway';

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
      {
        name: Invite.name,
        schema: InviteSchema,
      },
      {
        name: Home.name,
        schema: HomeSchema,
      },
    ]),
    JwtModule.register({
      global: true,
      secret: 'IamSecret',
      signOptions: { expiresIn: '59m' },
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        transport: {
          service: 'gmail',
          host: config.get('MAIL_SERVICE'),
          port: config.get('MAIL_PORT'),
          auth: {
            user: config.get('WORKING_EMAIL'),
            pass: config.get('APP_PASS'),
          },
        },
      }),
    }),
  ],
  providers: [pTaskUserService, EmailService, EventsGateway],
  controllers: [pTaskController],
})
export class parentTaskModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckRelation, checkVerification)
      .forRoutes(
        { path: 'parent/task', method: RequestMethod.POST },
        { path: 'parent/task/:id', method: RequestMethod.PUT },
        { path: 'parent/task/:id', method: RequestMethod.DELETE },
      );
  }
}
