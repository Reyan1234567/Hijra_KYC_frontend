import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Select,
  Button,
  Table,
  Typography,
  Row,
  Col,
  message,
  DatePicker,
  Statistic,
} from "antd";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { api, Logout } from "../../services/axios";
// import dayjs from "dayjs";
// import { AuthContext } from "../../context/AuthContext";
// import { useContext } from "react";

const { Title } = Typography;
const { RangePicker } = DatePicker;

interface CheckerReportDto {
  username: string;
  Pending: number;
  Approved: number;
  Rejected: number;
  Total: number;
}

const CheckerReport = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<CheckerReportDto[]>([]);
  const [totals, setTotals] = useState({
    Pending: 0,
    Approved: 0,
    Rejected: 0,
    Total: 0,
  });
  // const USER = useContext(AuthContext);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Check if dates are selected
      if (!values.dates || !values.dates[0] || !values.dates[1]) {
        message.error("Please select a date range");
        setLoading(false);
        return;
      }

      // Format dates from RangePicker
      const fromDate = values.dates[0].format("YYYY-MM-DD");
      const toDate = values.dates[1].format("YYYY-MM-DD");

      // Prepare API parameters
      const params: any = {
        fromDate,
        toDate,
      };

      console.log("API Parameters:", params);

      // Call the backend API
      const response = await api.get("api/checker-report", {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      console.log("API Response:", response.data);

      // Helper to access different key shapes (plain, getter-style, numeric keys)
      const getVal = (obj: any, keys: string[]) => {
        if (obj == null) return undefined;
        for (const k of keys) {
          if (obj[k] !== undefined) return obj[k];
        }
        return undefined;
      };

      const toNumber = (v: any) => {
        if (v == null) return 0;
        const n = Number(v);
        return Number.isNaN(n) ? 0 : n;
      };

      // If response is array, handle two possible shapes:
      // 1) Aggregated rows: each row already contains Pending/Approved/Rejected/Total fields (or getter-style equivalents)
      // 2) Detail rows: each row is a single request with getUserName/getStatus etc. -> group by user and count statuses
      if (response.data && Array.isArray(response.data)) {
        const arr = response.data;

        if (arr.length === 0) {
          message.warning("No data found for the selected criteria");
          setReportData([]);
          setTotals({ Pending: 0, Approved: 0, Rejected: 0, Total: 0 });
        } else {
          const first = arr[0];

          const isAggregated =
            first.Pending !== undefined ||
            first.Approved !== undefined ||
            first.Rejected !== undefined ||
            first.Total !== undefined ||
            first.getPendingCount !== undefined ||
            first.getApprovedCount !== undefined;

          if (isAggregated) {
            // Map aggregated rows to CheckerReportDto
            const mapped = arr.map((r: any, i: number) => {
              const username =
                getVal(r, ["username", "userName", "getUserName"]) ||
                `user-${i}`;
              const Pending = toNumber(
                getVal(r, [
                  "Pending",
                  "pending",
                  "getPendingCount",
                  "getPending",
                ]) || 0
              );
              const Approved = toNumber(
                getVal(r, [
                  "Approved",
                  "approved",
                  "getApprovedCount",
                  "getApproved",
                ]) || 0
              );
              const Rejected = toNumber(
                getVal(r, [
                  "Rejected",
                  "rejected",
                  "getRejectedCount",
                  "getRejected",
                ]) || 0
              );
              const Total = toNumber(
                getVal(r, ["Total", "total", "getTotalCount", "getTotal"]) ||
                  Pending + Approved + Rejected
              );
              return {
                username,
                Pending,
                Approved,
                Rejected,
                Total,
              } as CheckerReportDto;
            });

            setReportData(mapped);

            const totalsComputed = mapped.reduce(
              (acc, cur) => {
                acc.Pending += cur.Pending;
                acc.Approved += cur.Approved;
                acc.Rejected += cur.Rejected;
                acc.Total += cur.Total;
                return acc;
              },
              { Pending: 0, Approved: 0, Rejected: 0, Total: 0 }
            );

            setTotals(totalsComputed);
            message.success(`Found ${mapped.length} records`);
          } else {
            // Treat as detail rows -> group by user and count statuses
            const groups: Record<
              string,
              {
                Pending: number;
                Approved: number;
                Rejected: number;
                Total: number;
              }
            > = {};

            for (const item of arr) {
              const username =
                getVal(item, ["getUserName", "userName", "username"]) || "-";
              const status = (
                getVal(item, ["getStatus", "status"]) || ""
              ).toString();

              if (!groups[username])
                groups[username] = {
                  Pending: 0,
                  Approved: 0,
                  Rejected: 0,
                  Total: 0,
                };

              if (/pending/i.test(status)) groups[username].Pending += 1;
              else if (/approve/i.test(status)) groups[username].Approved += 1;
              else if (/reject/i.test(status)) groups[username].Rejected += 1;
              else groups[username].Total -= 0; // leave as-is for unknown status

              groups[username].Total += 1;
            }

            const mapped = Object.keys(groups).map((u) => ({
              username: u,
              Pending: groups[u].Pending,
              Approved: groups[u].Approved,
              Rejected: groups[u].Rejected,
              Total: groups[u].Total,
            }));

            setReportData(mapped);

            const totalsComputed = mapped.reduce(
              (acc, cur) => {
                acc.Pending += cur.Pending;
                acc.Approved += cur.Approved;
                acc.Rejected += cur.Rejected;
                acc.Total += cur.Total;
                return acc;
              },
              { Pending: 0, Approved: 0, Rejected: 0, Total: 0 }
            );

            setTotals(totalsComputed);
            message.success(
              `Aggregated ${mapped.length} users from ${arr.length} rows`
            );
          }
        }
      } else {
        message.warning("No data found for the selected criteria");
        setReportData([]);
        setTotals({ Pending: 0, Approved: 0, Rejected: 0, Total: 0 });
      }
    } catch (error: any) {
      console.error("API Error:", error);
      if (error.response?.status === 401) {
        // Force logout when unauthorized
        try {
          Logout();
        } catch (e) {
          // ignore
        }
      } else {
        message.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch report data"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = () => {
    if (!reportData.length) {
      message.warning("No data to export");
      return;
    }
    const excelData = reportData.map((r) => ({
      Username: r.username,
      Pending: r.Pending,
      Approved: r.Approved,
      Rejected: r.Rejected,
      Total: r.Total,
    }));
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "CheckerReport");
    XLSX.writeFile(wb, `CheckerReport_${new Date().toISOString()}.xlsx`);
  };

  const handleExportPDF = () => {
    if (!reportData.length) {
      message.warning("No data to export");
      return;
    }
    const doc = new jsPDF();
    const columns = ["Username", "Pending", "Approved", "Rejected", "Total"];
    const rows = reportData.map((r) => [
      r.username,
      r.Pending,
      r.Approved,
      r.Rejected,
      r.Total,
    ]);
    autoTable(doc, { head: [columns], body: rows });
    doc.save(`CheckerReport_${new Date().toISOString()}.pdf`);
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      width: 50,
      render: (_text: string, _record: any, index: number) => index + 1,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      width: 100,
    },
    {
      title: "Pending",
      dataIndex: "Pending",
      key: "Pending",
      width: 100,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: "Approved",
      dataIndex: "Approved",
      key: "Approved",
      width: 100,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: "Rejected",
      dataIndex: "Rejected",
      key: "Rejected",
      width: 100,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: "Total",
      dataIndex: "Total",
      key: "Total",
      width: 100,
      render: (value: number) => value.toLocaleString(),
    },
  ];

  return (
    <Card>
      <Title level={2}>HO CHECKERS REPORT</Title>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col xs={24} md={10}>
            <Form.Item
              name="dates"
              label="Date Range *"
              rules={[{ required: true, message: "Please select date range" }]}
            >
              <RangePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>
          </Col>
          <Col
            xs={24}
            md={4}
            style={{ display: "flex", alignItems: "flex-end" }}
          >
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Search
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      {reportData.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <Title level={4}>List of To Be Approved Requests From Branch</Title>

          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={6}>
              <Statistic title="Total Pending" value={totals.Pending} />
            </Col>
            <Col span={6}>
              <Statistic title="Total Approved" value={totals.Approved} />
            </Col>
            <Col span={6}>
              <Statistic title="Total Rejected" value={totals.Rejected} />
            </Col>
            <Col span={6}>
              <Statistic title="Grand Total" value={totals.Total} />
            </Col>
          </Row>

          <Row gutter={8} style={{ marginBottom: 12 }}>
            <Col>
              <Button onClick={handleExportExcel} disabled={!reportData.length}>
                Download as Excel
              </Button>
            </Col>
            <Col>
              <Button onClick={handleExportPDF} disabled={!reportData.length}>
                Download as PDF
              </Button>
            </Col>
          </Row>

          <Table
            columns={columns}
            dataSource={reportData}
            loading={loading}
            scroll={{ x: 600 }}
            pagination={{ pageSize: 10 }}
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={2}>
                  <strong>Total</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <strong>{totals.Pending.toLocaleString()}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  <strong>{totals.Approved.toLocaleString()}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                  <strong>{totals.Rejected.toLocaleString()}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}>
                  <strong>{totals.Total.toLocaleString()}</strong>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
        </div>
      )}
    </Card>
  );
};

export default CheckerReport;
