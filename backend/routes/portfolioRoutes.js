import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  deleteUserPortfolioItem,
  getUserPortfolio,
  postUserPortfolio,
} from "../controllers/portfolioController.js";

const router = express.Router();

router.get("/", protect, getUserPortfolio);
router.post("/", protect, postUserPortfolio);
router.delete("/:type/:id", protect, deleteUserPortfolioItem);

export default router;
