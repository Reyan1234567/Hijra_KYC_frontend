/*
 * HIJRA KYC FRONTEND - DASHBOARD PAGE
 * 
 * FILE TYPE: Page Component (Standalone)
 * PURPOSE: Main dashboard displaying KYC form statistics and metrics
 * 
 * FUNCTIONALITY:
 * - Displays role-specific dashboard metrics
 * - Shows different statistics based on user role (maker, HO_Checker, HO_Manager, District)
 * - Provides date filtering for statistics
 * - Real-time data fetching with React Query
 * 
 * DATA FETCHING:
 * - API: GET /makeForm/dashboard/{id} (via getDashboard service)
 * - Uses React Query for caching and state management
 * - Fetches data based on user ID and selected date
 * - Auto-refetches when date changes
 * 
 * ROLE-BASED DISPLAY:
 * - MAKER: Shows drafts, accepted, rejected, pending, total
 * - HO_CHECKER: Shows accepted, rejected, pending, total
 * - HO_MANAGER: Shows accepted, rejected, pending, total
 * - DISTRICT: Shows accepted, rejected, pending, total
 * 
 * USER INTERACTIONS:
 * - Date selection via DateDropDown component
 * - Statistics cards display counts for each status
 * 
 * COMPONENTS USED:
 * - DashboardCard: Displays individual metrics
 * - DateDropDown: Date selection control
 * 
 * LIFECYCLE:
 * 1. Component mounts with current date (set to 1st of month)
 * 2. useQuery fetches dashboard data for user and date
 * 3. Loading/error states handled
 * 4. Role-specific dashboard rendered
 * 5. Date changes trigger new data fetch
 * 
 * USED BY: Routes.tsx as main dashboard page ("/", "/dashboard")
 */

import { Flex, Spin } from "antd";
import DashboardCard from "./DashboardCard";
import DateDropDown from "../Helper/DateDropdown/DateDropDown";
import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "../../services/Dashboard";
import { AuthContext } from "../../context/AuthContext";

const Dashboard = () => {
  const [date, setDate] = useState(new Date());
  date.setDate(1)
    date.setHours(0,0,0,0)
  const USER = useContext(AuthContext);
  const role = USER?.user?.role ?? "maker";
  console.log(date);

  const { data, isLoading, isError, isSuccess, error } = useQuery({
    queryKey: ["makeDashboard", date],
    queryFn: () => getDashboard(USER?.user?.userId, date),
  });

  if (isLoading) {
    return (
      <Spin
        style={{ position: "absolute", left: "50%", top: "50%" }}
        size="large"
      />
    );
  }

  if (isError || data?.data === undefined) {
    console.log(error);
    return (
      <p style={{ position: "absolute", left: "50%", top: "50%" }}>
        {error ? error.response.data : "Something went wrong"}
      </p>
    );
  }

  if (isSuccess) {
    if (role === "maker") {
      return (
        <Flex vertical gap={10}>
          <Flex justify="space-around" align="center">
            <h1>Dashboard</h1>
            <DateDropDown date={date} setDate={setDate} />
          </Flex>

          <Flex wrap gap={20} justify="center" align="center">
            {/* <DashboardCard title={`Saved Requests`} amount={data?.data.saved} /> */}
            <DashboardCard
              title={`Drafted Requests`}
              amount={data?.data.drafts}
            />
            <DashboardCard
              title={`Accepted Requests`}
              amount={data?.data.accepted}
            />
            <DashboardCard
              title={`Rejected Requests`}
              amount={data?.data.rejected}
            />
            <DashboardCard
              title={`Pending Requests`}
              amount={data?.data.pending}
            />
            <DashboardCard title={`Total Requests`} amount={data?.data.total} />
          </Flex>
        </Flex>
      );
    } else if (role === "HO_Checker") {
      return (
        <Flex vertical gap={10}>
          <Flex justify="space-around" align="center">
            <h1>Dashboard</h1>
            <DateDropDown date={date} setDate={setDate} />
          </Flex>

          <Flex wrap gap={20} justify="center" align="center">
            <DashboardCard
              title={`Accepted Requests`}
              amount={data?.data.accepted}
            />
            <DashboardCard
              title={`Rejected Requests`}
              amount={data?.data.rejected}
            />
            <DashboardCard
              title={`Pending Requests`}
              amount={data?.data.pending}
            />
            <DashboardCard title={`Total Requests`} amount={data?.data.total} />
          </Flex>
        </Flex>
      );
    } else if (role === "HO_Manager") {
      return (
        <Flex vertical gap={10}>
          <Flex justify="space-around" align="center">
            <h1>Dashboard</h1>
            <DateDropDown date={date} setDate={setDate} />
          </Flex>

          <Flex wrap gap={20} justify="center" align="center">
            <DashboardCard title={`Accepted Requests`} amount={data.data.accepted} />
            <DashboardCard title={`Rejected Requests`} amount={data.data.rejected} />
            <DashboardCard title={`Pending Requests`} amount={data.data.pending} />
            <DashboardCard title={`Total Requests`} amount={data.data.total} />
          </Flex>
        </Flex>
      );
    }else if (role === "District") {
      return (
         <Flex vertical gap={10}>
          <Flex justify="space-around" align="center">
            <h1>Dashboard</h1>
            <DateDropDown date={date} setDate={setDate} />
          </Flex>

          <Flex wrap gap={20} justify="center" align="center">
            <DashboardCard
              title={`Accepted Requests`}
              amount={data?.data.accepted}
            />
            <DashboardCard
              title={`Rejected Requests`}
              amount={data?.data.rejected}
            />
            <DashboardCard
              title={`Pending Requests`}
              amount={data?.data.pending}
            />
            <DashboardCard title={`Total Requests`} amount={data?.data.total} />
          </Flex>
        </Flex>
      )
        return;
    }
  }
};

export default Dashboard;
