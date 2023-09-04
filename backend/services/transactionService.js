import Transaction from "../models/transactionModel.js";
import mongoose from "mongoose";

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
  } = filters;

  let query = Transaction.where({ isActive: true });

  if (targetIds && Array.isArray(targetIds)) {
    query = query.where({ targetId: { $in: targetIds } });
  }
  if (name) {
    query = query.where({ name: { $regex: name, $options: "i" } }); // 'i' for case insensitive.
  }
  if (fromDate && toDate) {
    query = query.where({ date: { $gt: fromDate, $lt: toDate } });
  }
  if (minAmount && maxAmount) {
    query = query.where({ amount: { $gt: minAmount, $lt: maxAmount } });
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
  return query.exec();
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
    fromContactId,
    toContactId,
    moduleEnum,
  } = transactionDetails;
  let transaction = await Transaction.create({
    targetId: new mongoose.Types.ObjectId(targetId),
    name,
    description,
    typeEnum,
    paymentModeEnum,
    bankEnum,
    statusEnum,
    date,
    amount,
    fromContact: new mongoose.Types.ObjectId(fromContactId),
    toContact: new mongoose.Types.ObjectId(toContactId),
    moduleEnum,
  });
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
    fromContactId,
    toContactId,
  } = transactionDetails;
  transaction.targetId = mongoose.Types.ObjectId(targetId);
  transaction.name = name;
  transaction.designation = designation;
  transaction.typeEnum = typeEnum;
  transaction.paymentModeEnum = paymentModeEnum;
  transaction.bankEnum = bankEnum;
  transaction.statusEnum = statusEnum;
  transaction.date = date;
  transaction.amount = amount;
  (transaction.fromContact = mongoose.Types.ObjectId(fromContactId)),
    (transaction.toContact = mongoose.Types.ObjectId(toContactId)),
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
  return result;
}

export async function getTotalCost(targetIds) {
  let transactions = [];
  if (Array.isArray(targetIds)) {
    transactions = await Transaction.find({
      targetId: { $in: targetIds },
      isActive: true,
    }).select("amount");
  }
  return transactions.reduce(
    (cumulativeTotal, transaction) => transaction.amount + cumulativeTotal,
    0
  );
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
