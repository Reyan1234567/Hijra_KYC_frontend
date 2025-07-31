import { Flex } from "antd";
import DashboardCard from "./DashboardCard";
import DateDropDown from "./DateDropDown";
import { useState } from "react";

const Dashboard = () => {
  const [date, setDate] = useState(new Date());
  console.log(date)
  return (
    <Flex vertical gap={10}>
      <Flex justify="space-around" align="center">
        <h1>Dashboard</h1>
        <DateDropDown date={date} setDate={setDate} />
      </Flex>

      <Flex wrap gap={20} justify="center" align="center">
        <DashboardCard title={`Make Requests`} amount={10} />
        <DashboardCard title={`Request checked`} amount={10} />
        <DashboardCard title={`Request unassigned`} amount={10} />
        <DashboardCard title={`Request assigned`} amount={10} />
      </Flex>
    </Flex>
  );
};

export default Dashboard;
