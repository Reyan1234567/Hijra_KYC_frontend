import React, { useState, useEffect } from "react";
import { Form, Input, Button, Typography, message, Space, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/axios"; // <-- use centralized axios instance

const { Title } = Typography;
const { Option } = Select;

interface District {
  id: number | string;
  name: string;
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
                {d.name}
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
