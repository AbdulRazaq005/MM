import mongoose from "mongoose";
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
        _id: {
          type: mongoose.Types.ObjectId,
          required: true,
          // unique: true,
        },
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
        _id: {
          type: mongoose.Types.ObjectId,
          required: true,
          // unique: true,
        },
        name: {
          type: String,
          required: true,
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
