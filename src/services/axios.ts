import axios from "axios";
import { logOutLog } from "./Authentication";

type refreshResponse = {
  accessToken: string;
};

const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

const getUserId = () => {
  return localStorage.getItem("userId");
};

const getRefreshToken=()=>{
  return localStorage.getItem("refreshToken")
}

export const api = axios.create({
  baseURL: "http://localhost:9090/",
  timeout: 5000,
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getAccessToken()}`;
  return config;
});

api.interceptors.response.use(
  async (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      (error.response.status == 401 || error.response.status == 403) &&
      !originalRequest._retry
    ) {
      try {
        originalRequest._retry = true;
        const newTokens = await getNewRefresh();
        localStorage.setItem("accessToken", newTokens!.accessToken);
        return api(originalRequest);
      } catch (e) {
        Logout(); //the logout function in the context and this specific function are different so what do you say????
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

const getNewRefresh = async () => {
  try {
    const refresh = await axios.post<refreshResponse>(
      "http://localhost:9090/auth/refresh",
      { refreshToken: getRefreshToken() }
    );
    console.log(refresh);
    return refresh.data;
  } catch (e) {
    console.log(e);
  }
};

export const Logout = async () => {
  try {
    if (!getUserId()) {
      throw new Error("no UserId found");
    }
    await logOutLog(Number(getUserId()));
  } catch (e) {
    console.log(e);
  } finally {
    window.location.replace("http://localhost:5173/login");
    localStorage.clear();
  }
};
