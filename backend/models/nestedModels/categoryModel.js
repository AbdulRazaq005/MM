import mongoose from "mongoose";
import Event from "./eventModel";
import Detail from "./detailModel";

const categorySchema = mongoose.Schema(
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
    details: {
      type: [Detail],
    },
    events: {
      type: [Event],
    },
    estimate: {
      type: Number,
      default: 0,
    },
  }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;