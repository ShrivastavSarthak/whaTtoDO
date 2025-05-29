import mongoose from "mongoose";


export interface ChildSignupInterface {
    username: string;
    email: string;
    phoneNo: string;
    password: string;
}


export interface ParentSignupInterface {
    name: string;
    username: string;
    email: string;
    phoneNo: string;
    password: string;
    gender: string;
    occupation: string;
}

export interface MemberInvitedInterface {
  _id: mongoose.Types.ObjectId;
  homeId: string;
  email: string;
  roleAssigned: string;
  status: string;
  token?: string;
  createdAt?: Date;
  updatedAt?: Date;
  
}