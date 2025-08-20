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
import { Menu } from "antd";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const SidebarMenu = () => {
  const navigate = useNavigate();
  const USER = useContext(AuthContext);

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
      label: "Make Form",
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
          label: "Rejected",
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
      label: "Check Form",
      children: [
        {
          key: "checkerTable",
          label: "All Requests",
          icon: <ProfileOutlined />,
        },
        {
          key: "checkTable/pending",
          label: "Pending",
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
          icon: <ClockCircleOutlined/>,
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
