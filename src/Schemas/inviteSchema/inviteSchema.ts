import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Invite {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'home' })
  homeId: string;

  @Prop({ type: String, required: true })
  roleAssigned: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({
    type: String,
    required: true,
    enum: ['pending', 'accepted', 'rejected'],
  })
  status: string;

  @Prop({ type: String, required: true })
  token: string;

  @Prop({ type: Date, default: new Date() })
  created_at: Date;
  
  @Prop({ type: Date, default: new Date() })
  updated_at: Date;
}

export const InviteSchema = SchemaFactory.createForClass(Invite);
