import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class home {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'pUser' })
  leader: string;

  @Prop({ required: true })
  homeName: string;

  @Prop({ required: true })
  homeDesc: string;

  @Prop()
  homePhoto: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'pUser', default: null })
  coLeader: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null })
  members: [];

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: new Date() })
  updated_at: Date;
}

export const HomeSchema = SchemaFactory.createForClass(home);
