export interface UserInterface {
  username: string;
  _id: string;
  email: string;
  phoneNo: string;
  password: string;
}


export interface EmailOptions{
  to:string;
  subject: string;
  body: string
}