import axios from "axios";
import { logOutLog } from "./Authentication";
import { BASE_URL } from "./Constants";

type RefreshResponse = {
  accessToken: string;
};

const getAccessToken = () => localStorage.getItem("accessToken");
const getRefreshToken = () => localStorage.getItem("refreshToken");
const getUserId = () => localStorage.getItem("userId");

// Axios instance
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

// Add Authorization header to all requests
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401/403 and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const newTokens = await refreshAccessToken();
        if (!newTokens) throw new Error("Failed to refresh token");

        // Save new access token and retry original request
        localStorage.setItem("accessToken", newTokens.accessToken);
        originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
        return api(originalRequest);
      } catch (err) {
        console.error("Refresh token failed, logging out...", err);
        await Logout();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// Refresh token function
const refreshAccessToken = async (): Promise<RefreshResponse | undefined> => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token available");

    const response = await axios.post<RefreshResponse>(
      BASE_URL+"/auth/refresh",
      { refreshToken }
    );

    return response.data;
  } catch (err) {
    console.error("Error refreshing access token:", err);
    return undefined;
  }
};

// Logout function
export const Logout = async () => {
  try {
    const userId = getUserId();
    if (userId) await logOutLog(Number(userId));
  } catch (err) {
    console.error("Error during logout:", err);
  } finally {
    localStorage.clear();
    window.location.replace("/app");
  }
};