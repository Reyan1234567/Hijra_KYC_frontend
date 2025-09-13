/**
 * FULL LAYOUT COMPONENT
 * 
 * TYPE: Layout Component (Main Application Shell)
 * PURPOSE: Provides the main authenticated application layout with sidebar, header, content area, and messaging
 * 
 * FUNCTIONALITY:
 * - Main application layout with Ant Design Layout components
 * - Collapsible sidebar with logo and navigation menu (SidebarMenu component)
 * - Header with bank branding, user dropdown, and message notifications
 * - Role-based menu overlay for HO_Manager users with quick access buttons
 * - Content area with lazy-loaded routes using React Router
 * - Message drawer system with real-time notifications
 * - Dual drawer setup: main messages list and individual chat view
 * - Footer with bank branding and copyright
 * 
 * DATA FETCHING:
 * - Uses React Query client for cache management
 * - Invalidates notification queries when message drawer closes
 * - Message count from AuthContext for badge display
 * 
 * USER INTERACTIONS:
 * - Sidebar navigation via SidebarMenu component
 * - User dropdown with profile and logout options
 * - Message badge click opens messages drawer
 * - HO_Manager menu overlay with categorized admin functions
 * - Route-based content rendering with protection
 * - Logout functionality with API call and navigation
 * 
 * LIFECYCLE:
 * - Mounts with layout structure
 * - Manages drawer states for messaging system
 * - Handles responsive sidebar collapse
 * - Suspense fallback for lazy-loaded routes
 * 
 * ROLE PERMISSIONS: All authenticated users (layout adapts based on role)
 * ROUTING: Container for all authenticated routes
 */

