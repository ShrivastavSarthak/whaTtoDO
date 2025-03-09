import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsArray } from 'class-validator';

@Schema()
export class User {
  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({
    unique: true,
    required: true,
    validate: {
      validator: function (v: string) {
        return v.toString().length >= 10 && v.toString().length <= 10;
      },
      message: 'Phone number should be of 10 digits',
    },
  })
  phoneNo: string;

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

  @Prop()
  verificationToken: string;

  @Prop()
  tokenExpiry: Date;

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: new Date() })
  updated_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
