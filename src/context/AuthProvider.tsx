import { ReactNode, useEffect, useLayoutEffect, useState } from "react";
import { userInfo } from "../types/ContextFiles";
import { LoginRequest } from "../types/LoginRequest";
import { AuthContext } from "./AuthContext";
import { loginFetch, loginLog } from "../services/Authentication";
import { api, Logout } from "../services/axios.ts";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

interface prop {
  child: ReactNode;
}

export const AuthProvider = (children: prop) => {
  const [user, setUser] = useState<userInfo | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [messageUnreadCount, setMessageUnreadCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

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
    try {
      const response = await loginFetch(userData);
      console.log(response.data.userInfo);
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("username", response.data.userInfo.username);
      localStorage.setItem("userId", response.data.userInfo.userId.toString());
      localStorage.setItem("role", response.data.userInfo.role);
      await loginLog(response.data.userInfo.userId);
      setUser(response.data.userInfo);
      navigate("/dashboard");
    } catch (e) {
      console.log(e);
      setUser(null);
      messageApi.open({
        type: "error",
        content: e?.response?.data ?? "Something went wrong",
      });
    }
  };

  const logout = async () => {
    Logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        messageCount: messageUnreadCount,
        setMessageCount: setMessageUnreadCount,
        rejectedCount,
        setRejectedCount,
        pendingCount,
        setPendingCount,
      }}
    >
      {contextHolder}
      {children.child}
    </AuthContext.Provider>
  );
};
