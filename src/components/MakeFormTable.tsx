import { useEffect, useState } from "react";
import {
  Button,
  Dropdown,
  Flex,
  message,
  Spin,
  Table,
  Tag,
} from "antd";
import type { MenuProps, TableColumnsType } from "antd";
import { api } from "../services/axios";
import {
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  SendOutlined,
} from "@ant-design/icons";

import { ExtractDate } from "../services/DisplayFunctions";
import EditModal from "./EditModal";
import ViewModal from "./viewModal";

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
}
interface dropDownInterface {
  menu: MenuProps["items"];
  onChange: () => void;
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
  const edit: MenuProps["items"] = [
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
      onClick: async () => {
        await api.patch(`makeForm/sendToHo/${modal.id}`);
      },
    },
  ];

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
  });
  const columns: TableColumnsType<allTableDataType> = [
    { title: "Cif", dataIndex: "cif" },
    { title: "Customer Account", dataIndex: "customerAccount" },
    { title: "Customer Name", dataIndex: "customerName" },
    { title: "Customer Phone", dataIndex: "customerPhone" },
    {
      title: "Made At",
      dataIndex: "madeAt",
      render: (madeAt) => <Flex justify="center">{ExtractDate(madeAt)}</Flex>,
    },
    {
      title: "Checked At",
      dataIndex: "checkedAt",
      render: (checkedAt) => (
        <Flex justify="center">{ExtractDate(checkedAt)}</Flex>
      ),
    },
    {
      title: "Checker Name",
      dataIndex: "hoName",
      render: (hoName) =>
        hoName === null || hoName === " " ? (
          <Flex justify="center" align="center">
            ---------
          </Flex>
        ) : (
          hoName
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: number) =>
        status === 0 ? (
          <Tag color="yellow">In Drafts</Tag>
        ) : status === 1 ? (
          <Tag color="blue">Pending</Tag>
        ) : status === 2 ? (
          <Tag color="green">Accepted</Tag>
        ) : (
          <Tag color="red">Rejected</Tag>
        ),
    },
    {
      title: "Actions",
      dataIndex: "status",
      render: (status: number, row: allTableDataType) => {
        if (status === 0) {
          return (
            <Flex justify="center" align="center">
              <DropDown
                menu={draft}
                onChange={() => {
                  setModal(row);
                }}
              />
            </Flex>
          );
        } else if (status === 3) {
          return (
            <Flex justify="center" align="center">
              <DropDown
                menu={edit}
                onChange={() => {
                  setModal(row);
                }}
              />
            </Flex>
          );
        } else {
          return (
            <Flex justify="center" align="center">
              <DropDown
                menu={view}
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

  const DropDown = (drop: dropDownInterface) => (
    <Dropdown
      menu={{ items: drop.menu }}
      trigger={["click"]}
      onOpenChange={drop.onChange}
    >
      <Button>
        Actions
        <DownOutlined />
      </Button>
    </Dropdown>
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [state, setState] = useState<"empty" | "loading" | "success" | "error">(
    "loading"
  );
  const [makeForms, setMakeForms] = useState<allTableDataType[]>();
  useEffect(() => {
    const fetchAccepted = async () => {
      try {
        const form = await api.get("/makeForm", { params: { makerId: 10 } });
        if (!form || form.data.length === 0) {
          setState("empty");
        } else {
          setState("success");
          console.log("form.data" + form.data);
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

  return (
    <>
      {state === "empty" && <Table<allTableDataType> columns={columns} />}
      {state === "loading" && <Spin size="large" />}
      {state === "error" && <p>Something wrong happened</p>}
      {state === "success" && (
        <>
          {contextHolder}
          <Flex gap="middle" vertical>
            <Table<allTableDataType>
              columns={columns}
              dataSource={makeForms}
              pagination={{
                showSizeChanger: true,
                pageSizeOptions: ["5", "10", "20", "50", "100", "200"],
              }}
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
            setModal={setModal}
            editModalOff={() => {
              setEditModal(false);
            }}
            triggerRender={() => setComponentReload((prev) => prev + 1)}
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
