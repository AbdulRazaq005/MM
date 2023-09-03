import mongoose from 'mongoose';

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
      ref: 'Contact',
      required: true,
    },
    toContact: {
      type: mongoose.Types.ObjectId,
      ref: 'Contact',
      required: true,
    },
    typeEnum: {
      type: String,
      required: true,
    },
    statusEnum: {
      type: String,
      required: true,
    },
    paymentModeEnum: {
      type: String,
      required: true,
    },
    bankEnum: {
      type: String,
    },
    moduleEnum: {
      type: String,
      required: true,
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

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
export { transactionSchema };

