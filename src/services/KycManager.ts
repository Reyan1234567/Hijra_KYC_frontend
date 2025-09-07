import { user } from "../components/User/Profile";
import { api } from "./axios";

export const getCheckers = async () => {
  const res=await api.get<user[]>("/api/user-profiles/getCheckers");
  console.log(res)
  return res
};

export const editAttendance = async (list:number[]) => {
  return await api.patch("/api/user-profiles/editPresent",{ids:list});
};
