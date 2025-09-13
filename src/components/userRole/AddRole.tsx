/**
 * ADD ROLE COMPONENT
 * 
 * PURPOSE:
 * Administrative interface for creating new user roles in the KYC management system.
 * Provides form-based role creation with validation, success feedback, and navigation
 * back to the roles listing page.
 * 
 * FUNCTIONALITY:
 * - Simple form with role name input and validation
 * - Automatic record status setting to active (1)
 * - Form reset after successful submission
 * - Success alert with auto-dismiss functionality
 * - Navigation back to View_Role page
 * - Loading states during API submission
 * - Comprehensive error handling with user feedback
 * 
 * API INTERACTIONS:
 * - POST /api/roles: Creates new role with roleName and recordStatus
 * - Sends payload with roleName and default recordStatus: 1 (Active)
 * - Error handling with detailed error message display
 * - Success confirmation with message notification
 * 
 * USER INTERACTIONS:
 * - Role name input field with required validation
 * - Save button with loading state during submission
 * - Back navigation button to View_Role page
 * - Success alert display with 4-second auto-dismiss
 * - Form reset after successful role creation
 * 
 * STATE MANAGEMENT:
 * - Form state managed by Ant Design Form hooks
 * - Success state for alert display control
 * - Loading state for button and form submission feedback
 * - Navigation state via React Router hooks
 * 
 * VALIDATION:
 * - Required field validation for role name
 * - Form submission prevention until validation passes
 * - User-friendly validation error messages
 * 
 * ROLE-BASED ACCESS:
 * - Typically restricted to Admin roles
 * - Critical for system role management and user assignment
 * - Supports organizational structure definition
 * 
 * USAGE: Administrative role creation page for system role management
 */

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
