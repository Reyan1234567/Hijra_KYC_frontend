import { Flex, MenuProps, Spin, TableColumnsType } from "antd";
import RequestTables from "./RequestTables";
import { useEffect, useState } from "react";
import { api } from "../services/axios";
import { allTableDataType } from "./MakeFormTable";
import DropDown from "./DropDown";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import CheckerEditModal from "./CheckerEditModal";
import ViewModal from "./viewModal";

const CheckerTable = () => {
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
    backReason:""
  });

  const [makeRequests, setMakeRequests] = useState<allTableDataType[]>([]);
  const [state, setState] = useState<"empty" | "loading" | "success" | "error">(
    "loading"
  );
  useEffect(() => {
    const getRequestsAssignedToMe = async () => {
      try {
        const makes = await api.get("/makeForm/getHo", {
          params: { hoUserId: 9 },
        });
        console.log(makes.data[0])
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
        if (status === 1 || status === 2) {
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
        } else if (status === 3 || status === 0) {
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

  return (
    <>
      {state === "loading" && <Spin />}
      {state === "empty" && <RequestTables data={[]} colums={columns} />}
      {state === "error" && <p>Something wrong happened</p>}
      {state === "success" && (
        <>
          <RequestTables data={makeRequests} colums={columns} />
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
