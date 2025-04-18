import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { homeSchema } from 'src/Schemas/homeSchema/homeSchema';
import { CreateHomeDto } from './dto/home.dto';
import { HomeInterface } from 'src/shared/interface/home-interface';
import { HomeFieldValidators } from 'src/utils/validators/fieldValidators';

@Injectable()
export class HomeService {
  constructor(
    @InjectModel(homeSchema.name) private homeModel: Model<homeSchema>,
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
      throw new Error('Leader already has a home');
    }

    const newHome = await this.homeModel.create({
      homeName: createHomeDto.homeName,
      homeDesc: createHomeDto.homeDesc,
      homePhoto: createHomeDto.homePhoto,
      leader: createHomeDto.leader,
    });

    return {
      message: 'Home created successfully',
      data: newHome,
      status: 201,
    };
  }
}
