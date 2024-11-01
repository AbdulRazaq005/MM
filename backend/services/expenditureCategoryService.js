import ExpenditureCategory from "../models/expenditureCategoryModel.js";
import Transaction from "../models/transactionModel.js";

export async function getExpenditureDetails({ fromDate, toDate }, userId) {
  let categories = await ExpenditureCategory.find({
    userId: userId,
    isActive: true,
  });
  let targetIds = categories.map((c) => c._id);

  let query = Transaction.where({ isActive: true });

  if (targetIds && Array.isArray(targetIds)) {
    query = query.where({ targetId: { $in: targetIds } });
  }
  if (fromDate && toDate) {
    query = query.where({ date: { $gte: fromDate, $lte: toDate } });
  }
  let transactions = await query
    .lean()
    .populate("fromContact toContact")
    .select("-isActive -__v")
    .exec();
  return {
    expenditureCategories: categories,
    transactions,
  };
}

export async function createExpenditureCategory(
  { name, description, type },
  userId
) {
  await ExpenditureCategory.create({
    name,
    description,
    userId: userId,
    type,
  });
  return true;
}

export async function updateExpenditureCategory(id, { name, description }) {
  let category = await ExpenditureCategory.findById(id);
  if (!category) {
    throw new Error("Expenditure Category not found.");
  }
  category.name = name;
  category.description = description;
  await category.save();
  return true;
}

export async function deleteExpenditureCategory(id, isHardDelete = false) {
  let category = await ExpenditureCategory.findById(id);
  if (!category) {
    throw new Error("Expenditure Category not found.");
  }
  if (isHardDelete) {
    await ExpenditureCategory.deleteOne({ id });
  } else {
    category.isActive = false;
    await category.save();
  }
  return true;
}
