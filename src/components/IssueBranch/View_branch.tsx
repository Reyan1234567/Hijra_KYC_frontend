
import React, { useEffect, useState } from "react";
import { Table, Button, Typography, Space, Tag, message } from "antd";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/axios"; // <-- use your axios instance

const { Title } = Typography;

interface Branch {
  id: number;
  branchCode: string;
  name: string;
  phone: string;
  status: number;
  districtId: number;  // ✅ only keep districtId
}

interface District {
  id: number;
  districtName: string;  // ✅ match backend entity
}

const View_Branch: React.FC = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [branchRes, districtRes] = await Promise.all([
          api.get<Branch[]>("/api/branches/get-all-branches"),
          api.get<District[]>("/api/districts/get-all-districts"),
        ]);
        setBranches(branchRes.data);
        setDistricts(districtRes.data);
      } catch (err: any) {
        console.error("Fetch error:", err);
        message.error(err?.response?.data?.message || "Failed to fetch data");
      }
    };

    fetchData();
  }, []);

  const handleEdit = (id: number) => {
    navigate(`/Edit_Branch/${id}`);
  };

  const handleAddNew = () => {
    navigate(`/Add_Branch`);
  };

  // ✅ helper function to resolve district name
  const getDistrictName = (districtId: number) => {
    const district = districts.find((d) => d.id === districtId);
    return district ? district.districtName : "Unknown";
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Branch Code", dataIndex: "branchCode", key: "branchCode" },
    { title: "Branch Name", dataIndex: "name", key: "name" },
    { title: "Branch Phone", dataIndex: "phone", key: "phone" },
    {
      title: "Status",
      key: "status",
      render: (_: any, record: Branch) => (
        <Tag color={record.status === 1 ? "green" : "red"}>
          {record.status === 1 ? "Active" : "Blocked"}
        </Tag>
      ),
    },
    {
      title: "District Name",
      key: "districtName",
      render: (_: any, record: Branch) => getDistrictName(record.districtId),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Branch) => (
        <Button type="primary" onClick={() => handleEdit(record.id)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <Title level={3}>List Of Issue Branches In KYC Management System</Title>
        <Button type="primary" onClick={handleAddNew}>
          Add New Branch
        </Button>
      </Space>

      <Table
        dataSource={branches}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default View_Branch;