import asyncHandler from "express-async-handler";
import { ModuleType, PaymentModeType } from "../utils/enums.js";
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "../services/transactionService.js";
import { getUserLoanDetails } from "../services/loanService.js";
import {
  getAllTargetIdsByProjectIds,
  getAllUserProjects,
} from "../services/projectService.js";
import ExpenditureCategory from "../models/expenditureCategoryModel.js";

// GET /api/transactions
export const getFilteredTransactions = asyncHandler(async (req, res) => {
  const {
    name,
    fromDate,
    toDate,
    minAmount,
    maxAmount,
    fromContactIds,
    toContactIds,
    typeEnum,
    paymentModeEnum,
    bankEnum,
    statusEnum,
    moduleEnum,
  } = req.query;

  let targetIds = req.query.targetIds;
  let userId = req.user._id;

  if (!targetIds) {
    if (moduleEnum === ModuleType.Projects) {
      let userProjects = await getAllUserProjects(userId);
      let projectIds = userProjects.map((p) => p._id);
      targetIds = await getAllTargetIdsByProjectIds(projectIds);
    }
    if (moduleEnum === ModuleType.Loans) {
      let userLoans = await getUserLoanDetails(userId);
      targetIds = userLoans.map((p) => p._id);
    }
    if (moduleEnum === ModuleType.Expenditure) {
      let categories = await ExpenditureCategory.find({
        userId: userId,
        isActive: true,
      });
      targetIds = categories.map((c) => c._id);
    }
  }

  const contacts = await getTransactions({
    targetIds,
    name,
    fromDate,
    toDate,
    minAmount,
    maxAmount,
    fromContactIds,
    toContactIds,
    typeEnum,
    paymentModeEnum,
    bankEnum,
    statusEnum,
    moduleEnum,
  });
  res.status(200).json(contacts);
});

// POST /api/transactions
export const createNewTransaction = asyncHandler(async (req, res) => {
  const {
    targetId,
    name,
    description,
    typeEnum,
    paymentModeEnum,
    bankEnum,
    statusEnum,
    date,
    amount,
    principalAmount,
    interestAmount,
    fromContactId,
    toContactId,
    moduleEnum,
  } = req.body;

  if (paymentModeEnum === PaymentModeType.Upi && !bankEnum) {
    res.status(400).json({
      message: "Bank Account is required for UPI transaction.",
    });
    return;
  }
  let result = await createTransaction({
    targetId,
    name,
    description,
    typeEnum,
    paymentModeEnum,
    bankEnum,
    statusEnum,
    date,
    amount,
    principalAmount,
    interestAmount,
    fromContactId,
    toContactId,
    moduleEnum,
  });

  res.status(200).json(result);
});

// PUT /api/transactions/:id
export const updateTransactionById = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ message: "Transaction id cannot be empty." });
    return;
  }
  const {
    targetId,
    name,
    description,
    typeEnum,
    paymentModeEnum,
    bankEnum,
    statusEnum,
    date,
    amount,
    principalAmount,
    interestAmount,
    fromContactId,
    toContactId,
    moduleEnum,
  } = req.body;

  if (paymentModeEnum === PaymentModeType.Upi && !bankEnum) {
    res.status(400).json({
      message: "Bank Account is required for UPI transaction.",
    });
    return;
  }
  let result = await updateTransaction(req.params.id, {
    targetId,
    name,
    description,
    typeEnum,
    paymentModeEnum,
    bankEnum,
    statusEnum,
    date,
    amount,
    principalAmount,
    interestAmount,
    fromContactId,
    toContactId,
    moduleEnum,
  });

  res.status(200).json(result);
});

// DELETE /api/transactions/:id
export const deleteTransactionById = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ message: "Transaction id cannot be empty." });
    return;
  }
  const { isHardDelete } = req.body;
  let result = await deleteTransaction(req.params.id, isHardDelete);
  res.status(200).json(result);
});
