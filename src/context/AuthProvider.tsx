// import { useState } from "react";
// import { AuthContextProps, userInfo } from "../types/ContextFiles";
// import { LoginRequest } from "../types/LoginRequest";
// import { AuthContext } from "./AuthContext";
// import { loginFetch } from "../services/Authentication";
// import { Logout } from "../services/axios.ts";


// export const AuthProvider = ({ children }: AuthContextProps) => {
//   const [user, setUser] = useState<userInfo | null>(null);

//   const login = async (userData: LoginRequest) => {
//     const response = await loginFetch(userData);
//     if (response) {
//       setUser(response.data.userDetails);
//     } else {
//       setUser(null);
//     }
//   };

//   const logout = async() => {
//     Logout();
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

