import mongoose from "mongoose";

const projectSchema = mongoose.Schema(
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
            unique: true,
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
            unique: true,
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
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
