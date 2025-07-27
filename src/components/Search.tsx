import { Button, Card, Flex, Input, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { api } from "../services/axios";

const Search = () => {
  const [makeForm, setMakeForm] = useState();
  const [state, setState] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const { Title } = Typography;
  useEffect(() => {
    const getMakeForm = async () => {
      try {
        const makeFormResponse = await api.get("link from imal ig");
        setMakeForm(makeFormResponse.data);
        setState("success");
      } catch (e) {
        setState("error");
        console.log(e);
      }
    };

    getMakeForm();
  }, []);
  return (
    <>
      <Card>
        <Flex gap={"middle"} vertical>
          <Title level={2}>Search By Account</Title>
          <Input />
          <Button>Search</Button>
        </Flex>
      </Card>
      {state === "loading" && <Spin />}
      {state === "error" && <Title level={3}></Title>}
      {state === "success" && <>
        <Card>
            {makeForm}
        </Card>
      </>}
    </>
  );
};

export default Search;
