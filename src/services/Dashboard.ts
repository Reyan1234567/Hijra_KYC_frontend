import { api } from "./axios"

interface MakerDashboard {
  saved: number;
  drafts: number;
  accepted: number;
  rejected: number;
  pending: number;
  total: number;
}

// interface ManagerDashboard {
//   accepted: number;
//   rejected: number;
//   pending: number;
//   total: number;
// }

export const getDashboard=async(id:number, date:Date)=>{
    return await api.get<MakerDashboard>(`/makeForm/dashboard/${id}`, {params:{date:date}})
}
