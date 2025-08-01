import { useEffect, useState } from "react";
import { api } from "../../services/axios";
import { allTableDataType } from "../MakeForm/MakeFormTable";
import { Button, Flex, message, Select, Typography } from "antd";
import { user } from "../User/Profile";

interface assignModal {
  modal: allTableDataType;
  trigger: () => void;
}
const Assign = (modal: assignModal) => {
  const [users, setUsers] = useState<user[]>([]);
  const { Title } = Typography;

  const [checker, setChecker] = useState(modal.modal.hoId);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const checkers = await api.get("/api/user-profiles/getCheckers");
        console.log(checkers.data);
        setUsers(checkers.data);
      } catch (e) {
        console.log(e);
      }
    };
    getUsers();
  }, [modal.modal.makeId]);

  const handleSave = () => {
    try {
      console.log(checker);
      console.log(modal.modal.makeId);
      api.patch(
        "/makeForm/assignChecker",
        {},
        { params: { checker: checker, make: modal.modal.makeId } }
      );
      messageApi.open({
        type: "success",
        content: "Assignement made successfully",
      });
      modal.trigger();
    } catch (e) {
      console.log(e);
      messageApi.open({
        type: "error",
        content: "Assignment wasn't successful",
      });
    }
  };

  function handleChange(value: number) {
    console.log("in the handleChange " + value);
    setChecker(value);
  }

  return (
    <Flex vertical justify="center" gap={15}>
      {contextHolder}
      {modal.modal.hoId !== null ? (
        <Flex vertical gap={5}>
          <Title level={4}>Change HO</Title>
          <Select
            options={users.map((user) => ({
              value: user.id,
              label: user.name,
            }))}
            value={checker}
            onChange={handleChange}
          />
        </Flex>
      ) : (
        <Flex vertical gap={5}>
          <Title level={4}>Assign HO</Title>
          <Select
            options={users.map((user) => ({
              value: user.id,
              label: user.name,
            }))}
            placeholder={"Select a value"}
            onChange={handleChange}
          />
        </Flex>
      )}

      <Button disabled={checker === undefined} onClick={handleSave}>
        Save
      </Button>
    </Flex>
  );
};

export default Assign;
