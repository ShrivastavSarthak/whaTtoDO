import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/Schemas/cSchema/user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { EmailService } from 'src/utils/email';

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
  providers: [UserService, EmailService],
  controllers: [UserController],
})
export class UsersModule {}
