/**
 * PendingMakeFormTable - Read-only display of pending KYC forms
 *
 * Displays pending KYC forms created by current maker with view-only functionality.
 *
 * FUNCTIONALITY:
 * - Fetches pending KYC forms via getPendingMakes API
 * - Date filtering (defaults to current month)
 * - Single action: View form details in modal
 * - Pagination with React Query caching
 *
 * DATA FLOW:
 * - API: GET /makeForm/getPending → getPendingMakes(date, userId, pageSize, pageNumber)
 * - Returns: pageableReturn with makes array and total count
 * - Query key: ["makes", date, pageNumber, pageSize]
 *
 * STATE:
 * - modal: allTableDataType - selected row data for ViewModal
 * - isModalOpen: boolean - ViewModal visibility
 * - date: Date - filter for pending requests
 * - pageSize/pageNumber: pagination state
 *
 * INTERACTIONS:
 * - Date selection via DateDropDown
 * - View action opens ViewModal with form details
 * - Pagination controls for navigation
 */

import { useContext, useRef, useState } from "react";
import { Button, Flex, Spin, Table } from "antd";
import type { MenuProps, TableColumnsType } from "antd";
import DateDropDown from "../Helper/DateDropdown/DateDropDown";
import { EyeOutlined } from "@ant-design/icons";
import ViewModal from "../Helper/RequestModals/ViewModal";
import DropDown from "../Helper/DateDropdown/DropDown";
import RequestTables from "../Helper/Table/RequestTables";
import { getPendingMakes } from "../../services/MakeForm";
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
const PendingMakeFormTable = () => {
  const today = new Date();
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
  const ref = useRef<SearchBoxHandle>(null);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const onchange = (pageNo: number, pageSi: number) => {
    setPageNumber(pageNo);
    setPageSize(pageSi);
  };
  const { data, isLoading, isError, isSuccess, error } = useQuery({
    queryKey: ["makes", date, pageNumber, pageSize],
    queryFn: () =>
      getPendingMakes(date, USER?.user?.userId, pageSize, pageNumber, search),
  });

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Pending Makes</h1>
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

export default PendingMakeFormTable;
