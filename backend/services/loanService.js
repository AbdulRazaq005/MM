import Loan from "../models/loanModel.js";
import mongoose from "mongoose";

export async function getAllLoanDetails() {
  const loans = await Loan.find({}).select("id name description");
  return loans;
}

export async function getUserLoanDetails(userId) {
  const loans = await Loan.find({
    loanUsers: { $elemMatch: { $eq: userId } },
  }).select("id name description");
  return loans;
}

// export async function getLoanDetailsById(id) {
//   const project = await Project.findById(id)
//     .select("id name description categories events details estimate vendor")
//     .lean()
//     .populate({
//       path: "vendor",
//       model: "Contact",
//     })
//     .populate({
//       path: "categories",
//       model: "Category",
//       select: "id name description categories estimate",
//       populate: {
//         path: "categories",
//         model: "Category",
//         select: "id categories",
//         populate: {
//           path: "categories",
//           model: "Category",
//           select: "id categories",
//         },
//       },
//     });
//   return project;
// }

export async function createLoan(loanDetails, userId) {
  const { name, description, loanAmount, tenure, interestRate, emiAmount } =
    loanDetails;
  const loan = await Loan.create({
    name,
    description,
    loanAmount,
    tenure,
    interestRate,
    emiAmount,
    loanUsers: [userId],
  });
  return loan;
}

// export async function updateProject(id, projectDetails, events, details) {
//   let project = await Project.findById(id);
//   if (!project) {
//     throw new Error("Project not found.");
//   }
//   const { name, description, estimate, vendor } = projectDetails;
//   project.name = name || project.name;
//   project.description = description || project.description;
//   project.estimate = estimate || project.estimate;

//   if (events && Array.isArray(events)) {
//     events.forEach((event) => {
//       if (!event._id) {
//         event._id = new mongoose.Types.ObjectId();
//       }
//     });
//     project.events = events;
//   }
//   if (details && Array.isArray(details)) {
//     details.forEach((detail) => {
//       if (!detail._id) {
//         detail._id = new mongoose.Types.ObjectId();
//       }
//     });
//     project.details = details;
//   }
//   if (vendor) {
//     project.vendor = new mongoose.Types.ObjectId(vendor);
//   } else {
//     project.vendor = null;
//   }
//   await project.save();
//   return true;
// }

// export async function deleteProjectById(projectId) {
//   const res = await Project.deleteOne({ _id: projectId });
//   return res.deletedCount == 1;
// }
