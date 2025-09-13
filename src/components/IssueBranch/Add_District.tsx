/**
 * ADD DISTRICT COMPONENT
 * 
 * TYPE: Page Component (Admin Role)
 * PURPOSE: Form interface for creating new districts in the system
 * 
 * FUNCTIONALITY:
 * - Simple form for district creation with code and name fields
 * - Form validation for required fields
 * - API integration for district creation
 * - Loading states and error handling
 * - Navigation back to dashboard after successful creation
 * 
 * API INTERACTIONS:
 * - POST /api/districts/post-district: Creates new district
 * - Payload includes: districtCode, districtName
 * - No data fetching required - pure creation form
 * 
 * USER INTERACTIONS:
 * - Form fields: District Code (required), District Name (required)
 * - Save button with loading state during submission
 * - Back button navigation to dashboard
 * - Success message on creation, error messages on failure
 * 
 * STATE MANAGEMENT:
 * - Form state managed by Ant Design Form hooks
 * - Loading state for submit button during API calls
 * - Navigation handled via React Router useNavigate
 * 
 * LIFECYCLE:
 * - No data fetching on mount - pure form component
 * - Form submission triggers district creation API call
 * - Successful creation redirects to dashboard
 * 
 * VALIDATION:
 * - Required fields: districtCode, name
 * - Form validation prevents submission with missing data
 * 
 * ROLE-BASED ACCESS:
 * - Typically restricted to Admin role for district management
 * - Part of administrative geographical management system
 * - Districts are used by branches for organizational hierarchy
 * 
 * USAGE: Standalone page for adding new districts to support branch organization
 */

import React, { useState } from "react";
import { Form, Input, Button, Typography, message, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/axios"; // <-- use your axios instance

const { Title } = Typography;

interface DistrictFormValues {
  districtCode: string;
  name: string;
}

const Add_District: React.FC = () => {
  const [form] = Form.useForm<DistrictFormValues>();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const onFinish = async (values: DistrictFormValues) => {
    setLoading(true);
    try {
      const payload = {
        districtCode: values.districtCode,
        districtName: values.name,
      };

      await api.post("/api/districts/post-district", payload);
      message.success("District added successfully");
      navigate("/dashboard"); // redirect to district list page
    } catch (err: any) {
      console.error(err);
      message.error(err?.response?.data?.message || "Failed to add district");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "40px auto",
        padding: 20,
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <Space style={{ marginBottom: 20 }}>
        <Button onClick={() => navigate("/dashboard")} type="primary">
          &larr; Back
        </Button>
      </Space>

      <Title level={3}>Add New District</Title>

      <Form<DistrictFormValues> form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="District Code"
          name="districtCode"
          rules={[{ required: true, message: "Please enter district code" }]}
        >
          <Input placeholder="Enter District Code" />
        </Form.Item>

        <Form.Item
          label="District Name"
          name="name"
          rules={[{ required: true, message: "Please enter district name" }]}
        >
          <Input placeholder="Enter District Name" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Add_District;
