import { LoginRequest } from "../types/LoginRequest";
import { userInfo } from "../types/ContextFiles";
import axios from "axios";

interface loginResult{
    userInfo:userInfo,
    accessToken:string,
    refreshToken:string
}

export const loginFetch=async (userInfo:LoginRequest)=>{
    try{
        const loginResult=await axios.post<loginResult>("http://localhost:9090/user/login", userInfo)
        return loginResult;
    }
    catch(e){
        console.log(e)
    }
}

