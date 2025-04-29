import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class invite {
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

  @Prop({ type: Date, default: new Date() })
  invited_at: Date;
}

export const InviteSchema = SchemaFactory.createForClass(invite);
