import mongoose from "mongoose";
// import { UserRole } from "../utils/enums.js";

const expenditureCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    isActive: {
      type: String,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const ExpenditureCategory = mongoose.model(
  "ExpenditureCategory",
  expenditureCategorySchema
);

export default ExpenditureCategory;
