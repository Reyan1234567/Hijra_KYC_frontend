import {
  BookOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DashboardOutlined,
  EditOutlined,
  FormOutlined,
  FullscreenOutlined,
  ProfileOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Badge, Menu } from "antd";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../services/axios";
import { useQuery } from "@tanstack/react-query";

const SidebarMenu = () => {
  const navigate = useNavigate();
  const USER = useContext(AuthContext);

  useQuery({
    queryKey: [],
    queryFn: async () => {
      const res = await api.get("/message/unread");
      USER?.setMessageCount(res?.data);
      console.log(res);
      const resp = await api.get("/makeForm/getRejected");
      console.log(resp);
      USER?.setRejectedCount(resp?.data);
      const respo = await api.get("/makeForm/getPending");
      console.log(res);
      USER?.setRejectedCount(respo?.data);
    },
    refetchInterval: 40000,
  });

  // useQuery({
  //   queryKey: [],
  //   queryFn: async () => {
  //     return res;
  //   },
  //   refetchInterval: 4000,
  // });

  const { data: pending } = useQuery({
    queryKey: [],
    queryFn: async () => await api.get("/makeForm/getPending"),
    refetchInterval: 4000,
  });

  USER?.setPendingCount(pending?.data);
  const maker = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      path: "/",
    },
    {
      key: "makeFormTable",
      icon: <EditOutlined />,
      label: (
        <>
          {USER?.rejectedCount ? (
            <>
              Make Form{" "}
              <Badge size={"small"} count={USER?.rejectedCount}></Badge>
            </>
          ) : (
            "Make Form"
          )}
        </>
      ),
      children: [
        {
          key: "makeForm",
          icon: <ProfileOutlined />,
          label: "All Requests",
          path: "/makeForm",
        },
        {
          key: "makeTable/drafts",
          icon: <FormOutlined />,
          label: "Drafts",
        },
        {
          key: "makeTable/pending",
          icon: <ClockCircleOutlined />,
          label: "Pending",
        },
        {
          key: "makeTable/approved",
          icon: <CheckCircleOutlined />,
          label: "Approved",
        },
        {
          key: "makeTable/rejected",
          icon: <CloseCircleOutlined />,
          label: (
            <>
              {USER?.rejectedCount ? (
                <>
                  Rejected{" "}
                  <Badge size={"small"} count={USER?.rejectedCount}></Badge>
                </>
              ) : (
                "Rejected"
              )}
            </>
          ),
        },
      ],
    },
    {
      key: "search",
      icon: <SearchOutlined />,
      label: "Search",
      path: "/search",
    },
  ];

  const checker = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      path: "/",
    },
    {
      key: "checkerTable",
      icon: <BookOutlined />,
      label: (
        <>
          {USER?.pendingCount ? (
            <>
              Check Form{" "}
              <Badge size={"small"} count={USER?.pendingCount}></Badge>
            </>
          ) : (
            "Check Form"
          )}
        </>
      ),
      children: [
        {
          key: "checkerTable",
          label: "All Requests",
          icon: <ProfileOutlined />,
        },
        {
          key: "checkTable/pending",
          label: (
            <>
              {USER?.pendingCount ? (
                <>
                  Pending{" "}
                  <Badge size={"small"} count={USER?.pendingCount}></Badge>
                </>
              ) : (
                "Pending"
              )}
            </>
          ),
          icon: <ClockCircleOutlined />,
        },
        {
          key: "checkTable/approved",
          label: "Approved",
          icon: <CheckCircleOutlined />,
        },
        {
          key: "checkTable/rejected",
          label: "Rejected",
          icon: <CloseCircleOutlined />,
        },
      ],
    },
    {
      key: "search",
      icon: <SearchOutlined />,
      label: "Search",
      path: "/search",
    },
  ];

  const manager = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      path: "/",
    },
    {
      key: "kycManagerTable",
      icon: <UserOutlined />,
      label: "KYC Manager",
      children: [
        { key: "manager", icon: <ProfileOutlined />, label: "All Requests" },
        {
          key: "manager/pending",
          icon: <ClockCircleOutlined />,
          label: "Pending",
        },
        {
          key: "manager/approved",
          icon: <CheckCircleOutlined />,
          label: "Approved",
        },
        {
          key: "manager/rejected",
          icon: <ClockCircleOutlined />,
          label: "Rejected",
        },
      ],
    },
    {
      key: "distribute",
      icon: <FullscreenOutlined />,
      label: "Distribute",
      path: "/distribute",
    },
    {
      key: "search",
      icon: <SearchOutlined />,
      label: "Search",
      path: "/search",
    },
  ];

  const onclick = (e) => {
    navigate(e.key);
  };

  return USER?.user?.role === "maker" ? (
    <div>
      <Menu
        mode="inline"
        defaultSelectedKeys={["shareHolder"]}
        style={{ borderRight: 0 }}
        items={maker}
        onClick={onclick}
      />
    </div>
  ) : USER?.user?.role === "HO_Checker" ? (
    <>
      <Menu
        mode="inline"
        defaultSelectedKeys={["shareHolder"]}
        style={{ borderRight: 0 }}
        items={checker}
        onClick={onclick}
      />
    </>
  ) : USER?.user?.role === "HO_Manager" ? (
    <>
      <Menu
        mode="inline"
        defaultSelectedKeys={["shareHolder"]}
        style={{ borderRight: 0 }}
        items={manager}
        onClick={onclick}
      />
    </>
  ) : (
    <></>
  );
};

export default SidebarMenu;
