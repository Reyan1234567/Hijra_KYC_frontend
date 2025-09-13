/*
 * HIJRA KYC FRONTEND - WEBSOCKET CHAT SERVICE
 * 
 * FILE TYPE: Service/WebSocket Client
 * PURPOSE: Real-time messaging and chat functionality
 * 
 * FUNCTIONALITY:
 * - WebSocket connection using STOMP protocol over SockJS
 * - Real-time private messaging between users
 * - Message subscription and publishing
 * - Auto-reconnection on connection loss
 * 
 * WEBSOCKET ENDPOINTS:
 * - Connection: ws://localhost:8080/ws
 * - Subscribe: /user/queue/messages (private messages)
 * - Publish: /app/private (send private messages)
 * 
 * EXPORTED FUNCTIONS:
 * - client: STOMP client instance for WebSocket connection
 * - sendPrivate: Send private message to specific user
 * 
 * USED BY: Chat.tsx component for real-time messaging
 */

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
