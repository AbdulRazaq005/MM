import asyncHandler from "express-async-handler";
import {
  createLoan,
  deleteLoanById,
  getLoanDetailsById,
  getUserLoanDetails,
  updateLoan,
} from "../services/loanService.js";
import { UserRole } from "../utils/enums.js";
import {
  getTransactionsByIds,
  markTransactionsInactiveByTargetIds,
} from "../services/transactionService.js";

// GET /api/loans
export const getUserLoans = asyncHandler(async (req, res) => {
  const loans = await getUserLoanDetails(req.user._id);
  if (!loans) {
    res.status(500).json({ message: "Error while fetching loans." });
  }
  res.status(200).json(loans);
});

// POST /api/loans
export const createNewLoan = asyncHandler(async (req, res) => {
  const loan = await createLoan(req.body, req.user._id);
  if (!loan) {
    res.status(500).json({ message: "Error while creating loan" });
  }
  res.status(200).json(loan);
});

// GET /api/loans/:id
export const getLoanDetails = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ message: "Loan id cannot be empty." });
  }
  const loan = await getLoanDetailsById(req.params.id);
  if (!loan) {
    res.status(404).json({ message: "Loan not found." });
  }
  let transactions = await getTransactionsByIds([loan._id]);
  loan.transactions = transactions;
  res.status(200).json(loan);
});

// PUT /api/loans/:id
export const updateLoanDetails = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ message: "Loan id cannot be empty." });
  }
  updateLoan(req.params.id, req.body);
  res.status(200).json({ message: "Update successful." });
});

// DELETE /api/loans/:id
export const deleteLoan = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ message: "Loan id cannot be empty." });
    return;
  }
  const loan = await getLoanDetailsById(req.params.id);
  const role = req.user.role;
  if (role !== UserRole.Admin && !loan.createdById.equals(req.user._id)) {
    res.status(401).json({
      message: "Only Loan creator & Admins are allowed to delete a Loan.",
    });
    return;
  }
  let isDeleted = await deleteLoanById(req.params.id, loan.bankContact);
  if (!isDeleted) {
    res.status(404).json({ message: "Loan not found." });
    return;
  }
  // console.log("attempt mark inactive");
  await markTransactionsInactiveByTargetIds([req.params.id]);
  res.status(200).json({ message: "Loan deletion successful." });
});
