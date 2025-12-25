import { io } from "socket.io-client";
import { getCookie } from "./cookies";
import { SOCKET_URL } from "../config.js";

// Singleton socket instance
let socket = null;

export const getSocket = () => {
  return socket;
};

export const connectSocket = () => {
  // If socket already exists and is connected, return it
  if (socket && socket.connected) {
    return socket;
  }

  // If socket exists but disconnected, clean it up
  if (socket && !socket.connected) {
    socket.removeAllListeners();
    socket = null;
  }

  const token = getCookie("token");
  
  if (!token) {
    console.warn("No token found. Please login first.");
    return null;
  }
  
  socket = io(SOCKET_URL, {
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    auth: {
      token: token, // Send token in auth object
    },
    withCredentials: true,
  });

  // Update auth token on reconnect in case token changed
  socket.on("reconnect_attempt", () => {
    const newToken = getCookie("token");
    if (newToken) {
      socket.auth.token = newToken;
    } else {
      // If no token on reconnect, disconnect
      socket.disconnect();
    }
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket.removeAllListeners();
    socket = null;
  }
};

