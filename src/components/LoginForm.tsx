import type { FormProps } from "antd";
import { Button, Card, Flex, Form, Input } from "antd";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Typography } from "antd";

const LoginForm = () => {
  const USER = useContext(AuthContext);
  const { Title } = Typography;
  const [loading, setLoading] = useState(false);
  const onFinish: FormProps["onFinish"] = async (values) => {
    try {
      setLoading(true);
      await USER?.login({
        username: values.username.toString(),
        password: values.password.toString(),
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed: FormProps["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Flex
      justify="center"
      align="center"
      style={{ width: "100vw", height: "100vh" }}
    >
      <Card>
        <Flex vertical align="center" gap={10}>
          <Title level={3}>Welcome</Title>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item label={null}>
              <Button type="primary" htmlType="submit" loading={loading}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Flex>
      </Card>
    </Flex>
  );
};

export default LoginForm;
