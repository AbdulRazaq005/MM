import asyncHandler from "express-async-handler";
import {
  createLoan,
  deleteLoanById,
  getLoanDetailsById,
  getUserLoanDetails,
  updateLoan,
} from "../services/loanService.js";

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
  // let loanCost = 0;
  // if (project.categories && Array.isArray(project.categories)) {
  //   for (let category of project.categories) {
  //     const targetIds = getAllNestedTargetIds(category);
  //     const totalCost = await getTotalCost(targetIds);
  //     category.totalCost = totalCost;
  //     projectCost += totalCost;
  //   }
  // }
  // project.totalCost = projectCost;
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
  }
  const role = req.user.role;
  if (role !== UserRole.Admin) {
    res
      .status(401)
      .json({ message: "Only Admins are allowed to delete a Project." });
  }
  let isDeleted = await deleteLoanById(req.params.id);
  if (!isDeleted) {
    res.status(404).json({ message: "Loan not found." });
  }
  res.status(200).json({ message: "Loan deletion successful." });
});
