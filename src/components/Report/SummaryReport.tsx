
/**
 * SUMMARY REPORT COMPONENT
 * 
 * PURPOSE:
 * Aggregated reporting interface for KYC form statistics by branch with comprehensive
 * filtering, role-based data access, and export capabilities. Provides high-level
 * overview of KYC processing performance across organizational branches.
 * 
 * FUNCTIONALITY:
 * - Date range filtering with required date selection
 * - Role-based branch access (District users see only their branches)
 * - Branch-specific filtering with client-side name matching
 * - Automatic status count aggregation (Pending, Approved, Rejected, Saved)
 * - Real-time totals calculation with summary statistics
 * - Excel and PDF export with formatted data
 * - Paginated table with summary row totals
 * - Number formatting with locale-specific separators
 * 
 * API INTERACTIONS:
 * - GET /api/branches/get-all-branches: Fetches all branches for non-District roles
 * - GET /api/branches/get-my-branches: Fetches user's assigned branches for District role
 * - GET /api/summary-report: Retrieves aggregated KYC statistics with parameters:
 *   * fromDate, toDate: Date range filter (required)
 *   * branchId: Always set to 0 for all branches, client-side filtering applied
 * - Automatic logout on 401 authentication errors
 * - Comprehensive error handling with user-friendly messages
 * 
 * DATA TRANSFORMATION:
 * - Handles multiple backend response formats (array or nested items)
 * - Maps various field name variations to consistent SummaryReportDto interface
 * - Normalizes numeric values with fallback to 0
 * - Calculates total records from individual status counts when not provided
 * - Client-side branch filtering by name matching for enhanced accuracy
 * - Aggregates totals across all filtered branches for summary display
 * 
 * USER INTERACTIONS:
 * - Date range selection (required field)
 * - Branch dropdown selection with role-based options
 * - Search button to trigger report generation
 * - Export buttons for Excel and PDF (disabled when no data)
 * - Summary statistics cards showing aggregated totals
 * - Paginated table view with 10 items per page
 * - Table summary row with bold totals
 * 
 * STATE MANAGEMENT:
 * - Form state managed by Ant Design Form hooks
 * - Loading states for branches fetch and report generation
 * - Report data state with transformed SummaryReportDto array
 * - Totals state for aggregated statistics display
 * - Role-based branch fetching logic in useEffect
 * 
 * ROLE-BASED ACCESS:
 * - District role: Limited to assigned branches via /get-my-branches endpoint
 * - Other roles: Access to all branches via /get-all-branches endpoint
 * - Provides appropriate data scope based on user permissions
 * - Critical for organizational hierarchy and data security
 * 
 * EXPORT FEATURES:
 * - Excel export using XLSX library with branch statistics
 * - PDF export using jsPDF with autoTable for formatted display
 * - Timestamped file names for export organization
 * - Data validation before export to prevent empty file generation
 * 
 * USAGE: Standalone summary reporting page for high-level KYC processing analytics
 */

import { useState, useEffect } from "react";
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
import { api, Logout } from "../../services/axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface SummaryReportDto {
  branchName: string;
  totalRecords: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  savedCount: number;
}

interface Branch {
  branch_id: number;
  name: string;
  branch_code: string;
}

