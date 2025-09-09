import {
  BookOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DashboardOutlined,
  EditOutlined,
  FormOutlined,
  ProfileOutlined,
  SearchOutlined,
  UserOutlined,
  ProjectOutlined,
  OrderedListOutlined,
  ZoomInOutlined,
  FundOutlined,
  UnorderedListOutlined,
  FullscreenOutlined,
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
    queryKey: ["notifications"],
    queryFn: async () => {
      // if (USER?.user?.role == "maker") {
      //   const resp = await api.get("/makeForm/getRejected");
      //   USER?.setRejectedCount(resp?.data);
      // } else if (USER?.user?.role == "HO_Checker") {
      //   const respo = await api.get("/makeForm/getPending");
      //   USER?.setPendingCount(respo?.data);
      // }
      const resp = await api.get("/makeForm/getRejected");
        USER?.setRejectedCount(resp?.data);
      const respo = await api.get("/makeForm/getPending");
        USER?.setPendingCount(respo?.data);
      const res = await api.get("/message/unread");
      USER?.setMessageCount(res?.data);
    },
    refetchInterval: 1000 * 60,
  });

  // --- Define menus ---
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
              Make Form <Badge size="small" count={USER?.rejectedCount} />
            </>
          ) : (
            "Make Form"
          )}
        </>
      ),
      children: [
        // { key: "makeForm", icon: <ProfileOutlined />, label: "All Requests" },
        { key: "makeTable/drafts", icon: <FormOutlined />, label: "Drafts" },
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
                  Rejected <Badge size="small" count={USER?.rejectedCount} />
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
              Check Form <Badge size="small" count={USER?.pendingCount} />
            </>
          ) : (
            "Check Form"
          )}
        </>
      ),
      children: [
        // {
        //   key: "checkerTable",
        //   label: "All Requests",
        //   icon: <ProfileOutlined />,
        // },
        {
          key: "checkTable/pending",
          label: (
            <>
              {USER?.pendingCount ? (
                <>
                  Pending <Badge size="small" count={USER?.pendingCount} />
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
      key: "attendance",
      icon: <UnorderedListOutlined />,
      label: "Attendance",
      path: "/attendance",
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
    {
      key: "reports",
      icon: <ProjectOutlined />,
      label: "Reports",
      children: [
        {
          key: "reports/detail",
          icon: <OrderedListOutlined />,
          label: "Detail Report",
        },
        {
          key: "reports/summary",
          icon: <ZoomInOutlined />,
          label: "Summary Report",
        },
        {
          key: "reports/checker",
          icon: <FundOutlined />,
          label: "Checker Report",
        },
      ],
    },
  ];
  const district = [
    { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard", path: "/" },
    {
          key: "reports",
          icon: <ProjectOutlined />,
          label: "Reports",
          children: [
              {
                  key: "reports/summary",
                  icon: <ZoomInOutlined />,
                  label: "Summary Report",
              },
          ],
      },

    
  ];

  const onclick = (e) => {
    navigate(e.key);
  };

  // --- Role Title below logo ---
  const role = localStorage.getItem("role");
  const getRoleLabel = () => {
    if (role === "HO_Manager") return "KYC Manager";
    if (role === "maker") return "Branch Maker";
    if (role === "HO_Checker") return "HO_Checker";
    if(role==="District") return "Distrcit MAnager";
    return "";
  };

  return (
    <div>
      {/* Title below logo */}
      <div
        style={{
          textAlign: "center",
          fontWeight: "700",
          fontSize: "16px",
          color: "#333",
          padding: "8px 0",
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}
      >
        {getRoleLabel()}
      </div>

      {/* Sidebar Menu */}
      {USER?.user?.role === "maker" ? (
        <Menu
          mode="inline"
          style={{ borderRight: 0 }}
          items={maker}
          onClick={onclick}
        />
      ) : USER?.user?.role === "HO_Checker" ? (
        <Menu
          mode="inline"
          style={{ borderRight: 0 }}
          items={checker}
          onClick={onclick}
        />
      ) : USER?.user?.role === "HO_Manager" ? (
        <Menu
          mode="inline"
          style={{ borderRight: 0 }}
          items={manager}
          onClick={onclick}
        />
      ) : USER?.user?.role==="District"?(
        <Menu
        mode="inline"
        style={{borderRight:0}}
        items={district}
        onClick={onclick}
        />
      ):null}
    </div>
  );
};

export default SidebarMenu;
