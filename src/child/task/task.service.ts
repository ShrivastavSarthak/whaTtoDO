import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from 'src/Schemas/cSchema/task.schema';
import { CreateTaskDto } from './dtos/Task.dto';
import { User } from 'src/Schemas/cSchema/user.schema';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async addTask(createTaskDto: CreateTaskDto) {
    try {
      const userExists = await this.userModel.findById(
        createTaskDto.created_by,
      );
      if (!userExists) {
        return { message: 'User not found' };
      }
      const addTask = {
        ...createTaskDto,
        updated_by: createTaskDto.created_by,
      };

      const newTask = await this.taskModel.create(addTask);
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

  async deleteTask(id: string) {
    try {
      const deletedTask = await this.taskModel.findByIdAndDelete(id);
      if (!deletedTask) {
        return { message: 'Task not found' };
      }

      return { message: 'Task deleted', deletedTask };
    } catch (error) {
      console.error('Error deleting task:', error);
      return { message: 'Something went wrong', error };
    }
  }
}
