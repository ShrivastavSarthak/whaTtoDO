import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { home } from 'src/Schemas/homeSchema/homeSchema';
import { pUser } from 'src/Schemas/pSchema/pUser.schema';
import { HomeInterface } from 'src/shared/interface/home-interface';
import { HomeFieldValidators } from 'src/utils/validators/fieldValidators';
import { CreateHomeDto } from './dto/home.dto';

@Injectable()
export class HomeService {
  constructor(
    @InjectModel(home.name) private homeModel: Model<home>,
    @InjectModel(pUser.name) private pUserModel: Model<pUser>,
  ) {}

  async createHome(createHomeDto: CreateHomeDto) {
    const home: HomeInterface = {
      homeName: createHomeDto.homeName,
      homeDesc: createHomeDto.homeDesc,
      homePhoto: createHomeDto.homePhoto,
      leader: createHomeDto.leader,
    };
    const checkValidation = HomeFieldValidators(home);

    // TODO:HAVE TO IMPLEMENT IT NOW LEAVE IT FOR LATER
    console.log(checkValidation);

    const isLeaderHomeExist = await this.homeModel.find({
      leader: home.leader,
    });

    if (isLeaderHomeExist.length > 0) {
      throw new BadRequestException("Leader already has a home");
    }

    const newHome = await this.homeModel.create({
      homeName: createHomeDto.homeName,
      homeDesc: createHomeDto.homeDesc,
      homePhoto: createHomeDto.homePhoto,
      leader: createHomeDto.leader,
    });

    const addHomeToLeader = await this.pUserModel.findByIdAndUpdate(
      home.leader,
      {
        homeId: newHome._id,
      },
    );

    if (!addHomeToLeader) {
      throw new BadRequestException('Failed to add home to leader');
    }

    return {
      message: 'Home created successfully',
      data: newHome,
      status: 201,
    };
  }

  // TODO: THIS FUNCTION WILL UPDATE BY GETTING THE LEADER CO-LEADER ID.
  async getHomeByLeaderId(id: string) {
    const isLeaderExist = await this.pUserModel.findById(id);
    if (!isLeaderExist) {
      throw new BadRequestException("Leader not found!!")
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
}
