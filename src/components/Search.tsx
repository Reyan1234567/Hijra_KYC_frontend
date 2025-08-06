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
import { useState } from "react";
import axios from "axios";
import AddImageForm from "./MakeForm/AddImageForm";
import { egami } from "./MakeForm/MakeFormTable";
import { createImage, createMakeForm } from "../services/MakeForm";

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
    fullName: "No one",
    branchName: "No branch",
    branchId: "No Id",
    phoneNumber: "09393020",
    accountNumber: "1000000332",
    accountType: "string",
    cif: "string",
  };
  const [makeForm, setMakeForm] = useState<makeFormInteface>(defaultMakeForm);
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const { Title } = Typography;
  const [form] = Form.useForm<{ AccountNumber: number }>();

  const onImageSubmit = async ({
    makeId,
    images,
  }: {
    makeId: number;
    images: egami[];
  }) => {
    if (makeForm == defaultMakeForm) {
      return;
    }
    try {
      const make = await createMakeForm(makeForm);
      await createImage(make.data, images);
    } catch (e) {
      console.log(e);
      messageApi.open({
        type: "error",
        content: "Some error happened",
      });
    }
  };
  async function onFinish() {
    try {
      const makeFormResponse = await axios.get(
        `https://dd3ef816daf3.ngrok-free.app/api/customerDetail/${
          form.getFieldsValue().AccountNumber
        }`
        // {
        // headers: {
        //   "ngrok-skip-browser-warning": "69420",
        //   "User-Agent":
        //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        // },
        // }
      );
      setMakeForm(makeFormResponse.data);
      setState("success");
    } catch (e) {
      setState("error");
      console.log(e);
      messageApi.open({
        type: "error",
        content: e instanceof Error ? e.message : String(e),
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
            <Flex style={{ width: "100%", padding: "15px" }} justify="center">
              <Button>Create a Make Request</Button>
            </Flex>
          </Card>
          <Modal
            open={modal}
            onCancel={() => setModal(false)}
            okButtonProps={{ style: { display: "none" } }}
            cancelButtonProps={{ style: { display: "none" } }}
            title="Add Images"
          >
            <AddImageForm
              setEditModal={() => setModal(false)}
              makeId={0}
              onFinish={({ makeId, images }) =>
                onImageSubmit({ makeId, images })
              }
            />
          </Modal>
        </>
      )}
    </>
  );
};

export default Search;
