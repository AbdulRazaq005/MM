import asyncHandler from "express-async-handler";
import {
  addCategory,
  getCategoryDetailsById,
  removeCategory,
  updateCategory,
} from "../services/categoryService.js";
import {
  getAllNestedTargetIds,
  getTotalCost,
  getTransactionsByIds,
} from "../services/transactionService.js";

// GET /api/projects/categories/:id
export const getCategoryDetails = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ message: "Category id cannot be empty." });
  }
  const category = await getCategoryDetailsById(req.params.id);
  if (!category) {
    res.status(404).json({ message: "Category not found." });
  }
  let categoryCost = await getTotalCost([category._id]);
  if (category.categories && Array.isArray(category.categories)) {
    for (let subCategory of category.categories) {
      const targetIds = getAllNestedTargetIds(subCategory);
      const totalCost = await getTotalCost(targetIds);
      subCategory.totalCost = totalCost;
      categoryCost += totalCost;
    }
  }
  category.totalCost = categoryCost;
  const transactionTargetIds = getAllNestedTargetIds(category);
  const transactions = await getTransactionsByIds(transactionTargetIds);
  category.transactions = transactions;
  res.status(200).json(category);
});

// PUT /api/projects/categories/:id
export const updateCategoryDetails = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ message: "Category id cannot be empty." });
  }
  const { name, description, estimate, events, details, vendor } = req.body;
  updateCategory(
    req.params.id,
    { name, description, estimate, vendor },
    events,
    details
  );
  res.status(200).json({ message: "Update successful." });
});

// POST /api/projects/categories/add-category
export const addSubCategory = asyncHandler(async (req, res) => {
  if (!req.body.targetId) {
    res.status(400).json({ message: "Category id cannot be empty." });
  }
  const { targetId, name, description, estimate } = req.body;
  const isSuccessful = await addCategory(targetId, {
    name,
    description,
    estimate,
  });
  if (!isSuccessful) {
    res.status(500).json({ message: "Error while adding Category." });
  }
  res.status(200).json(true);
});

// POST /api/projects/categories/remove-category
export const removeSubCategory = asyncHandler(async (req, res) => {
  if (!req.body.categoryId) {
    res.status(400).json({ message: "Category id cannot be empty." });
  }
  if (!req.body.subCategoryId) {
    res.status(400).json({ message: "SubCategory id cannot be empty." });
  }
  const { categoryId, subCategoryId } = req.body;
  const isSuccessful = await removeCategory(categoryId, subCategoryId);
  if (!isSuccessful) {
    res.status(500).json({ message: "Error while removing Category." });
  }
  res.status(200).json(true);
});
