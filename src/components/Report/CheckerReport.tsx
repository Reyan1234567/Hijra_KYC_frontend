/**
 * CHECKER REPORT COMPONENT
 * 
 * TYPE: Page Component (Manager/Admin Role)
 * PURPOSE: Comprehensive reporting interface for checker performance and KYC processing statistics
 * 
 * FUNCTIONALITY:
 * - Date range-based report generation for checker activities
 * - Aggregated statistics by checker username (Pending, Approved, Rejected, Total)
 * - Excel and PDF export capabilities
 * - Summary statistics with totals row
 * - Robust data parsing with multiple field name variations
 * - Status code normalization and mapping
 * - Loading states and error handling with authentication retry
 * 
 * API INTERACTIONS:
 * - GET /api/checker-report: Fetches checker performance data by date range
 * - Parameters: fromDate, toDate (YYYY-MM-DD format)
 * - Bearer token authentication with automatic logout on 401
 * - Handles both aggregated and raw data formats from backend
 * 
 * USER INTERACTIONS:
 * - Date range picker (required field) for report period selection
 * - Search button to generate report with loading state
 * - Export buttons for Excel and PDF downloads
 * - Paginated table view with summary row
 * - Statistics cards showing totals for each status
 * 
 * STATE MANAGEMENT:
 * - reportData: Array of CheckerReportDto with username and counts
 * - totals: Aggregated totals across all checkers
 * - loading: Form submission and API call state
 * - Form state managed by Ant Design Form hooks
 * 
 * DATA PROCESSING:
 * - Flexible field name mapping for different backend response formats
 * - Status normalization (string/numeric to standard categories)
 * - Automatic aggregation when raw transaction data is received
 * - Number formatting with locale-specific separators
 * - Robust error handling for malformed data
 * 
 * EXPORT FEATURES:
 * - Excel export using XLSX library with timestamped filenames
 * - PDF export using jsPDF with autoTable for formatted tables
 * - Data validation before export (prevents empty exports)
 * - Consistent column headers across export formats
 * 
 * STATUS MAPPING:
 * - Pending: status = 1 or contains "pending"
 * - Approved: status = 2 or contains "approve"
 * - Rejected: status = 3 or contains "reject"
 * - Unknown statuses default to Pending category
 * 
 * TABLE FEATURES:
 * - Index column with auto-numbering
 * - Username, Pending, Approved, Rejected, Total columns
 * - Number formatting with toLocaleString()
 * - Summary row with totals
 * - Horizontal scroll for responsive design
 * - 10 items per page pagination
 * 
 * ROLE-BASED ACCESS:
 * - Typically restricted to Manager/Admin roles
 * - Provides oversight of checker performance
 * - Critical for KYC processing monitoring and quality assurance
 * 
 * USAGE: Standalone reporting page for checker performance analysis and export
 */

