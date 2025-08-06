import { Button, Card, Flex, Spin, Tag, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getCheckers } from "../../services/KycManager";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import ChangeAttendance from "./ChangeAttendance";
import { useState } from "react";
const Attendance = () => {
  const { Title } = Typography;
  const [open, setOpen] = useState(false);
  const { data, isSuccess, isLoading, isError, error } = useQuery({
    queryKey: ["Attendance"],
    queryFn: () => getCheckers(),
  });

  if (isLoading) {
    console.log("loading");

    return (
      <Spin
        style={{ position: "absolute", left: "50%", top: "50%" }}
        size="large"
      />
    );
  }

  if (isError || data?.data === undefined) {
    console.log("error");
    return (
      <>
        <Title level={2}>Attendance</Title>
        <p style={{ position: "absolute", left: "50%", top: "50%" }}>
          Something went wrong{error ? error.message : ""}
        </p>
      </>
    );
  }

  if (isSuccess && data.data.length == 0) {
    console.log("empty");
    return <>Shiii nothing to show</>;
  }
  if (isSuccess) {
    const list = data.data;
    return (
      <>
        <Flex vertical align="center" gap={20}>
          <Title level={2}>Attendance</Title>
          <Flex wrap justify="space-around" gap={20}>
            {list.map((checker) => (
              <Card style={{ backgroundColor: "#eeeeeeff" }}>
                <Flex align="center" style={{ width: "500px" }}>
                  {checker.presentStatus === 0 ? (
                    <Tag color="red" style={{ height: "25px" }}>
                      <CloseOutlined />
                    </Tag>
                  ) : (
                    <Tag color="green" style={{ height: "25px" }}>
                      <CheckOutlined />
                    </Tag>
                  )}
                  <p>{checker.name}</p>
                  {/* <Title level={4}>{checker.name}</Title> */}
                </Flex>
              </Card>
            ))}
          </Flex>
          <Button onClick={()=>setOpen(true)}>Change Attendance</Button>
        </Flex>
        <ChangeAttendance open={open} setOpen={setOpen} users={list} />
      </>
    );
  }
};

export default Attendance;
