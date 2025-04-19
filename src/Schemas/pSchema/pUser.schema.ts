import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { gender, occupation } from 'src/shared/enum/parent.enum';

@Schema()
export class pUser {
  @Prop({ unique: false, required: true })
  name: string;

  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ unique: true, required: true })
  phoneNo: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, type: String })
  gender: {
    type: string;
    enum: gender;
  };

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ required: true, type: String })
  occupation: {
    type: string;
    enum: occupation;
  };
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  children: [];

  @Prop()
  verificationToken: string;

  @Prop()
  tokenExpiry: Date;

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: new Date() })
  updated_at: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'home', default: null })
  homeId: string;
}

export const pUserSchema = SchemaFactory.createForClass(pUser);
