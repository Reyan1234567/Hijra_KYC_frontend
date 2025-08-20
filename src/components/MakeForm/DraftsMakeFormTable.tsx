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
import { addToDrafts, getDraftedMakes, sendToHo } from "../../services/MakeForm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { allTableDataType } from "./AllMakeFormTable";

const DraftsMakeFormTable = () => {
  const queryClient = useQueryClient();
  const today = new Date();
  const [messageApi, contextHolder] = message.useMessage();
  const [editModal, setEditModal] = useState(false);
  const [date, setDate] = useState(
    new Date(today.setMonth(today.getMonth(), 1))
  );
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
    queryFn: () => getDraftedMakes(date, USER?.user?.userId, pageSize, pageNumber),
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
        content: error instanceof Error ? error.message : String(error),
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>Drafts</h1>
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
        <h1>Drafts</h1>
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

export default DraftsMakeFormTable;
