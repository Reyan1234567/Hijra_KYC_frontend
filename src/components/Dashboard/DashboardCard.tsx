import { Card, Flex, Typography } from "antd";

interface dashboardCard {
  title: string;
  amount: number;
}
const DashboardCard = (card: dashboardCard) => {
  const { Title } = Typography;

  return (
    <Card style={{minWidth:"500px", backgroundColor:"#eeeeeeff"}}>
      <Flex vertical gap={10} align="center" wrap>
        <Title level={4}>{card.title}</Title>
        <Title level={3}>{card.amount}</Title>
      </Flex>
    </Card>
  );
};

export default DashboardCard;
