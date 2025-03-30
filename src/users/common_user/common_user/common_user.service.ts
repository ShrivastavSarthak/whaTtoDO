import { InjectModel } from '@nestjs/mongoose';
import { VerifyUser } from '../dto/common.user.dto';
import { Model } from 'mongoose';
import { pUser } from 'src/Schemas/pSchema/pUser.schema';
import { User } from 'src/Schemas/cSchema/user.schema';
import { UnauthorizedException } from '@nestjs/common';
import { EventsGateway } from 'src/utils/events/events.gateway';

export class CommonUserService {
  constructor(
    @InjectModel(pUser.name) private pUserModel: Model<pUser>,
    @InjectModel(User.name) private userModel: Model<User>,
    private eventGateway: EventsGateway,
  ) {}
  async verifyUser(verifyUser: VerifyUser) {
    try {
      const child = await this.userModel.findById(verifyUser.id);
      const parent = await this.pUserModel.findById(verifyUser.id);

      const findUser = child || parent;

      if (!findUser) {
        throw new UnauthorizedException('User not found.');
      }

      if (
        !findUser.verificationToken ||
        findUser.verificationToken !== verifyUser.verifyToken
      ) {
        throw new UnauthorizedException(
          'Invalid or expired verification token.',
        );
      }

      if (
        !findUser.tokenExpiry ||
        new Date(findUser.tokenExpiry) < new Date()
      ) {
        throw new UnauthorizedException(
          'Verification token has expired. Please request a new one.',
        );
      }

      const updatedUser = child
        ? await this.userModel.findByIdAndUpdate(
            verifyUser.id,
            { isVerified: true, verificationToken: null, tokenExpiry: null },
            { new: true },
          )
        : await this.pUserModel.findByIdAndUpdate(
            verifyUser.id,
            { isVerified: true, verificationToken: null, tokenExpiry: null },
            { new: true },
          );

      if (!updatedUser) {
        throw new UnauthorizedException(
          'Failed to update user verification status.',
        );
      }

      this.eventGateway.notifyVerificationUpdate(verifyUser.id);

      return {
        message: 'User verified successfully.',
        user: updatedUser,
      };
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
