/*
 * HIJRA KYC FRONTEND - LOGIN FORM COMPONENT
 * 
 * FILE TYPE: Page Component (Standalone)
 * PURPOSE: User authentication interface - login page
 * 
 * FUNCTIONALITY:
 * - Renders login form with username/password fields
 * - Handles form submission and validation
 * - Integrates with AuthContext for authentication
 * - Displays loading state during login process
 * - Shows branded UI with logo and background image
 * 
 * DATA FETCHING:
 * - No direct API calls (uses AuthContext.login)
 * - AuthContext handles loginFetch service call
 * - Form validation handled by Ant Design Form component
 * 
 * USER INTERACTIONS:
 * - Username/password input with validation
 * - Submit button with loading state
 * - Form validation error messages
 * 
 * LIFECYCLE:
 * 1. User enters credentials
 * 2. Form validates required fields
 * 3. onFinish calls USER.login() from AuthContext
 * 4. Loading state shown during authentication
 * 5. On success: AuthProvider handles redirect
 * 6. On error: Error message shown via AuthProvider
 * 
 * USED BY: App.tsx when user is not authenticated
 */

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
