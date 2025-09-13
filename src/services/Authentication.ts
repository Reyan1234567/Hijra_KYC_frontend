/*
 * HIJRA KYC FRONTEND - AUTHENTICATION SERVICE
 * 
 * FILE TYPE: Service/API Layer
 * PURPOSE: Handles user authentication and session logging
 * 
 * FUNCTIONALITY:
 * - User login with credentials
 * - Login/logout activity logging
 * - Token management integration
 * 
 * API ENDPOINTS USED:
 * - POST /auth/login - User authentication
 * - POST /api/system-logs/add-new-login-log - Log user login
 * - POST /api/system-logs/add-new-logout-log - Log user logout
 * 
 * EXPORTED FUNCTIONS:
 * - loginFetch: Authenticates user and returns tokens + user info
 * - loginLog: Records login activity for audit trail
 * - logOutLog: Records logout activity for audit trail
 * 
 * DATA FLOW:
 * 1. loginFetch called with username/password
 * 2. Returns userInfo, accessToken, refreshToken
 * 3. Used by AuthProvider for login process
 * 4. Login/logout logs called for audit tracking
 * 
 * USED BY: AuthProvider.tsx for authentication flow
 */

import { LoginRequest } from "../types/LoginRequest";
import { userInfo } from "../types/ContextFiles";
import axios from "axios";
import { api } from "./axios";
import { BASE_URL } from "./Constants";

interface loginResult {
  userInfo: userInfo;
  accessToken: string;
  refreshToken: string;
}

export const loginFetch = async (userInfo: LoginRequest) => {
  const loginResult = await axios.post<loginResult>(
    BASE_URL+"/auth/login",
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
    console.log("logging logout")
  } catch (e) {
    console.log(e);
  }
};
