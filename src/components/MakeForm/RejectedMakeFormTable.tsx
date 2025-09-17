/**
 * RejectedMakeFormTable - Manage rejected KYC forms for resubmission
 * 
 * Displays rejected KYC forms with edit and resubmission functionality.
 * 
 * FUNCTIONALITY:
 * - Fetches rejected KYC forms via getRejectedMakes API
 * - Date filtering (defaults to current month)
 * - Unified actions for all rows: View and Edit
 * - Dedicated "Send to HO" column with confirmation popover
 * - Pagination with React Query caching
 * 
 * DATA FLOW:
 * - API: GET /makeForm/getRejected → getRejectedMakes(date, userId, pageSize, pageNumber)
 * - Mutation: PUT /makeForm/sendToHo/{id} → resubmits form (status 3 → 1)
 * - Returns: pageableReturn with makes array and total count
 * - Query key: ["makes", date, pageNumber, pageSize]
 * - Invalidates ["makes"] and ["notifications"] on successful resubmission
 * 
 * STATE:
 * - modal: allTableDataType - selected row data for modals and mutations
 * - isModalOpen: boolean - ViewModal visibility
 * - editModal: boolean - EditModal visibility  
 * - date: Date - filter for rejected requests
 * - pageSize/pageNumber: pagination state
 * 
 * INTERACTIONS:
 * - Date selection via DateDropDown
 * - Actions dropdown: View (ViewModal) and Edit (EditModal)
 * - Send to HO column: Popconfirm → sendToHoMutation
 * - Console logging for debugging modal state
 */

import { useContext, useRef, useState } from "react";
import { Button, Flex, message, Popconfirm, Spin, Table } from "antd";
import type { MenuProps, TableColumnsType } from "antd";
import DateDropDown from "../Helper/DateDropdown/DateDropDown";
import { EditOutlined, EyeOutlined, SendOutlined } from "@ant-design/icons";

import EditModal from "./EditModal";
import ViewModal from "../Helper/RequestModals/ViewModal";
import DropDown from "../Helper/DateDropdown/DropDown";
import RequestTables from "../Helper/Table/RequestTables";
import { getRejectedMakes, sendToHo } from "../../services/MakeForm";
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
const RejectedMakeFormTable = () => {
  const queryClient = useQueryClient();
  const today = new Date();
  const [messageApi, contextHolder] = message.useMessage();
  const [search, setSearch] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [date, setDate] = useState(
    new Date(today.setMonth(today.getMonth(), 1))
  );
  date.setHours(0, 0, 0, 0);

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
              <DropDown menu={rejected} onChange={() => setModal(row)} />
            </Flex>
          );
      },
    },
    {
      title: "Send to HO",
      dataIndex: "status",
      render: (_: number, row: allTableDataType) => {
        console.log("Supposed to be row: ", row);
        return (
          <Popconfirm
            title={"Send to Ho"}
            onOpenChange={() => {
              console.log("Row: ", row);
              setModal(row);
            }}
            description="Are you sure You wanna send to Ho?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => {
              console.log("Modal: ", modal);
              return sendToHoMutation.mutate(modal.id);
            }}
          >
            <Button>{<SendOutlined />}</Button>
          </Popconfirm>
        );
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
    queryFn: () =>
      getRejectedMakes(date, USER?.user?.userId, pageSize, pageNumber, search),
  });

  const sendToHoMutation = useMutation({
    mutationFn: (id: number) => sendToHo(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["makes"],
      });
      messageApi.open({
        type: "success",
        content: "Successfully sent to Ho",
      });
    },
    onError: (error: unknown) => {
      messageApi.error(
        error?.response?.message??"Something went wrong!"
      );
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
        <h1>Rejected Makes</h1>
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

export default RejectedMakeFormTable;
