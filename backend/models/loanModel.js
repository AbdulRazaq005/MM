import mongoose from "mongoose";

const loanSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    loanAmount: {
      type: Number,
      default: 0,
      required: true,
    },
    sanctionedDate: {
      type: Date,
      //required: true,
    },
    tenure: {
      type: Number,
      default: 0,
      required: true,
    },
    interestRate: {
      type: Number,
      default: 0,
      required: true,
    },
    repaymentStartDate: {
      type: Date,
      //required: true,
    },
    principalAmountPaid: {
      type: Number,
      default: 0,
    },
    interestAmountPaid: {
      type: Number,
      default: 0,
    },
    emiAmount: {
      type: Number,
      default: 0,
    },
    loanUsers: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    __v: { type: Number, select: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Loan = mongoose.model("Loan", loanSchema);

export default Loan;
export { loanSchema };
