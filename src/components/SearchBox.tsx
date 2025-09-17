import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { forwardRef, useImperativeHandle, useState } from "react";
import useMessage from "antd/es/message/useMessage";

interface searchBoxInterface {
  setState: React.Dispatch<React.SetStateAction<string>>;
}

export interface SearchBoxHandle {
  clear: () => void;
}

const SearchBox = forwardRef<SearchBoxHandle, searchBoxInterface>((prop, ref) => {
  const [search, setSearch] = useState("");
  const [messageApi, contextHolder] = useMessage();

  useImperativeHandle(ref, () => ({
    clear: () => {
      setSearch("");
    }
  }));
  
  const searchFunction = async () => {
    try {
      prop.setState(search);
    } catch (e) {
      messageApi.open({
        type: "error",
        content: `Something went wrong`,
      });
    }
  };
  return (
    <>
      {contextHolder}
      <Input
        onPressEnter={() => {
          searchFunction();
        }}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        addonAfter={
          <>
            <SearchOutlined
              onClick={() => {
                searchFunction();
              }}
            />
          </>
        }
      />
    </>
  );
});

export default SearchBox;
