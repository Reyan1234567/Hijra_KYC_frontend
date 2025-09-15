/**
 * BACK REASON COMPONENT
 * 
 * TYPE: Helper Component (All Roles)
 * PURPOSE: Displays rejection reason for KYC forms in modal contexts
 * CALLS: None (leaf component)
 * 
 * FUNCTIONALITY:
 * - Conditional rendering based on backReason presence
 * - Formatted display of rejection reason with visual divider
 * - Centered layout with bold title and reason text
 * - Used as part of larger modal components for form details
 * 
 * USER INTERACTIONS:
 * - Read-only display component - no user interactions
 * - Provides clear visual separation with divider
 * - Centered alignment for emphasis on rejection reason
 * 
 * STATE MANAGEMENT:
 * - Stateless component - receives data via props
 * - Uses allTableDataType interface for type safety
 * - Conditional rendering prevents empty state display
 * 
 * USED BY:
 * - DisplayInfo: Embedded in form display to show rejection reasons
 * - CheckerEditModal: Shows rejection reasons in edit modals
 *
 * USAGE:
 * - Embedded in DisplayInfo and other form detail modals
 * - Shows rejection feedback from checkers to makers
 * - Part of the KYC form review and feedback system
 * - Conditional component that only renders when backReason exists
 * 
 * ROLE-BASED ACCESS:
 * - Visible to all roles when viewing rejected forms
 * - Critical for makers to understand rejection reasons
 * - Helps in form correction and resubmission process
 */

import { Divider, Flex } from "antd";
import { allTableDataType } from "../../MakeForm/AllMakeFormTable";

const BackReason = (modal: allTableDataType) => {
  return (
    <>
      {modal.backReason && (
        <>
          <Divider />
          <Flex vertical justify="center" align="center">
            <p>
              <strong>Rejection Reason</strong>
            </p>
            <p>{modal.backReason}</p>
          </Flex>
        </>
      )}
    </>
  );
};

export default BackReason;
