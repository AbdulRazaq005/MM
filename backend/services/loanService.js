import Contact from "../models/contactModel.js";
import Loan from "../models/loanModel.js";
import mongoose from "mongoose";
import { ContactType } from "../utils/enums.js";

export async function getAllLoanDetails() {
  const loans = await Loan.find({}).select("id name description");
  return loans;
}

export async function getUserLoanDetails(userId) {
  const loans = await Loan.find({
    loanUsers: { $elemMatch: { $eq: userId } },
  })
    .select("-createdAt -updatedAt")
    .lean();
  return loans;
}

export async function getLoanDetailsById(id) {
  const loan = await Loan.findById(id).select("-createdAt -updatedAt").lean();
  return loan;
}

export async function createLoan(loanDetails, userId) {
  const {
    name,
    description,
    bankEnum,
    loanAmount,
    sanctionedDate,
    tenure,
    interestRate,
    repaymentStartDate,
    principalAmountPaid,
    interestAmountPaid,
    emiAmount,
  } = loanDetails;
  const loan = await Loan.create({
    name,
    description,
    bankEnum,
    loanAmount,
    sanctionedDate,
    tenure,
    interestRate,
    repaymentStartDate,
    principalAmountPaid,
    interestAmountPaid,
    emiAmount,
    loanUsers: [userId],
  });

  if (loan) {
    let contact = await Contact.create({
      name: name,
      contactType: ContactType.Bank,
      designation: bankEnum,
    });
    loan.bankContact = contact;
    await user.save();
  }
  return loan;
}

export async function updateLoan(id, loanDetails) {
  let loan = await Loan.findById(id);
  if (!loan) {
    throw new Error("Loan not found.");
  }
  const {
    name,
    description,
    loanAmount,
    sanctionedDate,
    tenure,
    interestRate,
    repaymentStartDate,
    principalAmountPaid,
    interestAmountPaid,
    emiAmount,
  } = loanDetails;
  loan.name = name || loan.name;
  loan.description = description || loan.description;
  loan.loanAmount = loanAmount || loan.loanAmount;
  loan.sanctionedDate = sanctionedDate || loan.sanctionedDate;
  loan.tenure = tenure || loan.tenure;
  loan.interestRate = interestRate || loan.interestRate;
  loan.repaymentStartDate = repaymentStartDate || loan.repaymentStartDate;
  loan.principalAmountPaid = principalAmountPaid || loan.principalAmountPaid;
  loan.interestAmountPaid = interestAmountPaid || loan.interestAmountPaid;
  loan.emiAmount = emiAmount || loan.emiAmount;

  await loan.save();
  return true;
}

export async function deleteLoanById(id) {
  const res = await Loan.deleteOne({ _id: id });
  return res.deletedCount == 1;
}
