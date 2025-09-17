import {
  Button,
  Card,
  Flex,
  Form,
  InputNumber,
  MenuProps,
  Space,
  Spin,
  Table,
  TableColumnsType,
  Typography,
} from "antd";
import useMessage from "antd/es/message/useMessage";
import { api } from "../../services/axios";
import { useState } from "react";
import { allTableDataType } from "../MakeForm/AllMakeFormTable";
import DropDown from "../Helper/DateDropdown/DropDown";
import { defaultAllTableDataType } from "../../services/MakeForm";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import ViewModal from "../Helper/RequestModals/ViewModal";
import CheckerEditModal from "./CheckerEditModal";
import { columns } from "../Helper/Table/RequestTables";

const SearchAccount = () => {
  const { Title } = Typography;
  const [form] = Form.useForm<{ AccountNumber: number }>();
  const [modal, setModal] = useState<allTableDataType>(defaultAllTableDataType);
  const [messageApi, contextHolder] = useMessage();
  const [editModal, setEditModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [result, setResult] = useState<allTableDataType>(
    defaultAllTableDataType
  );
  const [state, setState] = useState<
    "empty" | "idle" | "success" | "error" | "loading"
  >("idle");

  const SearchAccountColumns: TableColumnsType<allTableDataType> = [
    {
      title: "Actions",
      dataIndex: "status",
      render: (status: number, row: allTableDataType) => {
        if (status == 2 || status == 3) {
          return (
            <Flex justify="center" align="center">
              <DropDown menu={view} onChange={() => setModal(row)} />
            </Flex>
          );
        } else if (status == 1) {
          return (
            <Flex justify="center" align="center">
              <DropDown menu={edit} onChange={() => setModal(row)} />
            </Flex>
          );
        }
      },
    },
  ];

  const edit: MenuProps["items"] = [
    {
      label: "view",
      key: "1",
      icon: <EyeOutlined />,
      onClick: () => {
        setViewModal(true);
      },
    },
    {
      label: "Edit",
      key: "2",
      icon: <EditOutlined />,
      onClick: () => {
        setEditModal(true);
      },
    },
  ];

  const view: MenuProps["items"] = [
    {
      label: "view",
      key: "1",
      icon: <EyeOutlined />,
      onClick: () => {
        setViewModal(true);
      },
    },
  ];

  async function onFinish() {
    setState("loading");
    try {
      const res = await api.get("/makeForm/getFormRequest", {
        params: { account: form.getFieldValue("AccountNumber") },
      });
      setState("success");
      setResult(res.data);
      messageApi.open({
        type: "success",
        content: "Successfully fetched account",
      });
    } catch (e: unknown) {
      setState("error");
      messageApi.open({
        type: "error",
        content: e?.response?.message ?? "Something went wrong!",
      });
    }
  }
  return (
    <>
      {contextHolder}
      <Card style={{ marginBottom: "15px" }}>
        <Flex gap={"middle"} vertical>
          <Title level={2}>
            Search Account (Checker related)
          </Title>
          <Form
            name="account"
            form={form}
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              name="AccountNumber"
              label=" Account Number"
              rules={[
                { required: true, message: "Account number required" },
                {
                  type: "integer",
                  min: 9999999999,
                  message: "Enter a real Account number",
                },
              ]}
              layout="vertical"
            >
              <InputNumber style={{ minWidth: "100%" }} />
            </Form.Item>
            <Form.Item name="send">
              <Space>
                <Button
                  onClick={() => {
                    console.log(form.getFieldsValue());
                  }}
                  type="primary"
                  htmlType="submit"
                >
                  Send
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Flex>
      </Card>
      {state == "loading" && (
        <Spin
          style={{ position: "absolute", left: "50%", top: "50%" }}
          size="large"
        />
      )}
      {state == "error" && (
        <>
          <Title level={3} style={{ color: "red", textAlign: "center" }}>
            Something went wrong
          </Title>
        </>
      )}
      {state == "success" && (
        <>
        <Table dataSource={[result]} columns={[...columns, ...SearchAccountColumns]}/>
          <CheckerEditModal
            modal={modal}
            open={editModal}
            onCancel={() => setEditModal(false)}
            triggerRender={() => setState("idle")}
            messageApi={messageApi}
          />
          <ViewModal
            modal={modal}
            isModalOpen={viewModal}
            handleCancel={() => setViewModal(false)}
          />
        </>
      )}
    </>
  );
};

export default SearchAccount;
