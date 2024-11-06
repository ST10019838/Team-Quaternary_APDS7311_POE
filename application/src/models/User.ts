export interface User {
  _id?: string;
  fullname: string;
  username: string;
  idNumber: number;
  accountNumber: number;
  isEmployee: boolean;
  isAdmin?: boolean;
  password?: string;
}
