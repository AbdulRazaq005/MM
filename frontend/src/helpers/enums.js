export const UserRoleEnum = Object.freeze({
  Admin: "ADMIN",
  User: "USER",
});

export const ContactTypeEnum = Object.freeze({
  User: "USER",
  Bank: "BANK",
  ThirdParty: "TP",
});

export const TransactionTypeEnum = Object.freeze({
  Debit: "DEBIT",
  Credit: "CREDIT",
});

export const TransactionStatusEnum = Object.freeze({
  Pending: "PENDING",
  Successful: "SUCCESSFUL",
  Revoked: "REVOKED",
});

export const PaymentModeTypeEnum = Object.freeze({
  Upi: "UPI",
  Cash: "CASH",
  BankAccountTransfer: "BAT",
  Cheque: "CHEQUE",
});

export const BankAccountEnum = Object.freeze({
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

export const ModuleTypeEnum = Object.freeze({
  Projects: "PROJECTS",
  Loans: "LOANS",
  Banking: "BANKING",
});

export const PortfolioTypeEnum = Object.freeze({
  BankAccount: "BANKACCOUNT",
  Asset: "ASSET",
  Investment: "INVESTMENT",
});

// Options :

export const UserRoleOptions = [
  {
    label: "Admin",
    value: "ADMIN",
  },
  {
    label: "User",
    value: "USER",
  },
];

export const TransactionTypeOptions = [
  {
    label: "Debit",
    value: "DEBIT",
  },
  {
    label: "Credit",
    value: "CREDIT",
  },
];

export const TransactionStatusOptions = [
  {
    label: "Pending",
    value: "PENDING",
  },
  {
    label: "Succssful",
    value: "SUCCESSFUL",
  },
  {
    label: "Revoked",
    value: "REVOKED",
  },
];

export const PaymentModeTypeOptions = [
  {
    label: "UPI",
    value: "UPI",
  },
  {
    label: "Cash",
    value: "CASH",
  },
  {
    label: "Bank Account Transfer",
    value: "BAT",
  },
  {
    label: "Cheque",
    value: "CHEQUE",
  },
];

export const BankAccountOptions = [
  {
    label: "Canara Bank",
    value: "CANARA",
  },
  {
    label: "Union Bank",
    value: "UNION",
  },
  {
    label: "State Bank of India",
    value: "SBI",
  },
  {
    label: "Bank Of Baroda",
    value: "BOB",
  },
  {
    label: "Pragathi Krishna Gramina Bank",
    value: "PKGB",
  },
  {
    label: "Tunga Badhra Gramina Bank",
    value: "TBGB",
  },
  {
    label: "Axis Bank",
    value: "AXIS",
  },
  {
    label: "-",
    value: "",
  },
];

export const GetBankNameFromEnum = function (bankEnum) {
  var result = BankAccountOptions.find((ele) => ele.value === bankEnum);
  return result?.label;
};

export const ModuleTypeOptions = [
  {
    label: "Projects",
    value: "PROJECTS",
  },
  {
    label: "Banking",
    value: "BANKING",
  },
];
