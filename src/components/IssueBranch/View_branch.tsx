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
  districtId: number;
}

interface DistrictMap {
  [key: number]: string;
}

const View_Branch: React.FC = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [districts, setDistricts] = useState<DistrictMap>({});

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const res = await api.get<{ districtId: number; name: string; id?: number }[]>(
          "/api/districts/get-all-districts"
        );
        const map: DistrictMap = {};
        res.data.forEach(d => {
          const key = d.districtId || d.id!;
          map[key] = d.name;
        });
        setDistricts(map);
      } catch (err: any) {
        console.error("Districts fetch error:", err);
        message.error(err?.response?.data?.message || "Failed to fetch districts");
      }
    };

    const fetchBranches = async () => {
      try {
        const res = await api.get<Branch[]>("/api/branches");
        setBranches(res.data);
      } catch (err: any) {
        console.error("Branches fetch error:", err);
        message.error(err?.response?.data?.message || "Failed to fetch branches");
      }
    };

    fetchDistricts();
    fetchBranches();
  }, []);

  const handleEdit = (id: number) => {
    navigate(`/Edit_Branch/${id}`);
  };

  const handleAddNew = () => {
    navigate(`/Add_Branch`);
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
      title: "District",
      key: "district",
      render: (_: any, record: Branch) => districts[record.districtId] || "N/A",
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
