import Project from "../models/projectModel.js";
import Category from "../models/categoryModel.js";
import mongoose from "mongoose";
import { CATEGORY_DEPTH_START } from "../utils/constants.js";

export async function getAllProjectDetails(userId) {
  const projects = await Project.find({
    projectUsers: { $elemMatch: { $eq: userId } },
  })
    .select("id name description")
    .lean();
  return projects;
}

export async function getProjectDetailsById(id) {
  const project = await Project.findById(id)
    .select("id name description categories events details estimate vendor")
    .lean()
    .populate({
      path: "vendor",
      model: "Contact",
    })
    .populate({
      path: "categories",
      model: "Category",
      select: "id name description categories estimate",
      populate: {
        path: "categories",
        model: "Category",
        select: "id categories",
        populate: {
          path: "categories",
          model: "Category",
          select: "id categories",
        },
      },
    });
  return project;
}

export async function createProject(projectDetails, userId) {
  const { name, description, estimate } = projectDetails;
  const project = await Project.create({
    name,
    description,
    estimate,
    projectUsers: [userId],
    createdById: userId,
  });
  return project;
}

export async function updateProject(id, projectDetails, events, details) {
  let project = await Project.findById(id);
  if (!project) {
    throw new Error("Project not found.");
  }
  const { name, description, estimate, vendor } = projectDetails;
  project.name = name || project.name;
  project.description = description || project.description;
  project.estimate = estimate || project.estimate;

  if (events && Array.isArray(events)) {
    events.forEach((event) => {
      if (!event._id) {
        event._id = new mongoose.Types.ObjectId();
      }
    });
    project.events = events;
  }
  if (details && Array.isArray(details)) {
    details.forEach((detail) => {
      if (!detail._id) {
        detail._id = new mongoose.Types.ObjectId();
      }
    });
    project.details = details;
  }
  if (vendor) {
    project.vendor = new mongoose.Types.ObjectId(vendor);
  } else {
    project.vendor = null;
  }
  await project.save();
  return true;
}

export async function deleteProjectById(projectId) {
  const res = await Project.deleteOne({ _id: projectId });
  return res.deletedCount == 1;
}

export async function addCategory(projectId, categoryDetails) {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new Error("Project not found.");
  }
  const { name, description, estimate } = categoryDetails; // add more details
  const category = await Category.create({
    name,
    description,
    estimate,
    level: CATEGORY_DEPTH_START,
  });
  project.categories.push(category._id);
  await project.save();
  return true;
}

export async function removeCategory(projectId, categoryId) {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new Error("Project not found.");
  }
  var categoryToDelete = await Category.findById(categoryId);
  if (!categoryToDelete) {
    throw new Error("Category not found.");
  }
  if (categoryToDelete.categories.length !== 0) {
    throw new Error("Category having sub-categories cannot be deleted.");
  }
  var index = project.categories.indexOf(categoryId);
  if (index !== -1) {
    project.categories.splice(index, 1);
    await project.save();

    const res = await Category.deleteOne({ _id: categoryId });
    const updatedProject = await getProjectDetailsById(projectId);
    return { isSuccessful: res.deletedCount === 1, project: updatedProject };
  }
  return false;
}
