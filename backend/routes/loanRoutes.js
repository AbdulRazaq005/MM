import express from "express";
import {
  getUserLoans,
  createNewLoan,
  getLoanDetails,
  updateLoanDetails,
  deleteLoan,
} from "../controllers/loanController.js";
import { protect } from "../middleware/authMiddleware.js";
import { deleteLoanById } from "../services/loanService.js";

const router = express.Router();

//  Loan Routes
router
  .route("/")
  .get(protect, getUserLoans) // main loans page
  .post(protect, createNewLoan);

router
  .route("/:id")
  .get(protect, getLoanDetails)
  .put(protect, updateLoanDetails)
  .delete(protect, deleteLoan);

export default router;
