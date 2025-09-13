/**
 * MESSAGES PAGE COMPONENT
 * 
 * TYPE: Page Component (All Roles)
 * PURPOSE: Main messaging interface displaying user contacts with search and real-time updates
 * 
 * FUNCTIONALITY:
 * - User contact list with search functionality
 * - Real-time message count updates via React Query
 * - Unread message badge aggregation for parent drawer
 * - User filtering by name, branch, and role
 * - Chat initiation through user selection
 * - Loading states and error handling
 * - Query invalidation for real-time updates
 * 
 * API INTERACTIONS:
 * - GET /message/getAll: Fetches user contacts with unread counts
 * - Uses receiverId parameter for current user's contacts
 * - React Query caching with "messageContacts" key
 * - Automatic query invalidation on chat selection
 * 
 * USER INTERACTIONS:
 * - Search input for filtering contacts (name, branch, role)
 * - Click on user cards to initiate chat
 * - Real-time badge updates in parent drawer
 * - Loading spinner during data fetch
 * - Error message display on API failures
 * 
 * STATE MANAGEMENT:
 * - filteredUsers: Local filtered user list based on search
 * - search: Search input value with lowercase conversion
 * - React Query for server state management
 * - AuthContext for current user information
 * - Props communication with parent drawer component
 * 
 * REAL-TIME FEATURES:
 * - Automatic unread count aggregation and badge updates
 * - Query invalidation on user selection for fresh data
 * - useEffect dependencies for reactive filtering
 * - Badge count calculation from all user unread counts
 * 
 * SEARCH FUNCTIONALITY:
 * - Case-insensitive search across fullName, branchName, role
 * - Real-time filtering with useEffect
 * - Empty search shows all users
 * - Filtered results update immediately on input change
 * 
 * LIFECYCLE:
 * - Query enabled only when user is authenticated
 * - Badge calculation on user data changes
 * - Search filtering on search term or user data changes
 * - Query invalidation triggers on chat selection
 * 
 * USAGE:
 * - Used as drawer content in FullLayout messaging system
 * - Provides contact selection for MessagesView chat interface
 * - Part of real-time messaging system with WebSocket integration
 * 
 * ROLE-BASED ACCESS:
 * - Available to all authenticated users
 * - Shows contacts based on user's messaging permissions
 * - Displays organizational context (role, branch) for each contact
 */

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
