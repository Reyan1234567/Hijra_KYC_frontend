import { Flex } from "antd";
import DashboardCard from "./DashboardCard";
import DateDropDown from "./DateDropDown";
import { useState } from "react";

const Dashboard = () => {
  const [date, setDate] = useState(new Date());
  return (
    <Flex vertical gap={10}>
      <DateDropDown date={date} setDate={setDate} />
      <Flex wrap gap={10} justify="center" align="center">
        <DashboardCard
          title={`Amount of request made the past days`}
          amount={10}
        />
        <DashboardCard
          title={`Amount of request checked the past days`}
          amount={10}
        />
        <DashboardCard
          title={`Amount of request unassigned the past days`}
          amount={10}
        />
        <DashboardCard
          title={`Amount of request assigned the past days`}
          amount={10}
        />
        <DashboardCard
          title={`Amount of request left on read the past days`}
          amount={10}
        />
      </Flex>
    </Flex>
  );
};

export default Dashboard;
