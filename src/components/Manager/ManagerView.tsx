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
