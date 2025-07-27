import { Button, Card, Flex, message, Typography } from "antd";
import { api } from "../services/axios";

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
                content: e.message,
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
