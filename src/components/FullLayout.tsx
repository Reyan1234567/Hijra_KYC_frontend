import { Suspense, useState } from "react";
import {
  Avatar,
  Badge,
  Divider,
  Drawer,
  Dropdown,
  Layout,
  Spin,
  theme,
} from "antd";
import { MessageOutlined, UserOutlined } from "@ant-design/icons";
import logo from "../assets/logo.png";
import { Route, Routes } from "react-router-dom";

import routes from "./Routes.tsx";
import MessagesPage from "../pages/MessagesPage.tsx";
import SidebarMenu from "./SidebarMenu.tsx";
import { useNavigate } from "react-router-dom";
import MessagesView, { messages } from "./MessagesView.tsx";

const { Header, Content, Footer, Sider } = Layout;

const FullLayout = () => {
  const [open, setOpen] = useState(false);
  const [inOpen, setInOpen] = useState(false);
  const [chat, setChat] = useState<messages>({
    id: 0,
    senderName: "no-one",
    senderProfile: "no-profile",
  });
  const navigate = useNavigate();

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {};

  const items = [
    {
      key: "1",
      label: <span>User</span>,
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

  return (
    <Layout style={{ height: "100vh", overflowX:"hidden"}}>
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
            }}
          >
            <div>
              <Dropdown menu={{ items }} placement="bottom">
                <Badge count={0}>
                  <Avatar
                    style={{
                      backgroundColor: "#87d068",
                    }}
                    icon={<UserOutlined />}
                  />
                </Badge>
              </Dropdown>
            </div>
            <div style={{ marginLeft: "10px" }}>
              <Badge count={0}>
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
        <Content
          style={{
            margin: "24px 16px 0",
            maxHeight: "100%",
            maxWidth:"100%",
            overflowY: "auto",
            overflowX:"auto"
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
                {routes.map(({ path, component }, index) => (
                  <Route path={path} key={index} element={component} />
                ))}
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
        <MessagesPage open={inOpen} setOpen={setInOpen} setChatInfo={setChat} />
      </Drawer>
      <Drawer onClose={() => setInOpen(false)} open={inOpen} closable={false}>
        <MessagesView messageInfo={chat} setInOpen={setInOpen}/>
      </Drawer>
    </Layout>
  );
};
export default FullLayout;
