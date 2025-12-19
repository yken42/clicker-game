import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import dotenv from "dotenv";
import connectdb from "./database/connect.js";
import userRouter from "./routes/userRouter.js";
import cors from "cors";
dotenv.config();

const app = express();
const httpServer = createServer(app);

const red = "\x1b[31m";
const green = "\x1b[32m";
const reset = "\x1b[0m";

const io = new Server(httpServer, {
  withCredentials: true,
  cors: {
    origin: "http://localhost:5173", // Frontend Vite dev server port
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(green, "User connected: ", reset, socket.id);
  socket.emit("welcome", "Welcome to the clicker game");
  socket.on("disconnect", () => {
    console.log(red, "User disconnected: ", reset, socket.id);
  });
});

app.use(express.json());
app.use(cors());

app.use("/api/user", userRouter);
connectdb();

// Use httpServer.listen() instead of app.listen() so Socket.IO works
httpServer.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
