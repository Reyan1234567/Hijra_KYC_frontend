/**
 * KycManagerApprovedTable - Read-only approved KYC requests display
 *
 * Simple table showing approved KYC requests with view-only access for managers.
 *
 * FUNCTIONALITY:
 * - Fetches approved requests via GET /makeForm/manager/approved
 * - Date filtering with DateDropDown (defaults to current month)
 * - View action opens ViewModal for form details
 * - Pagination with RequestTables component
 * - Manual state management with useEffect
 *
 * STATE MANAGEMENT:
 * - makeRequests: pageableReturn - API data (makes array + total)
 * - viewModal: boolean - controls ViewModal visibility
 * - modal: allTableDataType - selected row for ViewModal
 * - date/pageSize/pageNumber: filter and pagination
 * - state: "loading"|"empty"|"success"|"error" - UI state
 * - trigger: number - forces re-fetch when incremented
 *
 * TABLE STRUCTURE:
 * - Maker column: displays makerName
 * - Action column: single "View" dropdown for all rows
 * - Uses RequestTables for pagination and rendering
 * - ViewModal for read-only form inspection
 */

import {
  Button,
  Flex,
  MenuProps,
  Spin,
  Table,
  TableColumnsType,
} from "antd";
import RequestTables from "../Helper/Table/RequestTables";
import { useContext, useEffect, useRef, useState } from "react";
import { api } from "../../services/axios";
import DateDropDown from "../Helper/DateDropdown/DateDropDown";
import { allTableDataType, pageableReturn } from "../MakeForm/AllMakeFormTable";
import DropDown from "../Helper/DateDropdown/DropDown";
import { EyeOutlined } from "@ant-design/icons";
import ViewModal from "../Helper/RequestModals/ViewModal";
import { AuthContext } from "../../context/AuthContext";
import SearchBox, { SearchBoxHandle } from "../SearchBox";

const KycManagerApprovedTable = () => {
  // const [ /*messageApi*/ contextHolder] = message.useMessage();
  const today = new Date();
  const [search, setSearch] = useState("");
  const [viewModal, setViewModal] = useState(false);
  const [date, setDate] = useState(
    new Date(today.setMonth(today.getMonth(), 1))
  );
  date.setHours(0, 0, 0, 0);
  const USER = useContext(AuthContext);
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

  const [makeRequests, setMakeRequests] = useState<pageableReturn>({
    makes: [],
    total: 0,
  });
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const ref = useRef<SearchBoxHandle>(null);
  const onchange = (pageNo: number, pageSi: number) => {
    setPageNumber(pageNo);
    setPageSize(pageSi);
  };
  const [state, setState] = useState<"empty" | "loading" | "success" | "error">(
    "loading"
  );
  useEffect(() => {
    const getRequestsAssignedToMe = async () => {
      try {
        const makes = await api.get<pageableReturn>(
          "/makeForm/manager/approved",
          {
            params: {
              date: date,
              pageNumber: pageNumber,
              pageSize: pageSize,
              search: search,
            },
          }
        );
        setMakeRequests(makes.data);
        if (makes.data.makes.length === 0) {
          setState("empty");
        } else {
          setState("success");
        }
      } catch (e) {
        console.log(e);
        setState("error");
      }
    };

    getRequestsAssignedToMe();
  }, [date, USER?.user?.userId, pageNumber, pageSize, search]);

  const view: MenuProps["items"] = [
    {
      label: "view",
      key: "1",
      icon: <EyeOutlined />,
      onClick: () => {
        setViewModal(true);
      },
    },
  ];

  const columns: TableColumnsType<allTableDataType> = [
    {
      title: "Maker",
      dataIndex: "makerName",
    },
    {
      title: "Action",
      dataIndex: "status",
      render: (_, row: allTableDataType) => {
        return (
          <Flex justify="center">
            <DropDown
              menu={view}
              onChange={() => {
                setModal(row);
              }}
            />
          </Flex>
        );
      },
    },
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Approved Requests</h1>
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
      {state === "loading" && (
        <Spin
          style={{ position: "absolute", left: "50%", top: "50%" }}
          size="large"
        />
      )}
      {state === "empty" && (
        <>
          <Table />
        </>
      )}
      {state === "error" && <p>Something wrong happened</p>}
      {state === "success" && (
        <>
          <RequestTables
            data={makeRequests.makes}
            colums={columns}
            pageSize={pageSize}
            pageNumber={pageNumber}
            total={makeRequests.total}
            onChange={onchange}
          />
          <ViewModal
            modal={modal}
            isModalOpen={viewModal}
            handleCancel={() => setViewModal(false)}
          />
        </>
      )}
    </>
  );
};

export default KycManagerApprovedTable;
