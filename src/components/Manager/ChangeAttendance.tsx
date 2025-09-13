/**
 * CHANGE ATTENDANCE COMPONENT
 * 
 * TYPE: Modal Component (Manager Role)
 * PURPOSE: Allows managers to modify attendance status of multiple checker users via checkbox interface
 * 
 * FUNCTIONALITY:
 * - Displays all checker users in a checkbox group format
 * - Pre-selects users who are currently marked as present (presentStatus == 1)
 * - Provides "check all" / "uncheck all" functionality with indeterminate state
 * - Saves attendance changes via API mutation and updates cache
 * - Closes modal automatically on successful save
 * 
 * DATA MUTATIONS:
 * - API: PUT /kycManager/editAttendance - updates attendance status for selected users
 * - Service: editAttendance(userIds[]) - accepts array of user IDs to mark as present
 * - Users not in the array are automatically marked as absent
 * - Invalidates ["Attendance"] query cache on success to refresh parent component
 * 
 * USER INTERACTIONS:
 * - Checkbox group for individual user selection
 * - "Check all" checkbox with indeterminate state for partial selections
 * - Save button to commit changes
 * - Modal close via cancel button or backdrop click
 * - Success/error messages via Ant Design message API
 * 
 * STATE MANAGEMENT:
 * - checked: user[] - array of users currently selected as present
 * - Initializes with users who have presentStatus == 1
 * - Updates when parent users prop changes via useEffect
 * - Uses React Query mutation for API calls and cache management
 * 
 * LIFECYCLE:
 * - useEffect syncs checked state with incoming users prop
 * - Resets selection when users list changes
 * - Handles mutation success/error states with user feedback
 * 
 * ROLE PERMISSIONS: Manager users only
 * USAGE: Called from Attendance component as modal overlay
 */

import { Modal, Checkbox, Button, CheckboxOptionType, message } from "antd";
import React, { useEffect, useState } from "react";
import { user } from "../User/Profile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editAttendance } from "../../services/KycManager";

interface changeAttendanceInterface {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  users: user[];
}
const ChangeAttendance = (change: changeAttendanceInterface) => {
  useEffect(() => {
    setChecked(change.users.filter((U) => U.presentStatus == 1));
  }, [change.users]);

  const CheckboxGroup = Checkbox.Group;
  const [checked, setChecked] = useState(
    change.users.filter((U) => U.presentStatus == 1)
  );
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  const onChange = (list: user[]) => {
    setChecked(list);
  };

  const handleSave = useMutation({
    mutationFn: () => editAttendance(checked.map((U) => U.id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Attendance"] });
      change.setOpen(false);
      messageApi.open({
        type: "success",
        content: "Attendance Edit successful",
      });
    },
    onError: (error) => {
      messageApi.open({
        type: "error",
        content: error instanceof Error ? error.message : String(error),
      });
    },
  });

  const options: CheckboxOptionType<user>[] = change.users.map(
    (user, index) => ({
      label: user.name,
      key: index,
      value: user,
    })
  );

  return (
    <>
      {contextHolder}
      <Modal
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        open={change.open}
        onCancel={() => change.setOpen(false)}
        title="Edit Attendance"
      >
        <Checkbox
          indeterminate={
            checked.length > 0 && checked.length < change.users.length
          }
          checked={change.users.length === checked.length}
          onChange={(e) =>
            e.target.checked ? setChecked(change.users) : setChecked([])
          }
        >
          check all
        </Checkbox>

        <CheckboxGroup options={options} value={checked} onChange={onChange} />
        <Button onClick={() => handleSave.mutate()}>Save</Button>
      </Modal>
    </>
  );
};

export default ChangeAttendance;
