import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUserPortfolio,
  postUserPortfolio,
} from "../controllers/portfolioController.js";

const router = express.Router();

router.get("/", protect, getUserPortfolio);
router.post("/", protect, postUserPortfolio);

export default router;