import { Suspense, useContext, useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Drawer,
  Dropdown,
  Input,
  Layout,
  Spin,
  theme,
} from "antd";
import { useQueryClient } from "@tanstack/react-query";
import {
  MessageOutlined,
  UserOutlined,
  MenuOutlined,
  CloseOutlined,
  SearchOutlined,
  AppstoreOutlined,
  SettingOutlined,
  TeamOutlined,
  EyeOutlined,
  NotificationOutlined,
  CodeOutlined,
  LoginOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import logo from "../../assets/logo.png";
import { Route, Routes } from "react-router-dom";
import routes from "./Routes.tsx";
import MessagesPage from "../Message/MessagesPage.tsx";
import SidebarMenu from "./SidebarMenu.tsx";
import { useNavigate } from "react-router-dom";
import MessagesView, { messages } from "../Message/MessagesView.tsx";
import LoginForm from "../LoginForm.tsx";
import ProtectionRoute from "../../ProtectionRoute.tsx";
import { Logout } from "../../services/axios.ts";
import { AuthContext } from "../../context/AuthContext.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import useMessage from "antd/es/message/useMessage";

const { Header, Content, Footer, Sider } = Layout;
const { Search } = Input;

interface MenuItemType {
  code: string;
  title: string;
  icon: React.ReactNode;
  path: string;
}

const FullLayout = () => {
  const pathName = window.location.pathname;
  const USER = useContext(AuthContext);
  const navigate = useNavigate();
  const [_, contextHolder]=useMessage()
  const [open, setOpen] = useState(false);
  const [messageBadge, setMessageBadge] = useState(0);
  const [inOpen, setInOpen] = useState(false);
  const [chat, setChat] = useState<messages>({
    id: 0,
    senderName: "no-one",
    senderProfile: "no-profile",
  });
  const [menuVisible, setMenuVisible] = useState(false);
  const queryClient = useQueryClient();

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    // Invalidate notifications query when message drawer closes to update sidebar count
    queryClient.invalidateQueries({
      queryKey: ["notifications"],
    });
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    Logout();
    // localStorage.clear();
    // navigate("/");
  };

//  const handleLogout = async () => {
//  try {
//    await Logout(); // make sure your Logout() returns a Promise
//    console.log("Logout API call successful");
//  } catch (err) {
//    console.error("Logout failed", err);
//  } finally {
//    localStorage.clear(); // clear after API call
//    navigate("/");         // redirect to login
//  }
//};

  const User = localStorage.getItem("username") || "User";
  const role = localStorage.getItem("role") || "";

  const items = [
    {
      key: "1",
      label: <span>{User}</span>,
      onClick: () => {
        navigate("/userProfiel");
      },
    },
    {
      key: "2",
      label: (
        <span onClick={handleLogout} style={{ color: "red" }}>
          Logout
        </span>
      ),
    },
  ];

  const firstRowItems: MenuItemType[] = [
    {
      code: "001",
      title: "Company Info",
      icon: <AppstoreOutlined />,
      path: "/company-info",
    },
    {
      code: "002",
      title: "Server Config",
      icon: <SettingOutlined />,
      path: "/server-config",
    },
    {
      code: "003",
      title: "Add Role",
      icon: <TeamOutlined />,
      path: "/AddRole",
    },
    {
      code: "004",
      title: "View Roles",
      icon: <EyeOutlined />,
      path: "/View_Role",
    },
    {
      code: "005",
      title: "Broadcast Message",
      icon: <NotificationOutlined />,
      path: "/broadcast",
    },
  ];

  const secondRowItems: MenuItemType[] = [
    {
      code: "006",
      title: "Add District",
      icon: <NotificationOutlined />,
      path: "/Add_District",
    },
    {
      code: "007",
      title: "View Issue Branch",
      icon: <CodeOutlined />,
      path: "/View_Branch",
    },
    {
      code: "008",
      title: "View Login",
      icon: <LoginOutlined />,
      path: "/View_Login",
    },
    {
      code: "009",
      title: "View Profile",
      icon: <ProfileOutlined />,
      path: "/ViewProfile",
    },
  ];

  return(
    <Layout style={{ height: "100vh", overflowX: "hidden" }}>
      {/*<ReactQueryDevtools initialIsOpen={false} />*/}
      {contextHolder}
      <Sider
        style={{ backgroundColor: "white" }}
        theme="light"
        breakpoint="lg"
        collapsedWidth="0"
      >
        <div className="demo-logo-vertical" />
        <div
          style={{
            width: "100%",
            borderColor: "white",
            marginTop: "10px",
            borderWidth: "5px",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <img
            style={{ padding: "10px", marginRight: "20px" }}
            src={logo}
            alt="logo"
            width={120}
            height={100}
          />
        </div>
        <Divider type="horizontal" />
        <SidebarMenu />
      </Sider>
      <Layout>
        <Header
          style={{
            background: "#115dcc",
            color: "white",
            position: "relative",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: "0 20px",
          }}
        >
          <h1
            style={{
              fontSize: "2rem",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            Hijra Bank
          </h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: "auto",
              justifyContent: "space-around",
              gap: "16px",
            }}
          >
            {role === "HO_Manager" && (
              <Button
                type="text"
                icon={
                  <MenuOutlined style={{ color: "white", fontSize: "20px" }} />
                }
                onClick={() => setMenuVisible(true)}
              />
            )}

            <div>
              <Dropdown menu={{ items }} placement="bottom">
                <Avatar
                  style={{
                    backgroundColor: "#87d068",
                  }}
                  icon={<UserOutlined />}
                />
              </Dropdown>
            </div>

            <div style={{ marginLeft: "10px" }}>
              <Badge count={USER?.messageCount}>
                <Avatar
                  style={{ backgroundColor: "black" }}
                  onClick={showDrawer}
                >
                  <MessageOutlined />
                </Avatar>
              </Badge>
            </div>
          </div>
        </Header>

        {menuVisible && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "white",
              zIndex: 1001,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "80px 24px 24px",
              overflow: "auto",
            }}
          >
            <div
              style={{
                width: "60%",
                maxWidth: "800px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Button
                type="text"
                icon={<CloseOutlined style={{ fontSize: "20px" }} />}
                onClick={() => setMenuVisible(false)}
                style={{ position: "absolute", top: "20px", left: "20px" }}
              />

              <Search
                placeholder="Search..."
                prefix={<SearchOutlined />}
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  marginBottom: "70px",
                }}
                size="large"
              />

              {/* First Row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                  gap: "16px",
                  width: "100%",
                  justifyItems: "center",
                  marginBottom: "40px",
                }}
              >
                {firstRowItems.map((item: MenuItemType) => (
                  <Button
                    key={item.code}
                    type="text"
                    onClick={() => {
                      navigate(item.path);
                      setMenuVisible(false);
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "16px 12px",
                      border: "1px solid #f0f0f0",
                      borderRadius: "12px",
                      minWidth: "140px",
                      fontWeight: 600,
                      backgroundColor: "#fafafa",
                      transition: "all 0.2s ease-in-out",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#e6f7ff")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#fafafa")
                    }
                  >
                    <div style={{ fontSize: "26px", marginBottom: "6px" }}>
                      {item.icon}
                    </div>
                    <div style={{ fontWeight: 700, textAlign: "center" }}>
                      {item.code} {item.title}
                    </div>
                  </Button>
                ))}
              </div>

              {/* Second Row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                  gap: "16px",
                  width: "100%",
                  justifyItems: "center",
                  marginBottom: "40px",
                }}
              >
                {secondRowItems.map((item: MenuItemType) => (
                  <Button
                    key={item.code}
                    type="text"
                    onClick={() => {
                      navigate(item.path);
                      setMenuVisible(false);
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "16px 12px",
                      border: "1px solid #f0f0f0",
                      borderRadius: "12px",
                      minWidth: "140px",
                      fontWeight: 600,
                      backgroundColor: "#fafafa",
                      transition: "all 0.2s ease-in-out",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#e6f7ff")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#fafafa")
                    }
                  >
                    <div style={{ fontSize: "26px", marginBottom: "6px" }}>
                      {item.icon}
                    </div>
                    <div style={{ fontWeight: 700, textAlign: "center" }}>
                      {item.code} {item.title}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        <Content
          style={{
            margin: "24px 16px 0",
            maxHeight: "100%",
            maxWidth: "100%",
            overflowY: "auto",
            overflowX: "auto",
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: "78vh",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Suspense
              fallback={
                <Spin
                  style={{ position: "absolute", left: "50%", top: "50%" }}
                  size="large"
                />
              }
            >
              <Routes>
                <Route element={<ProtectionRoute />}>
                  {routes.map(({ path, component }, index) => (
                    <Route path={path} key={index} element={component} />
                  ))}
                </Route>
              </Routes>
            </Suspense>
          </div>
        </Content>
        <Footer
          style={{
            background: "#115dcc",
            color: "white",
            textAlign: "center",
            marginBottom: "0rem",
            alignSelf: "stretch",
            fontSize: "1rem",
            height: "1.2rem",
            paddingTop: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Hijra Bank ©{new Date().getFullYear()} Created by Hijra Bank
          Developers
        </Footer>
      </Layout>
      <Drawer
        title="Messages"
        closable={{ "aria-label": "Close Button" }}
        onClose={onClose}
        open={open}
      >
        <MessagesPage
          open={inOpen}
          setOpen={setInOpen}
          setChatInfo={setChat}
          badge={messageBadge}
          setBadge={setMessageBadge}
        />
      </Drawer>
      <Drawer onClose={() => setInOpen(false)} open={inOpen} closable={false}>
        <MessagesView messageInfo={chat} setInOpen={setInOpen} />
      </Drawer>
    </Layout>
  );
};

export default FullLayout;