import { useState } from "react";
import {
  Card,
  Form,
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

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // ✅ Fix: check date properly
      if (!values.dates || !values.dates[0] || !values.dates[1]) {
        message.error("Please select a date range");
        setLoading(false);
        return;
      }

      // Format dates
      const fromDate = values.dates[0].format("YYYY-MM-DD");
      const toDate = values.dates[1].format("YYYY-MM-DD");

      const params: any = { fromDate, toDate };

      console.log("API Parameters:", params);

      // ✅ Fix: correct template string
      const response = await api.get("/api/checker-report", {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      console.log("API Response:", response.data);

      const arr: any[] = Array.isArray(response.data)
        ? response.data
        : response.data && Array.isArray(response.data.items)
        ? response.data.items
        : [];

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

      if (arr && Array.isArray(arr)) {
        if (arr.length === 0) {
          message.warning("No data found for the selected criteria");
          setReportData([]);
          setTotals({ Pending: 0, Approved: 0, Rejected: 0, Total: 0 });
        } else {
          const first = arr[0];
          const isAggregated =
            first.Pending !== undefined ||
            first.pending !== undefined ||
            first.Approved !== undefined ||
            first.approved !== undefined ||
            first.Rejected !== undefined ||
            first.rejected !== undefined ||
            first.Total !== undefined ||
            first.total !== undefined ||
            first.getPendingCount !== undefined ||
            first.getApprovedCount !== undefined;

          if (isAggregated) {
            const mapped = arr.map((r: any, i: number) => {
              const username =
                getVal(r, [
                  "hoUserName",
                  "ho_user_name",
                  "username",
                  "userName",
                  "getUserName",
                ]) || `user-${i}`;
              const Pending = toNumber(
                getVal(r, ["Pending", "pending", "getPendingCount", "getPending"]) || 0
              );
              const Approved = toNumber(
                getVal(r, ["Approved", "approved", "getApprovedCount", "getApproved"]) || 0
              );
              const Rejected = toNumber(
                getVal(r, ["Rejected", "rejected", "getRejectedCount", "getRejected"]) || 0
              );
              const Total =
                toNumber(
                  getVal(r, ["Total", "total", "getTotalCount", "getTotal"])
                ) || Pending + Approved + Rejected;

              return { username, Pending, Approved, Rejected, Total };
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
            // Improved status parsing logic
            const groups: Record<
              string,
              { Pending: number; Approved: number; Rejected: number; Total: number }
            > = {};

            for (const item of arr) {
              const username =
                getVal(item, ["getUserName", "userName", "username", "hoUserName", "ho_user_name"]) || "-";
              
              // Improved status detection based on the DetailReport component
              const status = (getVal(item, ["getStatus", "status", "statusName", "status_name"]) || "").toString();
              const normalizedStatus = status.toLowerCase().trim();

              if (!groups[username])
                groups[username] = { Pending: 0, Approved: 0, Rejected: 0, Total: 0 };

              // More robust status matching
              if (normalizedStatus.includes("pending")) {
                groups[username].Pending += 1;
              } else if (normalizedStatus.includes("approve")) {
                groups[username].Approved += 1;
              } else if (normalizedStatus.includes("reject")) {
                groups[username].Rejected += 1;
              } else {
                // If status doesn't match known values, check for numeric status codes
                const statusCode = parseInt(normalizedStatus);
                if (!isNaN(statusCode)) {
                  switch (statusCode) {
                    case 1: // Pending
                      groups[username].Pending += 1;
                      break;
                    case 2: // Approved
                      groups[username].Approved += 1;
                      break;
                    case 3: // Rejected
                      groups[username].Rejected += 1;
                      break;
                    default:
                      // Unknown status, count as pending
                      groups[username].Pending += 1;
                  }
                } else {
                  // Unknown status, count as pending
                  groups[username].Pending += 1;
                }
              }

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
            message.success(`Aggregated ${mapped.length} users from ${arr.length} rows`);
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
        try {
          Logout();
        } catch {
          // ignore
        }
      } else {
        message.error(
          error.response?.data?.message || error.message || "Failed to fetch report data"
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
      render: (_: string, __: any, index: number) => index + 1,
    },
    { title: "Username", dataIndex: "username", key: "username", width: 100 },
    {
      title: "Pending",
      dataIndex: "Pending",
      key: "Pending",
      width: 100,
      render: (v: number) => v.toLocaleString(),
    },
    {
      title: "Approved",
      dataIndex: "Approved",
      key: "Approved",
      width: 100,
      render: (v: number) => v.toLocaleString(),
    },
    {
      title: "Rejected",
      dataIndex: "Rejected",
      key: "Rejected",
      width: 100,
      render: (v: number) => v.toLocaleString(),
    },
    {
      title: "Total",
      dataIndex: "Total",
      key: "Total",
      width: 100,
      render: (v: number) => v.toLocaleString(),
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
          <Col xs={24} md={4} style={{ display: "flex", alignItems: "flex-end" }}>
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