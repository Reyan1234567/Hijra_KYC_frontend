/**
 * EDIT MODAL COMPONENT
 * 
 * TYPE: Modal Component (MakeForm Module)
 * PURPOSE: Provides a modal interface for editing existing KYC form requests
 * 
 * FUNCTIONALITY:
 * - Modal overlay for editing KYC form details and images
 * - Displays read-only form information via MakeInfo component
 * - Shows existing images with ImageEdit component for management
 * - Allows adding new images via AddImageForm component
 * - Handles image creation with React Query mutation
 * - Provides success/error feedback for image operations
 * - Closes modal and refreshes data on successful operations
 * 
 * DATA FETCHING:
 * - Uses createImage mutation from MakeForm service
 * - Invalidates "makes" query cache on successful image creation
 * - Handles API errors with user-friendly messages
 * 
 * USER INTERACTIONS:
 * - Modal open/close via handleCancel prop
 * - Image upload through AddImageForm component
 * - Image management through ImageEdit component
 * - Form submission with automatic modal closure
 * 
 * LIFECYCLE:
 * - Opens when editModal prop is true
 * - Displays form data passed via modal prop
 * - Closes on successful operations or user cancellation
 * - Triggers parent component re-render via editModalOff callback
 * 
 * USAGE: Used by AllMakeFormTable for editing draft and rejected forms
 */

import { Divider, Modal, message } from "antd";
import { allTableDataType, egami } from "./AllMakeFormTable";
import MakeInfo from "../Helper/RequestModals/MakeInfo";

import ImageEdit from "./ImageEdit";
import AddImageForm from "./AddImageForm";
import { createImage } from "../../services/MakeForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface editModalParam {
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
      console.log(error)
      messageApi.open({
        type: "error",
        content: error?.response?.data ?? "Something went wrong",
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
                createMutation.mutate({ makeId, imaged: images })
              }
            />
          </>
        )}
      </Modal>
    </>
  );
};

export default EditModal;
