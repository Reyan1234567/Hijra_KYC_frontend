import axios from "axios";
// import { config } from "dotenv";

type refreshResponse = {
  accessToken: string;
  refreshToken: string;
};

const ACCESS_TOKEN = localStorage.getItem("acccessToken") ?? "";
export const api = axios.create({
  baseURL: "http://localhost:9090/",
  timeout: 5000,
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  },
});

api.interceptors.response.use(
  async (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status == 401 && !originalRequest._retry) {
      try {
        originalRequest._retry = true;
        const newTokens = await getNewRefresh();
        originalRequest.headers.Authorization = `Bearer ${newTokens!.data}`;
        localStorage.setItem("accessToken", newTokens!.data.accessToken);
        localStorage.setItem("refreshToken", newTokens!.data.refreshToken);

        return api(originalRequest);
      } catch (e) {
        Logout();
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

const getNewRefresh = async () => {
  try {
    const refresh = await axios.get<refreshResponse>(
      "http://localhost:9090/api/get-refresh",
      { withCredentials: true }
    );
    return refresh;
  } catch (e) {
    console.log(e);
  }
};

export const Logout = async () => {
  try {
    await axios.get("/logout");
    window.location.replace("http://localhost:5173/login");
  } catch (e) {
    console.log(e);
  }
  localStorage.removeItem("accessToken");
};
