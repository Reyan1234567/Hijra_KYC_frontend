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
