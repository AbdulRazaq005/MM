export const UserRole = Object.freeze({
  Admin: "ADMIN",
  User: "USER",
});

export const ContactType = Object.freeze({
  User: "USER",
  Bank: "BANK",
  ThirdParty: "TP",
});

export const TransactionType = Object.freeze({
  Debit: "DEBIT",
  Credit: "CREDIT",
});

export const TransactionStatus = Object.freeze({
  Pending: "PENDING",
  Successful: "SUCCESSFUL",
  Revoked: "REVOKED",
});

export const PaymentModeType = Object.freeze({
  Upi: "UPI",
  Cash: "CASH",
  BankAccountTransfer: "BAT",
  Cheque: "CHEQUE",
});

export const BankAccount = Object.freeze({
  Sbi: "SBI",
  Union: "UNION",
  Canara: "CANARA",
  BankOfBaroda: "BOB",
  PragathiKrishna: "PKGB",
  TungaBhadra: "TBGB",
  Axis: "AXIS",
  Hdfc: "HDFC",
  Icici: "ICICI",
  Other: "OTHER",
});

export const ModuleType = Object.freeze({
  Projects: "PROJECTS",
  Loans: "LOANS",
  Banking: "BANKING",
});
