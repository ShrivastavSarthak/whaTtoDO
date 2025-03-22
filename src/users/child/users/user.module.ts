import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/Schemas/cSchema/user.schema';
import { EmailService } from 'src/utils/services/email';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { EventsGateway } from 'src/utils/events/events.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
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
  ],
  providers: [UserService, EmailService, EventsGateway],
  controllers: [UserController],
})
export class UsersModule {}
