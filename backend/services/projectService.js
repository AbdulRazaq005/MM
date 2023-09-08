import Project from "../models/projectModel.js";
import Category from "../models/categoryModel.js";
import mongoose from "mongoose";
import { CATEGORY_DEPTH_START } from "../utils/constants.js";

export async function getAllProjectDetails() {
  const projects = await Project.find({}).select("id name description");
  return projects;
}

export async function getProjectDetailsById(id) {
  const project = await Project.findById(id)
    .select("id name description categories events details estimate")
    .lean()
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

export async function createProject(projectDetails) {
  const { name, description, estimate } = projectDetails;
  const project = await Project.create({ name, description, estimate });
  return project;
}

export async function updateProject(id, projectDetails, events, details) {
  let project = await Project.findById(id);
  if (!project) {
    throw new Error("Project not found.");
  }
  const { name, description, estimate, contact } = projectDetails;
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
  if (contact) {
    project.vendor = mongoose.Types.ObjectId(contact);
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
  var index = project.categories.indexOf(categoryId);
  if (index !== -1) {
    project.categories.splice(index, 1);
    await project.save();
    return true;
  }
  return false;
}
