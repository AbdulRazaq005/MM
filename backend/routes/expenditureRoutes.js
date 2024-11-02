import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createUserExpenditureCategory,
  deleteUserExpenditureCategory,
  getUserExpenditureDetails,
  updateUserExpenditureCategory,
} from "../controllers/expenditureCategoryController.js";

const router = express.Router();

router.get("/", protect, getUserExpenditureDetails);
router.post("/", protect, createUserExpenditureCategory);
router.put("/:id", protect, updateUserExpenditureCategory);
router.delete("/:id", protect, deleteUserExpenditureCategory);

export default router;
