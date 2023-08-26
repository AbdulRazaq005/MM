import mongoose from "mongoose";

const eventSchema = mongoose.Schema(
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
    Date: {
      type: Date,
      required: true,
    },
    urls: {
      type: [String]
    },
  }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;