import {
  BookOutlined,
  DashboardOutlined,
  EditOutlined,
  FullscreenOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { Link } from "react-router-dom";
const SidebarMenu = () => {
  const menuItems = [
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
      key: "checkerTable",
      icon: <BookOutlined />,
      label: "Check Form",
      path: "/checkerTable",
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
  ];

  return (
    <div>
      <Menu
        mode="inline"
        defaultSelectedKeys={["shareHolder"]}
        style={{ height: "100%", borderRight: 0 }}
      >
        {menuItems.map((item) => (
          <Menu.Item key={item.key} icon={item.icon}>
            <Link to={item.path}>{item.label}</Link>
          </Menu.Item>
        ))}
      </Menu>
    </div>
  );
};

export default SidebarMenu;
