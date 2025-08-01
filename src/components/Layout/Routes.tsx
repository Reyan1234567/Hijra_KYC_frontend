import { lazy } from "react";

const MakeFormTable = lazy(() => import("../MakeForm/MakeFormTable.tsx"));
const Distribute = lazy(() => import("../Helper/Distribute.tsx"));
const Dashboard = lazy(() => import("../Dashboard/Dashboard.tsx"));
const Profile = lazy(() => import("../User/Profile.tsx"));
const KycManagerTable = lazy(() => import("../Manager/KycManagerTable.tsx"));
const CheckerTable = lazy(() => import("../Checker/CheckerTable.tsx"));
const MakeTable = lazy(() => import("../MakeForm/MakeFormTable.tsx"));
const Search = lazy(() => import("../Search.tsx"));

const routes = [
  { path: "/", exact: true, component: <Dashboard /> },
  { path: "/userProfiel", exact: true, component: <Profile /> },
  { path: "/checkerTable", component: <CheckerTable /> },
  { path: "/makerTable", component: <MakeTable /> },
  { path: "/makeForm", component: <MakeFormTable /> },
  { path: "/search", component: <Search /> },
  { path: "/distribute", component: <Distribute /> },
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/profile", component: <Profile /> },
  { path: "/kycManager", component: <KycManagerTable /> },
];

export default routes;
