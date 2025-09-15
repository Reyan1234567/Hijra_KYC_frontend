/**
 * CHECKER APPROVED TABLE COMPONENT
 *
 * TYPE: Page Component (Checker Role)
 * PURPOSE: Displays a paginated table of approved KYC forms assigned to the current Head Office (HO) user
 *
 * FUNCTIONALITY:
 * - Fetches approved KYC forms from /makeForm/getHo/approved endpoint
 * - Provides date filtering for approved requests
 * - Here values can have a view action, which enables them to what the details about the form
 * - Supports pagination with configurable page size
 *
 * DATA FETCHING:
 * - API: GET /makeForm/getHo/approved
 * - Parameters: hoUserId, date, pageNumber, pageSize
 * - Returns: pageableReturn with makes array and total count
 * - Uses manual useEffect with dependency array for data fetching
 *
 * USER INTERACTIONS:
 * - Date selection via DateDropDown component
 * - Action dropdown menu (view) per table row
 * - Modal interactions for viewing forms using the ViewModal component that have a param of type
 *    allTableDataType, modal in this page's case, which represents a makeFormDisplayDto from the backend. when Actions for 
 *    some row is clicked the modal state changes to whatever row is clicked and when clicking view a information about that
 *    specific form request is displayed including the images
 * - Pagination controls for navigating through results
 *
 * LIFECYCLE:
 * - Mounts with loading state
 * - Fetches data on mount and when dependencies change
 * - Updates state based on API response (empty/success/error)
 * - Re-renders when trigger, date, user, or pagination(pageNumber, pageSize) changes
 * - The trigger variable is made for the page to update, when some thing is fetched or
 *   some value is changed, it is set to a different value manually in the code, so a re-render
 *   can happen
 *
 * PAGINATION:
 * - when hit with the api /makeForm/getHo/approved, it gives a sub list based on the default
 *    params given the first 10 values, b/c pageSize is defaulted to 10 and pageNumber is defaulted to 1
 *    but in the 1st page is technically the 2nd because the page number is 0 indexed, but 1 indexed here,
 *    so that is managed in the backend. So the return will be of type pageableReturn, the total number is needed
 *    for display reasons(how much pages are left). Then RequestTable is called, which is a component made for most tables in this app.
 *    It has params the following params the total number in the whole list, the page size, the page number and the changing function — that sets the state in this page
 *    so a fetch is triggered. We call it and give it those params and as easy as that pagination is done.
 *
 * ROLE PERMISSIONS: Checker/HO users only
 * ROUTING: Accessed via /checkerApprovedTable route
 */

import { Flex, MenuProps, Spin, Table, TableColumnsType } from "antd";
import RequestTables from "../Helper/Table/RequestTables";
import { useContext, useEffect, useState } from "react";
import { api } from "../../services/axios";
import DateDropDown from "../Helper/DateDropdown/DateDropDown";
import { allTableDataType, pageableReturn } from "../MakeForm/AllMakeFormTable";
import DropDown from "../Helper/DateDropdown/DropDown";
import { EyeOutlined } from "@ant-design/icons";
import ViewModal from "../Helper/RequestModals/ViewModal";
import { AuthContext } from "../../context/AuthContext";

const CheckerApprovedTable = () => {
  const today = new Date();
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
          "/makeForm/getHo/approved",
          {
            params: {
              hoUserId: USER?.user?.userId,
              date: date,
              pageNumber: pageNumber,
              pageSize: pageSize,
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
  }, [date, USER?.user?.userId, pageNumber, pageSize]);

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
            <h1>Approved Requests</h1>
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
            <h1>Approved Requests</h1>
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

export default CheckerApprovedTable;
