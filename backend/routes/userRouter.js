import express from "express";
import { createUser, loginUser, logoutUser, updateScore, getUserScore, getScoreboard } from "../controllers/userController.js";
import { verifyToken } from "../middleware/middleware.js";

const router = express.Router();

// User authentication routes
router.post("/signup", createUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Score routes
router.get("/scoreboard", getScoreboard);
router.get("/score", verifyToken, getUserScore);
router.post("/score", verifyToken, updateScore);

export default router;