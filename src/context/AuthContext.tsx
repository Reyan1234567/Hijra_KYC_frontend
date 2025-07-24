import { createContext } from "react";
import { AuthInfo } from "../types/ContextFiles";


export const AuthContext = createContext<AuthInfo | undefined>(undefined);

