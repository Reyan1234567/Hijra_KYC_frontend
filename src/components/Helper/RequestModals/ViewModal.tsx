import { Flex, Modal } from "antd";
import DisplayInfo from "./DisplayInfo";
import { allTableDataType } from "../../MakeForm/MakeFormTable";

interface viewModalInterface {
  handleCancel: () => void;
  isModalOpen: boolean;
  modal: allTableDataType;
}
const ViewModal = (viewModal: viewModalInterface) => {
  return (
    <Modal
      title="View Request"
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
