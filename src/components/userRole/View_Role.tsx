import React, { useState, useEffect } from "react";
import {
  Layout,
  Table,
  Button,
  Tag,
  Space,
  Input,
  Card,
  message,
  Spin,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/axios"; // <-- centralized axios instance

const { Header, Content } = Layout;

interface Role {
  roleId: number;
  roleName: string;
  recordStatus: number; // 1 = Active, 0 = Blocked
}

const View_Role: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");

  const predefinedRoles = [
    "maker",
    "HO_Checker",
    "HO_Manager",
  ];

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await api.get<Role[]>("/api/roles");
      setData(response.data);
    } catch (error: any) {
      console.error("Error fetching roles:", error);
      message.error(error?.response?.data?.message || "Failed to load roles from server!");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter((item) =>
    item.roleName.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleDelete = async (id: number, roleName: string) => {
    if (!window.confirm(`Are you sure you want to delete the role "${roleName}"?`)) return;

    try {
      await api.delete(`/api/roles/${id}`);
      message.success("Role deleted successfully!");
      fetchRoles();
    } catch (error: any) {
      console.error("Delete error:", error);
      message.error(error?.response?.data?.message || "Failed to delete role!");
    }
  };

  const columns = [
    {
      title: "SN",
      key: "sn",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Role Name",
      dataIndex: "roleName",
      key: "roleName",
      sorter: (a: Role, b: Role) => a.roleName.localeCompare(b.roleName),
    },
    {
      title: "Status",
      key: "status",
      render: (_: any, record: Role) => (
        <Tag
          color={record.recordStatus === 1 ? "blue" : "red"}
          style={{ borderRadius: "12px", padding: "0 12px", fontWeight: "bold" }}
        >
          {record.recordStatus === 1 ? "Active" : "Blocked"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Role) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/Edit_Role/${record.roleId}`)}
          />
          {!predefinedRoles.includes(record.roleName) && (
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.roleId, record.roleName)}
            />
          )}
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ padding: "20px", minHeight: "100vh" }}>
      <Header
        style={{
          background: "#fff",
          padding: "10px 20px",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        List Of User Roles In KYC Management System
      </Header>

      <Content style={{ marginTop: "20px" }}>
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/AddRole")}
            >
              Add Role
            </Button>

            <Input
              placeholder="Search..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
              allowClear
            />
          </div>

          <Spin spinning={loading} tip="Loading roles...">
            <Table<Role>
              columns={columns}
              dataSource={filteredData}
              pagination={{ pageSize: 5 }}
              rowKey="roleId"
              locale={{ emptyText: "No records found!" }}
            />
          </Spin>
        </Card>
      </Content>
    </Layout>
  );
};

export default View_Role;
