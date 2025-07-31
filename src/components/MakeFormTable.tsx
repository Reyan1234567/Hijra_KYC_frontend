import { useEffect, useState } from "react";
import { Flex, message, Spin, Table, Tabs } from "antd";
import type { MenuProps, TableColumnsType, TabsProps } from "antd";
import { api } from "../services/axios";
import {
  EditOutlined,
  EyeOutlined,
  FileTextOutlined,
  SendOutlined,
} from "@ant-design/icons";

import EditModal from "./EditModal";
import ViewModal from "./ViewModal";
import DropDown from "./DropDown";
import RequestTables from "./RequestTables";

interface imageReturn {
  id: number;
  name: string;
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

const MakeFormTable = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [editModal, setEditModal] = useState(false);
  const [componentReload, setComponentReload] = useState(0);
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
      onClick: async () => {
        try {
          await api.patch(`/makeForm/send-ToHo/${modal.id}`);
          messageApi.open({
            type: "success",
            content: "succesfully sent to ho",
          });
          setComponentReload((prev) => prev + 1);
        } catch (e: unknown) {
          console.log(e);
          messageApi.open({
            type: "error",
            content: e instanceof Error ? e.message : String(e),
          });
        }
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
        try {
          await api.patch(`/makeForm/toDrafts/${modal.id}`);
          messageApi.open({
            type: "success",
            content: "successfully added to drafts",
          });
          setComponentReload((prev) => prev + 1);
        } catch (e) {
          console.log(e);
          messageApi.open({
            type: "error",
            content: e instanceof Error ? e.message : String(e),
          });
        }
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [state, setState] = useState<"empty" | "loading" | "success" | "error">(
    "loading"
  );
  const [makeForms, setMakeForms] = useState<allTableDataType[]>([]);
  useEffect(() => {
    const fetchAccepted = async () => {
      try {
        console.log("in the useEffect");
        const form = await api.get("/makeForm", { params: { makerId: 2 } });
        if (!form || form.data.length === 0) {
          setState("empty");
        } else {
          setState("success");
          console.log(form.data[5]);
          setMakeForms(form.data);
        }
      } catch (error) {
        setState("error");
        console.log("error" + error);
      }
    };
    fetchAccepted();
  }, [componentReload]);

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditModal(false);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "All Requests",
      children: <RequestTables data={makeForms} colums={columns} />,
    },
    {
      key: "2",
      label: "Drafts",
      children: (
        <RequestTables
          data={makeForms.filter((request) => request.status === 0)}
          colums={columns}
        />
      ),
    },
    {
      key: "3",
      label: "Pending",
      children: (
        <RequestTables
          data={makeForms.filter((request) => request.status === 1)}
          colums={columns}
        />
      ),
    },
    {
      key: "4",
      label: "Approved",
      children: (
        <RequestTables
          data={makeForms.filter((request) => request.status === 2)}
          colums={columns}
        />
      ),
    },
    {
      key: "5",
      label: "Rejected",
      children: (
        <RequestTables
          data={makeForms.filter((request) => request.status === 3)}
          colums={columns}
        />
      ),
    },
  ];

  return (
    <>
      {state === "empty" && (
        <Table<allTableDataType> columns={columns} dataSource={[]} />
      )}
      {state === "loading" && <Spin style={{position:"absolute", left:"50%", top:"50%"}} size="large" />}
      {state === "error" && <p>Something wrong happened</p>}
      {state === "success" && (
        <>
          {contextHolder}
          <Flex gap="middle" vertical>
            
            <Tabs type="card" defaultActiveKey="1" items={items} />
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
            setModal={setModal}
            editModalOff={() => {
              setEditModal(false);
            }}
            triggerRender={() => {
              console.log("re-rendered");
              setComponentReload((prev) => prev + 1);
            }}
          />
        </>
      )}
    </>
  );
};

export default MakeFormTable;

// current: page,
// pageSize: pageSize,
// total: totalCount,
// showSizeChanger: true, // allows changing how many rows per page
// onChange: (page, pageSize) => {
//   setPage(page);
//   setPageSize(pageSize);
// }

// <Dropdown
//                 menu={{ items: view }}
//                 trigger={["click"]}
//                 onOpenChange={() => {
//                   setModal(row);
//                 }}
//               >
//                 <Button>
//                   Actions
//                   <DownOutlined />
//                 </Button>
//               </Dropdown>
