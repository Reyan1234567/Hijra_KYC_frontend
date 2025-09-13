/**
 * DISTRIBUTE COMPONENT
 * 
 * TYPE: Helper Component (Manager Role)
 * PURPOSE: Manual KYC form distribution system for load balancing across checkers
 * 
 * FUNCTIONALITY:
 * - Single-action distribution button for redistributing pending KYC forms
 * - Manual API call to /makeForm/distribute endpoint
 * - Success/error message feedback to user
 * - Simple card-based UI with title and action button
 * - Error handling with response data display
 * 
 * API INTERACTIONS:
 * - GET /makeForm/distribute: Triggers redistribution of pending forms
 * - No request payload required - server handles distribution logic
 * - Returns success/error status for user feedback
 * 
 * USER INTERACTIONS:
 * - Single "Distribute" button click to trigger redistribution
 * - Success message: "Distributed successfully"
 * - Error message: Server response or "Something went wrong"
 * - No confirmation dialog - immediate action
 * 
 * STATE MANAGEMENT:
 * - No internal state - purely action-based component
 * - Uses Ant Design message API for notifications
 * - Error state handled via try-catch with console logging
 * 
 * ROLE-BASED ACCESS:
 * - Typically used by Manager role for workload management
 * - Helps balance checker assignments when needed
 * - Manual override for automatic distribution systems
 * 
 * USAGE: Standalone page component for administrative distribution control
 */

import { Button, Card, Flex, message, Typography } from "antd";
import { api } from "../../services/axios";

const Distribute = () => {
  const { Title } = Typography;
  const [messageApi, contextHolder] = message.useMessage();
  return (
    <Card>
      <Flex vertical gap={"middle"}>
        {contextHolder}
        <Title level={2}>Disribute</Title>
        <Button
          onClick={async () => {
            try {
              await api.get("/makeForm/distribute");
              messageApi.open({
                type: "success",
                content: "Distibuted successfully",
              });
            } catch (e) {
              console.log(e);
              messageApi.open({
                type: "error",
                content: e?.response?.data??"Something went wrong",
              });
            }
          }}
        >
          Distibute
        </Button>
      </Flex>
    </Card>
  );
};

export default Distribute;
