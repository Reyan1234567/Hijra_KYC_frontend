/**
 * KYC MANAGER REJECTED TABLE COMPONENT
 * 
 * PURPOSE:
 * Manager interface for viewing and managing rejected KYC requests with date filtering,
 * pagination, and comprehensive oversight capabilities. Provides detailed access to
 * rejected forms for analysis, review, and potential reassignment or correction.
 * 
 * FUNCTIONALITY:
 * - Displays rejected KYC requests in paginated table format
 * - Date-based filtering with month selection dropdown
 * - Status-based action menus (view for rejected/approved, edit for pending)
 * - View-only access for completed rejected requests (status 2/3)
 * - HO assignment editing for pending requests (status 1)
 * - Real-time data refresh with trigger-based re-fetching
 * - Loading, empty, error, and success state management
 * 
 * API INTERACTIONS:
 * - GET /makeForm/manager/rejected: Fetches rejected requests with pagination
 *   * date: Selected month filter
 *   * pageNumber, pageSize: Pagination parameters
 * - Uses AuthContext for user identification and access control
 * - Automatic error handling with state management
 * 
 * USER INTERACTIONS:
 * - Date dropdown for month-based filtering
 * - Action dropdown menus with view and edit options
 * - View modal for detailed KYC form inspection with rejection reasons
 * - Manager edit modal for HO assignment modification (if applicable)
 * - Pagination controls for large datasets
 * - Loading states during API operations
 * 
 * STATE MANAGEMENT:
 * - Make requests state with pageable return structure
 * - Modal states for view and edit operations
 * - Selected modal data for form operations
 * - Page size and number for pagination control
 * - Date state for filtering with default current month
 * - Component state (loading/empty/success/error)
 * - Trigger state for forcing data refresh
 * 
 * TABLE FEATURES:
 * - Maker name column display
 * - Status-based action column with conditional rendering
 * - Integrated with RequestTables helper component
 * - Pagination with customizable page sizes
 * - Total count display from API response
 * 
 * ROLE-BASED ACCESS:
 * - Manager role required for access
 * - Provides oversight of rejected KYC processing pipeline
 * - Critical for quality assurance and process improvement
 * - Supports analysis of rejection patterns and training needs
 * 
 * USAGE: Manager dashboard page for rejected KYC request analysis and management
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

const KycManagerRejectedTable = () => {
  // const [ /*messageApi*/ contextHolder] = message.useMessage();
  const today = new Date();
  const [trigger, setTrigger] = useState(0);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [date, setDate] = useState(
    new Date(today.setMonth(today.getMonth(), 1))
  );
  date.setHours(0,0,0,0)
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
        const makes = await api.get<pageableReturn>("/makeForm/manager/rejected", {
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
            <h1>Rejected Requests</h1>
            <DateDropDown date={date} setDate={setDate} />
          </div>
          <Table />
        </>
      )}
      {state === "error" && <p>Something wrong happened</p>}
      {state === "success" && (
        <>
          {/* {contextHolder} */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1>Rejected Requests</h1>
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

export default KycManagerRejectedTable;
