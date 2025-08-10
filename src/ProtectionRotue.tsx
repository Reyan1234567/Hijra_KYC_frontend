import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Outlet } from "react-router-dom";
// import { config } from "dotenv";
// config();

const ProtectionRotue = () => {
  const user = useContext(AuthContext);
  return user?.user && localStorage.getItem("accessToken") ? (
    <Outlet />
  ) : (
    window.location.replace("http://localhost:5173/login")
  );
};

export default ProtectionRotue;
