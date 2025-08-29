
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
import { api, Logout } from "../../services/axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
// import { AuthContext } from "../../context/AuthContext";

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
  // const USER = useContext(AuthContext);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    setBranchesLoading(true);
    try {
      // Adjust this endpoint based on your actual API
      const response = await api.get("/api/branches/get-all-branches", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      // Assuming the response structure matches your backend
      setBranches(response.data);
    } catch (error: any) {
      console.error(error);
      message.error("Failed to fetch branches");
    } finally {
      setBranchesLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Check if dates are selected
      if (!values.dates || !values.dates[0] || !values.dates[1]) {
        message.error("Please select a date range");
        setLoading(false);
        return;
      }

      // Extract values from the form

      // Format dates from RangePicker
      const fromDate = values.dates[0].format("YYYY-MM-DD");
      const toDate = values.dates[1].format("YYYY-MM-DD");

      // Always request ALL branches from backend; do branch-specific filtering client-side by name
      const params: any = { fromDate, toDate, branchId: 0 };
      console.log("API Parameters:", params);

      // Call the backend API
      const response = await api.get("/api/summary-report", {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      console.log("API Response:", response.data);

      const raw = response.data;
      const rows: any[] = Array.isArray(raw)
        ? raw
        : raw && Array.isArray(raw.items)
        ? raw.items
        : [];

      // map rows to SummaryReportDto shape, accepting getter-style keys
      const mapped = rows.map((item: any) => {
        const branchName =
          item.branchName ??
          item.branch_name ??
          item.getBranchName ??
          item.getBranch ??
          "Unknown Branch";
        const pendingCount =
          Number(
            item.pendingCount ??
              item.getPendingCount ??
              item.getPending ??
              item.pending ??
              0
          ) || 0;
        const approvedCount =
          Number(
            item.approvedCount ??
              item.getApprovedCount ??
              item.getApproved ??
              item.approved ??
              0
          ) || 0;
        const rejectedCount =
          Number(
            item.rejectedCount ??
              item.getRejectedCount ??
              item.getRejected ??
              item.rejected ??
              0
          ) || 0;
        const savedCount =
          Number(
            item.savedCount ??
              item.getSavedCount ??
              item.getSaved ??
              item.saved ??
              0
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

      // Client-side filtering: derive selected branch name from the form value and filter by branchName
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

      // Calculate totals defensively from the (possibly filtered) finalMapped
      const pendingTotal = finalMapped.reduce(
        (sum, item) => sum + (Number(item.pendingCount) || 0),
        0
      );
      const approvedTotal = finalMapped.reduce(
        (sum, item) => sum + (Number(item.approvedCount) || 0),
        0
      );
      const rejectedTotal = finalMapped.reduce(
        (sum, item) => sum + (Number(item.rejectedCount) || 0),
        0
      );
      const savedTotal = finalMapped.reduce(
        (sum, item) => sum + (Number(item.savedCount) || 0),
        0
      );
      const allTotal = finalMapped.reduce(
        (sum, item) => sum + (Number(item.totalRecords) || 0),
        0
      );

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
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch report data"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Export Excel
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

  // Export PDF
  const handleExportPDF = () => {
    if (!reportData.length) {
      message.warning("No data to export");
      return;
    }
    const doc = new jsPDF();
    const columns = [
      "Branch",
      "Pending",
      "Approved",
      "Rejected",
      "Saved",
      "Total",
    ];
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
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      width: 50,
      render: (_text: string, _record: any, index: number) => index + 1,
    },
    {
      title: "Branch",
      dataIndex: "branchName",
      key: "branchName",
      width: 100,
    },
    {
      title: "Pending",
      dataIndex: "pendingCount",
      key: "pendingCount",
      width: 100,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: "Approved",
      dataIndex: "approvedCount",
      key: "approvedCount",
      width: 100,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: "Rejected",
      dataIndex: "rejectedCount",
      key: "rejectedCount",
      width: 100,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: "Saved",
      dataIndex: "savedCount",
      key: "savedCount",
      width: 100,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: "Total",
      dataIndex: "totalRecords",
      key: "totalRecords",
      width: 100,
      render: (value: number) => value.toLocaleString(),
    },
  ];

  return (
    <Card>
      <Title level={2}>SUMMARY REPORT</Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          Branch: "0,ALL Branch",
        }}
      >
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item
              name="dates"
              label="Date Range *"
              rules={[{ required: true, message: "Please select date range" }]}
            >
              <RangePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
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
                <Option value="0,ALL Branch">ALL Branch</Option>
                {branches.map((branch) => (
                  <Option
                    key={branch.branch_id}
                    value={`${branch.branch_id},${branch.name}`}
                  >
                    {branch.name}
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

      {reportData.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <Title level={4}>List of Applicants Summary Report</Title>

          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={4}>
              <Statistic title="Total Pending" value={totals.pending} />
            </Col>
            <Col span={4}>
              <Statistic title="Total Approved" value={totals.approved} />
            </Col>
            <Col span={4}>
              <Statistic title="Total Rejected" value={totals.rejected} />
            </Col>
            <Col span={4}>
              <Statistic title="Total Saved" value={totals.saved} />
            </Col>
            <Col span={4}>
              <Statistic title="Grand Total" value={totals.all} />
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
            scroll={{ x: 800 }}
            pagination={{ pageSize: 10 }}
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={2}>
                  <strong>Total</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <strong>{totals.pending.toLocaleString()}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  <strong>{totals.approved.toLocaleString()}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                  <strong>{totals.rejected.toLocaleString()}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}>
                  <strong>{totals.saved.toLocaleString()}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5}>
                  <strong>{totals.all.toLocaleString()}</strong>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
        </div>
      )}
    </Card>
  );
};

export default SummaryReport;
