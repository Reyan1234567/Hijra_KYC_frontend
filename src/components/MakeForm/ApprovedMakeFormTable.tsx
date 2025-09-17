/**
 * APPROVED MAKE FORM TABLE COMPONENT
 *
 * TYPE: Page Component (Maker Role)
 * PURPOSE: Displays approved KYC forms created by the current maker user
 *
 * FUNCTIONALITY:
 * - Fetches approved KYC forms (status 2) created by the current maker
 * - Provides date filtering for approved requests (defaults to current month)
 * - View-only actions for approved forms (no editing allowed)
 * - Pagination support with React Query caching
 * - Loading, error, empty, and success states
 * - Real-time data updates via React Query
 *
 * DATA FETCHING:
 * - API: GET /makeForm/getApproved - fetches approved KYC forms by maker with status 2
 * - Service: getApprovedMakes(date, userId, pageSize, pageNumber)
 * - Parameters: date (filter), makerId (current user), pageSize, pageNumber
 * - Returns: pageableReturn with makes array and total count
 * - Uses React Query with cache key ["makes", date, pageNumber, pageSize]
 *
 * USER INTERACTIONS:
 * - Date selection via DateDropDown component
 * - View action in dropdown menu per table row
 * - Modal interactions:
 *   - ViewModal: Read-only form details display
 *   - EditModal: Present but not accessible for approved forms
 * - Pagination controls for navigating through results
 *
 * STATE MANAGEMENT:
 * - modal: allTableDataType - stores selected row data for modals
 * - isModalOpen: boolean - controls ViewModal visibility
 * - editModal: boolean - controls EditModal visibility (unused for approved)
 * - pageSize/pageNumber: pagination state
 * - Uses React Query for data fetching and caching
 *
 * LIFECYCLE:
 * - Mounts with current month date filter
 * - React Query handles data fetching, caching, and refetching
 * - Updates automatically when date or pagination changes
 * - Provides historical view of maker's approved work
 *
 * ROLE PERMISSIONS: Maker users only
 * ROUTING: Accessed via /approvedMakeFormTable route
 */

import { useContext, useRef, useState } from "react";
import { Button, Flex, message, Spin, Table } from "antd";
import type { MenuProps, TableColumnsType } from "antd";
import DateDropDown from "../Helper/DateDropdown/DateDropDown";
import { EyeOutlined } from "@ant-design/icons";

import ViewModal from "../Helper/RequestModals/ViewModal";
import DropDown from "../Helper/DateDropdown/DropDown";
import RequestTables from "../Helper/Table/RequestTables";
import { getApprovedMakes } from "../../services/MakeForm";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import SearchBox, { SearchBoxHandle } from "../SearchBox";

export interface imageReturn {
  id: number;
  url: string;
  description: string;
  descriptionCopy: string;
  make_id: string;
}

export interface allTableDataType {
  id: number;
  makerId: number;
  makeId: number;
  makerName: string;
  madeAt: Date;
  checkedAt: Date;
  assignedAt: Date;
  hoId: number;
  hoName: string;
  cif: string;
  customerAccount: string;
  customerName: string;
  customerPhone: string;
  images: imageReturn[];
  status: number;
  backReason: string;
}

export interface egami {
  description: string;
  file: string;
  url: string;
}

export interface pageableReturn {
  makes: allTableDataType[];
  total: number;
}
const ApprovedMakeFormTable = () => {
  const today = new Date();
  const [_, contextHolder] = message.useMessage();
  const [search, setSearch] = useState("");
  const [date, setDate] = useState(
    new Date(today.setMonth(today.getMonth(), 1))
  );
  date.setHours(0, 0, 0, 0);
  const view: MenuProps["items"] = [
    {
      label: "View",
      key: "1",
      icon: <EyeOutlined />,
      onClick: () => {
        setIsModalOpen(true);
      },
    },
  ];

  const [modal, setModal] = useState<allTableDataType>({
    id: 0,
    makerId: 0,
    makeId: 0,
    makerName: "",
    madeAt: new Date(),
    checkedAt: new Date(),
    assignedAt: new Date(),
    hoId: 0,
    hoName: "",
    cif: "",
    customerAccount: "",
    customerName: "",
    customerPhone: "",
    images: [],
    status: 0,
    backReason: "",
  });

  const columns: TableColumnsType<allTableDataType> = [
    {
      title: "Actions",
      dataIndex: "status",
      render: (_, row: allTableDataType) => {
        return (
          <Flex justify="center" align="center">
            <DropDown menu={view} onChange={() => setModal(row)} />
          </Flex>
        );
      },
    },
  ];

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const USER = useContext(AuthContext);
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const ref = useRef<SearchBoxHandle>(null);
  const onchange = (pageNo: number, pageSi: number) => {
    setPageNumber(pageNo);
    setPageSize(pageSi);
  };
  const { data, isLoading, isError, isSuccess, error } = useQuery({
    queryKey: ["makes", date, pageNumber, pageSize, search],
    queryFn: () =>
      getApprovedMakes(date, USER?.user?.userId, pageSize, pageNumber, search),
  });
  return (
    <>
      {contextHolder}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Approved Makes</h1>
        <DateDropDown date={date} setDate={setDate} />
      </div>
      <div
        style={{
          display: "flex",
          alignContent: "center",
          alignItems: "center",
          gap: "30px",
        }}
      >
        <h2>Search:</h2>
        <SearchBox setState={setSearch} ref={ref} />
        <Button
          danger
          disabled={search == ""}
          onClick={() => {
            if (ref.current) {
              ref.current.clear();
            }
            setSearch("");
          }}
        >
          Cancel
        </Button>
      </div>
      {isLoading && (
        <Spin
          style={{ position: "absolute", left: "50%", top: "50%" }}
          size="large"
        />
      )}
      {(isError || data?.data === undefined) && (
        <p style={{ position: "absolute", left: "50%", top: "50%" }}>
          Something went wrong{error ? error.message : ""}
        </p>
      )}
      {isSuccess && data.data.makes.length === 0 && (
        <>
          <Table<allTableDataType> dataSource={[]} />
        </>
      )}
      {isSuccess && data.data.makes.length > 0 && (
        <>
          <Flex gap="middle" vertical>
            <RequestTables
              data={data.data.makes}
              colums={columns}
              pageSize={pageSize}
              pageNumber={pageNumber}
              total={data.data.total}
              onChange={onchange}
            />
          </Flex>
          <ViewModal
            handleCancel={handleCancel}
            isModalOpen={isModalOpen}
            modal={modal}
          />
        </>
      )}
    </>
  );
};

export default ApprovedMakeFormTable;
