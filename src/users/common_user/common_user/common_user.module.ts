import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { pUser, pUserSchema } from 'src/Schemas/pSchema/pUser.schema';
import { Child, UserSchema } from 'src/Schemas/cSchema/child.schema';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from 'src/utils/services/email';
import { EventsGateway } from 'src/utils/events/events.gateway';
import { CommonUserController } from './common_user.controller';
import { CommonUserService } from './common_user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: pUser.name,
        schema: pUserSchema,
      },
      {
        name: Child.name,
        schema: UserSchema,
      },
    ]),
    JwtModule.register({
      global: true,
      secret: 'IamSecret',
      signOptions: { expiresIn: '59m' },
    }),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        auth: {
          user: process.env.WORKING_EMAIL,
          pass: process.env.APP_PASS,
        },
      },
    }),
  ],
  providers: [CommonUserService, EmailService, EventsGateway],
  controllers: [CommonUserController],
})
export class commonUserModule {}
