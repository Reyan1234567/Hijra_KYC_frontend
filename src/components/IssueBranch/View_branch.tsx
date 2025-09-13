/**
 * VIEW BRANCH COMPONENT
 * 
 * TYPE: Page Component (Admin Role)
 * PURPOSE: Table view for listing all issue branches with district information and management actions
 * 
 * FUNCTIONALITY:
 * - Table display of all branches with status indicators
 * - District name resolution from separate districts API
 * - Status tags (Active/Blocked) with color coding
 * - Edit action buttons for each branch
 * - Add New Branch navigation button
 * - Parallel API calls for branches and districts data
 * - Pagination support (10 items per page)
 * 
 * API INTERACTIONS:
 * - GET /api/branches/get-all-branches: Fetches all branch records
 * - GET /api/districts/get-all-districts: Fetches districts for name resolution
 * - Uses Promise.all for parallel data fetching
 * - District ID to name mapping via helper function
 * 
 * USER INTERACTIONS:
 * - Table view with sortable columns
 * - Edit button for each branch row (navigates to Edit_Branch/{id})
 * - Add New Branch button (navigates to Add_Branch)
 * - Status visualization with colored tags
 * - Pagination controls for large datasets
 * 
 * STATE MANAGEMENT:
 * - Branches array state from API
 * - Districts array state for name resolution
 * - Loading handled implicitly by useEffect
 * - Navigation via React Router useNavigate
 * 
 * LIFECYCLE:
 * - useEffect on mount to fetch both branches and districts
 * - Parallel API calls for better performance
 * - Error handling with user-friendly messages
 * 
 * DATA TRANSFORMATION:
 * - District ID to name mapping via getDistrictName helper
 * - Status number to tag display (1=Active/Green, 0=Blocked/Red)
 * - Table columns with custom render functions
 * 
 * TABLE COLUMNS:
 * - ID, Branch Code, Branch Name, Branch Phone
 * - Status (colored tag), District Name (resolved), Actions (Edit button)
 * 
 * ROLE-BASED ACCESS:
 * - Typically restricted to Admin role for branch management
 * - Central hub for branch administration
 * - Links to Add and Edit branch functionality
 * 
 * USAGE: Main page for viewing and managing all issue branches in the system
 */

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