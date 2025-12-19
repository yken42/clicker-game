import { io } from "socket.io-client";

// Singleton socket instance
let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io("http://localhost:3000", {
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

