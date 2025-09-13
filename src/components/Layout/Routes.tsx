/*
 * HIJRA KYC FRONTEND - APPLICATION ROUTES CONFIGURATION
 * 
 * FILE TYPE: Routing Configuration
 * PURPOSE: Defines all application routes and their corresponding components
 * 
 * FUNCTIONALITY:
 * - Lazy loads all page components for better performance
 * - Maps URL paths to React components
 * - Supports parameterized routes (e.g., /Edit_Role/:roleId)
 * - Organizes routes by functional areas (make forms, checker tables, etc.)
 * 
 * ROUTE CATEGORIES:
 * 1. DASHBOARD & MAIN PAGES:
 *    - "/" & "/dashboard": Dashboard (main landing page)
 *    - "/profile" & "/userProfiel": User Profile
 *    - "/search": Search functionality
 * 
 * 2. MAKE FORM PAGES (Maker Role):
 *    - "/makeForm": All make forms table
 *    - "makeTable/drafts": Draft forms
 *    - "makeTable/pending": Pending forms  
 *    - "makeTable/approved": Approved forms
 *    - "makeTable/rejected": Rejected forms
 * 
 * 3. CHECKER PAGES (Checker Role):
 *    - "/checkerTable": All checker forms
 *    - "checkTable/pending": Pending checker forms
 *    - "checkTable/approved": Approved checker forms
 *    - "checkTable/rejected": Rejected checker forms
 * 
 * 4. MANAGER PAGES (Manager Role):
 *    - "/manager": Manager table view
 *    - "manager/pending": Pending manager forms
 *    - "manager/approved": Approved manager forms
 *    - "manager/rejected": Rejected manager forms
 *    - "/attendance": Attendance management
 *    - "/distribute": Form distribution
 *    - "View_Login": Login activity view
 * 
 * 5. ADMIN PAGES:
 *    - "/AddRole", "/Edit_Role/:roleId", "/View_Role": Role management
 *    - "/Add_Branch", "/Edit_branch/:id", "/View_Branch": Branch management
 *    - "/Add_District": District management
 *    - "/Edit_Profile/:id", "/ViewProfile": Profile management
 * 
 * 6. REPORTS:
 *    - "reports/detail": Detailed reports
 *    - "reports/summary": Summary reports
 *    - "reports/checker": Checker reports
 * 
 * USED BY: FullLayout.tsx for rendering appropriate components based on current route
 */

import { JSX, lazy } from "react";
import Attendance from "../Manager/Attendance.tsx";

// Lazy load components from the first code
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

// Lazy load your pages from the first code
const AddRole = lazy(() => import("../userRole/AddRole"));
const EditRole = lazy(() => import("../userRole/Edit_Role"));
const ViewRole = lazy(() => import("../userRole/View_Role"));
const AddBranch = lazy(() => import("../IssueBranch/Add_Branch"));
const Edit_branch = lazy(() => import("../IssueBranch/Edit_branch"));
const View_branch = lazy(() => import("../IssueBranch/View_branch"));
const AddDistrict = lazy(() => import("../IssueBranch/Add_District"));
const EditProfile = lazy(() => import("../UserProfile/Edit_Profile"));
const ViewProfile = lazy(() => import("../UserProfile/ViewProfile"));
const View_Login=lazy(()=> import("../../components/Manager/View_Login.tsx"));
const CheckerReport=lazy(()=>import("../../components/Report/CheckerReport.tsx"));
const DetailReport=lazy(()=>import("../../components/Report/DetailReport.tsx"));
const SummaryReport=lazy(()=>import("../../components/Report/SummaryReport.tsx"));

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
  { path: "/AddRole", component: <AddRole /> },
  { path: "/Edit_Role/:roleId", component: <EditRole /> },
  { path: "/View_Role", component: <ViewRole /> },
  { path: "/Add_Branch", component: <AddBranch /> },
  { path: "/Edit_branch/:id", component: <Edit_branch /> },
  { path: "/View_Branch", component: <View_branch /> },
  { path: "/Add_District", component: <AddDistrict /> },
  { path: "/Edit_Profile/:id", component: <EditProfile /> },
  { path: "/ViewProfile", component: <ViewProfile /> },
  {path:"View_Login", component:<View_Login/>},
  { path: "reports/detail", component: <DetailReport /> },
    { path: "reports/summary", component: <SummaryReport /> },
    { path: "reports/checker", component: <CheckerReport /> },
];

export default routes;