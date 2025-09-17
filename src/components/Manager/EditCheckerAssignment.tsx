import { Button, Popconfirm, Spin, Table, Typography } from "antd";
import {
  deleteAllCheckerAssignments,
  getAllCheckers,
} from "../../services/MakeForm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useMessage from "antd/es/message/useMessage";
import { useState } from "react";
import { QuestionCircleOutlined } from "@ant-design/icons";

export interface checkers {
  checkerName: string;
  id: number;
  noOfUndoneToday: number;
}

const EditCheckerAssignment = () => {
  const [loading, setLoading] = useState(false);
  const [checkerClicked, setCheckerClicked] = useState(0);
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = useMessage();
  const { Title } = Typography;
  const { data, isLoading, isError, isSuccess, error } = useQuery({
    queryKey: ["allCheckers"],
    queryFn: () => getAllCheckers(),
  });

  const deleteCheckerAssignments = useMutation({
    mutationFn: (id: number) => {
      setLoading(true);
      setCheckerClicked(id);
      return deleteAllCheckerAssignments(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allCheckers"] });
      messageApi.open({
        type: "success",
        content: "Action successful",
      });
      setLoading(false);
      setCheckerClicked(0);
    },
    onError: () => {
      messageApi.open({
        type: "error",
        content: "Action unsuccessful",
      });
      setLoading(false);
      setCheckerClicked(0);
    },
  });

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 24,
    width: "100%",
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: 900,
  };

  const columns = [
    {
      title: (
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <Title level={4}>Checker's Name</Title>
        </div>
      ),
      dataIndex: "checkerName",
      key: "name",
      render: (checkerName: string) => {
        return (
          <Title level={5} style={{ margin: 0 }}>
            {checkerName}
          </Title>
        );
      },
    },
    {
      title: (
        <Title level={4} style={{ textAlign: "center" }}>
          Amount Left
        </Title>
      ),
      dataIndex: "noOfUndoneToday",
      key: "count",
      render: (count: number) => (
        <div style={{ textAlign: "center" }}>{count}</div>
      ),
    },
    {
      title: (
        <Title level={4} style={{ textAlign: "center" }}>
          Action
        </Title>
      ),
      dataIndex: "noOfUndoneToday",
      key: "action",
      render: (count: number, row: checkers) => {
        if (count === 0) {
          return (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button disabled>Delete Assignments</Button>
            </div>
          );
        } else {
          return (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Popconfirm
                title="Delete the task"
                description="Are you sure to delete this task?"
                icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                onConfirm={() => {
                  deleteCheckerAssignments.mutate(row.id);
                }}
              >
                <Button
                  danger
                  loading={checkerClicked === row.id && loading === true}
                >
                  Delete Assignments
                </Button>
              </Popconfirm>
            </div>
          );
        }
      },
    },
  ];

  if (isLoading) {
    return (
      <Spin
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
        size="large"
      />
    );
  }
  if (isSuccess && !data) {
    return (
      <div style={containerStyle}>
        <Title level={2} style={{ textAlign: "center" }}>
          Edit checkers Assignment
        </Title>
        <Table dataSource={[]} columns={columns} bordered style={tableStyle} />
      </div>
    );
  }
  if (isError) {
    return (
      <Title level={3} style={{ color: "red", textAlign: "center" }}>
        {error.message}
      </Title>
    );
  }
  if (isSuccess) {
    return (
      <>
        {contextHolder}
        <div style={containerStyle}>
          <Title level={2} style={{ textAlign: "center" }}>
            Edit checkers Assignment
          </Title>
          <Table
            dataSource={data.data}
            columns={columns}
            bordered
            style={tableStyle}
          />
        </div>
      </>
    );
  }

  return null;
};

export default EditCheckerAssignment;
