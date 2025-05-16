import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class ChildTask {
  @Prop({ required: true })
  taskName: string;

  @Prop({ required: true })
  taskDetails: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Child' })
  created_by: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Child' })
  updated_by: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, default: false })
  isCompleted: boolean;

  @Prop({ required: true, default: false })
  isDeleted: boolean;

  @Prop({ required: true, default: 0 })
  points: number;

  @Prop({ required: false })
  media: string;

  @Prop({ type: Date })
  completed_at: Date;

  @Prop({ type: Date, default: Date.now })
  started_at: Date;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;

  @Prop({ required: true, type: Date, default: Date.now })
  updated_at: Date;
}

export const ChildTaskSchema = SchemaFactory.createForClass(ChildTask);
