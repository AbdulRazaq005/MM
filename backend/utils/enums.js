const TransactionType = Object.freeze({
  Debit: "DEBIT",
  Credit: "CREDIT",
});

const TransactionStatus = Object.freeze({
  Pending: "PENDING",
  Succssful: "SUCCESSFUL",
  Revoked: "REVOKED",
});

const PaymentModeType = Object.freeze({
  Upi: "UPI",
  Cash: "CASH",
  BankAccountTransfer: "BAT",
  Cheque: "CHEQUE",
});

const BankType = Object.freeze({
  Sbi: "SBI",
  Union: "UNION",
  Canara: "CANARA",
  BankOfBaroda: "BOB",
  PragathiKrishna: "PKGB",
  TungaBadhra: "TBGB",
  Axis: "AXIS",
});

export { TransactionType, TransactionStatus, PaymentModeType, BankType };
