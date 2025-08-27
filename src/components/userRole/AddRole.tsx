import React, { useState } from "react";
import { Form, Input, Button, Typography, Alert, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/axios"; // centralized axios instance

const { Title } = Typography;

interface AddRoleFormValues {
  roleName: string;
}

const AddRole: React.FC = () => {
  const [form] = Form.useForm<AddRoleFormValues>();
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const onFinish = async (values: AddRoleFormValues) => {
    setLoading(true);
    const payload = {
      roleName: values.roleName,
      recordStatus: 1, // default Active
    };

    try {
      await api.post("/api/roles", payload);
      setSuccess(true);
      message.success("Role added successfully!");
      form.resetFields();
      setTimeout(() => setSuccess(false), 4000);
    } catch (error: any) {
      console.error("Failed to add role:", error);
      message.error(error?.response?.data?.message || "Failed to add role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "40px auto",
        background: "#fff",
        padding: 24,
        borderRadius: 8,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <Button
        type="primary"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/View_Role")}
        style={{ marginBottom: 24 }}
      >
        View Roles
      </Button>

      <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
        Add New User Role In KYC Management System
      </Title>

      {success && (
        <Alert
          message="Role Saved Successfully"
          type="success"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      <Form<AddRoleFormValues> form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Role Name"
          name="roleName"
          rules={[{ required: true, message: "Please input the role name" }]}
        >
          <Input placeholder="Enter role name" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Save Role
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddRole;
