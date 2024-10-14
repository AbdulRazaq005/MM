import Portfolio from "../models/portfolioModel.js";

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

  portfolio.lastUpdatedDate = date;
  portfolio.netWorth = netWorth;
  portfolio.bankAccounts = bankAccounts;
  portfolio.assets = assets;
  portfolio.investments = investments;

  await portfolio.save();
  return true;
}
