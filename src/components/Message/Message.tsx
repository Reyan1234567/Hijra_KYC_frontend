/**
 * MESSAGE COMPONENT
 * 
 * TYPE: Helper Component (All Roles)
 * PURPOSE: User card display for messaging interface with status indicators and unread counts
 * 
 * FUNCTIONALITY:
 * - User card with avatar, name, role, and branch information
 * - Profile photo display with fallback to default icon
 * - Online status indicator with green dot badge
 * - Unread message count badge
 * - Responsive card layout with consistent styling
 * - Avatar shape and size standardization
 * 
 * USER INTERACTIONS:
 * - Visual user identification in message lists
 * - Status awareness through online/offline indicators
 * - Unread message awareness through count badges
 * - Click target for user selection (handled by parent)
 * 
 * STATE MANAGEMENT:
 * - Stateless component - receives all data via props
 * - Uses userInfo interface for type safety
 * - Conditional rendering based on status and unread count
 * - Console logging for debugging (should be removed in production)
 * 
 * VISUAL ELEMENTS:
 * - 350px width card with borderless variant
 * - 48px square avatar with profile photo or default icon
 * - Green dot badge for online users
 * - Red count badge for unread messages
 * - Typography hierarchy: name (18px bold), role (12px), branch (12px)
 * 
 * DATA HANDLING:
 * - Profile photo URL construction with BASE_URL
 * - Fallback avatar with UserOutlined icon
 * - Status boolean determines online indicator visibility
 * - Unread count conditional display (only when > 0)
 * 
 * USAGE:
 * - Used in MessagesPage for user list display
 * - Part of real-time messaging system
 * - Provides user selection interface for chat initiation
 * 
 * ROLE-BASED ACCESS:
 * - Visible to all roles for inter-user communication
 * - Shows role and branch information for context
 * - Supports organizational messaging hierarchy
 */

import { Badge, Card, Flex, Avatar, Typography } from "antd";
import { userInfo } from "../../types/MessageTypes";
import { UserOutlined } from "@ant-design/icons";
import { BASE_URL } from "../../services/Constants";

const Message = (userInfo: userInfo) => {
  const avatar = () => {
    return userInfo.profilePhoto ? (
      <Avatar shape={"square"} size={48} src={BASE_URL+"/"+userInfo.profilePhoto} />
    ) : (
      <Avatar shape={"square"} size={48} icon={<UserOutlined />} />
    );
  };

  console.log(userInfo.unreadCount);
  return (
    <Card
      variant="borderless"
      style={{ width: 350, marginBottom: "5px" }}
      styles={{ body: { padding: "15px" } }}
    >
      <Flex justify="space-between" align="center">
        <Flex gap={30} align="center">
          {userInfo.status ? (
            <Badge dot status="success">
              {avatar()}
            </Badge>
          ) : (
            avatar()
          )}
          <Flex vertical align="start">
            <Typography.Text strong style={{ fontSize: "18px" }}>
              {userInfo.fullName}
            </Typography.Text>
            <Typography.Text style={{ fontSize: "12px" }}>
              {userInfo.role}
            </Typography.Text>
            <Typography.Text style={{ fontSize: "12px" }}>
              {userInfo.branchName}
            </Typography.Text>
          </Flex>
        </Flex>
        {userInfo.unreadCount > 0 && <Badge count={userInfo.unreadCount} />}
      </Flex>
    </Card>
  );
};

export default Message;
