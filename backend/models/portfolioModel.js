import mongoose from "mongoose";
import { BankAccount } from "../utils/enums.js";

const portfolioSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    lastUpdatedDate: {
      type: Date,
      required: true,
      default: new Date(),
    },
    netWorth: {
      type: Number,
      required: true,
      default: 0,
    },
    bankAccounts: {
      type: [
        {
          _id: {
            type: mongoose.Types.ObjectId,
            required: true,
            default: new mongoose.Types.ObjectId(),
          },
          name: {
            type: String,
            required: true,
          },
          description: {
            type: String,
          },
          value: {
            type: Number,
            required: true,
            default: 0,
          },
          bankEnum: {
            type: String,
            enum: [...Object.values(BankAccount), ""],
          },
        },
      ],
      default: [],
    },
    assets: {
      type: [
        {
          _id: {
            type: mongoose.Types.ObjectId,
            required: true,
            default: new mongoose.Types.ObjectId(),
          },
          name: {
            type: String,
            required: true,
          },
          description: {
            type: String,
          },
          value: {
            type: Number,
            required: true,
            default: 0,
          },
          //   quantity: {
          //     type: Number,
          //   },
          //   unitValue: {
          //     type: Number,
          //   },
        },
      ],
      default: [],
    },
    investments: {
      type: [
        {
          _id: {
            type: mongoose.Types.ObjectId,
            required: true,
            default: new mongoose.Types.ObjectId(),
          },
          name: {
            type: String,
            required: true,
          },
          description: {
            type: String,
          },
          value: {
            type: Number,
            required: true,
            default: 0,
          },
          // quantity: {
          //   type: Number,
          // },
          // unitValue: {
          //   type: Number,
          // },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

export default Portfolio;
