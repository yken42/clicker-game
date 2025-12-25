import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import dotenv from "dotenv";
import connectdb from "./database/connect.js";
import userRouter from "./routes/userRouter.js";
import cors from "cors";
import jwt from "jsonwebtoken";
import { setIO } from "./controllers/userController.js";
dotenv.config();

const app = express();
const httpServer = createServer(app);

const red = "\x1b[31m";
const green = "\x1b[32m";
const reset = "\x1b[0m";

const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      // Allow all origins
      callback(null, true);
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket authentication middleware
io.use(async (socket, next) => {
  try {
    // Get token from auth object (preferred) or cookies
    const token = socket.handshake.auth?.token || 
                  socket.handshake.headers.cookie?.split('token=')[1]?.split(';')[0];
    
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id; // Store userId in socket
    next();
  } catch (error) {
    next(new Error("Authentication error: Invalid token"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.userId;
  
  // Join socket to a room with userId as the room name
  socket.join(userId);
  
  // Override socket.id getter to return userId
  Object.defineProperty(socket, 'id', {
    get: () => userId,
    configurable: true
  });

  console.log(green, "✅", "User connected:", reset, userId);
  socket.emit("welcome", "Welcome to the clicker game");
  
  socket.on("disconnect", () => {
    console.log(red, "❌", "User disconnected:", reset, userId);
  });
});

app.use(express.json());
app.use(cors({
  origin: true, // Allow all origins (returns the origin in Access-Control-Allow-Origin)
  credentials: true,
}));

app.use("/api/user", userRouter);

// Set io instance in user controller so it can broadcast scoreboard updates
setIO(io);

connectdb();

// Use httpServer.listen() instead of app.listen() so Socket.IO works
// Bind to 0.0.0.0 to allow connections from outside the Docker container
httpServer.listen(process.env.PORT || 3000, "0.0.0.0", () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
