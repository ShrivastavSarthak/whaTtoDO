import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Home, HomeSchema } from 'src/Schemas/homeSchema/homeSchema';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { pUser, pUserSchema } from 'src/Schemas/pSchema/pUser.schema';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/utils/services/email';
import { EventsGateway } from 'src/utils/events/events.gateway';
import { Child, UserSchema } from 'src/Schemas/cSchema/child.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Home.name,
        schema: HomeSchema,
      },
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
  providers: [HomeService, EmailService, EventsGateway],
  controllers: [HomeController],
})
export class HomeModule {}
