import { LoginRequest } from "../types/LoginRequest";
import { userInfo } from "../types/ContextFiles";
import axios from "axios";
import { api } from "./axios";

interface loginResult {
  userInfo: userInfo;
  accessToken: string;
  refreshToken: string;
}

export const loginFetch = async (userInfo: LoginRequest) => {
  const loginResult = await axios.post<loginResult>(
    "http://localhost:9090/user/login",
    userInfo,
    { withCredentials: true }
  );
  return loginResult;
};

export const loginLog = async (id: number) => {
  try {
    await api.post("/api/system-logs/add-new-login-log", { userId: id });
  } catch (e) {
    console.log(e);
  }
};

export const logOutLog = async (id: number) => {
  try {
    await api.post("/api/system-logs/add-new-logout-log", { userId: id });
  } catch (e) {
    console.log(e);
  }
};
