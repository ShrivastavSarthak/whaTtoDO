import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { pUser, pUserSchema } from 'src/Schemas/pSchema/pUser.schema';
import { pUserService } from './puser.service';
import { pUserController } from './puser.controller';
import { Child, UserSchema } from 'src/Schemas/cSchema/child.schema';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from 'src/utils/services/email';
import { EventsGateway } from 'src/utils/events/events.gateway';
import { Invite, InviteSchema } from 'src/Schemas/inviteSchema/inviteSchema';
import { ConfigService } from '@nestjs/config';
import { Home, HomeSchema } from 'src/Schemas/homeSchema/homeSchema';

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
  providers: [pUserService, EmailService, EventsGateway],
  controllers: [pUserController],
})
export class pUserModule {}
