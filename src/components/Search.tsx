import {
  Button,
  Card,
  Flex,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Space,
  Spin,
  Typography,
} from "antd";
import { useContext, useState } from "react";
import axios from "axios";
import AddImageForm from "./MakeForm/AddImageForm";
import { allTableDataType, egami } from "./MakeForm/AllMakeFormTable";
import { createImage, createMakeForm } from "../services/MakeForm";
import { AuthContext } from "../context/AuthContext";
import { api } from "../services/axios";

export interface makeFormInteface {
  fullName: string;
  branchName: string;
  branchId: string;
  phoneNumber: string;
  accountNumber: string;
  accountType: string;
  cif: string;
}
const Search = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [modal, setModal] = useState(false);
  const defaultMakeForm = {
    fullName: "",
    branchName: "No branch",
    branchId: "No Id",
    phoneNumber: "09393020",
    accountNumber: "1000000332",
    accountType: "string",
    cif: "string",
  };
  const defaultErrorMakeForm = {
    fullName: null,
    branchName: null,
    branchId: null,
    phoneNumber: null,
    accountNumber: null,
    accountType: null,
    cif: null,
  };
  const [makeForm, setMakeForm] = useState<makeFormInteface>(defaultMakeForm);
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const { Title } = Typography;
  const [MakeId, setMakeId] = useState(0);
  const [flag, setFlag] = useState(false);
  const [form] = Form.useForm<{ AccountNumber: number }>();
  const USER = useContext(AuthContext);
  const onImageSubmit = async ({
    makeId,
    images,
  }: {
    makeId: number;
    images: egami[];
  }) => {
    if (makeForm == defaultMakeForm || !USER?.user?.userId) {
      return;
    }
    try {
      const make = await createMakeForm(makeForm, USER?.user?.userId);
      if (make.status === 200) {
        setMakeId(make.data.id);
        await createImage(make.data.id, images);
        form.setFieldValue("AccountNumber", "");
        setState("idle");
        messageApi.open({
          type: "success",
          content: "MakeForm Request Successful",
        });
      }
    } catch (e) {
      console.log(e);
      messageApi.open({
        type: "error",
        content: "Something went wrong",
      });
    }
  };

  async function onFinish() {
    setState("loading");
    const makeFormResponse = await axios.get(
      `https://5884aa1d5b0b.ngrok-free.app/api/customerDetail/${
        form.getFieldsValue().AccountNumber
      }`
    );
    if (
      makeFormResponse.data.fullName !== defaultErrorMakeForm.fullName &&
      makeFormResponse.data.fullName !== defaultMakeForm.fullName
    ) {
      setMakeForm(makeFormResponse.data);
      try {
        await api.get<allTableDataType>("/makeForm/accountCheck", {
          params: {
            accountNumber: form.getFieldValue("AccountNumber"),
          },
        });
        setFlag(false);
      } catch (e) {
        console.log(e);
        setFlag(true);
      }
      setState("success");
      messageApi.open({
        type: "success",
        content: "Successfully fetched account",
      });
    } else {
      setState("error");
      messageApi.open({
        type: "error",
        content: "Error fetching account",
      });
    }
  }

  return (
    <>
      {contextHolder}
      <Card style={{ marginBottom: "15px" }}>
        <Flex gap={"middle"} vertical>
          <Title level={2}>Search Account</Title>
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
      {state === "loading" && <Spin />}
      {state === "error" && <Title level={3}></Title>}
      {state === "success" && (
        <>
          <Card>
            <Flex justify="space-between" style={{ width: "100%" }}>
              <Flex vertical gap={2} style={{ width: "40%" }}>
                <p>Full Name</p>
                <Input
                  value={makeForm.fullName}
                  disabled
                  style={{ width: "100%" }}
                />
              </Flex>
              <Flex vertical gap={2} style={{ width: "40%" }}>
                <p>Branch Name</p>
                <Input
                  value={makeForm.branchName}
                  disabled
                  style={{ width: "100%" }}
                />
              </Flex>
            </Flex>
            <Flex justify="space-between">
              <Flex vertical gap={2} style={{ width: "40%" }}>
                <p>Branch Id</p>
                <Input
                  value={makeForm.branchId}
                  disabled
                  style={{ width: "100%" }}
                />
              </Flex>
              <Flex vertical gap={2} style={{ width: "40%" }}>
                <p>Phone Number</p>
                <Input
                  value={makeForm.phoneNumber}
                  disabled
                  style={{ width: "100%" }}
                />
              </Flex>
            </Flex>
            <Flex justify="space-between">
              <Flex vertical gap={2} style={{ width: "40%" }}>
                <p>Account Number</p>
                <Input
                  value={makeForm.accountNumber}
                  disabled
                  style={{ width: "100%" }}
                />
              </Flex>
              <Flex vertical gap={2} style={{ width: "40%" }}>
                <p>Account Type</p>
                <Input
                  value={makeForm.accountType}
                  disabled
                  style={{ width: "100%" }}
                />
              </Flex>
            </Flex>
            <Flex vertical gap={2}>
              <p>Cif</p>
              <Input value={makeForm.cif} disabled />
            </Flex>
            {flag && (
              <Flex style={{ width: "100%", padding: "15px" }} justify="center">
                <Button onClick={() => setModal(true)}>
                  Create a Make Request
                </Button>
              </Flex>
            )}
          </Card>
          <Modal
            open={modal}
            onCancel={() => setModal(false)}
            okButtonProps={{ style: { display: "none" } }}
            cancelButtonProps={{ style: { display: "none" } }}
            title="Add Images"
            width={1000}
          >
            <AddImageForm
              setEditModal={() => setModal(false)}
              makeId={MakeId}
              onFinish={({ makeId, images }) =>
                onImageSubmit({ makeId, images })
              }
            />
          </Modal>
        </>
      )}
      {state === "idle" && <></>}
    </>
  );
};

export default Search;
