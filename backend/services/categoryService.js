import Category from "../models/categoryModel.js";
import mongoose from "mongoose";

export async function getCategoryDetailsById(id) {
  const category = await Category.findById(id)
    .select(
      "id name description categories events details estimate vendor level"
    )
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
      },
    });
  return category;
}

export async function updateCategory(id, categoryDetails, events, details) {
  let category = await Category.findById(id);
  if (!category) {
    throw new Error("Category not found.");
  }
  const { name, description, estimate, vendor } = categoryDetails;
  category.name = name || category.name;
  category.description = description || category.description;
  category.estimate = estimate || category.estimate;

  if (events && Array.isArray(events)) {
    events.forEach((event) => {
      if (!event._id) {
        event._id = new mongoose.Types.ObjectId();
      }
    });
    category.events = events;
  }
  if (details && Array.isArray(details)) {
    details.forEach((detail) => {
      if (!detail._id) {
        detail._id = new mongoose.Types.ObjectId();
      }
    });
    category.details = details;
  }
  if (vendor) {
    category.vendor = new mongoose.Types.ObjectId(vendor);
  } else {
    category.vendor = null;
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
  var categoryToDelete = await Category.findById(subCategoryId);
  if (!categoryToDelete) {
    throw new Error("Sub-Category not found.");
  }
  if (categoryToDelete.categories.length !== 0) {
    throw new Error("Category having sub-categories cannot be deleted.");
  }
  var index = category.categories.indexOf(subCategoryId);
  if (index !== -1) {
    category.categories.splice(index, 1);
    await category.save();

    const res = await Category.deleteOne({ _id: subCategoryId });
    const updatedCategory = await getCategoryDetailsById(categoryId);
    return { isSuccessful: res.deletedCount === 1, category: updatedCategory };
  }
  return false;
}
