/**
 * VIEW MODAL COMPONENT
 * 
 * TYPE: Modal Component (Helper Module)
 * PURPOSE: Provides a read-only modal interface for viewing KYC form details
 * CALLS: DisplayInfo
 * 
 * FUNCTIONALITY:
 * - Modal overlay for displaying KYC form information in read-only mode
 * - Uses DisplayInfo component to render form data
 * - Handles undefined/empty modal data gracefully
 * - No action buttons (OK/Cancel hidden)
 * - Custom close button with aria-label for accessibility
 * 
 * USER INTERACTIONS:
 * - Modal open/close via isModalOpen prop
 * - Close via handleCancel callback or modal close button
 * - Read-only display of form information
 * 
 * USED BY:
 * - CheckerRejectedTable: View rejected forms with rejection reasons
 * - CheckerTable: View all checker-assigned forms
 * - KycManagerTable: Manager view of all forms
 * - CheckerApprovedTable: View approved forms
 * - CheckerPendingTable: View pending forms before editing
 * - KycManagerApprovedTable: Manager view of approved forms
 * - KycManagerPendingTable: Manager view of pending forms
 * - KycManagerRejectedTable: Manager view of rejected forms
 * - ApprovedMakeFormTable: Maker view of approved forms
 * - DraftsMakeFormTable: Maker view of draft forms
 * - PendingMakeFormTabel: Maker view of pending forms
 * - RejectedMakeFormTable: Maker view of rejected forms
 * - AllMakeFormTable: Maker view of all forms
 *
 * USAGE:
 * - Provides consistent view modal across different pages and roles
 * - Displays complete KYC form details including images and metadata
 * - Primary modal for read-only form viewing throughout the application
 */

import { Flex, Modal } from "antd";
import DisplayInfo from "./DisplayInfo";
import { allTableDataType } from "../../MakeForm/AllMakeFormTable";

interface viewModalInterface {
  handleCancel: () => void;
  isModalOpen: boolean;
  modal: allTableDataType;
}
const ViewModal = (viewModal: viewModalInterface) => {
  return (
    <Modal
      title={<p>View Request</p>}
      okButtonProps={{ style: { display: "none" } }}
      onCancel={viewModal.handleCancel}
      cancelButtonProps={{ style: { display: "none" } }}
      closable={{ "aria-label": "Custom Close Button" }}
      open={viewModal.isModalOpen}
      width={1000}
    >
      {viewModal.modal === undefined ? (
        <>Nothing to display</>
      ) : (
        <Flex vertical>
          <DisplayInfo {...viewModal.modal} />
        </Flex>
      )}
    </Modal>
  );
};

export default ViewModal;
