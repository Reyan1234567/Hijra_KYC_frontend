import React, { useEffect, useState } from "react";
import { Form, Input, Button, Typography, message, Space, Switch } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/axios"; // <-- use your axios instance

const { Title } = Typography;

interface BranchFormValues {
  branchCode: string;
  name: string;
  phone: string;
  status: boolean;
}

interface BranchData {
  branchCode: string;
  name: string;
  phone: string;
  status: number;
}

const Edit_Branch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm<BranchFormValues>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchBranch = async () => {
      setLoading(true);
      try {
        const res = await api.get<BranchData>(`/api/branches/search-branch/${id}`);
        const branch = res.data;

        form.setFieldsValue({
          branchCode: branch.branchCode,
          name: branch.name,
          phone: branch.phone,
          status: branch.status === 1, // convert 1/0 to boolean
        });
      } catch (err: any) {
        console.error(err);
        message.error(err?.response?.data?.message || "Failed to fetch branch details");
      } finally {
        setLoading(false);
      }
    };

    fetchBranch();
  }, [id, form]);

  const onFinish = async (values: BranchFormValues) => {
    setLoading(true);
    try {
      const payload = {
        branchCode: values.branchCode,
        name: values.name,
        phone: values.phone,
        status: values.status ? 1 : 0, // convert boolean to 1/0
      };

      await api.put(`/api/branches/${id}`, payload);
      message.success("Branch updated successfully");
      navigate("/View_Branch");
    } catch (err: any) {
      console.error(err);
      message.error(err?.response?.data?.message || "Failed to update branch");
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
          &larr; Back to View
        </Button>
      </Space>

      <Title level={3}>Edit Issue Branch Detail</Title>

      <Form<BranchFormValues> form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Branch Code"
          name="branchCode"
          rules={[{ required: true, message: "Please enter branch code" }]}
        >
          <Input placeholder="Enter branch code" />
        </Form.Item>

        <Form.Item
          label="Branch Name"
          name="name"
          rules={[{ required: true, message: "Please enter branch name" }]}
        >
          <Input placeholder="Enter branch name" />
        </Form.Item>

        <Form.Item
          label="Branch Phone"
          name="phone"
          rules={[{ message: "Please enter branch phone" }]}
        >
          <Input placeholder="Enter branch phone" />
        </Form.Item>

        <Form.Item label="Status" name="status" valuePropName="checked">
          <Switch checkedChildren="Active" unCheckedChildren="Blocked" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Edit_Branch;
