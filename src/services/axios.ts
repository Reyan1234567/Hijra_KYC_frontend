import axios from "axios";
// import { config } from "dotenv";

type refreshResponse = {
  accessToken: string;
};

const getAccessToken = () => {
  console.log("so that dumbahh fun");
  return localStorage.getItem("accessToken");
};

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
    console.log("NO error what the hell?????");
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      (error.response.status == 401 || error.response.status == 403) &&
      !originalRequest._retry
    ) {
      try {
        console.log("In the interceptor");
        console.log(error.response.status);
        originalRequest._retry = true;
        const newTokens = await getNewRefresh();
        console.log("THE NEW TOKEN");
        console.log(newTokens);
        originalRequest.headers.Authorization = `Bearer ${newTokens}`;
        localStorage.setItem("accessToken", newTokens!.accessToken);
        return api(originalRequest);
      } catch (e) {
        console.log(e);
        console.log("SHIIIIIT AIIINNTT WORKING");
        // Logout(); //the logout function in the context and this specific function are different so what do you say????
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

const getNewRefresh = async () => {
  try {
    const refresh = await axios.get<refreshResponse>(
      "http://localhost:9090/user/refresh",
      { withCredentials: true }
    );
    console.log(refresh);
    return refresh.data;
  } catch (e) {
    console.log(e);
  }
};

export const Logout = async () => {
  try {
    window.location.replace("http://localhost:5173/login");
  } catch (e) {
    console.log(e);
  }
  localStorage.clear();
  localStorage.removeItem("accessToken");
};
