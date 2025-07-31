import { lazy } from "react";

const MessagesPage = lazy(() => import("../pages/MessagesPage.tsx"));
const MessagesView = lazy(() => import("./MessagesView.tsx"));
const MakeFormTable = lazy(() => import("./MakeFormTable.tsx"));
const Distribute = lazy(() => import("./Distribute.tsx"));
const Dashboard = lazy(() => import("./Dashboard.tsx"));
const Profile = lazy(() => import("./Profile.tsx"));
const KycManagerTable = lazy(() => import("./KycManagerTable.tsx"));
const CheckerTable = lazy(() => import("./CheckerTable.tsx"));
const MakeTable = lazy(() => import("./MakeFormTable.tsx"));
const Search = lazy(() => import("./Search.tsx"));

const routes = [
  { path: "/", exact: true, component: <Dashboard /> },
  { path: "/userProfiel", exact: true, component: <Profile /> },
  { path: "/checkerTable", component: <CheckerTable /> },
  { path: "/makerTable", component: <MakeTable /> },
  { path: "/message", component: <MessagesPage /> },
  { path: "/messageChat", component: <MessagesView /> },
  { path: "/makeForm", component: <MakeFormTable /> },
  { path: "/search", component: <Search /> },
  { path: "/distribute", component: <Distribute /> },
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/profile", component: <Profile /> },
  { path: "/kycManager", component: <KycManagerTable /> },
];

export default routes;
