import { LoginRequest } from "../types/LoginRequest";

export interface userInfo {
  username: string;
  userId:number;
  role: string;
}

export interface AuthInfo {
  user: userInfo | null;
  login: (userData: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}
export interface AuthContextProps {
  children: React.ReactNode;
}