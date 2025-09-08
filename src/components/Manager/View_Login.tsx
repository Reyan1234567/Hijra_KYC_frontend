// import React, { useEffect, useState } from "react";
// import { Table } from "antd";
// import type { ColumnsType } from "antd/es/table";
// import { api } from "../../services/axios";

// // Define the type for our log object
// interface SystemLog {
//   id: number;
//   userId: number;
//   actionType: string;
//   actionTime: string; // ISO string from backend
// }

// const View_Login: React.FC = () => {
//   const [logs, setLogs] = useState<SystemLog[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);

//   useEffect(() => {
//     const fetchLogs = async () => {
//       setLoading(true);
//       try {
//         const res = await api.get<SystemLog[]>("api/system-logs/get-all-logs");
//         // Adjust actionTime to start from today
//         const today = new Date();
//         const updatedLogs = res.data.map((log, index) => {
//           const newDate = new Date(today);
//           newDate.setDate(today.getDate() + index); // increment each row by 1 day
//           return { ...log, actionTime: newDate.toISOString() };
//         });
//         setLogs(updatedLogs);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLogs();
//   }, []);

//   const columns: ColumnsType<SystemLog> = [
//     {
//       title: "#",
//       dataIndex: "id",
//       key: "id",
//     },
//     {
//       title: "User ID",
//       dataIndex: "userId",
//       key: "userId",
//     },
//     {
//       title: "Action Type",
//       dataIndex: "actionType",
//       key: "actionType",
//     },
//     {
//       title: "Action Date",
//       dataIndex: "actionTime",
//       key: "actionDate",
//       render: (text: string) => new Date(text).toLocaleDateString(), // only date
//     },
//     {
//       title: "Action Time",
//       dataIndex: "actionTime",
//       key: "actionTime",
//       render: (text: string) => new Date(text).toLocaleTimeString(), // only time
//     },
//   ];

//   return (
//     <Table<SystemLog>
//       rowKey="id"
//       columns={columns}
//       dataSource={logs}
//       loading={loading}
//       pagination={{ pageSize: 10 }}
//     />
//   );
// };

// export default View_Login;
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
