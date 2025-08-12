import { ReactNode, useLayoutEffect, useState } from "react";
import { userInfo } from "../types/ContextFiles";
import { LoginRequest } from "../types/LoginRequest";
import { AuthContext } from "./AuthContext";
import { loginFetch } from "../services/Authentication";
import { Logout } from "../services/axios.ts";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

interface prop {
  child: ReactNode;
}

export const AuthProvider = (children: prop) => {
  const [user, setUser] = useState<userInfo | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const onReload = () => {
      const username = localStorage.getItem("username") ?? "";
      const userId = localStorage.getItem("userId") ?? "";
      const role = localStorage.getItem("role") ?? "";
      if (userId != "" && username != "" && role != "") {
        setUser({ username: username, userId: parseInt(userId), role: role });
      }
    };
    onReload();
  }, []);

  const login = async (userData: LoginRequest) => {
    const response = await loginFetch(userData);
    if (response?.status == 200) {
      console.log(response.data.userInfo);
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("username", response.data.userInfo.username);
      localStorage.setItem("userId", response.data.userInfo.userId.toString());
      localStorage.setItem("role", response.data.userInfo.role);
      setUser(response.data.userInfo);
      navigate("/dashboard");
    } else {
      setUser(null);
      messageApi.open({
        type: "error",
        content: "wrong credentials",
      });
    }
  };

  const logout = async () => {
    Logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {contextHolder}
      {children.child}
    </AuthContext.Provider>
  );
};
