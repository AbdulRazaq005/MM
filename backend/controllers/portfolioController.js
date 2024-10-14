import asyncHandler from "express-async-handler";
import {
  getCurrentMonthPortfolio,
  upsertUserPortfolio,
} from "../services/portfolioService.js";

// GET /api/portfolio/:id
export const getUserPortfolio = asyncHandler(async (req, res) => {
  if (!req.user._id) {
    res.status(400).json({ message: "id cannot be empty." });
  }
  const portfolio = await getCurrentMonthPortfolio(req.user._id);
  res.status(200).json(portfolio);
});

// POST /api/portfolio
export const postUserPortfolio = asyncHandler(async (req, res) => {
  const { netWorth, bankAccounts, assets, investments } = req.body;
  if (
    Array.isArray(bankAccounts) &&
    Array.isArray(assets) &&
    Array.isArray(investments)
  ) {
    let result = await upsertUserPortfolio({
      userId: req.user._id,
      netWorth,
      bankAccounts,
      assets,
      investments,
    });
    res.status(200).json(result);
    return;
  } else {
    res.status(400).json({ message: "Invalid data" });
  }
});
