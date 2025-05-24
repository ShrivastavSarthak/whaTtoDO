import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChildTask } from 'src/Schemas/cSchema/childTask.schema';
// import { User } from 'src/Schemas/cSchema/user.schema';
// import { pUser } from 'src/Schemas/pSchema/pUser.schema';
import { JwtService } from '@nestjs/jwt';
import { UserRoleHierarchyEnum } from 'src/lib/enums/common.enums';
import { Home } from 'src/Schemas/homeSchema/homeSchema';
import { Invite } from 'src/Schemas/inviteSchema/inviteSchema';
import { pUser } from 'src/Schemas/pSchema/pUser.schema';
import { EmailOptions } from 'src/type';
import { EmailService } from 'src/utils/services/email';
import {
  AcceptInviteDto,
  ChildInviteDto,
  ParentInvite,
} from '../user/dto/Puser.dto';
import {
  CreateParentTaskDto,
  DeleteParentTaskDto,
  ReadParentTaskDto,
  UpdateParentTaskDto,
} from './dtos/Ptask.dto';

@Injectable()
export class pTaskUserService {
  constructor(
    @InjectModel(ChildTask.name) private taskModel: Model<ChildTask>,
    @InjectModel(pUser.name) private pUserModel: Model<pUser>,
    @InjectModel(Invite.name) private InviteSchema: Model<Invite>,
    @InjectModel(Home.name) private homeModel: Model<Home>,
    @InjectModel(Invite.name) private inviteModel: Model<Invite>,

    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async createTaskByParent(createTaskByParentDto: CreateParentTaskDto) {
    try {
      const addTask = {
        updated_by: createTaskByParentDto.pId,
        created_by: createTaskByParentDto.cId,
        taskName: createTaskByParentDto.task,
      };

      const taskCreated = await this.taskModel.create(addTask);

      return {
        message: 'Task created successfully',
        taskCreated,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async readTaskByParent(readParentTaskDto: ReadParentTaskDto) {
    try {
      const readTask = await this.taskModel.find({
        created_by: readParentTaskDto.cId,
      });

      return {
        message: 'Task fetched successfully',
        readTask,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async readAllChildTaskByParent(homeId: string) {
    try {
      const findAllTask = await this.taskModel.find({ homeId: homeId });

      if (!findAllTask) {
        return {
          message: 'Task not found',
          status: '404',
        };
      }
      return {
        message: 'Task fetched successfully',
        status: '200',
        findAllTask,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteTaskByParent(deleteParentTaskDto: DeleteParentTaskDto) {
    try {
      const checkDelete = await this.taskModel.findOneAndDelete({
        _id: deleteParentTaskDto.taskId,
        created_by: deleteParentTaskDto.cId,
      });

      if (!checkDelete) {
        return {
          message: 'Task not found',
          status: '400',
        };
      }
      return {
        message: 'Task deleted successfully',
        status: '201',
      };
    } catch (error) {
      return {
        message: 'Task not deleted',
        status: '500',
        error: error,
      };
    }
  }

  async updateTaskByParent(updateParentTaskDto: UpdateParentTaskDto) {
    try {
      const checkUpdate = await this.taskModel.findOneAndUpdate(
        {
          _id: updateParentTaskDto.taskId,
          created_by: updateParentTaskDto.cId,
        },
        {
          taskName: updateParentTaskDto.taskName,
        },
      );
      if (!checkUpdate) {
        return { message: 'Task not found', status: '404' };
      }

      return {
        message: ' Task updated successfully',
        status: 201,
        task: checkUpdate,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAllRequest(homeId: string) {
    try {
      const findAllInvites = await this.inviteModel.find(
        { homeId: homeId },
        { token: 0 },
      );

      if (!findAllInvites) {
        return {
          message: 'Task not found',
          status: '404',
        };
      }
      return {
        message: 'Task fetched successfully',
        status: '200',
        invites: findAllInvites,
      };
    } catch (error) {
      throw new Error(error);
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
          try {
            await this.emailService.sendMail(mailOptions);
          } catch (error) {
            throw new InternalServerErrorException(
              'Failed to send email',
              error.message,
            );
          }
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

  async resendInvite({
    homeId,
    inviteId,
  }: {
    homeId: string;
    inviteId: string;
  }) {
    if (!homeId && !inviteId) {
      throw new BadRequestException('homeId and inviteId are required');
    }

    const findInvite = await this.InviteSchema.findOne({
      _id: inviteId,
      homeId: homeId,
    });
    if (!findInvite) {
      throw new BadRequestException('Invite not found');
    }

    const inviteToken = this.jwtService.sign(
      { id: findInvite.email },
      { secret: process.env.JWT_SECRET, expiresIn: '5M' },
    );

    findInvite.token = inviteToken;
    const updateToken = await findInvite.save();

    if (!updateToken) {
      throw new InternalServerErrorException('Failed to update invite token');
    }

    const mailOptions: EmailOptions = {
      to: findInvite.email,
      subject: 'Connect with your homies!!',
      body: `Hey ${UserRoleHierarchyEnum.CO_LEADER}!! Just accept this invite and ready to connect with your homies  : ${process.env.FRONTEND_DEV_URL}/invite/${updateToken._id}`,
    };
    await this.emailService.sendMail(mailOptions);
    return {
      message: 'Mail resent successfully',
      status: 200,
    };
  }

  async deleteInvite(inviteId: string) {
    if (!inviteId) {
      throw new BadRequestException('inviteId is required');
    }

    const findInvite = await this.InviteSchema.findByIdAndDelete(inviteId);
    if (!findInvite) {
      throw new BadRequestException('Invite not found');
    }

    return {
      message: 'Invite deleted successfully',
      status: 200,
    };
  }
}
