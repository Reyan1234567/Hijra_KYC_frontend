/**
 * DASHBOARD CARD COMPONENT
 * 
 * PURPOSE:
 * Reusable card component for displaying dashboard statistics and metrics.
 * Provides consistent visual presentation of numerical data with titles
 * in a centered, vertical layout format.
 * 
 * FUNCTIONALITY:
 * - Displays title and numerical amount in vertical alignment
 * - Consistent card styling with light gray background
 * - Centered content layout with gap spacing
 * - Typography hierarchy with different heading levels
 * - Fixed minimum width for uniform dashboard appearance
 * 
 * PROPS:
 * - title: string - The label/description for the metric
 * - amount: number - The numerical value to display
 * 
 * USER INTERACTIONS:
 * - Static display component with no interactive elements
 * - Visual presentation only
 * 
 * STYLING:
 * - Light gray background (#eeeeeeff)
 * - Minimum width of 500px for consistency
 * - Vertical flex layout with center alignment
 * - 10px gap between title and amount
 * - Typography levels: h4 for title, h3 for amount
 * 
 * USAGE: Dashboard statistics display for KYC metrics, counts, and performance indicators
 */

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
