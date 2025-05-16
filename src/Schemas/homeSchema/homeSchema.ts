import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Home {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'pUser' })
  leader: string;

  @Prop({ required: true })
  homeName: string;

  @Prop({ required: true })
  homeDesc: string;

  @Prop({ type: String, default: null })
  homePhoto: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'pUser', default: null })
  coLeader: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Child', default: [] })
  members: mongoose.Schema.Types.ObjectId[];

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: new Date() })
  updated_at: Date;
}

export const HomeSchema = SchemaFactory.createForClass(Home);
