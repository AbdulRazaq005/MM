import asyncHandler from "express-async-handler";
import {
  addCategory,
  getCategoryDetailsById,
  removeCategory,
  updateCategory,
} from "../services/categoryService.js";

// GET /api/projects/categories/:id
export const getCategoryDetails = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ message: "Category id cannot be empty." });
  }
  const category = await getCategoryDetailsById(req.params.id);
  if (!category) {
    res.status(404).json({ message: "Category not found." });
  }
  res.status(200).json(category);
});

// PUT /api/projects/categories/:id
export const updateCategoryDetails = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ message: "Category id cannot be empty." });
  }
  const { name, description, estimate, events, details, contact } = req.body;
  updateCategory(
    req.params.id,
    { name, description, estimate, contact },
    events,
    details
  );
  res.status(200).json({ message: "Update successful." });
});

// POST /api/projects/categories/add-category
export const addSubCategory = asyncHandler(async (req, res) => {
  if (!req.body.categoryId) {
    res.status(400).json({ message: "Category id cannot be empty." });
  }
  const { categoryId, name, description, estimate } = req.body;
  const isSuccessful = await addCategory(categoryId, {
    name,
    description,
    estimate,
  });
  if (!isSuccessful) {
    res.status(500).json({ message: "Error while adding Category." });
  }
  // Should return only boolean ?
  const category = await getCategoryDetailsById(req.body.categoryId);
  if (!category) {
    res.status(500).json({ message: "Category not found." });
  }
  res.status(200).json(category);
});

// POST /api/projects/categories/add-category
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
  // Should return only boolean ?
  const category = await getCategoryDetailsById(categoryId);
  if (!category) {
    res.status(500).json({ message: "Category not found." });
  }
  res.status(200).json(category);
});
