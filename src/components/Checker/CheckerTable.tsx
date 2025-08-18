import {
  Flex,
  MenuProps,
  message,
  Spin,
  Table,
  TableColumnsType,
  Tabs,
  TabsProps,
} from "antd";
import RequestTables from "../Helper/Table/RequestTables";
import { useContext, useEffect, useState } from "react";
import { api } from "../../services/axios";
import DateDropDown from "../Helper/DateDropdown/DateDropDown";
import { allTableDataType } from "../MakeForm/AllMakeFormTable";
import DropDown from "../Helper/DateDropdown/DropDown";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import CheckerEditModal from "./CheckerEditModal";
import ViewModal from "../Helper/RequestModals/ViewModal";
import { AuthContext } from "../../context/AuthContext";

const CheckerTable = () => {
  const [, /*messageApi*/ contextHolder] = message.useMessage();
  const today = new Date();
  const [trigger, setTrigger] = useState(0);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [date, setDate] = useState(
    new Date(today.setMonth(today.getMonth(), 1))
  );
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

  const [makeRequests, setMakeRequests] = useState<allTableDataType[]>([]);
  const [state, setState] = useState<"empty" | "loading" | "success" | "error">(
    "loading"
  );
  useEffect(() => {
    const getRequestsAssignedToMe = async () => {
      try {
        const makes = await api.get("/makeForm/getHo", {
          params: { hoUserId: USER?.user?.userId, date: date },
        });
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
  }, [trigger, date, USER?.user?.userId]);

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

  const edit: MenuProps["items"] = [
    {
      label: "view",
      key: "1",
      icon: <EyeOutlined />,
      onClick: () => {
        setViewModal(true);
      },
    },
    {
      label: "Edit",
      key: "2",
      icon: <EditOutlined />,
      onClick: () => {
        setEditModal(true);
      },
    },
  ];
  const columns: TableColumnsType<allTableDataType> = [
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
                menu={edit}
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
            <h1>Check Table</h1>
            <DateDropDown date={date} setDate={setDate} />
          </div>
          <Table />
        </>
      )}
      {state === "error" && <p>Something wrong happened</p>}
      {state === "success" && (
        <>
          {contextHolder}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1>Check Table</h1>
            <DateDropDown date={date} setDate={setDate} />
          </div>
          <Tabs type="card" defaultActiveKey="1" items={items} />
          <CheckerEditModal
            modal={modal}
            open={editModal}
            onCancel={() => setEditModal(false)}
            triggerRender={() => setTrigger((prev) => prev + 1)}
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

export default CheckerTable;
