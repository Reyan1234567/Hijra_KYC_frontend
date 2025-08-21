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
  messageCount:number;
  setMessageCount:React.Dispatch<React.SetStateAction<number>>;
  rejectedCount:number;
  setRejectedCount:React.Dispatch<React.SetStateAction<number>>;
  pendingCount:number;
  setPendingCount:React.Dispatch<React.SetStateAction<number>>;
}

export interface AuthContextProps {
  children: React.ReactNode;
}