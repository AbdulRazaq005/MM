import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createNewTransaction,
  deleteTransactionById,
  getFilteredTransactions,
  updateTransactionById,
} from "../controllers/TransactionController.js";

const router = express.Router();

router.get("/", protect, getFilteredTransactions);
router.post("/", protect, createNewTransaction);
router.put("/:id", protect, updateTransactionById);
router.delete("/:id", protect, deleteTransactionById);

export default router;
