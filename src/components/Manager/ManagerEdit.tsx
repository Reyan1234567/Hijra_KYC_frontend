/**
 * MANAGER EDIT COMPONENT
 * 
 * TYPE: Modal Component (Manager Role)
 * PURPOSE: Provides interface for managers to edit HO assignments for KYC forms
 * 
 * FUNCTIONALITY:
 * - Displays KYC form details in read-only format via DisplayInfo component
 * - Provides HO assignment interface via Assign component
 * - Modal-based overlay for focused assignment editing
 * - Divider separation between form details and assignment controls
 * 
 * USER INTERACTIONS:
 * - Modal open/close controls via props
 * - Form details viewing (read-only)
 * - HO assignment dropdown selection and save functionality
 * - Modal dismissal via cancel button or backdrop click
 * 
 * STATE MANAGEMENT:
 * - Receives modal data and control functions as props from parent
 * - Passes through triggerRender callback to Assign component for data refresh
 * - No internal state management - purely presentational component
 * 
 * ROLE PERMISSIONS: Manager users only
 * USAGE: Called from KycManagerTable as assignment editing modal
 */

import { Divider, Modal } from "antd";
import DisplayInfo from "../Helper/RequestModals/DisplayInfo";
import Assign from "./Assign";
import { checkerViewModal } from "../Checker/CheckerEditModal";

const ManagerEdit = (modal: checkerViewModal) => {
  return (
    <Modal
      width={1000}
      open={modal.open}
      okButtonProps={{ style: { display: "none" } }}
      cancelButtonProps={{ style: { display: "none" } }}
      onCancel={modal.onCancel}
      title={"Edit HO Assignment"}
    >
      <DisplayInfo {...modal.modal} />
      <Divider />
      <Assign modal={modal.modal} trigger={modal.triggerRender} />
    </Modal>
  );
};

export default ManagerEdit;
