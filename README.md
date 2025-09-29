# Hijra KYC Frontend – Developer Documentation


## 1. Overview

This is the frontend for the Hijra KYC System.
It provides the Maker-Checker-Manager workflow for customer KYC data entry, approval/rejection, and reporting.

**Tech Stack:** React (TypeScript) + Vite + Ant Design + Axios

**Main Features:**

-**Maker:** Create, edit, submit KYC requests
-**Checker:** Approve/Reject requests
-**Manager:** Assign checkers, view attendance, oversee approvals
-**Reports:** Summary and detailed KYC reports
-**User management:** Roles, profiles, branch management

## 2. Prerequisites

-Node.js >=18.x
-npm (comes with Node) or yarn
-Backend API (Spring Boot, runs separately)

## 3. Getting Started

```bash
# Clone repo
git clone <repo-url>
cd Hijra_KYC_frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env and set VITE_API_BASE_URL=http://localhost:8080/api

# Run in development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---
## 4. Project Structure
src/
  App.tsx                # Main app component
  main.tsx               # Entry point
  ProtectionRoute.tsx    # Route guard for auth
  assets/                # Images, logos
  components/            # Major UI components
    Checker/             # Checker dashboards & tables
    Dashboard/           # Manager dashboard
    Helper/              # Reusable modals, dropdowns, tables
    IssueBranch/         # Branch management screens
    Layout/              # Layout & sidebar navigation
    MakeForm/            # Maker KYC forms & tables
    Manager/             # Manager assignments & approvals
    Message/             # Chat & messaging features
    Report/              # Reports (summary, detail, checker)
    User/                # User profile
    UserProfile/         # Edit / view user profile
    userRole/            # Role management (Add/Edit/View)
  context/               # Auth context & provider
  services/              # API calls (Axios)
  types/                 # TypeScript interfaces

## 5. Routing & Navigation
-Routes are defined in: **src/components/Layout/Routes.tsx**
-Key routes include:
-`/login` → LoginForm.tsx
-`/maker` → Maker KYC forms (MakeForm/*)
-`/checker` → Checker tables (Checker/*)
-`/manager` → Manager dashboard + assignments (Manager/*)
-`/reports` → KYC reports (Report/*)
-`/profile` → Edit/View profile (UserProfile/*)
-`/roles` → Role management (userRole/*)
**Note:** `ProtectionRoute.tsx` ensures only authenticated users can access protected routes.

## 6. State Management
-Context API is used (`context/AuthContext.tsx`, `context/AuthProvider.tsx`)
-Stores user session & role (Maker/Checker/Manager/District).
-Provides auth state across the app.

## 7. API Integration
All backend communication is through Axios, configured in **src/services/axios.ts**.
**Example**
```ts
import api from "./axios";

export const login = async (username: string, password: string) => {
  return api.post("/auth/login", { username, password });
};
```
**Main service files:**
`Authentication.ts` → Login, logout, token refresh
`MakeForm.ts` → Maker KYC APIs
`KycManager.ts` → Manager actions (assign, approve)
`Dashboard.ts` → Dashboard data fetch
`DisplayFunctions.ts` → Utility functions (date, format)
`chat.ts` → Messaging APIs

## 8. UI Components (Key Modules)
**Maker:** `(components/MakeForm/*)`
--Add, edit, submit forms
--View Approved, Pending, Draft, Rejected tables
**Checker:** `(components/Checker/*)`
--Approve, Reject, Edit KYC requests
**Manager:** `(components/Manager/*)`
--Assign checkers, attendance tracking, approval overview
**Reports:** `(components/Report/*)`
--Summary, detail, checker reports
**User Management:** (`components/userRole/*`, `components/UserProfile/*`)
--Add/Edit/View roles
--Edit/View user profile

## 9. Common Development Tasks
### Add a new KYC field
-Update the relevant form component in `components/MakeForm/`.
-Add validation logic `(Ant Design Form.Item)`.
-Update API call in `services/MakeForm.ts`.
-Update table display in `components/MakeForm/AllMakeFormTable.tsx`.

### Add a new API endpoint
-Create function in `src/services/<module>.ts`.
-Import and use in corresponding component.

### Add a new report
-Add a new component in `components/Report/`.
-Create API call in `services/Dashboard.ts`.
-Add route in `Layout/Routes.tsx`.

## 10. Troubleshooting
-API calls fail → Check `VITE_API_BASE_URL in .env`.
-CORS error → Backend must allow frontend origin.
-Login fails repeatedly → Check token handling in `Authentication.ts`.
