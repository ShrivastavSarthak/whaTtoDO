import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsArray } from 'class-validator';

@Schema()
export class User {
  @Prop({ unique: true, required: true })
  userName: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({
    unique: true,
    required: true,
    validate: {
      validator: function (v: number) {
        return v.toString().length >= 10 && v.toString().length <= 10;
      },
    },
  })
  phoneNo: number;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({
    type: [String],
    default: [],
    validate: {
      validator: function (v: string[]) {
        return v.length <= 2;
      },
      message: 'A maximum 2 parents are allowed.',
    },
  })
  @IsArray()
  parent: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
