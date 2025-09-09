// import { useContext } from "react";
// import { AuthContext } from "./context/AuthContext";
import { Outlet, useNavigate } from "react-router-dom";
// import { config } from "dotenv";
// config();

const ProtectionRoute = () => {
  const navigate=useNavigate()
  // const user = useContext(AuthContext);
  // console.log(user?.user)
  // console.log(localStorage.getItem("accessToken"))
  return localStorage.getItem("username") &&  localStorage.getItem("accessToken") ? (
    <Outlet />
  ) : (
      <>
        {localStorage.clear()}
        {window.location.reload()}
      </>
  );
};

export default ProtectionRoute;
