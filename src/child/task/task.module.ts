import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TaskService } from "./task.service";
import { TaskController } from "./task.controller";
import { User, UserSchema } from "src/Schemas/cSchema/user.schema";
import { Task, TaskSchema } from "src/Schemas/cSchema/task.schema";


@Module({
    imports:[
        MongooseModule.forFeature([
            {
                name: Task.name,
                schema: TaskSchema,
            },{
                name: User.name,
                schema:UserSchema
            }
            
        ])
    ],
    providers: [TaskService],
    controllers:[TaskController]
})

export class TaskModule{}