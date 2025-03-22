import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from 'src/Schemas/cSchema/task.schema';
import { User } from 'src/Schemas/cSchema/user.schema';
import { pUser } from 'src/Schemas/pSchema/pUser.schema';
import { CreateTaskDto, DeleteTaskDto } from './dtos/Task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(pUser.name) private parentModel: Model<pUser>,
  ) {}

  async createTask(createTaskDto: CreateTaskDto) {
    try {
      const userExists =
        (await this.userModel.findById(createTaskDto.created_by)) ||
        this.parentModel.findById(createTaskDto.created_by);

      if (!userExists) {
        return { message: 'User not found' };
      }

      const newTask = await this.taskModel.create({
        taskName: createTaskDto.taskName,
        taskDetails: createTaskDto.taskDetails,
        created_by: createTaskDto.created_by,
        updated_by: createTaskDto.created_by,
        isCompleted: false,
        isDeleted: false,
        completed_at: createTaskDto.completed_at,
        started_at: createTaskDto.started_at,
        media: createTaskDto.media,
        created_at: new Date(),
        updated_at: new Date(),
        points: createTaskDto.points,
      });

      return { message: 'Task created successfully', newTask };
    } catch (error) {
      console.error('Error creating task:', error);
      return { message: 'Something went wrong', error };
    }
  }

  async getUserTask(id: string) {
    try {
      const userExists = await this.userModel.findById(id);
      if (!userExists) {
        return { message: 'User not found' };
      }
;

      const tasks = await this.taskModel.find({ created_by: id });
      return tasks;
    } catch (error) {
      console.error('Error fetching user tasks:', error);
      return { message: 'Something went wrong', error };
    }
  }

  async updateTask(id: string, taskName: string) {
    try {
      const task = await this.taskModel.findById(id);
      if (!task) {
        return { message: 'Task not found' };
      }

      const updatedTask = await this.taskModel.findByIdAndUpdate(
        id,
        { taskName },
        { new: true },
      );

      return { message: 'Task updated', updatedTask };
    } catch (error) {
      console.error('Error updating task:', error);
      return { message: 'Something went wrong', error };
    }
  }

  async deleteTask(id: string, task: DeleteTaskDto) {
    try {
      const deletedTask = await this.taskModel.findByIdAndUpdate(id, {
        isDeleted: true,
        updated_at: new Date(),
        updated_by: task.updated_by,
      });
      if (!deletedTask) {
        return { message: 'Task not found' };
      }

      return { message: 'Task deleted successfully' };
    } catch (error) {
      console.error('Error deleting task:', error);
      return { message: 'Something went wrong', error };
    }
  }
}
