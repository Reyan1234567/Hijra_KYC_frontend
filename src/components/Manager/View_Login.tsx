/**
 * VIEW LOGIN COMPONENT
 * 
 * TYPE: Page Component (Manager Role)
 * PURPOSE: Displays system login/logout activity logs for user monitoring and audit purposes
 * 
 * FUNCTIONALITY:
 * - Fetches all system login/logout logs from the backend
 * - Displays logs in a paginated table format
 * - Shows user ID, action type (login/logout), and timestamp
 * - Provides audit trail for user activity monitoring
 * - Loading states and error handling for API calls
 * 
 * DATA FETCHING:
 * - API: GET /api/system-logs/get-all-logs - fetches all system activity logs
 * - Returns array of SystemLog objects with id, userId, actionType, actionTime
 * - Manual API calls with axios and local state management
 * - Fetches data on component mount
 * 
 * USER INTERACTIONS:
 * - Table view with pagination (10 items per page)
 * - Sortable columns for log analysis
 * - Loading indicator during data fetch
 * - Error handling with console logging
 * 
 * STATE MANAGEMENT:
 * - logs: SystemLog[] - stores fetched log data
 * - loading: boolean - tracks API call loading state
 * - Manual state management with useState hooks
 * - useEffect for data fetching on mount
 * 
 * LIFECYCLE:
 * - Mounts and immediately fetches system logs
 * - Console error logging for debugging API issues
 * - No automatic refresh - manual page reload required for updates
 * 
 * ROLE PERMISSIONS: Manager users only
 * ROUTING: Accessed via /viewLogin route
 */

import React, { useEffect, useState } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { api } from "../../services/axios";

// Define the type for our log object based on DTO
interface SystemLog {
  id: number;
  userId: number;
  actionType: string;
  actionTime: string; // ISO string from backend
}

const View_Login: React.FC = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await api.get<SystemLog[]>("api/system-logs/get-all-logs");
        setLogs(res.data); // no need to manipulate date
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const columns: ColumnsType<SystemLog> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: "Action Type",
      dataIndex: "actionType",
      key: "actionType",
    },
    {
      title: "Action Time",
      dataIndex: "actionTime",
      key: "actionTime",
      render: (text: string) => new Date(text).toLocaleString(), // date + time
    },
  ];

  return (
    <Table<SystemLog>
      rowKey="id"
      columns={columns}
      dataSource={logs}
      loading={loading}
      pagination={{ pageSize: 10 }}
    />
  );
};

export default View_Login;
