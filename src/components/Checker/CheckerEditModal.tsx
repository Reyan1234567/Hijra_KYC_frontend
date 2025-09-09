import { Button, Flex, Input,  Modal } from "antd";
import DisplayInfo from "../Helper/RequestModals/DisplayInfo";
import { api } from "../../services/axios";
import { useState } from "react";
import { allTableDataType } from "../MakeForm/AllMakeFormTable";
import BackReason from "../Helper/RequestModals/BackReason";
import { useQueryClient } from "@tanstack/react-query";
import { MessageInstance } from "antd/es/message/interface";

export interface checkerViewModal {
  modal: allTableDataType;
  open: boolean;
  onCancel: () => void;
  triggerRender: () => void;
  messageApi: MessageInstance;
}
const CheckerEditModal = (checkerEditModal: checkerViewModal) => {
  const [InputBox, setInputBox] = useState(false);
  const [InputBoxValue, setInputBoxValue] = useState("");
  const queryClient = useQueryClient();
  return (
    <>
      <Modal
        title="Edit Request"
        width={1000}
        open={checkerEditModal.open}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        onCancel={checkerEditModal.onCancel}
      >
        <DisplayInfo {...checkerEditModal.modal} />
        <BackReason {...checkerEditModal.modal} />
        {InputBox ? (
          <>
            <Flex vertical gap={"middle"} style={{ marginTop: "10px" }}>
              <p>Write reason of rejection</p>
              <Input
                value={InputBoxValue}
                onChange={(e) => setInputBoxValue(e.target.value)}
              />
              <Flex justify="center" gap="middle">
                <Button
                  onClick={() => {
                    setInputBox(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  disabled={InputBoxValue === ""}
                  onClick={async () => {
                    try {
                      await api.post(`/makeForm/reject-request`, {
                        makeFormId: checkerEditModal.modal.id,
                        comment: InputBoxValue,
                      });
                      await queryClient.invalidateQueries({
                        queryKey: ["notifications"],
                      });
                      await queryClient.invalidateQueries({
                        queryKey: ["pending"],
                      });
                      checkerEditModal.triggerRender();
                      checkerEditModal.onCancel();
                      checkerEditModal.messageApi.open({
                        type: "success",
                        content: "Request rejected",
                      });
                    } catch (e: unknown) {
                      console.log(e);
                      checkerEditModal.messageApi.open({
                        type: "error",
                        content: e.message,
                      });
                    } finally {
                      setInputBoxValue("");
                      setInputBox(false);
                    }
                  }}
                >
                  Send
                </Button>
                {/* exiting out with a message if status is good if not then send a bad response message and don't exit */}
              </Flex>
            </Flex>
          </>
        ) : (
          <Flex justify="center" gap="middle" style={{ marginTop: "10px" }}>
            <Button
              onClick={async () => {
                try {
                  await api.patch(
                    `makeForm/updateStatus/${checkerEditModal.modal.id}`,
                    {},
                    { params: { status: 2 } }
                  );
                  queryClient.invalidateQueries({
                    queryKey: ["notifications"],
                  });
                  await queryClient.invalidateQueries({
                    queryKey: ["pending"],
                  });
                  checkerEditModal.triggerRender();
                  checkerEditModal.onCancel();
                  checkerEditModal.messageApi.open({
                    type: "success",
                    content: "Request approved",
                  });
                } catch (e: unknown) {
                  console.log(e);
                  checkerEditModal.messageApi.open({
                    type: "error",
                    content: e?.response.data ?? "Something went wrong",
                  });
                }
              }}
            >
              Approve
            </Button>
            <Button
              onClick={() => {
                setInputBox(true);
              }}
            >
              Reject
            </Button>
          </Flex>
        )}
      </Modal>
    </>
  );
};

export default CheckerEditModal;
