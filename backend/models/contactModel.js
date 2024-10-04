import mongoose from "mongoose";
import { ContactType } from "../utils/enums.js";

const contactSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    designation: {
      type: String,
      required: true,
    },
    contactNo: {
      type: String,
      // unique: true,
    },
    contactType: {
      type: String,
      enum: Object.values(ContactType),
    },
    email: {
      type: String,
      // unique: true,
    },
    address: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    projectId: {
      type: mongoose.Types.ObjectId,
    },
    __v: { type: Number, select: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
export { contactSchema };
