/**
 * CHECKER EDIT MODAL COMPONENT
 * 
 * TYPE: Modal Component (Checker Role)
 * PURPOSE: Provides approve/reject functionality for pending KYC forms with reason input
 * 
 * FUNCTIONALITY:
 * - Displays KYC form details in read-only format using DisplayInfo component
 * - Shows rejection history via BackReason component
 * - Two-step rejection process: click Reject → enter reason → confirm
 * - One-click approval process with immediate status update
 * - Real-time query invalidation for notifications and pending lists
 * - Success/error feedback via message notifications
 * 
 * DATA OPERATIONS:
 * - API: PATCH /makeForm/updateStatus/{id}?status=2 - approves KYC form (status 2 = approved)
 * - API: POST /makeForm/reject-request - rejects KYC form with comment (status 3 = rejected)
 * - Invalidates React Query caches: ["notifications"], ["pending"] — related to the notifications showing in the sideBar of a checker
 * - Triggers parent component re-render via triggerRender callback
 * 
 * USER INTERACTIONS:
 * - View form details and rejection history
 * - Click "Approve" for immediate approval
 * - Click "Reject" to show reason input field
 * - Enter rejection reason and confirm or cancel
 * - Modal closes automatically on successful action
 * 
 * STATE MANAGEMENT:
 * - InputBox: boolean - controls visibility of rejection reason input
 * - InputBoxValue: string - stores rejection reason text
 * - Uses React Query client for cache invalidation — used react-query because it make it easier to trigger a refetch without 
 *    passing a manual trigger variable between components, just by using queryClient.invalidateQueries({
                        queryKey: ["the queryKey: notifications in our case"],
                      })
 * 
 * LIFECYCLE:
 * - Opens with form data passed as props
 * - Resets input state on successful action
 * - Closes modal and shows success/error messages
 * - Parent component handles modal open/close state
 * 
 * ROLE PERMISSIONS: Checker users only
 * USAGE: Called from CheckerPendingTable and similar checker components
 */

import { Button, Flex, Input, Modal } from "antd";
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
                        content: e?.response.data ?? "Something went wrong",
                      });
                    } finally {
                      setInputBoxValue("");
                      setInputBox(false);
                    }
                  }}
                >
                  Send
                </Button>
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
