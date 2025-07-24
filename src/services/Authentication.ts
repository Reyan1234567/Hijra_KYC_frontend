import {api} from "./axios";
import { LoginRequest } from "../types/LoginRequest";
import { userInfo } from "../types/ContextFiles";

interface loginResult{
    userDetails:userInfo,
    accessToken:string,
    refreshToken:string
}

export const loginFetch=async (userInfo:LoginRequest)=>{
    try{
        const loginResult=await api.post<loginResult>("/api/login", userInfo)
        localStorage.setItem('accessToken', loginResult.data.accessToken)
        return loginResult;
    }
    catch(e){
        console.log(e)
    }
}

