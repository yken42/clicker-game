import express from "express";
import dotenv from "dotenv";
import connectdb from "./database/connect.js";
import userRouter from "./routes/userRouter.js";
import cors from "cors";
dotenv.config();

const app = express();

// Middleware must be registered before routes
app.use(express.json());
app.use(cors());

app.use('/api/user', userRouter);
connectdb();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});