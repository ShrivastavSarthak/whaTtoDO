import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Child, UserSchema } from 'src/Schemas/cSchema/child.schema';
import { EmailService } from 'src/utils/services/email';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { EventsGateway } from 'src/utils/events/events.gateway';
import { Invite, InviteSchema } from 'src/Schemas/inviteSchema/inviteSchema';
import { Home, HomeSchema } from 'src/Schemas/homeSchema/homeSchema';

@Module({
  imports: [
    MongooseModule.forFeature([
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
  ],
  providers: [UserService, EmailService, EventsGateway],
  controllers: [UserController],
})
export class UsersModule {}
