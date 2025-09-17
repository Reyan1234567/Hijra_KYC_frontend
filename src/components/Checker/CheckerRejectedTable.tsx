/**
 * CHECKER REJECTED TABLE COMPONENT
 *
 * TYPE: Page Component (Checker Role)
 * PURPOSE: Displays KYC forms that have been rejected by the current checker
 *
 * FUNCTIONALITY:
 * - Fetches rejected KYC forms assigned to the current Head Office (HO) user
 * - Provides date filtering for rejected requests (defaults to current month)
 * - View-only action menu: Only "View" action available for all rejected forms
 * - Pagination support with configurable page size (default: 10)
 * - Updates on date, user, or pagination changes
 * - Loading, empty, error, and success states
 *
 * DATA FETCHING:
 * - API: GET /makeForm/getHo/rejected - fetches KYC forms assigned to HO user with rejected status
 * - Parameters: hoUserId (current user), date (filter), pageNumber, pageSize
 * - Returns: pageableReturn with makes array and total count
 * - Refetches on date, user, or pagination changes
 *
 * USER INTERACTIONS:
 * - Date selection via DateDropDown component
 * - Action dropdown menus per table row (view only for rejected forms)
 * - Modal interactions for viewing forms using the ViewModal component that have a param of type
 *    allTableDataType, modal in this page's case, which represents a makeFormDisplayDto from the backend. when Actions for
 *    some row is clicked the modal state changes to whatever row is clicked and when clicking view a information about that
 *    specific form request is displayed including the images
 * - Pagination controls for navigating through results
 *
 * STATE MANAGEMENT:
 * - viewModal: boolean - controls ViewModal visibility
 * - modal: allTableDataType - stores selected row data for modals
 * - makeRequests: pageableReturn - stores fetched data and total count
 * - state: loading/empty/success/error - manages UI state
 * - pageSize/pageNumber: pagination state
 *
 * LIFECYCLE:
 * - Mounts with loading state and current month date
 * - Fetches rejected forms on mount and dependency changes
 * - Updates state based on API response
 * - Provides historical view of rejected forms
 *
 *  * PAGINATION:
 * - when hit with the api /makeForm/getHo/rejected, it gives a sub list based on the default
 *    params given the first 10 values, b/c pageSize is defaulted to 10 and pageNumber is defaulted to 1
 *    but in the 1st page is technically the 2nd because the page number is 0 indexed, but 1 indexed here,
 *    so that is managed in the backend. So the return will be of type pageableReturn, the total number is needed
 *    for display reasons(how much pages are left). Then RequestTable is called, which is a component made for most tables in this app.
 *    It has params the following params the total number in the whole list, the page size, the page number and the changing function — that sets the state in this page
 *    so a fetch is triggered. We call it and give it those params and as easy as that pagination is done.
 *
 * ROLE PERMISSIONS: Checker/HO users only
 * ROUTING: Accessed via /checkerRejectedTable route
 */

import { Button, Flex, MenuProps, Spin, Table, TableColumnsType } from "antd";
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

const CheckerRejectedTable = () => {
  const today = new Date();
  const [search, setSearch] = useState("");
  const [viewModal, setViewModal] = useState(false);
  const ref = useRef<SearchBoxHandle>(null);
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
          "/makeForm/getHo/rejected",
          {
            params: {
              hoUserId: USER?.user?.userId,
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
      title: "Action",
      dataIndex: "status",
      render: (_: number, row: allTableDataType) => {
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
        <h1>Rejected Requests</h1>
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

export default CheckerRejectedTable;
