import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from 'src/Schemas/cSchema/task.schema';
// import { User } from 'src/Schemas/cSchema/user.schema';
// import { pUser } from 'src/Schemas/pSchema/pUser.schema';
import {
  CreateParentTaskDto,
  DeleteParentTaskDto,
  ReadParentTaskDto,
  UpdateParentTaskDto,
} from './dtos/Ptask.dto';
import { Invite } from 'src/Schemas/inviteSchema/inviteSchema';

@Injectable()
export class pTaskUserService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    // @InjectModel(User.name) private uTaskModel: Model<User>,
    // @InjectModel(pUser.name) private pTaskModel: Model<pUser>,
    @InjectModel(Invite.name) private inviteModel: Model<Invite>,
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


  async readAllChildTaskByParent(homeId:string){
    try {
      
      const findAllTask = await this.taskModel.find({homeId:homeId});

      if(!findAllTask) {
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

  async getAllRequest(homeId:string){
    try {
      const findAllTask = await this.inviteModel.find({homeId:homeId}, {token: 0});

      if(!findAllTask) {
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
}
