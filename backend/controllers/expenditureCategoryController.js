import asyncHandler from "express-async-handler";
import {
  getExpenditureDetails,
  createExpenditureCategory,
  updateExpenditureCategory,
  deleteExpenditureCategory,
} from "../services/expenditureCategoryService.js";

// GET /api/expenditure
export const getUserExpenditureDetails = asyncHandler(async (req, res) => {
  let filters = {
    fromDate: req.query.fromDate,
    toDate: req.query.toDate,
  };
  const result = await getExpenditureDetails(filters, req.user._id);
  res.status(200).json(result);
});

// POST /api/expenditure
export const createUserExpenditureCategory = asyncHandler(async (req, res) => {
  const { name, description, type } = req.body;
  let result = await createExpenditureCategory(
    {
      name,
      description,
      type,
    },
    req.user._id
  );
  res.status(200).json(result);
});

// PUT /api/expenditure/:id
export const updateUserExpenditureCategory = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res
      .status(400)
      .json({ message: "Expenditure Category id cannot be empty." });
    return;
  }
  const { name, description } = req.body;
  let result = await updateExpenditureCategory(req.params.id, {
    name,
    description,
  });
  res.status(200).json(result);
});

// DELETE /api/expenditure/:id
export const deleteUserExpenditureCategory = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res
      .status(400)
      .json({ message: "Expenditure Category id cannot be empty." });
    return;
  }
  const { isHardDelete } = req.body;
  let result = await deleteExpenditureCategory(req.params.id, isHardDelete);
  res.status(200).json(result);
});
