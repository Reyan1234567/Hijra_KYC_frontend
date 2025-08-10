import { Badge, Card, Flex, Avatar, Typography } from "antd";
import { userInfo } from "../../types/MessageTypes";
import { UserOutlined } from "@ant-design/icons";

const Message = (userInfo: userInfo) => {
  const avatar = () => {
    return userInfo.profilePhoto ? (
      <Avatar shape={"square"} size={48} src={userInfo.profilePhoto} />
    ) : (
      <Avatar shape={"square"} size={48} icon={<UserOutlined />} />
    );
  };
  return (
    <Card
      variant="borderless"
      style={{ width: 400, marginBottom: "5px" }}
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
        {userInfo.unreadCount > 0 && (
          <Badge count={userInfo.unreadCount}></Badge>
        )}
      </Flex>
    </Card>
  );
};

export default Message;
