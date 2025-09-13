/**
 * MANAGER VIEW COMPONENT
 * 
 * TYPE: Modal Component (Manager Role)
 * PURPOSE: Provides read-only view of KYC form details for managers
 * 
 * FUNCTIONALITY:
 * - Displays complete KYC form information in modal overlay
 * - Read-only interface for form inspection without editing capabilities
 * - Uses DisplayInfo component for consistent form data presentation
 * - Modal controls for opening/closing the view
 * 
 * USER INTERACTIONS:
 * - Modal open/close via props control
 * - Read-only form data viewing
 * - Modal dismissal via backdrop click or close controls
 * - No action buttons - purely informational display
 * 
 * STATE MANAGEMENT:
 * - Receives modal data and control functions as props from parent
 * - No internal state management - purely presentational component
 * - Passes form data directly to DisplayInfo component
 * 
 * ROLE PERMISSIONS: Manager users only
 * USAGE: Called from manager table components for form inspection
 */

import { Modal } from "antd";
import DisplayInfo from "../Helper/RequestModals/DisplayInfo";
import { allTableDataType } from "../MakeForm/AllMakeFormTable";

interface modal {
  modal: allTableDataType;
  open: boolean;
  onCancel: () => void;
}
const ManagerView = (modal: modal) => {
  return (
    <Modal
      width={1000}
      open={modal.open}
      onCancel={modal.onCancel}
      okButtonProps={{ style: { display: "none" } }}
      cancelButtonProps={{ style: { display: "none" } }}
    >
      <DisplayInfo {...modal.modal} />
    </Modal>
  );
};

export default ManagerView;
