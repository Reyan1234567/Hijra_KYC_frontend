import { ReactNode, useState } from "react";
import {  userInfo } from "../types/ContextFiles";
import { LoginRequest } from "../types/LoginRequest";
import { AuthContext } from "./AuthContext";
import { loginFetch } from "../services/Authentication";
import { Logout } from "../services/axios.ts";


interface prop{
    child:ReactNode
}

export const AuthProvider = (children : prop) => {
  const [user, setUser] = useState<userInfo | null>(null);

  const login = async (userData: LoginRequest) => {
    const response = await loginFetch(userData);
    if (response) {
      setUser(response.data.userDetails);
    } else {
      setUser(null);
    }
  };

  const logout = async() => {
    Logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout}}>
      {children.child}
    </AuthContext.Provider>
  );
};

