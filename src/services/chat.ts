import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface messageBody {
  sender: number;
  receiver: number;
  message: string;
}
export const client = new Client({
  webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
  reconnectDelay: 5000,
  debug: (str) => console.log("STOMP DEBUG:", str),
});

client.onConnect = (frame) => {
  console.log("Connected ", frame);
  client.subscribe("/user/queue/messages", (message) => {
    const body = JSON.parse(message.body);
    console.log("Received private:", body.sender, body.content);
  });
};

export const sendPrivate = (messageBody: messageBody) => {
  client.publish({
    destination: "/app/private",
    body: JSON.stringify(messageBody),
  });
};
