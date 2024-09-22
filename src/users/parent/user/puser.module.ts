import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { pUser, pUserSchema } from 'src/Schemas/pSchema/pUser.schema';
import { pUserService } from './puser.service';
import { pUserController } from './puser.controller';
import { User, UserSchema } from 'src/Schemas/cSchema/user.schema';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from 'src/utils/email';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: pUser.name,
        schema: pUserSchema,
      },
      {
        name: User.name,
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
        service:"gmail",
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        auth: {
          user: 'sharthakshrivastav20112002@gmail.com',
          pass: 'ovqijipqjplpyacn',
        },
      },
    }),
  ],
  providers: [pUserService, EmailService],
  controllers: [pUserController],
})
export class pUserModule {}
