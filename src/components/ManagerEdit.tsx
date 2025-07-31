import { Divider, Modal } from "antd"
import DisplayInfo from "./DisplayInfo";
import Assign from "./Assign";
import { checkerViewModal } from "./CheckerEditModal";

const ManagerEdit = (modal:checkerViewModal) => {
  return (
    <Modal
    width={1000}
    open={modal.open}
    okButtonProps={{style:{display:"none"}}}
    cancelButtonProps={{style:{display:"none"}}}
    onCancel={modal.onCancel}
    title={"Edit HO Assignment"}
    >
        <DisplayInfo {...modal.modal}/>
        <Divider/>
        <Assign modal={modal.modal} trigger={modal.triggerRender} />
    </Modal>
  )
}

export default ManagerEdit
