/**
 * PENDING MAKE FORM TABLE COMPONENT
 * 
 * TYPE: Page Component (Maker Role)
 * PURPOSE: Displays KYC forms in pending status (submitted to HO but not yet processed)
 * 
 * FUNCTIONALITY:
 * - Fetches pending KYC forms (status 1) created by the current maker
 * - Provides date filtering for pending requests (defaults to current month)
 * - Status-based action menus:
 *   - Status 0 (draft): Edit, View, Send to HO actions
 *   - Status 1 (pending): View only (awaiting HO processing)
 *   - Status 3 (rejected): View, Add to drafts (for resubmission)
 * - Pagination support with React Query caching
 * - Real-time data updates via React Query mutations
 * 
 * DATA FETCHING:
 * - API: GET /makeForm/getPending - fetches pending KYC forms by maker with status 1
 * - Service: getPendingMakes(date, userId, pageSize, pageNumber)
 * - Parameters: date (filter), makerId (current user), pageSize, pageNumber
 * - Returns: pageableReturn with makes array and total count
 * - Uses React Query with cache key ["makes", date, pageNumber, pageSize]
 * 
 * DATA MUTATIONS:
 * - API: PUT /makeForm/sendToHo/{id} - submits form to Head Office (status 0 → 1)
 * - API: PUT /makeForm/addToDrafts/{id} - moves rejected form back to drafts (status 3 → 0)
 * - Service: sendToHo(id) - changes form status from draft to pending
 * - Service: addToDrafts(id) - changes rejected form back to draft for editing
 * - Invalidates React Query cache on success to refresh data
 * 
 * USER INTERACTIONS:
 * - Date selection via DateDropDown component
 * - Status-specific action dropdown menus per table row
 * - Modal interactions:
 *   - ViewModal: Read-only form details display
 *   - EditModal: Edit form details and images (for drafts only)
 * - Pagination controls for navigating through results
 * 
 * STATE MANAGEMENT:
 * - modal: allTableDataType - stores selected row data for modals
 * - isModalOpen: boolean - controls ViewModal visibility
 * - editModal: boolean - controls EditModal visibility
 * - pageSize/pageNumber: pagination state
 * - Uses React Query for data fetching, caching, and mutations
 * 
 * LIFECYCLE:
 * - Mounts with current month date filter
 * - React Query handles data fetching, caching, and refetching
 * - Updates automatically when date or pagination changes
 * - Mutations trigger cache invalidation and UI updates
 * 
 * ROLE PERMISSIONS: Maker users only
 * ROUTING: Accessed via /pendingMakeFormTable route
 */

import { useContext, useState } from "react";
import { Flex, message, Spin, Table } from "antd";
import type { MenuProps, TableColumnsType, TabsProps } from "antd";
import DateDropDown from "../Helper/DateDropdown/DateDropDown";
import {
  EditOutlined,
  EyeOutlined,
  FileTextOutlined,
  SendOutlined,
} from "@ant-design/icons";

import EditModal from "./EditModal";
import ViewModal from "../Helper/RequestModals/ViewModal";
import DropDown from "../Helper/DateDropdown/DropDown";
import RequestTables from "../Helper/Table/RequestTables";
import {
  addToDrafts,
  getMakes,
  getPendingMakes,
  sendToHo,
} from "../../services/MakeForm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";

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
  const queryClient = useQueryClient();
  const today = new Date();
  const [messageApi, contextHolder] = message.useMessage();
  const [editModal, setEditModal] = useState(false);
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

  const draft: MenuProps["items"] = [
    {
      label: "Edit",
      key: "1",
      icon: <EditOutlined />,
      onClick: () => {
        setEditModal(true);
      },
    },
    {
      label: "View",
      key: "2",
      icon: <EyeOutlined />,
      onClick: () => {
        setIsModalOpen(true);
      },
    },
    {
      label: "Send to HO",
      key: "3",
      icon: <SendOutlined />,
      onClick: () => {
        sendToHoMutation.mutate(modal.id);
      },
    },
  ];

  const rejected: MenuProps["items"] = [
    {
      label: "View",
      key: "1",
      icon: <EyeOutlined />,
      onClick: () => {
        setIsModalOpen(true);
      },
    },
    {
      label: "Add to drafts",
      key: "2",
      icon: <FileTextOutlined />,
      onClick: async () => {
        addToDraftsMutation.mutate(modal.id);
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
      render: (status: number, row: allTableDataType) => {
        if (status === 0) {
          return (
            <Flex justify="center" align="center">
              <DropDown menu={draft} onChange={() => setModal(row)} />
            </Flex>
          );
        } else if (status === 3) {
          return (
            <Flex justify="center" align="center">
              <DropDown menu={rejected} onChange={() => setModal(row)} />
            </Flex>
          );
        } else {
          return (
            <Flex justify="center" align="center">
              <DropDown menu={view} onChange={() => setModal(row)} />
            </Flex>
          );
        }
      },
    },
  ];

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditModal(false);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const USER = useContext(AuthContext);
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const onchange = (pageNo: number, pageSi: number) => {
    setPageNumber(pageNo);
    setPageSize(pageSi);
  };
  const { data, isLoading, isError, isSuccess, error } = useQuery({
    queryKey: ["makes", date, pageNumber, pageSize],
    queryFn: () =>
      getPendingMakes(date, USER?.user?.userId, pageSize, pageNumber),
  });

  const sendToHoMutation = useMutation({
    mutationFn: (id: number) => sendToHo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["makes"] });
      messageApi.open({
        type: "success",
        content: "Successfully sent to Ho",
      });
    },
    onError: (error) => {
      messageApi.open({
        type: "error",
        content: e?.response.data ?? "Something went wrong",
      });
    },
  });

  const addToDraftsMutation = useMutation({
    mutationFn: (id: number) => addToDrafts(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["makes"] });
      messageApi.open({
        type: "success",
        content: "Successfully added to drafts",
      });
    },
    onError: (error) => {
      messageApi.open({
        type: "error",
        content: e?.response.data ?? "Something went wrong",
      });
    },
  });

  if (isLoading) {
    return (
      <Spin
        style={{ position: "absolute", left: "50%", top: "50%" }}
        size="large"
      />
    );
  }
  if (isError || data?.data === undefined) {
    return (
      <p style={{ position: "absolute", left: "50%", top: "50%" }}>
        Something went wrong{error ? error.message : ""}
      </p>
    );
  }
  if (isSuccess && data.data.makes.length === 0) {
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
          <h1>Pending Makes</h1>
          <DateDropDown date={date} setDate={setDate} />
        </div>
        <Table<allTableDataType> dataSource={[]} />
      </>
    );
  }

  const res: allTableDataType[] = data.data.makes;

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
        <h1>Pending Makes</h1>
        <DateDropDown date={date} setDate={setDate} />
      </div>
      <Flex gap="middle" vertical>
        <RequestTables
          data={res}
          colums={columns}
          pageSize={pageSize}
          pageNumber={pageNumber}
          total={data.data.total}
          onChange={onchange}
          // onSizeChange={onchange}
        />{" "}
      </Flex>
      <ViewModal
        handleCancel={handleCancel}
        isModalOpen={isModalOpen}
        modal={modal}
      />
      <EditModal
        handleCancel={handleCancel}
        editModal={editModal}
        modal={modal}
        editModalOff={() => {
          setEditModal(false);
        }}
      />
    </>
  );
};

export default PendingMakeFormTable;
