import asyncHandler from "express-async-handler";
import { PaymentModeType } from "../utils/enums.js";
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "../services/transactionService.js";

// GET /api/transactions
export const getFilteredTransactions = asyncHandler(async (req, res) => {
  const {
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
  } = req.query;
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
