/**
 * ASSIGN COMPONENT
 * 
 * TYPE: Modal Component (Manager Role)
 * PURPOSE: Allows managers to assign or reassign KYC forms to Head Office (HO) checkers
 * 
 * FUNCTIONALITY:
 * - Fetches available checker users from the system
 * - Displays current assignment status (assigned vs unassigned)
 * - Provides dropdown selection for checker assignment
 * - Handles both initial assignment and reassignment scenarios
 * - Updates assignment via API and triggers parent component refresh
 * 
 * DATA FETCHING:
 * - API: GET /api/user-profiles/getCheckers - fetches all available checker users
 * - Returns array of user objects with id, name, and other profile details
 * - Fetches data on component mount and when modal data changes
 * 
 * DATA MUTATIONS:
 * - API: PATCH /makeForm/assignChecker - assigns/reassigns KYC form to checker
 * - Parameters: checker (user ID), make (form ID)
 * - Updates the hoId field of the KYC form record
 * - Triggers parent component refresh via trigger() callback
 * 
 * USER INTERACTIONS:
 * - Dropdown selection to choose checker from available users
 * - Save button to confirm assignment (disabled when no checker selected)
 * - Success/error messages displayed via Ant Design message API
 * - Dynamic UI text: "Assign HO" vs "Change HO" based on current assignment
 * 
 * STATE MANAGEMENT:
 * - users: user[] - list of available checker users
 * - checker: number - selected checker user ID
 * - messageApi: Ant Design message instance for notifications
 * - Initializes checker state with current assignment (modal.modal.hoId)
 * 
 * LIFECYCLE:
 * - useEffect triggers on modal.modal.hoId and modal.modal.makeId changes
 * - Fetches fresh checker list and updates state accordingly
 * - Console logging for debugging assignment operations
 * 
 * ROLE PERMISSIONS: Manager users only
 * USAGE: Used within manager table components as assignment modal content
 */

import { useEffect, useState } from "react";
import { api } from "../../services/axios";
import { allTableDataType } from "../MakeForm/AllMakeFormTable";
import { Button, Flex, message, Select, Typography } from "antd";
import { user } from "../User/Profile";

interface assignModal {
  modal: allTableDataType;
  trigger: () => void;
}
const Assign = (modal: assignModal) => {
  const [users, setUsers] = useState<user[]>([]);
  const { Title } = Typography;

  const [checker, setChecker] = useState(modal.modal.hoId ?? undefined);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const getUsers = async () => {
      setChecker(modal.modal.hoId);
      try {
        const checkers = await api.get("/api/user-profiles/getCheckers");
        console.log(checkers.data);
        setUsers(checkers.data);
      } catch (e) {
        console.log(e);
      }
    };
    getUsers();
  }, [modal.modal.hoId, modal.modal.makeId]);

  const handleSave = async () => {
    try {
      console.log(checker);
      console.log(modal.modal.makeId);
      await api.patch(
        "/makeForm/assignChecker",
        {},
        { params: { checker: checker, make: modal.modal.makeId } }
      );
      messageApi.open({
        type: "success",
        content: "Assignement made successfully",
      });
      modal.trigger();
    } catch (e: any) {
      console.log(e);
      messageApi.open({
        type: "error",
        content: e?.response?.data ?? "Assignment wasn't successful",
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
            options={users.map((user, index) => ({
              value: user.id,
              key: index,
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
            value={checker}
            onChange={handleChange}
            placeholder="Assign an Ho"
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
