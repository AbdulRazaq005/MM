import Contact from "../models/contactModel.js";
import Loan from "../models/loanModel.js";
import { ContactType } from "../utils/enums.js";
import { deleteContact } from "./contactService.js";

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
  const loan = await Loan.findById(id)
    .select("-createdAt -updatedAt")
    .lean()
    .populate("loanUsers", "name");
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
    createdById: userId,
  });

  if (loan) {
    let contact = await Contact.create({
      name: name,
      contactType: ContactType.Bank,
      designation: bankEnum + " Bank Account",
    });
    loan.bankContact = contact;
    await loan.save();
  }
  return loan;
}

export async function updateLoan(id, loanDetails) {
  let loan = await Loan.findById(id);
  if (!loan) {
    throw new Error("Loan not found.");
  }
  let oldBankEnum = loan.bankEnum;
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
    bankEnum,
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
  loan.bankEnum = bankEnum || loan.bankEnum;

  await loan.save();

  if (bankEnum && bankEnum !== oldBankEnum) {
    let contact = await Contact.findById(loan.bankContact);
    if (!contact) {
      throw new Error("Bank Contact not found!");
    }
    contact.designation = bankEnum + " Bank Account";
    await contact.save();
  }
  return true;
}

export async function deleteLoanById(id, bankContactId) {
  const res = await Loan.deleteOne({ _id: id });
  let isDeleted = res.deletedCount == 1;
  if (isDeleted) {
    deleteContact(bankContactId, true);
  }
  return isDeleted;
}

export async function updateLoanForTransaction(id, loanDetails) {
  let loan = await Loan.findById(id);
  if (!loan) {
    throw new Error("Loan not found.");
  }

  const { principalAmount, interestAmount } = loanDetails;
  loan.principalAmountPaid = loan.principalAmountPaid + Number(principalAmount);
  loan.interestAmountPaid = loan.interestAmountPaid + Number(interestAmount);

  await loan.save();
  return true;
}
