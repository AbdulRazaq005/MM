import Contact from "../models/contactModel.js";
import User from "../models/userModel.js";
import { ContactType } from "../utils/enums.js";
import { getAllUserProjects } from "./projectService.js";

export async function getContacts(userId) {
  let userProjects = await getAllUserProjects(userId);
  let userProjectIds = userProjects.map((p) => p._id);

  let contacts = await Contact.where({
    isActive: true,
    projectId: { $in: userProjectIds },
  }).exec();

  let userContact = await getUserContactId(userId);
  return [...contacts, userContact];
}

async function getUserContactId(userId) {
  let userContact = await User.findById(userId)
    .populate("contact")
    .lean()
    .select("contact");
  // console.log(userContact);
  return userContact.contact;
}

export async function createContact(contactDetails) {
  let { name, designation, contactNo, email, address, projectId, userId } =
    contactDetails;

  // change this in future to allow select project from UI
  let userProjects = await getAllUserProjects(userId);
  if (!projectId) {
    projectId = userProjects[0]?._id;
  }

  let contact = await Contact.create({
    name,
    designation,
    contactNo,
    email,
    address,
    projectId,
    // contactType: ContactType.ThirdParty,
  });
  return await getContacts(userId);
}

export async function updateContact(id, contactDetails) {
  let contact = await Contact.findById(id);
  if (!contact) {
    throw new Error("Contact not found.");
  }
  const {
    name,
    designation,
    contactNo,
    email,
    address,
    projectId,
    ContactType,
    userId,
  } = contactDetails;
  contact.name = name;
  contact.designation = designation;
  contact.contactNo = contactNo;
  contact.email = email;
  contact.address = address;
  contact.projectId = projectId;
  contact.ContactType = ContactType;
  await contact.save();
  return await getContacts(userId);
}

export async function deleteContact(id, isHardDelete = false, userId) {
  let contact = await Contact.findById(id);
  if (!contact) {
    throw new Error("Contact not found.");
  }
  if (isHardDelete) {
    await Contact.deleteOne({ _id: id });
  } else {
    contact.isActive = false;
    await contact.save();
  }
  return await getContacts(userId);
}
