import type { FormProps } from "antd";
import { Button, Card, Flex, Form, Input, Typography } from "antd";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import logo from '../assets/logo.png'
import kyc from '../assets/kyc-bg.jpg'


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
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${kyc})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Card
        style={{
          width: 380,
          padding: "30px 20px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <img
          src={logo}
          alt="logo"
          style={{ width: 90, marginBottom: 10 }}
        />

        {/* Title */}
        <Title level={4} style={{ marginBottom: 20, color: "#006666" }}>
          KYC Management System
        </Title>

        {/* Form */}
        <Form
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Username*"
            name="username"
            rules={[
              { required: true, message: "Please input your username!" },
            ]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            label="Password*"
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                backgroundColor: "#008080",
                borderColor: "#008080",
                borderRadius: "6px",
              }}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  );
};

export default LoginForm;
