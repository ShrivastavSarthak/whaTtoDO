import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class aUser {
  @Prop({ unique: true, required: true })
  userName: string;

  @Prop({ unique: false, required: true })
  name: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const aUserSchema = SchemaFactory.createForClass(aUser);
