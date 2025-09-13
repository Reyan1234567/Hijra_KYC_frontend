/**
 * KYC MANAGER TABLE COMPONENT
 * 
 * TYPE: Page Component (Manager Role)
 * PURPOSE: Main manager dashboard displaying all KYC forms requiring manager oversight and assignment
 * 
 * FUNCTIONALITY:
 * - Fetches all KYC forms visible to managers with date filtering
 * - Displays forms with status-based action menus
 * - Provides HO assignment management for pending forms (status 1)
 * - View-only access for processed forms (status 2, 3)
 * - Manual state management with loading, success, error, and empty states
 * - Pagination support with configurable page size
 * 
 * DATA FETCHING:
 * - API: GET /makeForm/manager - fetches KYC forms for manager oversight
 * - Parameters: date (filter), pageNumber, pageSize
 * - Returns: pageableReturn with makes array and total count
 * - Manual API calls with axios instead of React Query
 * - Refetches on trigger state changes for real-time updates
 * 
 * USER INTERACTIONS:
 * - Date selection via DateDropDown component
 * - Status-based dropdown menus:
 *   - Status 1 (pending): View, Edit HO Assignment actions
 *   - Status 2/3 (processed): View only
 * - Modal interactions:
 *   - ViewModal: Read-only form details display
 *   - ManagerEdit: HO assignment interface with Assign component
 * - Pagination controls for navigating through results
 * 
 * STATE MANAGEMENT:
 * - makeRequests: pageableReturn - stores fetched form data
 * - modal: allTableDataType - selected row data for modals
 * - viewModal/editModal: boolean - modal visibility controls
 * - trigger: number - incremented to force data refetch
 * - state: "loading" | "success" | "error" | "empty" - manual state management
 * - pageSize/pageNumber: pagination state
 * 
 * LIFECYCLE:
 * - useEffect triggers on trigger, date, userId, pageNumber, pageSize changes
 * - Manual API error handling with try-catch blocks
 * - Console logging for debugging API responses
 * - State-based conditional rendering for different UI states
 * 
 * ROLE PERMISSIONS: Manager users only
 * ROUTING: Accessed via /kycManagerTable route
 */

import { Flex, MenuProps, Spin, Table, TableColumnsType } from "antd";
import RequestTables from "../Helper/Table/RequestTables";
import { useContext, useEffect, useState } from "react";
import { api } from "../../services/axios";
import DateDropDown from "../Helper/DateDropdown/DateDropDown";
import { allTableDataType, pageableReturn } from "../MakeForm/AllMakeFormTable";
import DropDown from "../Helper/DateDropdown/DropDown";
import { BookOutlined, EyeOutlined } from "@ant-design/icons";
import ViewModal from "../Helper/RequestModals/ViewModal";
import { AuthContext } from "../../context/AuthContext";
import ManagerEdit from "./ManagerEdit";

const KycManagerTable = () => {
  // const [ /*messageApi*/ contextHolder] = message.useMessage();
  const today = new Date();
  const [trigger, setTrigger] = useState(0);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [date, setDate] = useState(
    new Date(today.setMonth(today.getMonth(), 1))
  );
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
        const makes = await api.get<pageableReturn>("/makeForm/manager", {
          params: {
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

  const assign: MenuProps["items"] = [
    {
      label: "view",
      key: "1",
      icon: <EyeOutlined />,
      onClick: () => {
        setViewModal(true);
      },
    },
    {
      label: "Edit HO Assignment",
      key: "2",
      icon: <BookOutlined />,
      onClick: () => {
        setEditModal(true);
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
                menu={assign}
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1>Manager's Table</h1>
            <DateDropDown date={date} setDate={setDate} />
          </div>
          <Table />
        </>
      )}
      {state === "error" && <p>Something wrong happened</p>}
      {state === "success" && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1>Manager's Table</h1>
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
          <ManagerEdit
            modal={modal}
            open={editModal}
            onCancel={() => setEditModal(false)}
            triggerRender={() => setTrigger((prev) => prev + 1)}
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

export default KycManagerTable;
