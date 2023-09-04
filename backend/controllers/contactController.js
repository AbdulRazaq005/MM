import asyncHandler from "express-async-handler";
import {
  createContact,
  deleteContact,
  getContacts,
  updateContact,
} from "../services/contactService.js";

// GET /api/contacts
export const getAllContacts = asyncHandler(async (req, res) => {
  const contacts = await getContacts();
  res.status(200).json(contacts);
});

// POST /api/contacts
export const createNewContact = asyncHandler(async (req, res) => {
  const { name, designation, contactNo, email, address, projectId } = req.body;
  let result = await createContact({
    name,
    designation,
    contactNo,
    email,
    address,
    projectId,
  });
  res.status(200).json(result);
});

// PUT /api/contacts/:id
export const updateContactById = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ message: "Contact id cannot be empty." });
  }
  const { name, designation, contactNo, email, address, projectId } = req.body;
  let result = await updateContact(req.params.id, {
    name,
    designation,
    contactNo,
    email,
    address,
    projectId,
  });
  res.status(200).json(result);
});

// DELETE /api/contacts/:id
export const deleteContactById = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ message: "Contact id cannot be empty." });
  }
  const { isHardDelete } = req.body;
  let result = await deleteContact(req.params.id, isHardDelete);
  res.status(200).json(result);
});
