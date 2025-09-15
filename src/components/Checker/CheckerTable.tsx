/**
 * CHECKER TABLE COMPONENT( UNUSED, NOT FOUNT IN THE SIDEBAR OF A CHECKER)
 * 
 * TYPE: Page Component (Checker Role)
 * PURPOSE: Main checker dashboard displaying all KYC forms assigned to the current checker
 * 
 * FUNCTIONALITY:
 * - Fetches all KYC forms assigned to the current Head Office (HO) user
 * - Provides date filtering for assigned requests (defaults to current month)
 * - Status-based action menus:
 *   - Status 1 (pending): View and Edit (approve/reject) actions
 *   - Status 2/3 (approved/rejected): View only
 * - Pagination support with configurable page size
 * - Real-time updates via trigger mechanism
 * - Loading, empty, error, and success states
 * 
 * DATA FETCHING:
 * - API: GET /makeForm/getHo - fetches all KYC forms assigned to HO user (all statuses)
 * - Parameters: hoUserId (current user), date (filter), pageNumber, pageSize
 * - Returns: pageableReturn with makes array and total count
 * - Refetches on trigger, date, user, or pagination changes
 * 
 * USER INTERACTIONS:
 * - Date selection via DateDropDown component
 * - Action dropdown menus per table row (view/edit based on status)
 * - Modal interactions:
 *   - ViewModal: Read-only form details
 *   - CheckerEditModal: Approve/reject with reason input for pending forms
 * - Pagination controls for navigating through results
 * 
 * STATE MANAGEMENT:
 * - trigger: number - forces re-fetch when incremented
 * - viewModal/editModal: boolean - controls modal visibility
 * - modal: allTableDataType - stores selected row data for modals
 * - makeRequests: pageableReturn - stores fetched data and total count
 * - state: loading/empty/success/error - manages UI state
 * 
 * LIFECYCLE:
 * - Mounts with loading state and current month date
 * - Fetches all assigned forms on mount and dependency changes
 * - Updates state based on API response
 * - Provides comprehensive view of checker workload
 * 
 * ROLE PERMISSIONS: Checker/HO users only
 * ROUTING: Accessed via /checkerTable route (main checker dashboard)
 */

import { Flex, MenuProps, message, Spin, Table, TableColumnsType } from "antd";
import RequestTables from "../Helper/Table/RequestTables";
import { useContext, useEffect, useState } from "react";
import { api } from "../../services/axios";
import DateDropDown from "../Helper/DateDropdown/DateDropDown";
import { allTableDataType, pageableReturn } from "../MakeForm/AllMakeFormTable";
import DropDown from "../Helper/DateDropdown/DropDown";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import CheckerEditModal from "./CheckerEditModal";
import ViewModal from "../Helper/RequestModals/ViewModal";
import { AuthContext } from "../../context/AuthContext";

const CheckerTable = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const today = new Date();
  const [trigger, setTrigger] = useState(0);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
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
        const makes = await api.get<pageableReturn>("/makeForm/getHo", {
          params: {
            hoUserId: USER?.user?.userId,
            date: date,
            pageNumber: pageNumber,
            pageSize: pageSize,
          },
        });
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
  }, [trigger, date, USER?.user?.userId, pageNumber, pageSize]);

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

  const edit: MenuProps["items"] = [
    {
      label: "view",
      key: "1",
      icon: <EyeOutlined />,
      onClick: () => {
        setViewModal(true);
      },
    },
    {
      label: "Edit",
      key: "2",
      icon: <EditOutlined />,
      onClick: () => {
        setEditModal(true);
      },
    },
  ];
  const columns: TableColumnsType<allTableDataType> = [
    {
      title: "Action",
      dataIndex: "status",
      render: (status: number, row: allTableDataType) => {
        if (status === 3 || status === 2) {
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
        } else if (status === 1) {
          return (
            <Flex justify="center">
              <DropDown
                menu={edit}
                onChange={() => {
                  setModal(row);
                }}
              />
            </Flex>
          );
        }
      },
    },
  ];
  return (
    <>
      {state === "loading" && (
        <Spin
          style={{ position: "absolute", left: "50%", top: "50%" }}
          size="large"
        />
      )}
      {state === "empty" && (
        <>
          {contextHolder}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1>Check Table</h1>
            <DateDropDown date={date} setDate={setDate} />
          </div>
          <Table />
        </>
      )}
      {state === "error" && <p>Something wrong happened</p>}
      {state === "success" && (
        <>
          {contextHolder}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1>Check Table</h1>
            <DateDropDown date={date} setDate={setDate} />
          </div>
          <RequestTables
            data={makeRequests.makes}
            colums={columns}
            pageSize={pageSize}
            pageNumber={pageNumber}
            total={makeRequests.total}
            onChange={onchange}
          />
          <CheckerEditModal
            modal={modal}
            open={editModal}
            onCancel={() => setEditModal(false)}
            triggerRender={() => setTrigger((prev) => prev + 1)}
            messageApi={messageApi}
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

export default CheckerTable;
