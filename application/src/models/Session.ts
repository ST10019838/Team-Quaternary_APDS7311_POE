export interface Session {
  username: string;
  idNumber: number;
  accountNumber: number;
  isAdmin: boolean;
  isEmployee: boolean;
  token: string;
}
