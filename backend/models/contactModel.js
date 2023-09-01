import mongoose from "mongoose";

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
      unique: true,
    },
    email: {
      type: String,
      unique: true,
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
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
export { contactSchema };
