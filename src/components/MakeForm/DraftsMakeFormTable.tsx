import { useContext, useState } from "react";
import { Button, Flex, message, Popconfirm, Spin, Table } from "antd";
import type { MenuProps, TableColumnsType } from "antd";
import DateDropDown from "../Helper/DateDropdown/DateDropDown";
import {
  EditOutlined,
  EyeOutlined,
  SendOutlined,
} from "@ant-design/icons";

import EditModal from "./EditModal";
import ViewModal from "../Helper/RequestModals/ViewModal";
import DropDown from "../Helper/DateDropdown/DropDown";
import RequestTables from "../Helper/Table/RequestTables";
import {
  getDraftedMakes,
  sendToHo,
} from "../../services/MakeForm";
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
  date.setHours(0, 0, 0, 0);

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
            <DropDown
              menu={draft}
              onChange={() => {
                console.log(row);
                setModal(row);
              }}
            />
          </Flex>
        );
      },
    },
    {
      title: "Send to HO",
      dataIndex: "status",
      render: (_:number, row: allTableDataType) => {
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
  const onchange = (pageNo: number, pageSi: number) => {
    setPageNumber(pageNo);
    setPageSize(pageSi);
  };
  const { data, isLoading, isError, isSuccess, error } = useQuery({
    queryKey: ["draftMakes", date, pageNumber, pageSize],
    queryFn: () =>
      getDraftedMakes(date, USER?.user?.userId, pageSize, pageNumber),
  });

  const sendToHoMutation = useMutation({
    mutationFn: (id: number) => sendToHo(id),
    onSuccess: async() => {
      await queryClient.invalidateQueries({ queryKey: ["draftMakes"] });
      messageApi.open({
        type: "success",
        content: "Successfully sent to Ho",
      });
    },
    onError: (error) => {
      messageApi.open({
        type: "error",
        content: error?.response?.data??"Something went wrong",
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
