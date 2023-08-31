export const TransactionType = Object.freeze({
  Debit: "DEBIT",
  Credit: "CREDIT",
});

export const TransactionStatus = Object.freeze({
  Pending: "PENDING",
  Succssful: "SUCCESSFUL",
  Revoked: "REVOKED",
});

export const PaymentModeType = Object.freeze({
  Upi: "UPI",
  Cash: "CASH",
  BankAccountTransfer: "BAT",
  Cheque: "CHEQUE",
});

export const BankType = Object.freeze({
  Sbi: "SBI",
  Union: "UNION",
  Canara: "CANARA",
  BankOfBaroda: "BOB",
  PragathiKrishna: "PKGB",
  TungaBadhra: "TBGB",
  Axis: "AXIS",
});