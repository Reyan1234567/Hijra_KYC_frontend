import { Button, Flex, Input, message, Modal } from "antd";
import DisplayInfo from "./DisplayInfo";
import { api } from "../services/axios";
import { useState } from "react";
import { allTableDataType } from "./MakeFormTable";

export interface checkerViewModal {
  modal: allTableDataType;
  open: boolean;
  onCancel: () => void;
  triggerRender: () => void;
}
const CheckerEditModal = (checkerEditModal: checkerViewModal) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [InputBox, setInputBox] = useState(false);
  const [InputBoxValue, setInputBoxValue] = useState("");
  return (
    <>
      {contextHolder}
      <Modal
        title="Edit Request"
        width={1000}
        open={checkerEditModal.open}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        onCancel={checkerEditModal.onCancel}
      >
        <DisplayInfo {...checkerEditModal.modal} />
        {InputBox ? (
          <>
            <Flex vertical gap={"middle"} style={{marginTop:"10px"}}>
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
                      messageApi.open({
                        type: "success",
                        content: "Request rejected",
                      });
                      checkerEditModal.onCancel();
                      checkerEditModal.triggerRender();
                    } catch (e: unknown) {
                      console.log(e);
                      messageApi.open({
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
          <Flex justify="center" gap="middle" style={{marginTop:"10px"}}>
            <Button
              onClick={async () => {
                try {
                  await api.patch(
                    `makeForm/updateStatus/${checkerEditModal.modal.id}`,
                    {},
                    { params: { status: 2 } }
                  );
                  messageApi.open({
                    type: "success",
                    content: "Request rejected",
                  });
                  checkerEditModal.onCancel();
                  checkerEditModal.triggerRender();
                } catch (e: unknown) {
                  console.log(e);
                  messageApi.open({
                    type: "error",
                    content: e.message,
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
