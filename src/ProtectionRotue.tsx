// import { useContext } from "react";
// import { AuthContext } from "./context/AuthContext";
import { Outlet, useNavigate } from "react-router-dom";
// import { config } from "dotenv";
// config();

const ProtectionRotue = () => {
  const navigate=useNavigate()
  // const user = useContext(AuthContext);
  // console.log(user?.user)
  // console.log(localStorage.getItem("accessToken"))
  return localStorage.getItem("username") &&  localStorage.getItem("accessToken") ? (
    <Outlet />
  ) : (
    navigate("/login")
  );
};

export default ProtectionRotue;
