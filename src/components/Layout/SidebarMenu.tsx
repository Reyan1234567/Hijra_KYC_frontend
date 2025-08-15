import {
  BookOutlined,
  DashboardOutlined,
  EditOutlined,
  FullscreenOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Badge, Menu } from "antd";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Attendance from "../Manager/Attendance";

const SidebarMenu = () => {
  const USER = useContext(AuthContext);
  // const all = [
  //   {
  //     key: "dashboard",
  //     icon: <DashboardOutlined />,
  //     label: "Dashboard",
  //     path: "/",
  //   },
  //   {
  //     key: "makeFormTable",
  //     icon: <EditOutlined />,
  //     label: "Make Form",
  //     path: "/makeForm",
  //   },
  //   {
  //     key: "checkerTable",
  //     icon: <BookOutlined />,
  //     label: "Check Form",
  //     path: "/checkerTable",
  //   },
  //   {
  //     key: "kycManagerTable",
  //     icon: <UserOutlined />,
  //     label: "KYC Manager",
  //     path: "/kycManager",
  //   },
  //   {
  //     key: "distributer",
  //     icon: <FullscreenOutlined />,
  //     label: "Distribute",
  //     path: "/distribute",
  //   },
  // ];

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
      path: "/makeForm",
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
      Badge: 2,
    },
    {
      key: "checkerTable",
      icon: <BookOutlined />,
      label: "Check Form",
      path: "/checkerTable",
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
      path: "/kycManager",
    },
    {
      key: "distributer",
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

  return USER?.user?.role === "maker" ? (
    <div>
      <Menu
        mode="inline"
        defaultSelectedKeys={["shareHolder"]}
        style={{ borderRight: 0 }}
      >
        {maker.map((item) => (
          <Menu.Item key={item.key} icon={item.icon}>
            <Link to={item.path}>{item.label}</Link>
          </Menu.Item>
        ))}
      </Menu>
    </div>
  ) : USER?.user?.role === "HO_Checker" ? (
    <>
      <Menu
        mode="inline"
        defaultSelectedKeys={["shareHolder"]}
        style={{ borderRight: 0 }}
      >
        {checker.map((item) => (
          <Menu.Item key={item.key} icon={item.icon}>
            <Link to={item.path}>{item.label}</Link>
          </Menu.Item>
        ))}
      </Menu>
    </>
  ) : USER?.user?.role === "HO_Manager" ? (
    <>
      <Menu
        mode="inline"
        defaultSelectedKeys={["shareHolder"]}
        style={{ borderRight: 0 }}
      >
        {manager.map((item) => (
          <Menu.Item key={item.key} icon={item.icon}>
            <Link to={item.path}>{item.label}</Link>
          </Menu.Item>
        ))}
      </Menu>
    </>
  ) : (
    <></>
  );
};

export default SidebarMenu;
