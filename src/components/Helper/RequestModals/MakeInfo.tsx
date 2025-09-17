/**
 * MAKE INFO COMPONENT
 * 
 * TYPE: Helper Component (All Roles)
 * PURPOSE: Displays detailed KYC form information including customer, request, and checker details
 * CALLS: None (leaf component)
 * 
 * FUNCTIONALITY:
 * - Two-column layout displaying customer and request information
 * - Customer section: CIF, name, account number, phone
 * - Request section: Maker ID, creation date, assignment date, validation date, status
 * - Date formatting using ExtractDate utility function
 * - Status mapping from numeric codes to readable text
 * - Conditional display for unassigned/unchecked forms
 * 
 * USER INTERACTIONS:
 * - Read-only information display
 * - Clear visual separation between sections with dividers
 * - Responsive two-column layout (40% width each)
 * - Bold highlighting for important fields (CIF, Status)
 * 
 * STATE MANAGEMENT:
 * - Stateless component - receives all data via props
 * - Uses allTableDataType interface for type safety
 * - Date comparison logic for conditional rendering
 * - Console logging for debugging (should be removed in production)
 * 
 * DATE HANDLING:
 * - Uses ExtractDate() for consistent date formatting
 * - Compares dates with current time to show appropriate messages
 * - Shows "-" for unassigned forms
 * - Shows "Not checked yet" for pending validation
 * 
 * STATUS MAPPING:
 * - Status 1: "Pending"
 * - Status 2: "Approved"
 * - Status 3: "Rejected"
 * 
 * USED BY:
 * - DisplayInfo: Core component for form information display
 * - EditModal: Shows form info in maker edit modals
 *
 * USAGE:
 * - Core component used in DisplayInfo for complete form views
 * - Essential for all modal-based form detail displays
 * - Provides standardized information layout across the application
 * - Foundation component that displays customer and request details
 * 
 * ROLE-BASED ACCESS:
 * - Visible to all roles for form information viewing
 * - Critical for checkers to see assignment and validation history
 * - Helps makers track form progress through the system
 */

import { Divider, Flex } from "antd";
import { allTableDataType } from "../../MakeForm/AllMakeFormTable";
import { ExtractDate } from "../../../services/DisplayFunctions";
import { Typography } from "antd";

const MakeInfo = (modal: allTableDataType) => {
  const { Title } = Typography;
  const now = new Date();
  console.log(modal);
  return (
    <Flex justify="space-between">
      <Flex vertical style={{ width: "40%" }}>
        <Flex justify="space-between">
          <p>
            <strong>CIF:</strong>
          </p>
          <p>{modal!.cif}</p>
        </Flex>
        <Divider />
        <Title level={3}>Customer Info</Title>
        <Flex justify="space-between">
          <p>Name:</p>
          <p>{modal!.customerName}</p>
        </Flex>
        <Flex justify="space-between">
          <p>Account:</p>
          <p>{modal!.customerAccount}</p>
        </Flex>
        <Flex justify="space-between">
          <p>Phone:</p>
          <p>{modal!.customerPhone}</p>
        </Flex>
      </Flex>

      <Flex vertical style={{ width: "40%" }}>
        <Title level={3}>Request Info</Title>
        <Flex justify="space-between">
          <p>Maker ID:</p>
          <p>{modal!.makerId}</p>
        </Flex>
        <Flex justify="space-between">
          <p>Made At:</p>
          <p>{ExtractDate(modal!.madeAt)}</p>
        </Flex>

        <Divider />

        <Title level={3}>Checker Info</Title>
        <Flex justify="space-between">
          <p>Assigned At:</p>
          <p>
            {new Date(modal?.assignedAt) > now || !modal.assignedAt
              ? "-"
              : ExtractDate(modal!.assignedAt)}
          </p>
        </Flex>
        <Flex justify="space-between">
          <p>Validated At:</p>
          <p>
            {new Date(modal?.checkedAt) > now || !modal.checkedAt
              ? "Not checked yet"
              : ExtractDate(modal!.checkedAt)}
          </p>
        </Flex>
        <Flex justify="space-between">
          <p>
            <strong>Status:</strong>
          </p>
          <p>
            {modal!.status === 1 && "Pending"}
            {modal!.status === 2 && "Approved"}
            {modal!.status === 3 && "Rejected"}
          </p>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default MakeInfo;