const SummaryReport = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(true);
  const [reportData, setReportData] = useState<SummaryReportDto[]>([]);
  const [totals, setTotals] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    saved: 0,
    all: 0,
  });

  // Determine whether to fetch district branches or all branches
  useEffect(() => {
    const role = localStorage.getItem("role"); // or get from context
    if (role === "District") {
      fetchDistrictBranches();
    } else {
      fetchBranches();
    }
  }, []);

  const fetchBranches = async () => {
    setBranchesLoading(true);
    try {
      const response = await api.get("/api/branches/get-all-branches", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setBranches(response.data);
    } catch (error: any) {
      console.error(error);
      message.error("Failed to fetch branches");
    } finally {
      setBranchesLoading(false);
    }
  };

  const fetchDistrictBranches = async () => {
    setBranchesLoading(true);
    try {
      const response = await api.get("/api/branches/get-my-branches", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setBranches(response.data);
    } catch (error: any) {
      console.error(error);
      message.error("Failed to fetch branches for district");
    } finally {
      setBranchesLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      if (!values.dates || !values.dates[0] || !values.dates[1]) {
        message.error("Please select a date range");
        setLoading(false);
        return;
      }

      const fromDate = values.dates[0].format("YYYY-MM-DD");
      const toDate = values.dates[1].format("YYYY-MM-DD");

      const params: any = { fromDate, toDate, branchId: 0 };
      console.log("API Parameters:", params);

      const response = await api.get("/api/summary-report", {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const raw = response.data;
      const rows: any[] = Array.isArray(raw)
        ? raw
        : raw && Array.isArray(raw.items)
        ? raw.items
        : [];

      const mapped = rows.map((item: any) => {
        const branchName =
          item.branchName ??
          item.branch_name ??
          item.getBranchName ??
          item.getBranch ??
          "Unknown Branch";
        const pendingCount =
          Number(
            item.pendingCount ?? item.getPendingCount ?? item.getPending ?? item.pending ?? 0
          ) || 0;
        const approvedCount =
          Number(
            item.approvedCount ?? item.getApprovedCount ?? item.getApproved ?? item.approved ?? 0
          ) || 0;
        const rejectedCount =
          Number(
            item.rejectedCount ?? item.getRejectedCount ?? item.getRejected ?? item.rejected ?? 0
          ) || 0;
        const savedCount =
          Number(
            item.savedCount ?? item.getSavedCount ?? item.getSaved ?? item.saved ?? 0
          ) || 0;
        const totalRecords =
          Number(
            item.totalRecords ??
              item.getTotalRecords ??
              item.total ??
              pendingCount + approvedCount + rejectedCount + savedCount
          ) || pendingCount + approvedCount + rejectedCount + savedCount;

        return {
          branchName,
          pendingCount,
          approvedCount,
          rejectedCount,
          savedCount,
          totalRecords,
        } as SummaryReportDto;
      });

      let finalMapped = mapped;
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
        finalMapped = mapped.filter((m) => {
          const bn = (m.branchName || "").toString().trim().toLowerCase();
          return bn.includes(needle) || needle.includes(bn);
        });
      }

      setReportData(finalMapped);

      const pendingTotal = finalMapped.reduce((sum, item) => sum + (Number(item.pendingCount) || 0), 0);
      const approvedTotal = finalMapped.reduce((sum, item) => sum + (Number(item.approvedCount) || 0), 0);
      const rejectedTotal = finalMapped.reduce((sum, item) => sum + (Number(item.rejectedCount) || 0), 0);
      const savedTotal = finalMapped.reduce((sum, item) => sum + (Number(item.savedCount) || 0), 0);
      const allTotal = finalMapped.reduce((sum, item) => sum + (Number(item.totalRecords) || 0), 0);

      setTotals({
        pending: pendingTotal,
        approved: approvedTotal,
        rejected: rejectedTotal,
        saved: savedTotal,
        all: allTotal,
      });

      message.success(`Found ${finalMapped.length} records`);
    } catch (error: any) {
      console.error("API Error:", error);
      if (error.response?.status === 401) {
        await Logout();
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
      Branch: r.branchName,
      Pending: r.pendingCount,
      Approved: r.approvedCount,
      Rejected: r.rejectedCount,
      Saved: r.savedCount,
      Total: r.totalRecords,
    }));
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SummaryReport");
    XLSX.writeFile(wb, `SummaryReport_${new Date().toISOString()}.xlsx`);
  };

  const handleExportPDF = () => {
    if (!reportData.length) {
      message.warning("No data to export");
      return;
    }
    const doc = new jsPDF();
    const columns = ["Branch", "Pending", "Approved", "Rejected", "Saved", "Total"];
    const rows = reportData.map((r) => [
      r.branchName,
      r.pendingCount,
      r.approvedCount,
      r.rejectedCount,
      r.savedCount,
      r.totalRecords,
    ]);
    autoTable(doc, { head: [columns], body: rows });
    doc.save(`SummaryReport_${new Date().toISOString()}.pdf`);
  };

  const columns = [
    { title: "#", dataIndex: "index", key: "index", width: 50, render: (_text: string, _record: any, index: number) => index + 1 },
    { title: "Branch", dataIndex: "branchName", key: "branchName", width: 100 },
    { title: "Pending", dataIndex: "pendingCount", key: "pendingCount", width: 100, render: (value: number) => value.toLocaleString() },
    { title: "Approved", dataIndex: "approvedCount", key: "approvedCount", width: 100, render: (value: number) => value.toLocaleString() },
    { title: "Rejected", dataIndex: "rejectedCount", key: "rejectedCount", width: 100, render: (value: number) => value.toLocaleString() },
    { title: "Saved", dataIndex: "savedCount", key: "savedCount", width: 100, render: (value: number) => value.toLocaleString() },
    { title: "Total", dataIndex: "totalRecords", key: "totalRecords", width: 100, render: (value: number) => value.toLocaleString() },
  ];

  return (
    <Card>
      <Title level={2}>SUMMARY REPORT</Title>

      <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ Branch: "0,ALL Branch" }}>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item name="dates" label="Date Range *" rules={[{ required: true, message: "Please select date range" }]}>
              <RangePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="Branch" label="Branch *" rules={[{ required: true, message: "Please select branch" }]}>
              <Select loading={branchesLoading} placeholder={branchesLoading ? "Loading branches..." : "Select branch"}>
                <Option value="0,ALL Branch">ALL Branch</Option>
                {branches.map((branch) => (
                  <Option key={branch.branch_id} value={`${branch.branch_id},${branch.name}`}>
                    {branch.name}
                  </Option>
                ))}
              </Select>
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
          <Title level={4}>List of Applicants Summary Report</Title>

          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={4}><Statistic title="Total Pending" value={totals.pending} /></Col>
            <Col span={4}><Statistic title="Total Approved" value={totals.approved} /></Col>
            <Col span={4}><Statistic title="Total Rejected" value={totals.rejected} /></Col>
            <Col span={4}><Statistic title="Total Saved" value={totals.saved} /></Col>
            <Col span={4}><Statistic title="Grand Total" value={totals.all} /></Col>
          </Row>

          <Row gutter={8} style={{ marginBottom: 12 }}>
            <Col><Button onClick={handleExportExcel} disabled={!reportData.length}>Download as Excel</Button></Col>
            <Col><Button onClick={handleExportPDF} disabled={!reportData.length}>Download as PDF</Button></Col>
          </Row>

          <Table
            columns={columns}
            dataSource={reportData}
            loading={loading}
            scroll={{ x: 800 }}
            pagination={{ pageSize: 10 }}
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={2}><strong>Total</strong></Table.Summary.Cell>
                <Table.Summary.Cell index={1}><strong>{totals.pending.toLocaleString()}</strong></Table.Summary.Cell>
                <Table.Summary.Cell index={2}><strong>{totals.approved.toLocaleString()}</strong></Table.Summary.Cell>
                <Table.Summary.Cell index={3}><strong>{totals.rejected.toLocaleString()}</strong></Table.Summary.Cell>
                <Table.Summary.Cell index={4}><strong>{totals.saved.toLocaleString()}</strong></Table.Summary.Cell>
                <Table.Summary.Cell index={5}><strong>{totals.all.toLocaleString()}</strong></Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
        </div>
      )}
    </Card>
  );
};

export default SummaryReport;
