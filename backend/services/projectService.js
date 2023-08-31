import Project from "../models/projectModel.js";
import Category from "../models/categoryModel.js";
import mongoose from "mongoose";
import { CATEGORY_DEPTH_START } from "../utils/constants.js";


export async function getAllProjectDetails(id) {
  const projects = await Project.find({}).select("id name description");
  return projects;
}

export async function getProjectDetailsById(id) {
  const project = await Project.findById(id)
    .select("id name description categories events details estimate")
    .populate({
      path: "categories",
      model: "Category",
      select: "id name description categories",
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
    project.events = events;
  }
  if (details && Array.isArray(details)) {
    project.details = details;
  }
  if (contact) {
    project.vendor = mongoose.Types.ObjectId(contact);
  }
  await project.save();
  return true;
}

export async function deleteProjectById(projectId) {
  const res = await Project.deleteOne({_id: projectId});
  return res.deletedCount == 1;
}

export async function addCategory(projectId, categoryDetails) {
  const project = await Project.findById(projectId);
  if (!project){
    throw new Error("Project not found.")
  }
  const { name, description, estimate } = categoryDetails; // add more details
  const category = await Category.create({
    name,
    description,
    estimate,
    CATEGORY_DEPTH_START,
  });
  project.categories.push(category._id);
  await project.save();
  return true;
}

export async function removeCategory(projectId, categoryId) {
  const project = await Project.findById(projectId);
  if (!project){
    throw new Error("Project not found.")
  }
  var index = project.categories.indexOf(categoryId);
  if (index !== -1) {
    project.categories.splice(index, 1);
    await project.save();
    return true;
  }
  return false;
}

// Helper methods

// async function updateProjectEvents(events, project) {
//   let newEvents = events.filter((e) => e.status == DocumentUpdateStatus.New);
//   newEvents.forEach(async (e) => {
//     const event = await Event.create({
//       name: e.name,
//       description: e.description,
//       date: e.date,
//       urls: e.urls,
//     });
//     project.events.push(event);
//   });

//   let updatedEvents = events.filter(
//     (e) => e.status == DocumentUpdateStatus.Updated
//   );
//   updatedEvents.forEach((e) => {
//     const event = project.events.find((pe) => pe.id == e._id);
//     event.name = e.name;
//     event.description = e.description;
//     event.date = e.date;
//     event.urls = e.urls;
//   });
//   let deletedEvents = events.filter(
//     (e) => e.status == DocumentUpdateStatus.Deleted
//   );
//   deletedEvents.forEach((e) => {
//     const event = project.events.find((pe) => pe.id == e._id);
//     project.events.pop(event);
//   });
//   return project;
// }
