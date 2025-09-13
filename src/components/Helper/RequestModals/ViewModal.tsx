/**
 * VIEW MODAL COMPONENT
 * 
 * TYPE: Modal Component (Helper Module)
 * PURPOSE: Provides a read-only modal interface for viewing KYC form details
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
 * USAGE:
 * - Used by AllMakeFormTable, CheckerApprovedTable, and other table components
 * - Provides consistent view modal across different pages
 * - Displays complete KYC form details including images and metadata
 */

import { Flex, Modal, Typography } from "antd";
import DisplayInfo from "./DisplayInfo";
import { allTableDataType } from "../../MakeForm/AllMakeFormTable";

interface viewModalInterface {
  handleCancel: () => void;
  isModalOpen: boolean;
  modal: allTableDataType;
}
const ViewModal = (viewModal: viewModalInterface) => {
  const { Title } = Typography;
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
