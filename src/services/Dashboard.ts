/*
 * HIJRA KYC FRONTEND - DASHBOARD SERVICE
 * 
 * FILE TYPE: Service/API Layer
 * PURPOSE: Fetches dashboard statistics and metrics
 * 
 * FUNCTIONALITY:
 * - Retrieves maker dashboard statistics by user ID and date
 * - Provides KYC form status counts for dashboard display
 * 
 * API ENDPOINTS USED:
 * - GET /makeForm/dashboard/{id} - Get dashboard stats for specific maker
 * 
 * DATA RETURNED:
 * - saved: Number of saved forms
 * - drafts: Number of draft forms
 * - accepted: Number of accepted forms
 * - rejected: Number of rejected forms
 * - pending: Number of pending forms
 * - total: Total number of forms
 * 
 * EXPORTED FUNCTIONS:
 * - getDashboard: Fetches dashboard metrics for a specific maker and date
 * 
 * USED BY: Dashboard.tsx component for displaying statistics
 */

import { api } from "./axios"

interface MakerDashboard {
  saved: number;
  drafts: number;
  accepted: number;
  rejected: number;
  pending: number;
  total: number;
}


export const getDashboard=async(id:number, date:Date)=>{
    return await api.get<MakerDashboard>(`/makeForm/dashboard/${id}`, {params:{date:date}})
}
