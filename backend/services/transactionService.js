import Transaction, { transactionSchema } from "../models/transactionModel.js";
import mongoose from "mongoose";
import { ModuleType, TransactionType } from "../utils/enums.js";
import { updateLoanForTransaction } from "./loanService.js";

export async function getTransactions(filters) {
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
  } = filters;

  let query = Transaction.where({ isActive: true });

  if (targetIds && Array.isArray(targetIds)) {
    query = query.where({ targetId: { $in: targetIds } });
  }
  if (name) {
    query = query.where({ name: { $regex: name, $options: "i" } }); // 'i' for case insensitive.
  }
  if (fromDate && toDate) {
    query = query.where({ date: { $gte: fromDate, $lte: toDate } });
  }
  if (minAmount && maxAmount) {
    query = query.where({ amount: { $gte: minAmount, $lte: maxAmount } });
  }
  if (fromContactIds && Array.isArray(fromContactIds)) {
    query = query.where({ fromContact: { $in: fromContactIds } });
  }
  if (toContactIds && Array.isArray(toContactIds)) {
    query = query.where({ toContact: { $in: toContactIds } });
  }
  if (typeEnum) {
    query = query.where({ typeEnum: typeEnum });
  }
  if (paymentModeEnum) {
    query = query.where({ paymentModeEnum: paymentModeEnum });
  }
  if (bankEnum) {
    query = query.where({ bankEnum: bankEnum });
  }
  if (statusEnum) {
    query = query.where({ typeEnum: statusEnum });
  }
  if (moduleEnum) {
    query = query.where({ moduleEnum: moduleEnum });
  }
  let transactions = await query
    .lean()
    .populate("fromContact toContact")
    .select("-isActive -__v")
    .exec();

  return transactions.sort((t1, t2) => t2.date - t1.date);
}

export async function createTransaction(transactionDetails) {
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
  } = transactionDetails;
  await Transaction.create({
    targetId: new mongoose.Types.ObjectId(targetId),
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
    fromContact: new mongoose.Types.ObjectId(fromContactId),
    toContact: new mongoose.Types.ObjectId(toContactId),
    moduleEnum,
  });

  if (moduleEnum === ModuleType.Loans) {
    await updateLoanForTransaction(targetId, {
      principalAmount,
      interestAmount,
    });
  }

  return true;
}

export async function updateTransaction(id, transactionDetails) {
  let transaction = await Transaction.findById(id);
  if (!transaction) {
    throw new Error("Transaction not found.");
  }

  const {
    targetId,
    name,
    designation,
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
  } = transactionDetails;

  if (transaction.moduleEnum === ModuleType.Loans) {
    await updateLoanForTransaction(targetId, {
      principalAmount: Number(principalAmount) - transaction.principalAmount,
      interestAmount: Number(interestAmount) - transaction.interestAmount,
    });
  }
  transaction.targetId = new mongoose.Types.ObjectId(targetId);
  transaction.name = name;
  transaction.designation = designation;
  transaction.typeEnum = typeEnum;
  transaction.paymentModeEnum = paymentModeEnum;
  transaction.bankEnum = bankEnum;
  transaction.statusEnum = statusEnum;
  transaction.date = date;
  transaction.amount = amount;
  transaction.principalAmount = principalAmount;
  transaction.interestAmount = interestAmount;
  transaction.fromContact = new mongoose.Types.ObjectId(fromContactId);
  transaction.toContact = new mongoose.Types.ObjectId(toContactId);
  await transaction.save();

  return true;
}

export async function deleteTransaction(id, isHardDelete = false) {
  let transaction = await Transaction.findById(id);
  let result;
  if (!transaction) {
    throw new Error("Transaction not found.");
  }
  if (isHardDelete) {
    const res = await Transaction.deleteOne({ _id: id });
    result = res.deletedCount === 1;
  } else {
    transaction.isActive = false;
    result = true;
    await transaction.save();
  }
  if (transaction.moduleEnum === ModuleType.Loans) {
    await updateLoanForTransaction(transaction.targetId, {
      principalAmount: -1 * transaction.principalAmount,
      interestAmount: -1 * transaction.interestAmount,
    });
  }
  return result;
}

export async function getTotalCost(targetIds) {
  let transactions = [];
  if (Array.isArray(targetIds)) {
    transactions = await Transaction.find({
      targetId: { $in: targetIds },
      isActive: true,
    }).select("amount typeEnum");
  }
  return transactions.reduce((cumulativeTotal, transaction) => {
    let amount = transaction.amount;
    if (transaction.typeEnum === TransactionType.Credit)
      return cumulativeTotal - amount;
    else return cumulativeTotal + amount;
  }, 0);
}

export function getAllNestedTargetIds(object) {
  let categoryIds = [object._id];
  getObjectCategoryIds(object, categoryIds);
  return categoryIds;
}

function getObjectCategoryIds(object, cumulativeIds) {
  if (object.categories && Array.isArray(object.categories)) {
    object.categories.forEach((c) => {
      cumulativeIds.push(c._id);
      getObjectCategoryIds(c, cumulativeIds);
    });
  }
}

export async function getTransactionsByIds(targetIds) {
  let query = Transaction.where({ isActive: true });
  if (targetIds && Array.isArray(targetIds)) {
    query = query.where({ targetId: { $in: targetIds } });
  }
  let transactions = await query
    .lean()
    .populate("fromContact toContact")
    .select("-isActive -__v")
    .exec();
  return transactions.sort((t1, t2) => t2.date - t1.date);
}

export async function markTransactionsInactiveByTargetIds(targetIds) {
  if (targetIds && Array.isArray(targetIds)) {
    let res = await Transaction.updateMany(
      { targetId: { $in: targetIds } },
      { $set: { isActive: false } },
      { multi: true }
    );
  }
}
