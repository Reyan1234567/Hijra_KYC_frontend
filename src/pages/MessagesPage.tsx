import { Input, Spin, Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Message from "../components/Message";
import { userInfo } from "../types/MessageTypes";
import { useEffect, useState } from "react";
import { api } from "../services/axios";
import { useNavigate } from "react-router-dom";

const MessagesPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<userInfo[] | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<userInfo[]>();
  const [state, setState] = useState<"loading" | "success" | "error" | "empty">(
    "loading"
  );
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const getUserMessage = async () => {
      try {
        setState("loading");
        const userMessage = await api.get("/message/getAll", {
          params: { receiverId: 3 },
          //  in the real thing, when incorporating auth receiver will be imported using useContext
        });
        console.log(userMessage);
        if (userMessage.data.length === 0) {
          setState("empty");
        } else {
          setState("success");
          setUser(userMessage.data);
          setFilteredUsers(userMessage.data);
        }
      } catch (e) {
        console.log(e);
        setState("error");
        setError("Something went wrong");
      }
    };
    getUserMessage();
  }, []);

  useEffect(() => {
    const Search = () => {
      const FilteredUsers = user?.filter(
        (userM) =>
          userM.fullName.toLowerCase().includes(search) ||
          userM.branchName.toLowerCase().includes(search) ||
          userM.role.toLowerCase().includes(search) ||
          search == ""
      );
      if (FilteredUsers != null) {
        setFilteredUsers(FilteredUsers);
      }
    };
    Search();
  }, [search]);

  console.log(state);
  return (
    <>
      <p style={{fontSize:"25px", fontWeight:"bold"}}>Messages</p>
      <Input.Search
        placeholder="Search"
        variant="outlined"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value.toLowerCase());
        }}
        style={{marginBottom:"10px"}}
      />
      {state === "empty" && <p>No Messages</p>}
      {state === "loading" && <Spin indicator={<LoadingOutlined spin />} />}
      {state === "error" && <Typography.Text>{error}</Typography.Text>}
      {state === "success" &&
        (filteredUsers === undefined || filteredUsers === null ? (
          <p>Nothing to show</p>
        ) : (
          filteredUsers.map((userInfo) => (
            <div
            style={{cursor:"pointer"}}
              onClick={() => {
                navigate(`/messageChat?sender=${userInfo.id}&senderName=${userInfo.fullName}&senderProfile=${userInfo.profilePhoto}`);
              }}
            >
              {/* in the real thing, when incorporating auth receiver will be imported using useContext */}
              <Message
                id={userInfo.id}
                fullName={userInfo.fullName}
                role={userInfo.role}
                branchName={userInfo.branchName}
                status={userInfo.status}
                unreadCount={userInfo.unreadCount}
                profilePhoto={userInfo.profilePhoto}
              />
            </div>
          ))
        ))}
    </>
  );
};

export default MessagesPage;
