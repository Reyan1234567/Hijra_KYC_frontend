
/**
 * DETAIL REPORT COMPONENT
 * 
 * PURPOSE:
 * Comprehensive reporting interface for detailed KYC form information with advanced filtering,
 * data transformation, and export capabilities. Provides granular view of individual KYC requests
 * with customer details, processing timeline, and user assignments.
 * 
 * FUNCTIONALITY:
 * - Date range filtering with required date selection
 * - Branch-based filtering (all branches or specific branch)
 * - Status filtering (All, Pending, Approved, Rejected, Saved)
 * - Multi-format backend response handling with robust data transformation
 * - Client-side branch name filtering for enhanced accuracy
 * - Excel and PDF export with formatted data
 * - Detailed customer information display in table format
 * - Real-time date formatting with relative time display
 * - Status visualization with colored tags
 * - Comment display for rejected/approved requests
 * 
 * API INTERACTIONS:
 * - GET /api/branches/get-all-branches: Fetches all available branches for filtering
 * - GET /api/detail-report: Retrieves detailed KYC report data with parameters:
 *   * fromDate, toDate: Date range filter (required)
 *   * status: Status filter (optional, defaults to all)
 *   * branchId: Always set to 0 for all branches, client-side filtering applied
 * - Automatic logout on 401 authentication errors
 * - Comprehensive error handling with user-friendly messages
 * 
 * DATA TRANSFORMATION:
 * - Handles multiple backend response formats:
 *   * Array of arrays (indexed data)
 *   * Array of objects with numeric keys
 *   * Array of objects with named properties
 *   * Nested response with items array
 * - Normalizes timestamp formats to ISO strings
 * - Maps various field name variations to consistent interface
 * - Client-side branch filtering by name matching
 * - Status normalization and tag generation
 * 
 * USER INTERACTIONS:
 * - Date range selection (required field)
 * - Branch dropdown selection with loading states
 * - Status dropdown selection with predefined options
 * - Search button to trigger report generation
 * - Export buttons for Excel and PDF (disabled when no data)
 * - Paginated table view with 10 items per page
 * - Horizontal scroll for responsive table display
 * 
 * STATE MANAGEMENT:
 * - Form state managed by Ant Design Form hooks
 * - Loading states for branches fetch and report generation
 * - Report data state with transformed DetailReportDto array
 * - Error handling with automatic cleanup and user feedback
 * 
 * EXPORT FEATURES:
 * - Excel export using XLSX library with flattened data structure
 * - PDF export using jsPDF with autoTable for formatted tables
 * - Timestamped file names for export organization
 * - Data validation before export to prevent empty file generation
 * 
 * ROLE-BASED ACCESS:
 * - Typically restricted to Manager/Admin roles
 * - Provides detailed oversight of KYC processing pipeline
 * - Critical for audit trails and compliance reporting
 * - Supports operational analysis and quality assurance
 * 
 * USAGE: Standalone detailed reporting page for comprehensive KYC form analysis and export
 */

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Card,
  Form,
  Select,
  Button,
  Table,
  Typography,
  Row,
  Col,
  Tag,
  message,
  DatePicker,
  Spin,
} from "antd";
import { api, Logout } from "../../services/axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
// import { AuthContext } from "../../context/AuthContext";

dayjs.extend(relativeTime);

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface DetailReportDto {
  id: number;
  sn: number;
  customerName: string;
  customerAccount: string;
  customerPhone: string;
  status: string;
  branchName: string;
  branchId?: number;
  user_name: string;
  ho_user_name: string;
  uploaded_on: string;
  comment: string;
}

interface Branch {
  branch_id: number;
  name: string;
  branch_code: string;
}

