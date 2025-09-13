/**
 * MESSAGES VIEW COMPONENT
 * 
 * TYPE: Page Component (All Roles)
 * PURPOSE: Real-time chat interface for one-on-one messaging between users
 * 
 * FUNCTIONALITY:
 * - Real-time chat conversation display with message history
 * - Message sending with Enter key and send button
 * - Automatic message read status updates
 * - Auto-scroll to latest messages
 * - Back navigation with query invalidation
 * - Loading, success, error, and empty states
 * - Message alignment based on sender/receiver
 * 
 * API INTERACTIONS:
 * - GET /message/getConvo: Fetches conversation history between two users
 * - PATCH /message/updateSeen: Marks messages as read when opening conversation
 * - POST /message: Sends new message to recipient
 * - Query invalidation for real-time updates on navigation
 * 
 * USER INTERACTIONS:
 * - Header with back button, avatar, and contact name
 * - Scrollable message history with sender/receiver alignment
 * - Input field with Enter key and send button functionality
 * - Automatic scroll to bottom on new messages
 * - Visual distinction between sent and received messages
 * 
 * STATE MANAGEMENT:
 * - messages: Array of conversation messages
 * - messageBox: Current input text
 * - state: Loading/success/error/empty status
 * - AuthContext for current user information
 * - Query client for cache invalidation
 * - URL search params for profile photo handling
 * 
 * REAL-TIME FEATURES:
 * - Auto-scroll to bottom on message updates
 * - Query invalidation on conversation exit
 * - Immediate message display on send
 * - Read status updates on conversation open
 * - Notification count updates via query invalidation
 * 
 * MESSAGE LAYOUT:
 * - Received messages: Left-aligned with sender styling
 * - Sent messages: Right-aligned with different styling
 * - Card-based message bubbles with responsive width
 * - Maximum 40% width for message bubbles
 * - Proper spacing and padding for readability
 * 
 * LIFECYCLE:
 * - useEffect for auto-scroll on message changes
 * - useEffect for fetching conversation history
 * - Message read status update on component mount
 * - Query invalidation on component unmount/navigation
 * 
 * ERROR HANDLING:
 * - Try-catch blocks for all API calls
 * - User-friendly error messages via Ant Design message API
 * - Console logging for debugging
 * - Graceful fallback states for different scenarios
 * 
 * USAGE:
 * - Used as drawer content when chat is selected from MessagesPage
 * - Part of real-time messaging system with WebSocket integration
 * - Provides complete chat experience within the application
 * 
 * ROLE-BASED ACCESS:
 * - Available to all authenticated users
 * - Messages filtered by user permissions
 * - Supports organizational communication needs
 */

import { Avatar, Card, Flex, Input, message } from "antd";
import { ChevronLeft } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { api } from "../../services/axios";
import { SendOutlined, UserOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

interface message {
  senderId: number;
  recieverId: number;
  messageBody: string;
  recieverStatus: number;
}

export interface messages {
  id: number;
  senderName: string;
  senderProfile: string;
}

interface yme {
  messageInfo: messages;
  setInOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MessagesView = (messageDetail: yme) => {
  const [messageApi] = message.useMessage();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [messageBox, setMessageBox] = useState("");
  const [searchParams] = useSearchParams();

  const [state, setState] = useState<"loading" | "success" | "error" | "empty">(
    "loading"
  );
  const [messages, setMessages] = useState<message[]>([]);

  const USER = useContext(AuthContext);
  const queryClient = useQueryClient();
  useEffect(() => {
    const scroll = () => {
      bottomRef.current?.scrollIntoView();
    };
    scroll();
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const messageList = await api.get("/message/getConvo", {
          params: {
            user1: USER?.user?.userId,
            user2: messageDetail.messageInfo.id,
          },
        });
        console.log(messageDetail.messageInfo.id);
        const seen = await api.patch(
          "/message/updateSeen",
          {},
          {
            params: {
              senderId: messageDetail.messageInfo.id,
              recieverId: USER?.user?.userId,
            },
          }
        );
        console.log(seen);
        if (messageList.data.length == 0) {
          setState("empty");
        } else {
          setState("success");
          setMessages(messageList.data);
        }
      } catch (e) {
        setState("error");
        console.log(e);
      }
    };

    getMessages();
  }, [USER?.user?.userId, messageDetail.messageInfo.id]);

  const error = () => {
    messageApi.open({
      type: "error",
      content: "Some error happened",
    });
  };

  const sendMessage = async (message: string) => {
    try {
      console.log(message, messageDetail.messageInfo.id);
      const res = await api.post("/message", {
        sender: USER?.user?.userId,
        message: message,
        receiver: messageDetail.messageInfo.id,
      });
      if (res) {
        setMessages([...messages, res.data]);
        setState("success");
      }
    } catch (e) {
      error();
      console.log(e);
    } finally {
      setMessageBox("");
    }
  };
  return (
    <Flex vertical>
      <Flex align="center">
        <ChevronLeft
          size={34}
          onClick={() => {
            messageDetail.setInOpen(false);
            // Invalidate message contacts query to refresh unread counts when exiting conversation
            queryClient.invalidateQueries({
              queryKey: ["messageContacts", USER?.user?.userId],
            });
            // Also invalidate notifications query to update sidebar count
            queryClient.invalidateQueries({
              queryKey: ["notifications"],
            });
          }}
          style={{ cursor: "pointer" }}
        />
        {searchParams.get("profilePhoto") ? (
          <Avatar
            shape={"square"}
            size={48}
            src={messageDetail.messageInfo.senderProfile}
          />
        ) : (
          <Avatar shape={"square"} size={40} icon={<UserOutlined />} />
        )}
        <p style={{ fontSize: "20px", fontWeight: "bold", marginLeft: "10px" }}>
          {messageDetail.messageInfo.senderName}
        </p>
      </Flex>
      <Flex
        vertical
        style={{ maxWidth: "100%", height: "80vh", overflowY: "auto" }}
      >
        {state === "empty" && <p>No messages</p>}
        {state === "error" && <p>Something went wrong</p>}
        {state === "success" &&
          messages?.map((message) =>
            message.recieverId === USER?.user?.userId ? (
              <Flex justify="start" style={{ width: "100%" }}>
                <Card
                  styles={{ body: { padding: "0px 3px" } }}
                  style={{
                    width: "fit-content",
                    height: "fit-content",
                    marginLeft: "10px",
                    marginBottom: "5px",
                    maxWidth: "40%",
                  }}
                >
                  <p style={{ textAlign: "start" }}>{message.messageBody}</p>
                </Card>
              </Flex>
            ) : (
              <Flex justify="end" style={{ width: "100%" }}>
                <Card
                  bodyStyle={{ padding: "0px 6px" }}
                  style={{
                    padding: "0px",
                    width: "fit-content",
                    height: "fit-content",
                    marginRight: "15px",
                    marginBottom: "5px",
                    maxWidth: "40%",
                  }}
                >
                  <p style={{ textAlign: "start" }}>{message.messageBody}</p>
                </Card>
              </Flex>
            )
          )}
        <div ref={bottomRef} />
      </Flex>
      <Input
        onPressEnter={() => {
          sendMessage(messageBox);
        }}
        value={messageBox}
        onChange={(e) => {
          setMessageBox(e.target.value);
        }}
        addonAfter={
          <SendOutlined
            onClick={() => {
              sendMessage(messageBox);
            }}
          />
        }
      />
    </Flex>
  );
};

export default MessagesView;
