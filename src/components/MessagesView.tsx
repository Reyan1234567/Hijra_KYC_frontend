import { Avatar, Card, Flex, Input, message } from "antd";
import { ChevronLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { api } from "../services/axios";
import { SendOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";

interface message {
  senderId: number;
  recieverId: number;
  messageBody: string;
  recieverStatus: number;
}

const MessagesView = () => {
  const [messageApi] = message.useMessage();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [messageBox, setMessageBox] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sender = {
    id: searchParams.get("sender"),
    name: searchParams.get("senderName"),
    profile: searchParams.get("senderProfile"),
  };
  const [state, setState] = useState<"loading" | "success" | "error" | "empty">(
    "loading"
  );
  const [messages, setMessages] = useState<message[]>([]);

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
            user1: 3,
            user2: sender.id,
          },
        });
        console.log(sender.id);
        const seen = await api.patch(
          "/message/updateSeen",
          {},
          { params: { senderId: sender.id, recieverId: 3 } }
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
  }, [sender.id]);

  const error = () => {
    messageApi.open({
      type: "error",
      content: "Some error happened",
    });
  };

  const sendMessage = async (message: string) => {
    try {
      console.log(message, sender.id);
      const res = await api.post("/message", {
        sender: 3,
        message: message,
        receiver: sender.id,
      });
      if (res) {
        setMessages([...messages, res.data]);
        setState('success')
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
          onClick={() => {
            navigate("/message");
          }}
          style={{ cursor: "pointer" }}
        />
        {searchParams.get("profilePhoto") ? (
          <Avatar shape={"square"} size={48} src={sender.profile} />
        ) : (
          <Avatar shape={"square"} size={40} icon={<UserOutlined />} />
        )}
        <p style={{ fontSize: "20px", fontWeight: "bold", marginLeft: "10px" }}>
          {sender.name}
        </p>
      </Flex>
      <Flex
        vertical
        style={{ maxWidth: "40vh", height: "80vh", overflowY: "auto" }}
      >
        {state === "empty" && <p>No messages</p>}
        {state === "error" && <p>Something went wrong</p>}
        {state === "success" &&
          messages?.map((message) =>
            message.recieverId === 3 ? (
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
