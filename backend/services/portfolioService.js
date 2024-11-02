import mongoose from "mongoose";
import Portfolio from "../models/portfolioModel.js";
import { PortfolioType } from "../utils/enums.js";

export async function getCurrentMonthPortfolio(userId) {
  let date = new Date();
  let portfolio = await Portfolio.findOne({
    userId: userId,
    lastUpdatedDate: {
      $gte: new Date(date.getFullYear(), date.getMonth(), 1),
      $lt: new Date(date.getFullYear(), date.getMonth() + 1, 0),
    },
  });

  if (!portfolio) {
    // fetch the latest existing record
    portfolio = await Portfolio.findOne().sort({ lastUpdatedDate: -1 });
  }
  if (!portfolio) {
    // create one if no records exist for this userId
    portfolio = await Portfolio.create({
      userId: userId,
      lastUpdatedDate: new Date(),
    });
  }

  return portfolio;
}

export async function upsertUserPortfolio({
  userId,
  netWorth,
  bankAccounts,
  assets,
  investments,
}) {
  let date = new Date();
  let portfolio = await Portfolio.findOne({
    userId: userId,
    lastUpdatedDate: {
      $gte: new Date(date.getFullYear(), date.getMonth(), 1),
      $lt: new Date(date.getFullYear(), date.getMonth() + 1, 0),
    },
  });
  if (!portfolio) {
    // fetch the latest existing record
    portfolio = await Portfolio.findOne().sort({ lastUpdatedDate: -1 });
  }
  if (!portfolio) {
    // create one if no records exist for this userId
    portfolio = await Portfolio.create({
      userId: userId,
      lastUpdatedDate: new Date(),
    });
  }

  let total = 0;
  total += Number(bankAccounts.reduce((total, item) => total + item.value, 0));
  total += Number(assets.reduce((total, item) => total + item.value, 0));
  total += Number(investments.reduce((total, item) => total + item.value, 0));

  portfolio.lastUpdatedDate = date;
  portfolio.netWorth = total;
  portfolio.bankAccounts = bankAccounts;
  portfolio.assets = assets;
  portfolio.investments = investments;

  await portfolio.save();
  return portfolio;
}

export async function deletePortfolioItem({ userId, type, id }) {
  // console.log("delete: ", { userId, type, id });
  let date = new Date();
  let portfolio = await Portfolio.findOne({
    userId: userId,
    lastUpdatedDate: {
      $gte: new Date(date.getFullYear(), date.getMonth(), 1),
      $lt: new Date(date.getFullYear(), date.getMonth() + 1, 0),
    },
  });
  if (!portfolio) {
    // fetch the latest existing record
    portfolio = await Portfolio.findOne().sort({ lastUpdatedDate: -1 });
  }
  if (!portfolio) {
    // create one if no records exist for this userId
    portfolio = await Portfolio.create({
      userId: userId,
      lastUpdatedDate: new Date(),
    });
  }
  if (type === PortfolioType.BankAccount) {
    let bankAccounts = portfolio.bankAccounts;
    portfolio.bankAccounts = bankAccounts.filter((b) => !b._id.equals(id));
  }
  if (type === PortfolioType.Asset) {
    let assets = portfolio.assets;
    portfolio.assets = assets.filter((b) => !b._id.equals(id));
  }
  if (type === PortfolioType.Investment) {
    let investments = portfolio.investments;
    portfolio.investments = investments.filter((b) => !b._id.equals(id));
  }

  await portfolio.save();
  return portfolio;
}
