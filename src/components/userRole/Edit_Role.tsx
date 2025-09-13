/**
 * EDIT ROLE COMPONENT
 * 
 * PURPOSE:
 * Administrative interface for editing existing user roles in the KYC management system.
 * Allows modification of role status while preserving role name integrity, with
 * pre-populated form data and validation.
 * 
 * FUNCTIONALITY:
 * - Fetches existing role data by roleId from URL parameters
 * - Pre-populates form with current role information
 * - Disabled role name field to prevent accidental changes
 * - Status toggle between Active and Blocked states
 * - Form validation with required field enforcement
 * - Loading states during data fetch and form submission
 * - Navigation back to View_Role page after successful update
 * 
 * API INTERACTIONS:
 * - GET /api/roles/{roleId}: Fetches specific role details for editing
 * - PUT /api/roles/{roleId}: Updates role with modified status
 * - Status conversion between string (Active/Blocked) and number (1/0)
 * - Comprehensive error handling with user feedback
 * - Success confirmation with navigation redirect
 * 
 * USER INTERACTIONS:
 * - URL parameter-based role identification
 * - Pre-populated form with existing role data
 * - Status dropdown selection (Active/Blocked)
 * - Save button with form submission
 * - Back navigation button to roles listing
 * - Loading spinner during data operations
 * 
 * STATE MANAGEMENT:
 * - Form state managed by Ant Design Form hooks
 * - Loading state for data fetch and UI feedback
 * - URL parameter extraction via React Router hooks
 * - Navigation state for routing control
 * 
 * DATA HANDLING:
 * - Role ID validation from URL parameters
 * - Status normalization between API (number) and UI (string) formats
 * - Form field mapping from API response
 * - DTO construction for API update requests
 * 
 * VALIDATION:
 * - Required field validation for role status
 * - URL parameter validation with error handling
 * - Form submission prevention until validation passes
 * 
 * ROLE-BASED ACCESS:
 * - Typically restricted to Admin roles
 * - Critical for role lifecycle management
 * - Supports organizational structure maintenance
 * - Prevents unauthorized role modifications
 * 
 * USAGE: Administrative role editing page for role status management
 */

import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Typography,
  message,
  Card,
  Spin,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/axios"; // centralized axios instance

const { Title } = Typography;
const { Option } = Select;

interface Role {
  roleId: number;
  roleName: string;
  recordStatus: number; // 1 = Active, 0 = Blocked
}

interface RoleFormValues {
  roleName: string;
  recordStatus: "Active" | "Blocked";
}

const Edit_Role: React.FC = () => {
  const [form] = Form.useForm<RoleFormValues>();
  const navigate = useNavigate();
  const { roleId } = useParams<{ roleId: string }>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (roleId) {
      fetchRoleDetails();
    } else {
      message.error("Invalid role ID");
      navigate("/View_Role");
    }
  }, [roleId, navigate]);

  const fetchRoleDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get<Role>(`/api/roles/${roleId}`);
      const role = response.data;

      form.setFieldsValue({
        roleName: role.roleName,
        recordStatus: role.recordStatus === 1 ? "Active" : "Blocked",
      });
    } catch (error: any) {
      console.error("Fetch Error:", error);
      message.error(error?.response?.data?.message || "Failed to load role data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: RoleFormValues) => {
    const dto = {
      roleName: values.roleName,
      recordStatus: values.recordStatus === "Active" ? 1 : 0,
    };

    try {
      await api.put(`/api/roles/${roleId}`, dto);
      message.success("Role updated successfully!");
      navigate("/View_Role");
    } catch (error: any) {
      console.error("Update Error:", error);
      message.error(error?.response?.data?.message || "Failed to update role");
    }
  };

  return (
    <Card style={{ maxWidth: 600, margin: "40px auto" }}>
      <Button
        type="primary"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/View_Role")}
        style={{ marginBottom: 16 }}
      >
        Back to View Roles
      </Button>

      <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
        Edit User Role Information
      </Title>

      {loading ? (
        <Spin spinning />
      ) : (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Role Name" name="roleName">
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Role Status"
            name="recordStatus"
            rules={[{ required: true, message: "Please select role status!" }]}
          >
            <Select placeholder="Select status">
              <Option value="Active">Active</Option>
              <Option value="Blocked">Blocked</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Save Role Change
            </Button>
          </Form.Item>
        </Form>
      )}
    </Card>
  );
};

export default Edit_Role;
