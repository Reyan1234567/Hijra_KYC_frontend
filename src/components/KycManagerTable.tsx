import { Flex, MenuProps, Spin, TableColumnsType, Tabs, TabsProps } from "antd";
import RequestTables from "./RequestTables";
import { useEffect, useState } from "react";
import { api } from "../services/axios";
import { allTableDataType } from "./MakeFormTable";
import DropDown from "./DropDown";
import { BookOutlined, EyeOutlined } from "@ant-design/icons";
import ManagerEdit from "./ManagerEdit";
import ManagerView from "./ManagerView";

const KycManagerTable = () => {
  const [trigger, setTrigger] = useState(0);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
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

  const [makeRequests, setMakeRequests] = useState<allTableDataType[]>([]);
  const [state, setState] = useState<"empty" | "loading" | "success" | "error">(
    "loading"
  );
  useEffect(() => {
    const getRequestsAssignedToMe = async () => {
      try {
        const makes = await api.get("/makeForm/manager");
        console.log(makes.data[0]);
        setMakeRequests(makes.data);
        if (makes.data.length === 0) {
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
  }, [trigger]);

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

  const assign: MenuProps["items"] = [
    {
      label: "view",
      key: "1",
      icon: <EyeOutlined />,
      onClick: () => {
        setViewModal(true);
      },
    },
    {
      label: "Edit HO Assignment",
      key: "2",
      icon: <BookOutlined />,
      onClick: () => {
        setEditModal(true);
      },
    },
  ];
  const columns: TableColumnsType<allTableDataType> = [
    {
      title: "Maker",
      dataIndex: "makerName",
    },
    {
      title: "Action",
      dataIndex: "status",
      render: (status: number, row: allTableDataType) => {
        if (status === 3 || status === 2) {
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
        } else if (status === 1) {
          return (
            <Flex justify="center">
              <DropDown
                menu={assign}
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

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "All Requests",
      children: (
        <RequestTables
          data={makeRequests.filter((req) => req.status !== 0)}
          colums={columns}
        />
      ),
    },
    {
      key: "3",
      label: "Pending",
      children: (
        <RequestTables
          data={makeRequests.filter((request) => request.status === 1)}
          colums={columns}
        />
      ),
    },
    {
      key: "4",
      label: "Approved",
      children: (
        <RequestTables
          data={makeRequests.filter((request) => request.status === 2)}
          colums={columns}
        />
      ),
    },
    {
      key: "5",
      label: "Rejected",
      children: (
        <RequestTables
          data={makeRequests.filter((request) => request.status === 3)}
          colums={columns}
        />
      ),
    },
  ];
  return (
    <>
      {state === "loading" && <Spin />}
      {state === "empty" && <RequestTables data={[]} colums={columns} />}
      {state === "error" && <p>Something wrong happened</p>}
      {state === "success" && (
        <>
          <Tabs type="card" defaultActiveKey="1" items={items} />
          <ManagerEdit
            modal={modal}
            open={editModal}
            onCancel={() => setEditModal(false)}
            triggerRender={() => setTrigger((prev) => prev + 1)}
          />
          <ManagerView modal={modal} open={viewModal} onCancel={()=>setViewModal(false)} />
        </>
      )}
    </>
  );
};

export default KycManagerTable;
