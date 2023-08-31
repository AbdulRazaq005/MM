import Category from "../models/categoryModel.js";
import mongoose from "mongoose";

export async function getCategoryDetailsById(id) {
  const category = await Category.findById(id)
    .select("id name description categories events details estimate level")
    .populate({
      path: "categories",
      model: "Category",
      select: "id name description categories",
      populate: {
        path: "categories",
        model: "Category",
        select: "id categories",
      },
    });
  return category;
}

export async function updateCategory(id, categoryDetails, events, details) {
  let category = await Category.findById(id);
  if (!category) {
    throw new Error("Category not found.");
  }
  const { name, description, estimate, contact } = categoryDetails;
  category.name = name || category.name;
  category.description = description || category.description;
  category.estimate = estimate || category.estimate;

  if (events && Array.isArray(events)) {
    category.events = events;
  }
  if (details && Array.isArray(details)) {
    category.details = details;
  }
  if (contact) {
    category.vendor = mongoose.Types.ObjectId(contact);
  }
  await category.save();
  return true;
}

export async function addCategory(categoryId, categoryDetails) {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new Error("Category not found.");
  }
  const { name, description, estimate } = categoryDetails; // add more details
  const subCategory = await Category.create({
    name,
    description,
    estimate,
    level: category.level + 1,
  });
  category.categories.push(subCategory._id);
  await category.save();
  return true;
}

export async function removeCategory(categoryId, subCategoryId) {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new Error("Category not found.");
  }
  var index = category.categories.indexOf(subCategoryId);
  if (index !== -1) {
    category.categories.splice(index, 1);
    await category.save();
    return true;
  }
  return false;
}
