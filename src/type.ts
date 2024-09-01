export interface UserInterface {
  userName: string;
  _id: string;
  email: string;
  phoneNo: number;
  password: string;
}


export interface EmailOptions{
  to:string;
  subject: string;
  body: string
}