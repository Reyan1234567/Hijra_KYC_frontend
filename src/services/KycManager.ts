import { user } from "../components/User/Profile";
import { api } from "./axios";

export const getCheckers = async () => {
  return await api.get<user[]>("/api/user-profiles/getCheckers");
};

export const editAttendance = async (list:number[]) => {
  return await api.patch("/api/user-profiles/editPresent",{ids:list});
};
