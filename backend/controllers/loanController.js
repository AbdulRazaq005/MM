import asyncHandler from "express-async-handler";
import {
  createLoan,
  //getAllLoanDetails,
  getUserLoanDetails,
} from "../services/loanService.js";
// import {
//   getAllNestedTargetIds,
//   getTotalCost,
// } from "../services/transactionService.js";
// import { UserRole } from "../utils/enums.js";

// GET /api/loans
export const getUserLoans = asyncHandler(async (req, res) => {
  const loans = await getUserLoanDetails(req.user._id);
  if (!loans) {
    res.status(500).json({ message: "Error while fetching loans." });
  }
  res.status(200).json(loans);
});

// POST /api/loans
export const createNewLoan = asyncHandler(async (req, res) => {
  const loan = await createLoan(req.body, req.user._id);
  if (!loan) {
    res.status(500).json({ message: "Error while creating loan" });
  }
  res.status(200).json(loan);
});

// // GET /api/projects/:id
// export const getProjectDetails = asyncHandler(async (req, res) => {
//   if (!req.params.id) {
//     res.status(400).json({ message: "Project id cannot be empty." });
//   }
//   const project = await getProjectDetailsById(req.params.id);
//   if (!project) {
//     res.status(404).json({ message: "Project not found." });
//   }
//   let projectCost = 0;
//   if (project.categories && Array.isArray(project.categories)) {
//     for (let category of project.categories) {
//       const targetIds = getAllNestedTargetIds(category);
//       const totalCost = await getTotalCost(targetIds);
//       category.totalCost = totalCost;
//       projectCost += totalCost;
//     }
//   }
//   project.totalCost = projectCost;
//   res.status(200).json(project);
// });

// // PUT /api/projects/:id
// export const updateProjectDetails = asyncHandler(async (req, res) => {
//   if (!req.params.id) {
//     res.status(400).json({ message: "Project id cannot be empty." });
//   }
//   const { name, description, estimate, events, details, vendor } = req.body;
//   updateProject(
//     req.params.id,
//     { name, description, estimate, vendor },
//     events,
//     details
//   );
//   res.status(200).json({ message: "Update successful." });
// });

// // DELETE /api/projects/:id
// export const deleteProject = asyncHandler(async (req, res) => {
//   if (!req.params.id) {
//     res.status(400).json({ message: "Project id cannot be empty." });
//   }
//   const role = req.user.role;
//   if (role !== UserRole.Admin) {
//     res
//       .status(401)
//       .json({ message: "Only Admins are allowed to delete a Project." });
//   }
//   let isDeleted = await deleteProjectById(req.params.id);
//   if (!isDeleted) {
//     res.status(404).json({ message: "Project not found." });
//   }
//   res.status(200).json({ message: "Project deletion successful." });
// });
