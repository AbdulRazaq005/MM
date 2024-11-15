import express from "express";
import {
  getAllProjects,
  createNewProject,
  getProjectDetails,
  updateProjectDetails,
  deleteProject,
  addProjectCategory,
  removeProjectCategory,
} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  addSubCategory,
  getCategoryDetails,
  removeSubCategory,
  updateCategoryDetails,
} from "../controllers/projectCategoryController.js";

const router = express.Router();

//  Project  Routes
router
  .route("/")
  .get(protect, getAllProjects) // main projects page
  .post(protect, createNewProject);

router
  .route("/:id")
  .get(protect, getProjectDetails)
  .put(protect, updateProjectDetails)
  .delete(protect, deleteProject);

router.post("/add-category", protect, addProjectCategory);
router.post("/remove-category", protect, removeProjectCategory);

//  Category  Routes
router
  .route("/categories/:id")
  .get(protect, getCategoryDetails)
  .put(protect, updateCategoryDetails);

router.post("/categories/add-category", protect, addSubCategory);
router.post("/categories/remove-category", protect, removeSubCategory);

export default router;
