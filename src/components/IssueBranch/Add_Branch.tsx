/**
 * ADD BRANCH COMPONENT
 * 
 * TYPE: Page Component (Admin Role)
 * PURPOSE: Form interface for creating new issue branches with district association
 * 
 * FUNCTIONALITY:
 * - Form-based branch creation with validation
 * - District dropdown populated from backend API
 * - Branch code, name, phone, and district selection
 * - Automatic status setting (Active = 1)
 * - Navigation back to branch list after successful creation
 * - Loading states and error handling
 * 
 * API INTERACTIONS:
 * - GET /api/districts/get-all-districts: Fetches available districts for dropdown
 * - POST /api/branches/post-branch: Creates new branch with payload
 * - Payload includes: branchCode, name, phone, districtId, status (default 1)
 * 
 * USER INTERACTIONS:
 * - Form fields: Branch Code (required), Name (required), District (required), Phone (optional)
 * - Save button with loading state during submission
 * - Back button navigation to View_Branch page
 * - Success message on creation, error messages on failure
 * 
 * STATE MANAGEMENT:
 * - Form state managed by Ant Design Form hooks
 * - Loading state for submit button during API calls
 * - Districts array state populated on component mount
 * - Navigation handled via React Router useNavigate
 * 
 * LIFECYCLE:
 * - useEffect on mount to fetch districts from API
 * - Form submission triggers branch creation API call
 * - Successful creation redirects to branch list view
 * 
 * VALIDATION:
 * - Required fields: branchCode, name, districtId
 * - Optional field: phone
 * - Form validation prevents submission with missing required data
 * 
 * ROLE-BASED ACCESS:
 * - Typically restricted to Admin role for branch management
 * - Part of administrative branch and district management system
 * 
 * USAGE: Standalone page for adding new issue branches to the system
 */

import React, { useState, useEffect } from "react";
import { Form, Input, Button, Typography, message, Space, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/axios"; // <-- use centralized axios instance

const { Title } = Typography;
const { Option } = Select;

interface District {
  id: number | string;
  districtName: string;

}

interface BranchFormValues {
  branchCode: string;
  name: string;
  phone: string;
  districtId: number | string;
}

const Add_Branch: React.FC = () => {
  const [form] = Form.useForm<BranchFormValues>();
  const [loading, setLoading] = useState<boolean>(false);
  const [districts, setDistricts] = useState<District[]>([]);
  const navigate = useNavigate();

  // Fetch districts from backend
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const res = await api.get<District[]>("/api/districts/get-all-districts");
        setDistricts(res.data);
      } catch (err: any) {
        console.error(err);
        message.error(err?.response?.data?.message || "Failed to fetch districts");
      }
    };
    fetchDistricts();
  }, []);

  const onFinish = async (values: BranchFormValues) => {
    setLoading(true);
    try {
      const payload = {
        branchCode: values.branchCode,
        name: values.name,
        phone: values.phone,
        districtId: values.districtId, // selected district ID
        status: 1, // default Active
      };

      await api.post("/api/branches/post-branch", payload);
      message.success("Branch added successfully");
      navigate("/View_Branch");
    } catch (err: any) {
      console.error(err);
      message.error(err?.response?.data?.message || "Failed to add branch");
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
        <Button onClick={() => navigate("/View_Branch")} type="primary">
          &larr; Back
        </Button>
      </Space>

      <Title level={3}>Add New Issue Branch:</Title>

      <Form<BranchFormValues> form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Branch Code"
          name="branchCode"
          rules={[{ required: true, message: "Please enter branch code" }]}
        >
          <Input placeholder="Enter Issue Branch Code" />
        </Form.Item>

        <Form.Item
          label="Issue Branch Name"
          name="name"
          rules={[{ required: true, message: "Please enter branch name" }]}
        >
          <Input placeholder="Enter Issue Branch Name" />
        </Form.Item>

        <Form.Item
          label="District"
          name="districtId"
          rules={[{ required: true, message: "Please select a district" }]}
        >
          <Select placeholder="Select District">
            {districts.map((d) => (
              <Option key={d.id} value={d.id}>
                {d.districtName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Issue Branch Phone"
          name="phone"
          rules={[{ message: "Please enter branch phone" }]}
        >
          <Input placeholder="Enter Issue Branch Phone" />
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

export default Add_Branch;
