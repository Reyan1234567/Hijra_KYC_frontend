import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Select,
  Button,
  message,
  Switch,
  Card,
  Typography,
} from "antd";
import { ArrowLeftOutlined, UserOutlined } from "@ant-design/icons";
import { api } from "../../services/axios"; // <-- updated axios instance

const { Option } = Select;
const { Title } = Typography;

interface Role {
  roleId: number;
  roleName: string;
}

interface Branch {
  branchId: number;
  name: string;
}

const Edit_Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [roles, setRoles] = useState<Role[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  // const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // const fallbackImage = 'https://via.placeholder.com/80x80.png?text=User';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch roles and branches in parallel
        const [rolesRes, branchesRes, userRes] = await Promise.all([
          api.get<Role[]>("/api/roles"),
          api.get<Branch[]>("/api/branches/get-all-branches"),
          api.get(`/api/user-profiles/get-user/${id}`),
        ]);

        setRoles(rolesRes.data);
        setBranches(branchesRes.data);

        console.log("User API response:", userRes.data);

        // Check if your backend wraps data in `data` property
        const userData = userRes.data.data ? userRes.data.data : userRes.data;

        if (!userData) {
          message.error("User data not found");
          return;
        }

        // Populate form fields
        form.setFieldsValue({
          id: userData.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          gender: userData.gender,
          phoneNumber: userData.phoneNumber,
          roleId: userData.roleId,
          branchId: Number(userData.branchId ?? 0),
          status: userData.status === "Active" || userData.status === "1",
          photoUrl: userData.photoUrl,
        });
        // setImageUrl(`/api/user-profiles/user-profile/${id}/photoUrl`);
        setInitialized(true);
      } catch (error: any) {
        console.error("Failed to load data", error);
        message.error(error?.response?.data?.message || "Failed to load data");
      }
    };
    fetchData();
  }, [id, form]);

  // const handleUploadChange = ({ fileList }: { fileList: any[] }) => {
  //   setFileList(fileList);
  // };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("gender", values.gender);
      formData.append("phoneNumber", values.phoneNumber);
      formData.append("roleId", values.roleId);
      formData.append("branchId", values.branchId);
      formData.append("status", values.status ? "1" : "0");

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("photoUrl", fileList[0].originFileObj);
      }

      await api.put(`/api/user-profiles/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      message.success("User updated successfully");
      navigate("/ViewProfile");
    } catch (error: any) {
      console.error("Failed to update user", error);
      message.error(error?.response?.data?.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  if (!initialized) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: "20px" }}>
      <Card bordered={false}>
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{ marginBottom: 24, fontWeight: "bold" }}
        >
          Back
        </Button>

        <Title level={4} style={{ marginBottom: 24 }}>
          Edit User Profile
        </Title>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="roleId"
            label="User Role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select placeholder="Select Role">
              {roles.map((role) => (
                <Option key={role.roleId} value={role.roleId}>
                  {role.roleName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="branchId"
            label="Issue Branch"
            rules={[{ required: true, message: "Please select a branch" }]}
          >
            <Select placeholder="Select Branch">
              {branches.map((branch, index) => (
                <Option
                  key={branch.branchId || index}
                  value={branch.branchId || index + 1}
                >
                  {branch.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: "Please input first name" }]}
          >
            <Input placeholder="Enter first name" />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "Please input last name" }]}
          >
            <Input placeholder="Enter last name" />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: "Please select gender" }]}
          >
            <Select placeholder="Select Gender">
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[{ required: true, message: "Please input phone number" }]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>

          {/* <Form.Item label="Profile Photo">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div>
                <img
                  src={
                    fileList.length > 0
                      ? URL.createObjectURL(fileList[0].originFileObj)
                      : imageUrl || fallbackImage
                  }
                  alt="Preview"
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '1px solid #d9d9d9',
                  }}
                />
              </div>

              <Upload
                beforeUpload={() => false}
                fileList={fileList}
                onChange={handleUploadChange}
                maxCount={1}
                listType="picture"
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>Change Photo</Button>
              </Upload>
            </div>
          </Form.Item> */}

          <Form.Item
            name="status"
            label="Account Status"
            valuePropName="checked"
          >
            <Switch checkedChildren="Active" unCheckedChildren="Blocked" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<UserOutlined />}
              style={{ width: 150, fontWeight: "bold" }}
            >
              Update User
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Edit_Profile;
