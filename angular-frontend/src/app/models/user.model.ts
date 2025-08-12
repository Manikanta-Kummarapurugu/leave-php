
export interface User {
  EMPID: number;
  EMPNAME: string;
  EMPPOSITION: string;
  USERNAME: string;
  PASSWRD?: string;
  ACCSTATUS: string;
  EMPSEX: string;
  COMPANY: string;
  DEPARTMENT: string;
  EMPLOYID: string;
  AVELEAVE: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: User;
}
