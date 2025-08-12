import { Flex, Spin } from "antd";
import DashboardCard from "./DashboardCard";
import DateDropDown from "../Helper/DateDropdown/DateDropDown";
import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "../../services/Dashboard";
import { AuthContext } from "../../context/AuthContext";

const Dashboard = () => {
  const [date, setDate] = useState(new Date());
  const role = "maker";
  const USER=useContext(AuthContext);
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
    return (
      <p style={{ position: "absolute", left: "50%", top: "50%" }}>
        Something went wrong{error ? error.message : ""}
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
            <DashboardCard title={`Saved Requests`} amount={data?.data.saved} />
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
    } else if (role === "checker") {
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
    } else if (role === "manager") {
      return (
        <Flex vertical gap={10}>
          <Flex justify="space-around" align="center">
            <h1>Dashboard</h1>
            <DateDropDown date={date} setDate={setDate} />
          </Flex>

          <Flex wrap gap={20} justify="center" align="center">
            <DashboardCard title={`Accepted Requests`} amount={10} />
            <DashboardCard title={`Rejected Requests`} amount={10} />
            <DashboardCard title={`Pending Requests`} amount={10} />
            <DashboardCard title={`Total Requests`} amount={10} />
          </Flex>
        </Flex>
      );
    } else {
      return;
    }
  }
};

export default Dashboard;
