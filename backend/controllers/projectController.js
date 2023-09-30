import asyncHandler from "express-async-handler";
import {
  addCategory,
  createProject,
  deleteProjectById,
  getAllProjectDetails,
  getProjectDetailsById,
  removeCategory,
  updateProject,
} from "../services/projectService.js";
import {
  getAllNestedTargetIds,
  getTotalCost,
} from "../services/transactionService.js";

// GET /api/projects
export const getAllProjects = asyncHandler(async (req, res) => {
  const projects = await getAllProjectDetails();
  if (!projects) {
    res.status(500).json({ message: "Error while fetching projects." });
  }
  res.status(200).json(projects);
});

// POST /api/projects
export const createNewProject = asyncHandler(async (req, res) => {
  const { name, description, estimate } = req.body;
  const project = await createProject({ name, description, estimate });
  if (!project) {
    res.status(500).json({ message: "Error while creating project" });
  }
  res.status(200).json(project);
});

// GET /api/projects/:id
export const getProjectDetails = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ message: "Project id cannot be empty." });
  }
  const project = await getProjectDetailsById(req.params.id);
  if (!project) {
    res.status(404).json({ message: "Project not found." });
  }
  let projectCost = 0;
  if (project.categories && Array.isArray(project.categories)) {
    for (let category of project.categories) {
      const targetIds = getAllNestedTargetIds(category);
      const totalCost = await getTotalCost(targetIds);
      category.totalCost = totalCost;
      projectCost += totalCost;
    }
  }
  project.totalCost = projectCost;
  res.status(200).json(project);
});

// PUT /api/projects/:id
export const updateProjectDetails = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ message: "Project id cannot be empty." });
  }
  const { name, description, estimate, events, details, vendor } = req.body;
  updateProject(
    req.params.id,
    { name, description, estimate, vendor },
    events,
    details
  );
  res.status(200).json({ message: "Update successful." });
});

// DELETE /api/projects/:id
export const deleteProject = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ message: "Project id cannot be empty." });
  }
  let isDeleted = await deleteProjectById(req.params.id);
  if (!isDeleted) {
    res.status(404).json({ message: "Project not found." });
  }
  res.status(200).json({ message: "Project deletion successful." });
});

// POST /api/projects/add-category
export const addProjectCategory = asyncHandler(async (req, res) => {
  if (!req.body.targetId) {
    res.status(400).json({ message: "Project id cannot be empty." });
  }
  const { targetId, name, description, estimate } = req.body;
  const isSuccessful = await addCategory(targetId, {
    name,
    description,
    estimate,
  });
  if (!isSuccessful) {
    res.status(500).json({ message: "Error while adding Category." });
  }
  res.status(200).json(true);
});

// POST /api/projects/remove-category
export const removeProjectCategory = asyncHandler(async (req, res) => {
  if (!req.body.projectId) {
    res.status(400).json({ message: "Project id cannot be empty." });
  }
  if (!req.body.categoryId) {
    res.status(400).json({ message: "Category id cannot be empty." });
  }
  const { projectId, categoryId } = req.body;
  const { isSuccessful, project } = await removeCategory(projectId, categoryId);
  if (!isSuccessful) {
    res.status(500).json({ message: "Error while removing Category." });
  }
  res.status(200).json(project);
});
