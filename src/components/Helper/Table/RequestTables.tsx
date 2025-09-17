/**
 * REQUEST TABLES COMPONENT
 * 
 * TYPE: Reusable Helper Component
 * PURPOSE: Provides a standardized table for displaying KYC form requests with pagination
 * 
 * FUNCTIONALITY:
 * - Reusable table component for KYC form data display
 * - Standard columns: CIF, Customer Account, Name, Phone, Made At, Checked At, Checker Name, Status
 * - Status rendering with colored tags (Draft/Pending/Accepted/Rejected)
 * - Date formatting using ExtractDate utility function
 * - Conditional rendering for empty checker names and dates
 * - Pagination support with configurable page size
 * - Custom column injection via colums prop, so that we can inject action columns
 * 
 * DATA HANDLING:
 * - Accepts allTableDataType[] array as data source
 * - Merges standard columns with optional custom columns
 * - Handles pagination state and callbacks
 * - Date validation and formatting for display — if checkedAt is null or checkedAt is greater than current date, it will display "---------"
 * 
 * USER INTERACTIONS:
 * - Pagination controls (page navigation and size change)
 * - Custom action columns can be injected
 * - Sortable columns based on the madeAt column
 * 
 * USAGE:
 * - Used by AllMakeFormTable, CheckerApprovedTable, and other table pages
 * - Provides consistent table styling and behavior across the app
 * - Reduces code duplication for common table functionality
 * 
 * PROPS:
 * - data: Array of KYC form records
 * - colums: Optional additional columns (typically action columns)
 * - pageSize, pageNumber, total: Pagination configuration
 * - onChange: Callback for pagination changes
 */

import { Flex, Table, TableColumnsType, Tag } from "antd";
import { allTableDataType } from "../../MakeForm/AllMakeFormTable";
import { ExtractDate } from "../../../services/DisplayFunctions";

interface dataSource {
  data: allTableDataType[];
  colums?: TableColumnsType<allTableDataType>;
  pageSize: number;
  pageNumber: number;
  total: number;
  onChange: (pageNo: number, pageSi: number) => void;
}

export const columns: TableColumnsType<allTableDataType> = [
    { title: "Cif", dataIndex: "cif" },
    { title: "Customer Account", dataIndex: "customerAccount" },
    { title: "Customer Name", dataIndex: "customerName" },
    { title: "Customer Phone", dataIndex: "customerPhone" },
    {
      title: "Made At",
      dataIndex: "madeAt",
      render: (madeAt) => <Flex justify="center">{ExtractDate(madeAt)}</Flex>,
      sorter: (a, b) => new Date(a.madeAt).getTime() - new Date(b.madeAt).getTime(),
      sortDirections: ['descend', 'ascend'],
      defaultSortOrder: 'descend',
    },
    {
      title: "Checked At",
      dataIndex: "checkedAt",
      render: (checkedAt) => (
        <Flex justify="center">
          {new Date(checkedAt) > new Date() || !checkedAt
            ? "---------"
            : ExtractDate(checkedAt)}
        </Flex>
      ),
    },
    {
      title: "Checker Name",
      dataIndex: "hoName",
      render: (hoName) =>
        hoName === null || hoName === " " ? (
          <Flex justify="center" align="center">
            ---------
          </Flex>
        ) : (
          hoName
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: number) =>
        status === 0 ? (
          <Tag color="yellow">In Drafts</Tag>
        ) : status === 1 ? (
          <Tag color="blue">Pending</Tag>
        ) : status === 2 ? (
          <Tag color="green">Accepted</Tag>
        ) : (
          <Tag color="red">Rejected</Tag>
        ),
    },
  ];

const RequestTables = (dataSource: dataSource) => {
  
  return (
    <Table<allTableDataType>
      columns={
        dataSource.colums ? [...columns, ...dataSource.colums] : [...columns]
      }
      dataSource={dataSource.data}
      pagination={{
        showSizeChanger: true,
        current: dataSource.pageNumber,
        pageSize: dataSource.pageSize,
        total: dataSource.total,
        onChange: (page: number, pageSize: number) => {
          dataSource.onChange(page, pageSize);
        },
      }}
    />
  );
};

export default RequestTables;
