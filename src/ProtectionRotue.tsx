// import { useContext } from "react";
// import { AuthContext } from "./context/AuthContext";
import { Outlet } from "react-router-dom";
// import { config } from "dotenv";
// config();

const ProtectionRotue = () => {
  // const user = useContext(AuthContext);
  // console.log(user?.user)
  // console.log(localStorage.getItem("accessToken"))
  return localStorage.getItem("username") &&  localStorage.getItem("accessToken") ? (
    <Outlet />
  ) : (
    window.location.replace("http://localhost:5173/login")
  );
};

export default ProtectionRotue;
