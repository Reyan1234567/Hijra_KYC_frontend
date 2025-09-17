/**
 * ALL MAKE FORM TABLE COMPONENT (NOT USED)
 *
 * TYPE: Page Component (Maker Role)
 * PURPOSE: Displays all KYC forms created by the current maker user with status-based actions
 *
 * FUNCTIONALITY:
 * - Fetches maker's KYC forms using React Query from getMakes service
 * - Provides date filtering for form submissions
 * - Shows different action menus based on form status:
 *   - Status 0 (draft): Edit, View, Send to HO actions
 *   - Status 3 (rejected): View and Edit actions
 *   - Other statuses: View only
 * - Supports pagination with configurable page size
 * - Real-time updates via React Query cache invalidation
 *
 * DATA FETCHING:
 * - Uses React Query useQuery hook with key ["makes", date, pageNumber, pageSize]
 * - API: getMakes(date, userId, pageSize, pageNumber)
 * - Returns: pageableReturn with makes array and total count
 * - Automatic refetching on dependency changes
 *
 * USER INTERACTIONS:
 * - Date selection via DateDropDown component
 * - Action dropdown menus (edit/view/send) per table row
 * - Modal interactions for viewing and editing forms
 * - Pagination controls for navigating through results
 * - Send to HO mutation for submitting draft forms
 *
 * LIFECYCLE:
 * - Mounts with React Query loading state
 * - Shows loading spinner during data fetch
 * - Renders empty table if no data
 * - Updates automatically when query dependencies change
 *
 * ROLE PERMISSIONS: Maker users only
 * ROUTING: Accessed via /allMakeFormTable route
 */

import { useContext, useRef, useState } from "react";
import { Button, Flex, message, Spin, Table } from "antd";
import type { MenuProps, TableColumnsType } from "antd";
import DateDropDown from "../Helper/DateDropdown/DateDropDown";
import { EditOutlined, EyeOutlined, SendOutlined } from "@ant-design/icons";
import {defaultAllTableDataType} from "../../services/MakeForm"
import EditModal from "./EditModal";
import ViewModal from "../Helper/RequestModals/ViewModal";
import DropDown from "../Helper/DateDropdown/DropDown";
import RequestTables from "../Helper/Table/RequestTables";
import { getMakes, sendToHo } from "../../services/MakeForm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

const AllMakeFormTable = () => {
  const queryClient = useQueryClient();
  const today = new Date();
  const [messageApi, contextHolder] = message.useMessage();
  const [search, setSearch] = useState("");
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
      label: "Edit",
      key: "2",
      icon: <EditOutlined />,
      onClick: async () => {
        setEditModal(true);
      },
    },
  ];

  const [modal, setModal] = useState<allTableDataType>(defaultAllTableDataType);

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
  const ref = useRef<SearchBoxHandle>(null);
  const onchange = (pageNo: number, pageSi: number) => {
    setPageNumber(pageNo);
    setPageSize(pageSi);
  };
  const { data, isLoading, isError, isSuccess, error } = useQuery({
    queryKey: ["makes", date, pageNumber, pageSize, search],
    queryFn: () => getMakes(date, USER?.user?.userId, pageSize, pageNumber, search),
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
        content: error instanceof Error ? error.message : String(error),
      });
    },
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
        <h1>MakeTable</h1>
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
          <EditModal
            handleCancel={handleCancel}
            editModal={editModal}
            modal={modal}
            editModalOff={() => {
              setEditModal(false);
            }}
          />
        </>
      )}
    </>
  );
};

export default AllMakeFormTable;
