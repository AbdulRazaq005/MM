import mongoose from "mongoose";
// import { eventSchema } from "./nestedModels/eventModel.js";
// import { detailSchema } from "./nestedModels/detailModel.js";
import { CATEGORY_DEPTH_ALLOWED } from "../utils/constants.js";

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  estimate: {
    type: Number,
    default: 0,
  },
  vendor: {
    type: mongoose.Types.ObjectId,
    ref: "Contact",
  },
  categories: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
  ],
  details: {
    type: [
      {
        key: {
          type: String,
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
      },
    ],
    default: [],
  },
  events: {
    type: [
      {
        name: {
          type: String,
          required: true,
          unique: true,
        },
        description: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          required: true,
        },
        urls: {
          type: [String],
        },
      },
    ],
    default: [],
  },
  level: {
    type: Number,
    required: true,
    min: [1, "Category level cannot be less than 1."],
    max: [
      CATEGORY_DEPTH_ALLOWED,
      `Category level cannot exceed ${CATEGORY_DEPTH_ALLOWED}.`,
    ],
  },
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
// export { categorySchema };
