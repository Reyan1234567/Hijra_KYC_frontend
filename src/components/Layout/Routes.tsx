import { JSX, lazy } from "react";
import Attendance from "../Manager/Attendance.tsx";

const MakeFormTable = lazy(() => import("../MakeForm/AllMakeFormTable.tsx"));
const DraftsMakeFormTable = lazy(
  () => import("../MakeForm/DraftsMakeFormTable.tsx")
);
const Distribute = lazy(() => import("../Helper/Distribute.tsx"));
const Dashboard = lazy(() => import("../Dashboard/Dashboard.tsx"));
const Profile = lazy(() => import("../User/Profile.tsx"));
const KycManagerTable = lazy(() => import("../Manager/KycManagerTable.tsx"));
const KycManagerPendingTable = lazy(
  () => import("../Manager/KycManagerPendingTable.tsx")
);
const KycManagerApprovedTable = lazy(
  () => import("../Manager/KycManagerApprovedTable.tsx")
);
const KycManagerRejectedTable = lazy(
  () => import("../Manager/KycManagerRejectedTable.tsx")
);
const CheckerTable = lazy(() => import("../Checker/CheckerTable.tsx"));
const CheckerPendingTable = lazy(
  () => import("../Checker/CheckerPendingTable.tsx")
);
const CheckerApprovedTable = lazy(
  () => import("../Checker/CheckerApprovedTable.tsx")
);
const CheckerRejectedTable = lazy(
  () => import("../Checker/CheckerRejectedTable.tsx")
);
const Search = lazy(() => import("../Search.tsx"));
const PendingFormTable = lazy(
  () => import("../MakeForm/PendingMakeFormTabel.tsx")
);
const ApprovedFormTable = lazy(
  () => import("../MakeForm/ApprovedMakeFormTable.tsx")
);
const RejectedFormTable = lazy(
  () => import("../MakeForm/RejectedMakeFormTable.tsx")
);

interface routes {
  path: string;
  component: JSX.Element;
}

const routes: routes[] = [
  { path: "/", component: <Dashboard /> },
  { path: "/userProfiel", component: <Profile /> },
  { path: "/checkerTable", component: <CheckerTable /> },
  { path: "/makeForm", component: <MakeFormTable /> },
  { path: "/search", component: <Search /> },
  { path: "/distribute", component: <Distribute /> },
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/profile", component: <Profile /> },
  { path: "/manager", component: <KycManagerTable /> },
  { path: "/attendance", component: <Attendance /> },
  { path: "makeTable/drafts", component: <DraftsMakeFormTable /> },
  { path: "makeTable/pending", component: <PendingFormTable /> },
  { path: "makeTable/approved", component: <ApprovedFormTable /> },
  { path: "makeTable/rejected", component: <RejectedFormTable /> },
  { path: "checkTable/pending", component: <CheckerPendingTable /> },
  { path: "checkTable/approved", component: <CheckerApprovedTable /> },
  { path: "checkTable/rejected", component: <CheckerRejectedTable /> },
  { path: "manager/pending", component: <KycManagerPendingTable /> },
  { path: "manager/approved", component: <KycManagerApprovedTable /> },
  { path: "manager/rejected", component: <KycManagerRejectedTable /> },
];

export default routes;
