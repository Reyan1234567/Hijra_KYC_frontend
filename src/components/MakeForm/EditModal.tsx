import { Divider, Modal, message } from "antd";
import { allTableDataType, egami } from "./MakeFormTable";
import MakeInfo from "../Helper/RequestModals/MakeInfo";

import ImageEdit from "./ImageEdit";
import AddImageForm from "./AddImageForm";
import { createImage } from "../../services/MakeForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface editModalParam {
  handleCancel: () => void;
  editModal: boolean;
  modal: allTableDataType;
  editModalOff: () => void;
}

const EditModal = (editModalParam: editModalParam) => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: ({ makeId, imaged }: { makeId: number; imaged: egami[] }) =>
      createImage(makeId, imaged),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["makes"] });
      messageApi.open({
        type: "success",
        content: "Image created Successfully",
      });
    },
    onError: (error) => {
      messageApi.open({
        type: "error",
        content: error instanceof Error ? error.message : String(error),
      });
    },
  });

  return (
    <>
      {contextHolder}
      <Modal
        title="Edit Request"
        onCancel={editModalParam.handleCancel}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        closable={{ "aria-label": "Custom Close Button" }}
        open={editModalParam.editModal}
        width={1000}
      >
        {editModalParam.modal === undefined ? (
          <>Nothing to display</>
        ) : (
          <>
            <MakeInfo {...editModalParam.modal} />
            <Divider />
            <ImageEdit images={editModalParam.modal.images} />
            <Divider />
            <AddImageForm
              setEditModal={() => {
                editModalParam.editModalOff();
              }}
              makeId={editModalParam.modal.id}
              onFinish={({ makeId, images }) =>
                createMutation.mutate({ makeId, imaged:images })
              }
            />
          </>
        )}
      </Modal>
    </>
  );
};

export default EditModal;
