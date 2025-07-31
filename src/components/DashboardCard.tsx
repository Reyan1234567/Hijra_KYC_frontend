import { Card, Typography } from "antd";

interface dashboardCard {
  title: string;
  amount: number;
}
const DashboardCard = (card: dashboardCard) => {
  const { Title } = Typography;

  return (
    <Card>
      <Title level={4}>{card.title}</Title>
      <Title level={3}>{card.amount}</Title>
    </Card>
  );
};

export default DashboardCard;
