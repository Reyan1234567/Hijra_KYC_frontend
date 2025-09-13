/**
 * EDIT BRANCH COMPONENT
 * 
 * TYPE: Page Component (Admin Role)
 * PURPOSE: Form interface for editing existing issue branch details with district reassignment
 * 
 * FUNCTIONALITY:
 * - Pre-populated form with existing branch data from API
 * - District dropdown with current selection maintained
 * - Status toggle switch (Active/Blocked)
 * - Form validation and error handling
 * - Navigation back to branch list after successful update
 * - Loading states during data fetching and submission
 * 
 * API INTERACTIONS:
 * - GET /api/districts/get-all-districts: Fetches available districts for dropdown
 * - GET /api/branches/search-branch/{id}: Fetches existing branch data for editing
 * - PUT /api/branches/{id}: Updates branch with modified data
 * - Payload includes: branchCode, name, phone, place, districtId, status (0/1)
 * 
 * USER INTERACTIONS:
 * - Pre-filled form fields: Branch Code, Name, Phone, Place, District, Status
 * - District dropdown with current selection highlighted
 * - Status switch with Active/Blocked labels
 * - Save Changes button with loading state during submission
 * - Back button navigation to View_Branch page
 * - Success/error messages for user feedback
 * 
 * STATE MANAGEMENT:
 * - Form state managed by Ant Design Form hooks with pre-population
 * - Loading state for both data fetching and form submission
 * - Districts array state populated on component mount
 * - URL parameter (id) used to identify branch for editing
 * 
 * LIFECYCLE:
 * - useEffect on mount to fetch districts list
 * - useEffect with id dependency to fetch specific branch data
 * - Form pre-population with setFieldsValue after data fetch
 * - Form submission triggers branch update API call
 * 
 * DATA TRANSFORMATION:
 * - Status conversion: boolean (form) ↔ number (API) (true=1, false=0)
 * - District selection by ID with name display in dropdown
 * - Form validation prevents submission with invalid data
 * 
 * VALIDATION:
 * - Required fields: branchCode, name, districtId
 * - Optional fields: phone, place
 * - Status field handled as boolean switch
 * 
 * ROLE-BASED ACCESS:
 * - Typically restricted to Admin role for branch management
 * - Part of administrative branch modification system
 * - Allows updating branch details and district assignments
 * 
 * USAGE: Standalone page for editing existing issue branches in the system
 */

import React, { useEffect, useState } from "react";
import { Form, Input, Button, Typography, message, Space, Switch, Select } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/axios";

const { Title } = Typography;
const { Option } = Select;

interface District {
  id: number;
  districtName: string;
  districtCode: string;
}

interface BranchFormValues {
  branchCode: string;
  name: string;
  phone: string;
  place: string;
  districtId: number;
  status: boolean;
}

interface BranchData {
  branchCode: string;
  name: string;
  phone: string;
  place: string;
  districtId: number;
  status: number;
}

const Edit_Branch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm<BranchFormValues>();
  const [loading, setLoading] = useState<boolean>(false);
  const [districts, setDistricts] = useState<District[]>([]);

  // fetch all districts once
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
          place: branch.place,
          districtId: branch.districtId, // ✅ preselect by id
          status: branch.status === 1,
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
        place: values.place,
        districtId: values.districtId, // ✅ send only id
        status: values.status ? 1 : 0,
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

        <Form.Item
          label="District"
          name="districtId"
          rules={[{ required: true, message: "Please select district" }]}
        >
          <Select placeholder="Select District">
            {districts.map((d) => (
              <Option key={d.id} value={d.id}>
                {d.districtName} ({d.districtCode})
              </Option>
            ))}
          </Select>
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