const DetailReport: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [reportData, setReportData] = useState<DetailReportDto[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(true);
  // const { USER } = useContext(AuthContext); // Not used

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    setBranchesLoading(true);
    try {
      const response = await api.get("/api/branches/get-all-branches", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setBranches(response.data || []);
    } catch (error: any) {
      console.error(error);
      message.error("Failed to fetch branches");
      if (error.response?.status === 401) await Logout();
    } finally {
      setBranchesLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const statusValue = values.status
        ? parseInt(values.status.split(",")[0])
        : null;

      // branchId parsing removed: we will request ALL branches and filter client-side by name

      if (!values.dates || !values.dates[0] || !values.dates[1]) {
        message.error("Please select a date range");
        setLoading(false);
        return;
      }

      // format dates
      const fromDate = values.dates[0].format("YYYY-MM-DD");
      const toDate = values.dates[1].format("YYYY-MM-DD");

      // Always request ALL branches from backend; do branch-specific filtering client-side by name
      const params: any = { fromDate, toDate, branchId: 0 };
      if (statusValue !== 5 && statusValue !== null)
        params.status = statusValue;

      const response = await api.get("/api/detail-report", {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const data = response.data;
      console.log("API Response:", data);
      // no debug toast

      // helper: normalize timestamp -> ISO string; return empty string when missing/invalid
      const toIso = (v: any) => {
        if (v === null || v === undefined || v === "") return "";
        if (typeof v === "string") return v;
        const d = new Date(v);
        return Number.isNaN(d.getTime()) ? "" : d.toISOString();
      };

      // helper: read numeric-indexed value from array or object with numeric keys
      const getIndexVal = (row: any, idx: number) => {
        if (Array.isArray(row)) return row[idx];
        if (!row) return undefined;
        if (Object.prototype.hasOwnProperty.call(row, idx)) return row[idx];
        const key = String(idx);
        if (Object.prototype.hasOwnProperty.call(row, key)) return row[key];
        return undefined;
      };

      const mapObjectItem = (item: any, index: number) => {
        const makeTime =
          item.make_time ??
          item.uploaded_on ??
          item.uploadedOn ??
          item.getUploadedOn ??
          item.makeTime ??
          item.created_at;
        return {
          id: item.id ?? item.requestId ?? item.getId ?? index,
          sn: index + 1,
          customerName:
            item.customer_name ??
            item.customerName ??
            item.getCustomerName ??
            "-",
          customerAccount:
            item.customer_account ??
            item.customerAccount ??
            item.getCustomerAccount ??
            "-",
          customerPhone:
            item.customer_phone ??
            item.customerPhone ??
            item.getCustomerPhone ??
            "-",
          status:
            item.status ??
            item.statusName ??
            item.status_name ??
            item.getStatus ??
            "Unknown",
          branchName:
            item.branchName ??
            item.branch_name ??
            item.branch ??
            item.getBranchName ??
            "Unknown Branch",
          user_name:
            item.user_name ??
            item.maker_user_name ??
            item.makerUsername ??
            item.getUserName ??
            "Unknown Maker",
          ho_user_name:
            item.ho_user_name ??
            item.hoUserName ??
            item.checker_username ??
            item.getHoUserName ??
            "Unknown Checker",
          uploaded_on: makeTime ? toIso(makeTime) : "",
          comment:
            item.comment ??
            item.remarks ??
            item.br_comment ??
            item.getComment ??
            "",
        } as DetailReportDto & { sn: number };
      };

      let transformed: DetailReportDto[] = [];

      if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) {
        transformed = data.map(
          (row: any, idx: number) =>
            ({
              id: getIndexVal(row, 0) ?? idx,
              sn: idx + 1,
              customerName: getIndexVal(row, 1) ?? "-",
              customerAccount: getIndexVal(row, 2) ?? "-",
              customerPhone: getIndexVal(row, 3) ?? "-",
              status: getIndexVal(row, 4) ?? "Unknown",
              // index 5 may be branch id or branch name depending on server projection
              branchName:
                typeof getIndexVal(row, 5) === "string"
                  ? getIndexVal(row, 5)
                  : "Unknown Branch",
              branchId:
                typeof getIndexVal(row, 5) === "number"
                  ? getIndexVal(row, 5)
                  : Number.isInteger(Number(getIndexVal(row, 5)))
                  ? Number(getIndexVal(row, 5))
                  : undefined,
              user_name: getIndexVal(row, 6) ?? "Unknown Maker",
              ho_user_name: getIndexVal(row, 7) ?? "Unknown Checker",
              uploaded_on: getIndexVal(row, 8)
                ? toIso(getIndexVal(row, 8))
                : "",
              comment: getIndexVal(row, 9) ?? "",
            } as DetailReportDto)
        );
      } else if (
        Array.isArray(data) &&
        data.length > 0 &&
        typeof data[0] === "object"
      ) {
        const first = data[0];
        const hasNumericKeys = Object.keys(first || {}).some((k) =>
          /^\d+$/.test(k)
        );
        if (hasNumericKeys) {
          transformed = data.map(
            (row: any, idx: number) =>
              ({
                id: getIndexVal(row, 0) ?? idx,
                sn: idx + 1,
                customerName: getIndexVal(row, 1) ?? "-",
                customerAccount: getIndexVal(row, 2) ?? "-",
                customerPhone: getIndexVal(row, 3) ?? "-",
                status: getIndexVal(row, 4) ?? "Unknown",
                branchName: getIndexVal(row, 5) ?? "Unknown Branch",
                user_name: getIndexVal(row, 6) ?? "Unknown Maker",
                ho_user_name: getIndexVal(row, 7) ?? "Unknown Checker",
                uploaded_on: getIndexVal(row, 8)
                  ? toIso(getIndexVal(row, 8))
                  : "",
                comment: getIndexVal(row, 9) ?? "",
              } as DetailReportDto)
          );
        } else {
          transformed = data.map((it: any, idx: number) => {
            const base = mapObjectItem(it, idx);
            // try to extract branch id from object if available
            const bid =
              it.branch_id ??
              it.branchId ??
              it.getBranchId ??
              it.getBranch ??
              undefined;
            return {
              ...base,
              branchId: bid !== undefined ? Number(bid) : undefined,
            } as DetailReportDto;
          });
        }
      } else if (data && Array.isArray((data as any).items)) {
        const rows = (data as any).items;
        transformed = rows.map((r: any, idx: number) => {
          const hasNumeric =
            Array.isArray(r) ||
            Object.keys(r || {}).some((k) => /^\d+$/.test(k));
          return hasNumeric
            ? ({
                id: getIndexVal(r, 0) ?? idx,
                sn: idx + 1,
                customerName: getIndexVal(r, 1) ?? "-",
                customerAccount: getIndexVal(r, 2) ?? "-",
                customerPhone: getIndexVal(r, 3) ?? "-",
                status: getIndexVal(r, 4) ?? "Unknown",
                branchName:
                  typeof getIndexVal(r, 5) === "string"
                    ? getIndexVal(r, 5)
                    : "Unknown Branch",
                branchId:
                  typeof getIndexVal(r, 5) === "number"
                    ? getIndexVal(r, 5)
                    : Number.isInteger(Number(getIndexVal(r, 5)))
                    ? Number(getIndexVal(r, 5))
                    : undefined,
                user_name: getIndexVal(r, 6) ?? "Unknown Maker",
                ho_user_name: getIndexVal(r, 7) ?? "Unknown Checker",
                uploaded_on: getIndexVal(r, 8) ? toIso(getIndexVal(r, 8)) : "",
                comment: getIndexVal(r, 9) ?? "",
              } as DetailReportDto)
            : mapObjectItem(r, idx);
        });
      }

      // Client-side filtering: derive selected branch name from the form value and filter by branchName
      let finalData = transformed;
      const selectedBranchName = (() => {
        const v = values.Branch;
        if (!v) return undefined;
        if (typeof v === "string") {
          const parts = v.split(",");
          if (parts.length >= 2) return parts.slice(1).join(",").trim();
          return v.trim();
        }
        if (typeof v === "number") {
          const b = branches.find((b) => b.branch_id === v);
          return b?.name;
        }
        return undefined;
      })();

      if (selectedBranchName && !/^\s*all/i.test(selectedBranchName)) {
        const needle = selectedBranchName.toString().trim().toLowerCase();
        finalData = transformed.filter((t) => {
          const bn = (t.branchName || "").toString().trim().toLowerCase();
          return bn.includes(needle) || needle.includes(bn);
        });
      }

      setReportData(finalData);
      message.success(`Found ${finalData.length} records`);
    } catch (err: any) {
      console.error("API Error:", err);
      if (err.response?.status === 401) await Logout();
      else
        message.error(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch report data"
        );
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case "Pending":
        return <Tag color="orange">Pending</Tag>;
      case "Approved":
        return <Tag color="green">Approved</Tag>;
      case "Rejected":
        return <Tag color="red">Rejected</Tag>;
      case "Saved":
        return <Tag color="blue">Saved</Tag>;
      default:
        return <Tag color="default">Unknown</Tag>;
    }
  };

  const columns = [
    {
      title: "SN",
      dataIndex: "sn",
      key: "sn",
      width: 50,
    },
    {
      title: "Branch",
      dataIndex: "branchName",
      key: "branchName",
      width: 160,
      render: (v: string) => v || "-",
    },
    {
      title: "Customer Information",
      key: "customerInfo",
      width: 300,
      render: (record: DetailReportDto) => (
        <div>
          <div>
            <strong>Name:</strong> {record.customerName}
          </div>
          <div>
            <strong>Account:</strong> {record.customerAccount}
          </div>
          <div>
            <strong>Phone:</strong> {record.customerPhone}
          </div>
        </div>
      ),
    },
    {
      title: "Uploaded On",
      dataIndex: "uploaded_on",
      key: "uploaded_on",
      width: 180,
      render: (v: string) => (
        <div>
          {v ? (
            <>
              <div>{dayjs(v).format("YYYY-MM-DD HH:mm")}</div>
              <Text type="secondary">{dayjs(v).fromNow()}</Text>
            </>
          ) : (
            <div>-</div>
          )}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 160,
      render: (status: string, record: DetailReportDto) => (
        <div>
          {getStatusTag(status)}
          {record.comment && record.comment !== "No comments" && (
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">Comment: {record.comment}</Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Users",
      key: "users",
      width: 200,
      render: (record: DetailReportDto) => (
        <div>
          <div>
            <strong>Maker:</strong> {record.user_name}
          </div>
          <div>
            <strong>Checker:</strong> {record.ho_user_name}
          </div>
        </div>
      ),
    },
  ];

  // Export as Excel
  const handleExportExcel = () => {
    if (!reportData.length) {
      message.warning("No data to export");
      return;
    }
    // Flatten for Excel
    const excelData = reportData.map((row) => ({
      SN: row.sn,
      Branch: row.branchName,
      "Customer Name": row.customerName,
      "Customer Account": row.customerAccount,
      "Customer Phone": row.customerPhone,
      "Uploaded On": row.uploaded_on,
      Status: row.status,
      Comment: row.comment,
      Maker: row.user_name,
      Checker: row.ho_user_name,
    }));
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DetailReport");
    XLSX.writeFile(
      wb,
      `DetailReport_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`
    );
  };

  // Export as PDF
  const handleExportPDF = () => {
    if (!reportData.length) {
      message.warning("No data to export");
      return;
    }
    const doc = new jsPDF();
    const columns = [
      "SN",
      "Branch",
      "Customer Name",
      "Customer Account",
      "Customer Phone",
      "Uploaded On",
      "Status",
      "Comment",
      "Maker",
      "Checker",
    ];
    const rows = reportData.map((row) => [
      row.sn,
      row.branchName,
      row.customerName,
      row.customerAccount,
      row.customerPhone,
      row.uploaded_on,
      row.status,
      row.comment,
      row.user_name,
      row.ho_user_name,
    ]);
    autoTable(doc, { head: [columns], body: rows });
    doc.save(`DetailReport_${dayjs().format("YYYYMMDD_HHmmss")}.pdf`);
  };

  return (
    <Card>
      <Title level={2}>DETAIL REPORT</Title>
      <Row gutter={16} style={{ marginBottom: 16 }}>
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

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ status: "5,All status", Branch: "0,ALL Branch,0" }}
      >
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
          <Col xs={24} md={10}>
            <Form.Item name="status" label="Request Status">
              <Select>
                <Option value="5,All status">All Status</Option>
                <Option value="1,Pending">Pending</Option>
                <Option value="2,Approved">Approved</Option>
                <Option value="3,Rejected">Rejected</Option>
                <Option value="4,Saved">Saved</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={10}>
            <Form.Item
              name="Branch"
              label="Branch *"
              rules={[{ required: true, message: "Please select branch" }]}
            >
              <Select
                loading={branchesLoading}
                placeholder={
                  branchesLoading ? "Loading branches..." : "Select branch"
                }
              >
                <Option value="0,ALL Branch,0">ALL Branch</Option>
                {branches.map((b) => (
                  <Option key={b.branch_id} value={`${b.branch_id},${b.name}`}>
                    {b.name}
                  </Option>
                ))}
              </Select>
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

      {loading ? (
        <div style={{ textAlign: "center", padding: "24px" }}>
          <Spin size="large" />
        </div>
      ) : reportData.length > 0 ? (
        <div style={{ marginTop: 24 }}>
          <Title level={4}>List of Applicants Detail Report</Title>
          <Table
            columns={columns}
            dataSource={reportData}
            rowKey="id"
            loading={loading}
            scroll={{ x: 1000 }}
            pagination={{ pageSize: 10 }}
          />
        </div>
      ) : (
        <div style={{ marginTop: 24, textAlign: "center", padding: "20px" }}>
          <Text type="secondary">
            No data available. Select filters and click Search to load data.
          </Text>
        </div>
      )}
    </Card>
  );
};

export default DetailReport;
