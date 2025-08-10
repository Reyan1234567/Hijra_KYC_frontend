import { Input, Spin, Typography } from "antd";
import Message from "./Message";
import { userInfo } from "../../types/MessageTypes";
import { useContext, useEffect, useState } from "react";
import { api } from "../../services/axios";
import { messages } from "./MessagesView";
import { AuthContext } from "../../context/AuthContext";

interface drawerInterface {
  open: boolean;
  badge: number;
  setBadge: React.Dispatch<React.SetStateAction<number>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setChatInfo: React.Dispatch<React.SetStateAction<messages>>;
}

const MessagesPage = (drawer: drawerInterface) => {
  const [user, setUser] = useState<userInfo[] | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<userInfo[]>();
  const [state, setState] = useState<"loading" | "success" | "error" | "empty">(
    "loading"
  );
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const USER=useContext(AuthContext)

  useEffect(() => {
    const getUserMessage = async () => {
      try {
        setState("loading");
        const userMessage = await api.get("/message/getAll", {
          params: { receiverId: USER?.user?.userId},
          //  in the real thing, when incorporating auth receiver will be imported using useContext
        });
        console.log(userMessage);
        if (userMessage.data.length === 0) {
          setState("empty");
        } else {
          setState("success");
          setUser(userMessage.data);
          setFilteredUsers(userMessage.data);
          let messageSum = 0;
          userMessage.data.forEach((data: userInfo) => {
            messageSum += data.unreadCount;
          });
          drawer.setBadge(messageSum);
        }
      } catch (e) {
        console.log(e);
        setState("error");
        setError("Something went wrong");
      }
    };
    getUserMessage();
  }, [USER?.user?.userId, drawer]);

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
  }, [search, user]);

  console.log(state);
  return (
    <>
      <Input.Search
        placeholder="Search"
        variant="outlined"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value.toLowerCase());
        }}
        style={{ marginBottom: "10px" }}
      />
      {state === "empty" && <p>No Messages</p>}
      {state === "loading" && (
        <Spin
          style={{ position: "absolute", left: "50%", top: "50%" }}
          size="large"
        />
      )}
      {state === "error" && <Typography.Text>{error}</Typography.Text>}
      {state === "success" &&
        (filteredUsers === undefined || filteredUsers === null ? (
          <p>Nothing to show</p>
        ) : (
          filteredUsers.map((userInfo) => (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => {
                drawer.setOpen(true);
                drawer.setChatInfo({
                  id: userInfo.id,
                  senderName: userInfo.fullName,
                  senderProfile: userInfo.profilePhoto,
                });
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
