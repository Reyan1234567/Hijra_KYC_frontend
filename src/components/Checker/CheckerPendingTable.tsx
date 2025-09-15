/**
 * CHECKER PENDING TABLE COMPONENT
 *
 * TYPE: Page Component (Checker Role)
 * PURPOSE: Displays pending KYC forms assigned to the current checker for approval/rejection
 *
 * FUNCTIONALITY:
 * - Fetches pending KYC forms assigned to the current Head Office (HO) user
 * - Provides date filtering for pending requests (defaults to current month)
 * - Unified action menu for all pending items: View and Edit actions available for all rows
 * - Pagination support with configurable page size (default: 10)
 * - Real-time updates via trigger mechanism
 * - Loading, empty, error, and success states
 *
 * DATA FETCHING:
 * - API: GET /makeForm/getHo/pending - fetches KYC forms assigned to HO user with pending status
 * - Parameters: hoUserId (current user), date (filter), pageNumber, pageSize
 * - Returns: pageableReturn with makes array and total count
 * - Refetches on trigger, date, user, or pagination changes
 *
 * USER INTERACTIONS:
 * - Date selection via DateDropDown component
 * - Action dropdown menus per table row (view/edit for all pending items)
 * - Modal interactions:
 *   - ViewModal: Read-only form details — view only modal triggered when view is clicked in the actions dropdown
 *   - CheckerEditModal: Approve/reject with reason input — edit modal triggered when edit is clicked in the actions dropdown.
 * - Pagination controls for navigating through results
 *
 * STATE MANAGEMENT:
 * - trigger: number - forces re-fetch when incremented
 * - viewModal/editModal: boolean - controls modal visibility
 * - modal: allTableDataType - stores selected row data for modals
 * - makeRequests: pageableReturn - stores fetched data and total count
 * - state: loading/empty/success/error - manages UI state
 * - pageSize/pageNumber: pagination state
 *
 * LIFECYCLE:
 * - Mounts with loading state and current month date
 * - Fetches data on mount and dependency changes
 * - Updates state based on API response
 * - Triggers re-render when actions complete
 *
 *  * PAGINATION:
 * - when hit with the api /makeForm/getHo/pending, it gives a sub list based on the default
 *    params given the first 10 values, b/c pageSize is defaulted to 10 and pageNumber is defaulted to 1
 *    but in the 1st page is technically the 2nd because the page number is 0 indexed, but 1 indexed here,
 *    so that is managed in the backend. So the return will be of type pageableReturn, the total number is needed
 *    for display reasons(how much pages are left). Then RequestTable is called, which is a component made for most tables in this app.
 *    It has params the following params the total number in the whole list, the page size, the page number and the changing function — that sets the state in this page
 *    so a fetch is triggered. We call it and give it those params and as easy as that pagination is done.
 *
 * ROLE PERMISSIONS: Checker/HO users only
 * ROUTING: Accessed via /checkerPendingTable route
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

const CheckerPendingTable = () => {
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
        const makes = await api.get<pageableReturn>("/makeForm/getHo/pending", {
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
      render: (_, row: allTableDataType) => {
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
            <h1>Pending Requests</h1>
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
            <h1>Pending Requests</h1>
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

export default CheckerPendingTable;
