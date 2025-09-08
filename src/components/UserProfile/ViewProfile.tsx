
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
