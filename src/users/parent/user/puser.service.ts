import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import {
  UserRoleEnum,
  UserRoleHierarchyEnum,
} from 'src/lib/enums/common.enums';
import { User } from 'src/Schemas/cSchema/user.schema';
import { Home } from 'src/Schemas/homeSchema/homeSchema';
import { Invite } from 'src/Schemas/inviteSchema/inviteSchema';
import { pUser } from 'src/Schemas/pSchema/pUser.schema';
import { EmailOptions } from 'src/type';
import { EventsGateway } from 'src/utils/events/events.gateway';
import { EmailService } from 'src/utils/services/email';
import { ParentSignupFieldValidators } from 'src/utils/validators/fieldValidators';
import {
  AcceptInviteDto,
  AddChild,
  ChildInviteDto,
  CreatePatentDto,
  LoginUserDto,
  ParentInvite,
  ResendVerificationEmail,
} from './dto/Puser.dto';

@Injectable()
export class pUserService {
  constructor(
    @InjectModel(pUser.name) private pUserModel: Model<pUser>,
    @InjectModel(Invite.name) private InviteSchema: Model<Invite>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Home.name) private homeModel: Model<Home>,
    private jwtService: JwtService,
    private emailService: EmailService,
    private eventGateway: EventsGateway,
    private configService: ConfigService,
  ) {}

  async signupParent(createParentDto: CreatePatentDto) {
    const user = {
      name: createParentDto.name,
      username: createParentDto.username,
      email: createParentDto.email,
      phoneNo: createParentDto.phoneNo,
      password: createParentDto.password,
      gender: createParentDto.gender,
      occupation: createParentDto.occupation,
    };

    if (!ParentSignupFieldValidators(user)) {
      return;
    }

    const isUserExist = await this.pUserModel.aggregate([
      {
        $match: {
          $or: [
            { email: createParentDto.email },
            { phoneNo: createParentDto.phoneNo },
            { username: createParentDto.username },
          ],
        },
      },
    ]);

    if (isUserExist.length > 0) {
      throw new BadRequestException('User already exist');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createParentDto.password, salt);

    const newParent = await this.pUserModel.create({
      name: createParentDto.name,
      username: createParentDto.username,
      email: createParentDto.email,
      phoneNo: createParentDto.phoneNo,
      password: hashedPassword,
      gender: createParentDto.gender,
      occupation: createParentDto.occupation,
    });

    if (newParent) {
      const emailToken = this.jwtService.sign(
        { id: newParent._id },
        { secret: process.env.JWT_SECRET, expiresIn: '5M' },
      );

      await this.pUserModel.findByIdAndUpdate(newParent._id, {
        verificationToken: emailToken,
        tokenExpiry: new Date(Date.now() + 5 * 60 * 1000),
      });

      const verificationLink = `${process.env.FRONTEND_DEV_URL}/${newParent._id}/${emailToken}`;
      const mailOptions: EmailOptions = {
        to: newParent.email,
        subject: 'Just one step away!!',
        body: `Hey!! click on the this link to verify your account: ${verificationLink}`,
      };
      this.emailService.sendMail(mailOptions);
    }

    const payload = { id: newParent._id, isVerified: newParent.isVerified };
    return {
      message: 'user created successfully',
      user_id: newParent._id,
      role: UserRoleEnum.PARENT,
      homeId: newParent.homeId,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async loginParent(loginUser: LoginUserDto): Promise<{
    access_token: string;
    user_id: any;
    role: string;
    homeId: string;
  }> {
    try {
      const isParent = await this.pUserModel.findOne({
        $or: [{ username: loginUser.username }, { email: loginUser.username }],
      });

      if (isParent) {
        const password = await bcrypt.compare(
          loginUser.password,
          isParent.password,
        );

        if (!password) {
          throw new UnauthorizedException();
        }
        const payload = { id: isParent._id };

        return {
          access_token: await this.jwtService.signAsync(payload),
          user_id: isParent._id,
          homeId: isParent.homeId,
          role: UserRoleEnum.PARENT,
        };
      }
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async addChildren(addChild: AddChild) {
    try {
      const findChild: any = await this.userModel.findOne({
        username: addChild.childUsername,
      });

      const findParent: any = await this.pUserModel.findById(addChild.parentId);

      if (!findChild && !findParent) {
        throw new Error(
          'child or parent not exist please try with different username .',
        );
      }

      // const checkParentAdded = findParent.children;

      if (findChild.parent.length >= 2) {
        return {
          message: 'Sorry only two parent are allowed',
          status: 400,
        };
      }

      const checkChildExist = await this.pUserModel.findOne({
        children: { $in: [findChild._id] },
      });

      if (checkChildExist) {
        return {
          message: 'Sorry this child is already added with you',
          status: 400,
        };
      }

      const addChildToPatent = await this.pUserModel.findByIdAndUpdate(
        addChild.parentId,
        {
          $push: { children: findChild._id },
        },
      );

      const addParentToChild = await this.userModel.findByIdAndUpdate(
        findChild._id,
        {
          $push: { parent: addChild.parentId },
        },
      );

      if (!addChildToPatent && !addParentToChild) {
        throw new Error(
          'something went wrong please try again after some time ',
        );
      }

      return {
        message: 'parent and child connection successfully established',
        child: findChild,
        parent: findParent,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getParentById(id: string) {
    try {
      const getParent = await this.pUserModel.findById(id).select('-password');
      if (!getParent) {
        throw new UnauthorizedException('User not found.');
      }
      return {
        message: 'User fetched successfully',
        user: getParent,
      };
    } catch (error) {
      throw new UnauthorizedException('User not found.');
    }
  }

  async resendVerificationEmail(
    ResendVerificationEmail: ResendVerificationEmail,
  ) {
    try {
      const findUser = await this.pUserModel.findById(
        ResendVerificationEmail.id,
      );

      if (findUser) {
        const emailToken = this.jwtService.sign(
          { id: findUser._id },
          { secret: process.env.JWT_SECRET, expiresIn: '5M' },
        );

        await this.pUserModel.findByIdAndUpdate(findUser._id, {
          verificationToken: emailToken,
          tokenExpiry: new Date(Date.now() + 5 * 60 * 1000),
        });

        const verificationLink = `${process.env.FRONTEND_DEV_URL}/${findUser._id}/${emailToken}`;
        const mailOptions: EmailOptions = {
          to: findUser.email,
          subject: 'Just one step away!!',
          body: `Hey!! click on the this link to verify your account: ${verificationLink}`,
        };
        this.emailService.sendMail(mailOptions);
        await this.emailService.sendMail(mailOptions);

        return {
          message: 'Mail send successfully',
          status: 200,
        };
      }
      return {
        message: 'User not found',
        status: 404,
      };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async sendParentInvite(parentInvite: ParentInvite) {
    try {
      const findUser = await this.InviteSchema.findOne({
        email: parentInvite.email,
      });
      const inviteToken = this.jwtService.sign(
        { id: parentInvite.email },
        { secret: process.env.JWT_SECRET, expiresIn: '5M' },
      );
      if (findUser) {
      }
      const findInvite = await this.InviteSchema.findOne({
        email: parentInvite.email,
        homeId: parentInvite.homeId,
      });
      if (findInvite) {
        const updateToken = await this.InviteSchema.findByIdAndUpdate(
          findInvite._id,
          {
            token: inviteToken,
          },
        );
        if (updateToken) {
          const mailOptions: EmailOptions = {
            to: parentInvite.email,
            subject: 'Connect with your homies!!',
            body: `Hey ${UserRoleHierarchyEnum.CO_LEADER}!! Just accept this invite and ready to connect with your homies  : ${process.env.FRONTEND_DEV_URL}/invite/${updateToken._id}`,
          };
          await this.emailService.sendMail(mailOptions);
          return {
            message: 'Mail send successfully',
            status: 200,
          };
        }
      }

      const createInvite = await this.InviteSchema.create({
        homeId: parentInvite.homeId,
        email: parentInvite.email,
        token: inviteToken,
        roleAssigned: UserRoleHierarchyEnum.CO_LEADER,
        status: 'pending',
      });

      if (createInvite) {
        const mailOptions: EmailOptions = {
          to: parentInvite.email,
          subject: 'Connect with your homies!!',
          body: `Hey ${UserRoleHierarchyEnum.CO_LEADER}!! Just accept this invite and ready to connect with your homies  : ${process.env.FRONTEND_DEV_URL}/invite/${createInvite._id}`,
        };
        await this.emailService.sendMail(mailOptions);
        return {
          message: 'Mail send successfully',
          status: 200,
        };
      }
      return {
        message: 'User not found',
        status: 404,
      };
    } catch (error) {
      throw new BadRequestException('User not found');
    }
  }

  async sendChildrenInvites(childInvitesDto: ChildInviteDto) {
    const { emails, homeId } = childInvitesDto;

    if (!homeId || !homeId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('Invalid homeId format');
    }
    const checkHomeExist = await this.homeModel.findById(homeId);
    if (!checkHomeExist) {
      throw new BadRequestException('Home not found');
    }

    const inviteResults = await Promise.allSettled(
      emails.map(async (email: string) => {
        const inviteToken = this.jwtService.sign(
          { email: email },
          { secret: process.env.JWT_SECRET, expiresIn: '5M' },
        );
        const findInvite = await this.InviteSchema.findOne({
          email: email,
          homeId: homeId,
        });
        if (findInvite) {
          const updateToken = await this.InviteSchema.findByIdAndUpdate(
            findInvite._id,
            {
              token: inviteToken,
            },
          );
          if (updateToken) {
            const mailOptions: EmailOptions = {
              to: email,
              subject: 'Connect with your homies!!',
              body: `Hey ${UserRoleHierarchyEnum.MEMBER}!! Just accept this invite and ready to connect with your homies  : ${process.env.FRONTEND_DEV_URL}/invite/${updateToken._id}`,
            };
            await this.emailService.sendMail(mailOptions);
            return {
              message: 'Mail send successfully',
              status: 200,
            };
          }
        }
        const isInviteCreated = await this.InviteSchema.create({
          homeId: homeId,
          email: email,
          roleAssigned: UserRoleHierarchyEnum.MEMBER,
          status: 'pending',
          token: inviteToken,
        });
        console.log(isInviteCreated, 'isInviteCreated');

        if (isInviteCreated) {
          const mailOptions: EmailOptions = {
            to: email,
            subject: 'Connect with your homies!!',
            body: `Hey ${UserRoleHierarchyEnum.MEMBER}!! Accept this invite and get ready to connect with your homies: ${process.env.FRONTEND_DEV_URL}/invite/${isInviteCreated._id}`,
          };
          await this.emailService.sendMail(mailOptions);
        }
      }),
    );

    const failedInvites = inviteResults.filter(
      (result) => result.status === 'rejected',
    );

    if (failedInvites.length > 0) {
      throw new InternalServerErrorException('Some invites were not created');
    }

    return {
      message: 'Invite created successfully',
      status: 201,
    };
  }

  async acceptHomeInvite(invite: { id: string; token: string }) {
    const { id, token } = invite;
    const findInvite = await this.InviteSchema.find({ _id: id, token: token });

    if (!findInvite) {
      throw new BadRequestException('Invalid invite link');
    }

    return {
      message: 'Invite accepted successfully',
      status: 200,
    };
  }

  async acceptCoLeaderInvite(acceptInviteDto: AcceptInviteDto) {
    const findInvite = await this.InviteSchema.findOne({
      email: acceptInviteDto.email,
      token: acceptInviteDto.inviteToken,
    });

    if (!findInvite) {
      throw new BadRequestException('Invalid invite link');
    }

    const findUser = await this.pUserModel.findOne({
      email: findInvite.email,
    });

    if (!findUser) {
      throw new BadRequestException(
        'User not found please create account first',
      );
    }

    if (!findUser) {
      throw new BadRequestException('User not found');
    }

    const addCoLeader = await this.homeModel.findByIdAndUpdate(
      findInvite.homeId,
      {
        coLeader: findUser._id,
      },
    );

    if (!addCoLeader) {
      throw new BadRequestException('Unable to add co-leader');
    }
    if (findInvite) {
      await this.InviteSchema.findByIdAndDelete(findInvite._id);
    }

    return {
      message: 'Co-leader added successfully',
      status: 200,
    };
  }
}
