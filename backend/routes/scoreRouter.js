import express from "express";
import { getScoreboard } from "../controllers/scoreController.js";

const router = express.Router();

router.get("/scoreboard", getScoreboard);

export default router;