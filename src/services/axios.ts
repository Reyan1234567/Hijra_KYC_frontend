import axios from "axios";
// import {config} from "dotenv";
// import { jwtDecode } from "jwt-decode";
// import { userInfo } from "../types/ContextFiles";

// config()

export const api=axios.create({
    baseURL:"http://localhost:9090/",
    timeout:5000,
    headers: {
        'Authorization':`Bearer ${localStorage.getItem("accessToken")}`
    }
})

// let isRefreshing=false;
// let failedQueue:promisQueue[]=[];

// const loopRequest=()=>{
//    failedQueue.forEach((failedRequest)=>{
//      const {resolve, config}=failedRequest;
//         resolve(config);
//    }) 
//    failedQueue=[];
// }


// api.interceptors.request.use(
//     async (config)=>{
//         if(isRefreshing){
//             return new Promise((resolve)=>failedQueue.push({config, resolve}))
//         }

//         if(!config.headers?.Authorization){
//             return Promise.reject("No Authorization header");
//         }
//         const token=jwtDecode<decodedToken>((config.headers?.Authorization as string).split(" ")[1]);
//         if(!token){
//             return config;
//         }
//         const now=new Date();
//         now.setSeconds(now.getSeconds()+5)
//         if(new Date(token.exp)<now){
//             isRefreshing=true;
//             const newToken=await getNewRefresh();
//             if(!newToken||!newToken.data){
//                 Logout();
//                 return Promise.reject("Nothing in the Authorization header");
//             }
//             localStorage.setItem('accessToken', newToken.data)
//             isRefreshing=false;
//             if(failedQueue.length!=0){
//                 loopRequest()
//             }
//         }
//         return config;
//     },
//     (error)=>{
//         console.log(error)
//         return Promise.reject(error)
//     }
// )

// const getNewRefresh=async()=>{
//     try{
//         const refresh= await axios.get<string>("http://localhost:9090/api/get-refresh", {withCredentials:true});
//         return refresh;
//     }
//     catch(e){
//         console.log(e)
//     }
// }

// export const Logout=async ()=>{
//     try{
//         await axios.get("/logout");
//     }
//     catch(e){
//         console.log(e)
//     }
//     localStorage.removeItem('accessToken');
// }

// type decodedToken={
//     iat:number,
//     exp:number,
//     user:userInfo
// }

// type promisQueue={
//     resolve:(value:InternalAxiosRequestConfig)=>void,
//     config:InternalAxiosRequestConfig
// }

// import axios, { InternalAxiosRequestConfig } from "axios";
// 