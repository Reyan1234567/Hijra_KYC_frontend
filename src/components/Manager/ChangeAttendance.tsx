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
