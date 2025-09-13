/*
 * HIJRA KYC FRONTEND - KYC MANAGER SERVICE
 * 
 * FILE TYPE: Service/API Layer
 * PURPOSE: Handles manager-specific operations and user management
 * 
 * FUNCTIONALITY:
 * - Retrieve checker users for assignment/management
 * - Update attendance status for multiple users
 * - Manager-level user operations
 * 
 * API ENDPOINTS USED:
 * - GET /api/user-profiles/getCheckers - Get all checker users
 * - PATCH /api/user-profiles/editPresent - Update attendance for users
 * 
 * EXPORTED FUNCTIONS:
 * - getCheckers: Fetches all users with checker role
 * - editAttendance: Updates present/absent status for list of user IDs
 * 
 * USED BY: Manager components for user management and attendance tracking
 */

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
