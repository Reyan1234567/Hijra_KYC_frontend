import { Input, Spin, Typography } from "antd";
import Message from "./Message";
import { userInfo } from "../../types/MessageTypes";
import { useContext, useEffect, useState } from "react";
import { api } from "../../services/axios";
import { messages } from "./MessagesView";
import { AuthContext } from "../../context/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface drawerInterface {
  open: boolean;
  badge: number;
  setBadge: React.Dispatch<React.SetStateAction<number>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setChatInfo: React.Dispatch<React.SetStateAction<messages>>;
}

const MessagesPage = (drawer: drawerInterface) => {
  const [filteredUsers, setFilteredUsers] = useState<userInfo[]>();
  const [search, setSearch] = useState("");
  const USER = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["messageContacts", USER?.user?.userId],
    queryFn: async () => {
      const userMessage = await api.get("/message/getAll", {
        params: { receiverId: USER?.user?.userId },
      });
      console.log(userMessage);
      return userMessage.data;
    },
    enabled: !!USER?.user?.userId,
  });

  useEffect(() => {
    if (user) {
      setFilteredUsers(user);
      let messageSum = 0;
      user.forEach((data: userInfo) => {
        messageSum += data.unreadCount;
      });
      drawer.setBadge(messageSum);
    }
  }, [user, drawer]);

  useEffect(() => {
    const Search = () => {
      const FilteredUsers = user?.filter(
        (userM: userInfo) =>
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
      {!user && isLoading && (
        <Spin
          style={{ position: "absolute", left: "50%", top: "50%" }}
          size="large"
        />
      )}
      {isError && <Typography.Text>Something went wrong</Typography.Text>}
      {user && user.length === 0 && <p>No Messages</p>}
      {user && user.length > 0 &&
        (filteredUsers === undefined || filteredUsers === null ? (
          <p>Nothing to show</p>
        ) : (
          filteredUsers.map((userInfo) => (
            <div
              key={userInfo.id}
              style={{ cursor: "pointer" }}
              onClick={() => {
                // Invalidate message contacts query to refresh unread counts
                queryClient.invalidateQueries({
                  queryKey: ["messageContacts", USER?.user?.userId],
                });
                drawer.setOpen(true);
                drawer.setChatInfo({
                  id: userInfo.id,
                  senderName: userInfo.fullName,
                  senderProfile: userInfo.profilePhoto,
                });
              }}
            >
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
