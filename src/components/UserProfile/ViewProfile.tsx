
/**
 * VIEW PROFILE COMPONENT
 * 
 * PURPOSE:
 * Administrative interface for viewing and managing all user profiles in the KYC system.
 * Provides comprehensive user listing with search, filtering, sorting, and edit capabilities
 * for user management operations.
 * 
 * FUNCTIONALITY:
 * - Displays all users in paginated table format
 * - Real-time search across name, role, branch, and phone number
 * - Status filtering (Active/Blocked) with colored tags
 * - Sortable columns with full name sorting capability
 * - Edit navigation to individual user profile editing
 * - Responsive table with horizontal scrolling
 * - Loading states and error handling with user feedback
 * 
 * API INTERACTIONS:
 * - GET /api/user-profiles/get-all-users: Fetches all user profiles
 * - Comprehensive error handling with detailed error messages
 * - Loading states during API calls for better UX
 * 
 * USER INTERACTIONS:
 * - Search input with clear functionality for filtering users
 * - Status filter dropdown for Active/Blocked users
 * - Edit button navigation to Edit_Profile component
 * - Sortable table columns for data organization
 * - Pagination controls with customizable page sizes
 * - Total user count display in pagination
 * 
 * STATE MANAGEMENT:
 * - Users array state from API response
 * - Loading state for API call feedback
 * - Search text state for real-time filtering
 * - Memoized filtered users for performance optimization
 * - Navigation state via React Router hooks
 * 
 * DATA PROCESSING:
 * - Real-time search filtering across multiple fields
 * - Full name concatenation for display and sorting
 * - Status-based filtering with predefined filter options
 * - Memoized columns definition for performance
 * - Case-insensitive search implementation
 * 
 * TABLE FEATURES:
 * - Serial number column with automatic indexing
 * - User ID, full name, role, branch, gender, phone display
 * - Status visualization with colored tags (green/red)
 * - Fixed action column with edit functionality
 * - Responsive design with horizontal scroll
 * - Custom empty state messages
 * 
 * ROLE-BASED ACCESS:
 * - Typically restricted to Admin/Manager roles
 * - Provides overview of all system users
 * - Critical for user management and system administration
 * - Supports user lifecycle monitoring and maintenance
 * 
 * USAGE: Administrative user management page for viewing and accessing user profiles
 */

import React, { useEffect, useState, useMemo } from 'react';
import { Table, Tag, Button, Avatar, Space, message, Input, Row, Col } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/axios'; // use your axios instance
import { BASE_URL } from '../../services/Constants';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  roleName: string;
  branchAddress: string;
  gender: string;
  phoneNumber: string;
  status: 'Active' | 'Blocked';
}

const ViewProfile: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>(''); // 🔍 search state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await api.get<User[]>('/api/user-profiles/get-all-users');
        setUsers(res.data);
      } catch (err: any) {
        console.error('API error:', err);
        message.error(`Failed to load users: ${err?.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const onEdit = (user: User) => {
    navigate(`/Edit_Profile/${user.id}`);
  };

  // 🔍 Filter users by search text
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return (
        fullName.includes(searchText.toLowerCase()) ||
        user.roleName.toLowerCase().includes(searchText.toLowerCase()) ||
        user.branchAddress.toLowerCase().includes(searchText.toLowerCase()) ||
        user.phoneNumber.includes(searchText)
      );
    });
  }, [users, searchText]);

  const columns: ColumnsType<User> = useMemo(() => [
    {
      title: 'SN',
      render: (_: any, __: any, index: number) => index + 1,
      width: 70,
    },
    {
      title: 'User ID',
      dataIndex: 'id',
      key: 'userID',
    },
    {
      title: 'Full Name',
      render: (_: any, record: User) => `${record.firstName} ${record.lastName}`,
      sorter: (a: User, b: User) =>
        (a.firstName + a.lastName).localeCompare(b.firstName + b.lastName),
    },
    {
      title: 'Role',
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: 'Branch',
      dataIndex: 'branchAddress',
      key: 'branchAddress',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      width: 90,
    },
    {
      title: 'Phone No.',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 130,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: User['status']) => (
        <Tag color={status === 'Blocked' ? 'volcano' : 'green'}>
          {status}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: 'Active' },
        { text: 'Blocked', value: 'Blocked' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right' as 'right',
      width: 100,
      render: (_: any, record: User) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ], [navigate]);

  return (
    <div className="container">
      <h2 style={{ margin: '16px 0' }}>List Of Users In KYC Management System</h2>

      {/* 🔍 Search Bar */}
      <Row justify="end" style={{ marginBottom: 16 }}>
        <Col>
          <Input
            placeholder="Search by name, role, branch, phone..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </Col>
      </Row>

      <Table<User>
        loading={loading}
        dataSource={filteredUsers}  // use filtered list
        columns={columns}
        rowKey="id"
        scroll={{ x: 1000 }}
        pagination={{ 
          pageSize: 10, 
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} users`
        }}
        bordered
        locale={{
          emptyText: loading ? 'Loading...' : 'No users found'
        }}
      />
    </div>
  );
};

export default ViewProfile;
