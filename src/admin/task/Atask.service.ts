import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/Schemas/cSchema/user.schema';
import { pUser } from 'src/Schemas/pSchema/pUser.schema';
import { FetchByIdDto, RemoveParentChildRelationDto } from './dto/Atask.dto';

@Injectable()
export class AdminTaskService {
  constructor(
    @InjectModel(pUser.name) private patentUserModel: Model<pUser>,
    @InjectModel(User.name) private childUserModel: Model<User>,
  ) {}

  async getAllParent(): Promise<{
    message: string;
    data: any;
    status: number | string;
  }> {
    try {
      console.log('hii');

      const fetchAllParent = await this.patentUserModel.find();
      console.log(fetchAllParent);

      if (!fetchAllParent) {
        return { message: 'No parent found', data: [], status: 200 };
      }

      return {
        message: 'Parent fetch successfully',
        data: fetchAllParent,
        status: 200,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAllChildren(): Promise<{
    message: string;
    data: any;
    status: number | string;
  }> {
    try {
      const fetchAllChildren = await this.childUserModel.find();

      if (!fetchAllChildren) {
        return { message: 'No children found', data: [], status: 200 };
      }

      return {
        message: 'children fetch successfully',
        data: fetchAllChildren,
        status: 200,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async fetchParentById(fetchPatentId: FetchByIdDto): Promise<{
    message: string;
    data: any;
    status: number | string;
  }> {
    try {
      const fetchPatent = await this.patentUserModel.findById(fetchPatentId.id);

      if (!fetchPatent) {
        throw new Error('Sorry this user not found!');
      }

      return {
        message: 'Patent fetched successfully',
        data: fetchPatent,
        status: 200,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async fetchChildById(fetchChildId: FetchByIdDto): Promise<{
    message: string;
    data: any;
    status: number | string;
  }> {
    try {
      const fetchChild = await this.childUserModel.findOne({
        _id: fetchChildId.id,
      });

      if (!fetchChild) {
        throw new Error('Sorry this user not found!');
      }

      return {
        message: 'Child fetched successfully',
        data: fetchChild,
        status: 200,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async removeParentChildRelation(
    removeParentChildRelationDto: RemoveParentChildRelationDto,
  ) {
    try {
      const checkParentExist = await this.patentUserModel.findById(
        removeParentChildRelationDto.parentId,
      );

      if (!checkParentExist) {
        throw new Error('Sorry This user not exist');
      }

      const checkRelation = await this.patentUserModel.findOne({
        children: { $in: [removeParentChildRelationDto.childId] },
      });

      if (!checkRelation) {
        throw new Error('Sorry this child not belongs to you');
      }

      const removeRelation = await this.patentUserModel.updateOne(
        { _id: removeParentChildRelationDto.parentId },
        { $pull: { children: removeParentChildRelationDto.childId } },
      );

      if (!removeRelation) {
        throw new Error(
          'Sorry relation not removed please try again after sometime',
        );
      }

      return {
        message: 'Relation removed successfully',
        status: 200,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
