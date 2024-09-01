
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { gender, occupation } from 'src/enum/parent.enum';

@Schema()
export class pUser {
  @Prop({ unique: false, required: true })
  name: string;

  @Prop({required:true,default:false})
  verified: boolean

  @Prop({ unique: true, required: true })
  userName: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ unique: true, required: true })
  phoneNo: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;

  @Prop({ required: true, type: String })
  gender: {
    type: string;
    enum: gender;
  };

  @Prop({ required: true, type: String })
  occupation: {
    type: string;
    enum: occupation;
  };
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  children: [];
}

export const pUserSchema = SchemaFactory.createForClass(pUser);
