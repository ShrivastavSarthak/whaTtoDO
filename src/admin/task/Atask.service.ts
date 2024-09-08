import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/Schemas/cSchema/user.schema';
import { pUser } from 'src/Schemas/pSchema/pUser.schema';
import {
  DeleteTaskByIdDto,
  FetchByIdDto,
  RemoveParentChildRelationDto,
} from './dto/Atask.dto';
import { Task } from 'src/Schemas/cSchema/task.schema';

@Injectable()
export class AdminTaskService {
  constructor(
    @InjectModel(pUser.name) private patentUserModel: Model<pUser>,
    @InjectModel(User.name) private childUserModel: Model<User>,
    @InjectModel(Task.name) private TaskModel: Model<Task>,
  ) {}

  async getAllParent({
    pageSize,
    pageNo,
  }: {
    pageSize: number;
    pageNo: number;
  }): Promise<{
    message: string;
    data: any;
    status: number | string;
  }> {
    try {
      const skip = (pageNo - 1) * pageSize;

      const fetchAllParent = await this.patentUserModel
        .find()
        .skip(skip)
        .limit(pageSize);

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

  async getAllChildren({
    pageNo,
    pageSize,
  }: {
    pageNo: number;
    pageSize: number;
  }): Promise<{
    message: string;
    data: any;
    status: number | string;
  }> {
    try {
      const skip = (pageNo - 1) * pageSize;
      const fetchAllChildren = await this.childUserModel
        .find()
        .skip(skip)
        .limit(pageSize);

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
        _id: removeParentChildRelationDto.parentId,
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

  async readChildData(pageNo, pageSize, childId) {
    try {
      const skip = (pageNo - 1) * pageSize;
      const fetchData = await this.TaskModel.find({
        created_by: childId,
      })
        .skip(skip)
        .limit(pageSize);

      if (!fetchData) {
        return {
          message: 'Task not found',
          status: 200,
        };
      }
      return {
        message: 'Task fetch successfully',
        data: fetchData,
        status: 200,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteTaskById(deleteTaskByIdDto: DeleteTaskByIdDto) {
    try {
      const deleteTask = await this.TaskModel.findByIdAndDelete(
        deleteTaskByIdDto.id,
      );

      if (!deleteTask) {
        throw new Error('Task not found');
      }

      return {
        message: 'Task deleted successfully',
        status: 200,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
