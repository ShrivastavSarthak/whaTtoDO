import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Child } from 'src/Schemas/cSchema/child.schema';
import { Home } from 'src/Schemas/homeSchema/homeSchema';
import { pUser } from 'src/Schemas/pSchema/pUser.schema';
import { HomeInterface } from 'src/shared/interface/home-interface';
import { HomeFieldValidators } from 'src/utils/validators/fieldValidators';
import { CreateHomeDto } from './dto/home.dto';

@Injectable()
export class HomeService {
  constructor(
    @InjectModel(Home.name) private homeModel: Model<Home>,
    @InjectModel(pUser.name) private pUserModel: Model<pUser>,
    @InjectModel(Child.name) private cUserModel: Model<Child>,
    @InjectConnection() private connection: Connection,
  ) {}

  async createHome(createHomeDto: CreateHomeDto) {
    const home: HomeInterface = {
      homeName: createHomeDto.homeName,
      homeDesc: createHomeDto.homeDesc,
      homePhoto: createHomeDto.homePhoto,
      leader: createHomeDto.leader,
    };
    const checkValidation = HomeFieldValidators(home);

    if (!checkValidation) {
      throw new BadRequestException('Field validation failed');
    }
    const session = await this.connection.startSession();

    try {
      session.startTransaction({
        readConcern: { level: 'snapshot' },
        writeConcern: { w: 'majority' },
      });

      // Move this inside the transaction
      const isLeaderHomeExist = await this.homeModel
        .find({ leader: home.leader })
        .session(session);

      if (isLeaderHomeExist.length > 0) {
        throw new BadRequestException('Leader already has a home');
      }

      const newHome = await this.homeModel.create(
        [
          {
            leader: home.leader,
            homeName: home.homeName,
            homeDesc: home.homeDesc,
            homePhoto: home.homePhoto,
          },
        ],
        { session },
      );

      const updatedLeader = await this.pUserModel.findByIdAndUpdate(
        home.leader,
        { homeId: newHome[0]._id },
        { session, new: true },
      );

      if (!updatedLeader) {
        throw new BadRequestException(
          'Something went wrong while creating the home. Please try again.',
        );
      }

      await session.commitTransaction();

      return {
        message: 'Home created successfully',
        data: newHome[0],
        status: 201,
      };
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException(error);
    } finally {
      session.endSession();
    }
  }

  // TODO: THIS FUNCTION WILL UPDATE BY GETTING THE LEADER CO-LEADER ID.
  async getHomeByLeaderId(id: string) {
    const isLeaderExist = await this.pUserModel.findById(id);
    if (!isLeaderExist) {
      throw new BadRequestException('Leader not found!!');
    }
    const home = await this.homeModel.findOne({ leader: id });
    if (!home) {
      throw new BadRequestException('Home not found for this leader');
    }

    return {
      message: 'Home found successfully',
      data: home,
      status: 200,
    };
  }

  async deleteHome(homeId: string) {
    if (!homeId) {
      throw new BadRequestException('homeId should not be empty');
    }
    const findHome = await this.homeModel.findById(homeId);

    if (!findHome) {
      throw new NotFoundException('Home not exist or already deleted');
    }

    const session = await this.connection.startSession();

    try {
      session.startTransaction({
        readConcern: { level: 'snapshot' },
        writeConcern: { w: 'majority' },
      });
      await this.pUserModel
        .updateMany(
          { homeId: findHome._id },
          { $set: { homeId: null, updated_at: new Date() } },
        )
        .session(session);

      if (findHome.members) {
        await this.cUserModel
          .updateMany(
            { homeId: findHome._id },
            { $set: { homeId: null, updated_at: new Date() } },
          )
          .session(session);
      }

      await this.homeModel.findByIdAndDelete(findHome._id).session(session);

      await session.commitTransaction();
      return {
        statusCode: 200,
        message: 'Home deleted successfully',
      };
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException(
        'Sorry home did not delete, please try again in a while',
      );
    }

    const deleteHomeById = await this.homeModel.findByIdAndDelete(homeId);

    if (!deleteHomeById) {
      throw new BadRequestException(
        'Sorry home did not delete, please try again in a while',
      );
    }

    return {
      statusCode: 200,
      message: 'Home deleted successfully',
    };
  }
}
