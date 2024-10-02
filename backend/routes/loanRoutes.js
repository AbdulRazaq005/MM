import express from "express";
import { getUserLoans, createNewLoan } from "../controllers/loanController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

//  Loan Routes
router
  .route("/")
  .get(protect, getUserLoans) // main loans page
  .post(protect, createNewLoan);

// router
//   .route("/:id")
//   .get(protect, getProjectDetails)
//   .put(protect, updateProjectDetails)
//   .delete(protect, deleteProject);

export default router;
