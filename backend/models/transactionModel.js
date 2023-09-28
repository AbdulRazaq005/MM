import mongoose from "mongoose";
import {
  BankAccount,
  ModuleType,
  PaymentModeType,
  TransactionStatus,
  TransactionType,
} from "../utils/enums.js";

const transactionSchema = mongoose.Schema(
  {
    targetId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    fromContact: {
      type: mongoose.Types.ObjectId,
      ref: "Contact",
      required: true,
    },
    toContact: {
      type: mongoose.Types.ObjectId,
      ref: "Contact",
      required: true,
    },
    typeEnum: {
      type: String,
      required: true,
      enum: Object.values(TransactionType),
    },
    statusEnum: {
      type: String,
      required: true,
      enum: Object.values(TransactionStatus),
    },
    paymentModeEnum: {
      type: String,
      required: true,
      enum: Object.values(PaymentModeType),
    },
    bankEnum: {
      type: String,
      enum: [...Object.values(BankAccount), ""],
    },
    moduleEnum: {
      type: String,
      required: true,
      enum: Object.values(ModuleType),
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
export { transactionSchema };
