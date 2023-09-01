import Contact from "../models/contactModel.js";

export async function getContacts() {
  let contacts = await Contact.find({ isActive: true}).select('name designation contactNo email address');
  return contacts;
}

export async function createContact(contactDetails) {
  const { name, designation, contactNo, email, address, projectId } =
    contactDetails;
  let contact = await Contact.create({
    name,
    designation,
    contactNo,
    email,
    address,
    projectId,
  });
  return true;
}

export async function updateContact(id, contactDetails) {
  let contact = await Contact.findById(id);
  if (!contact) {
    throw new Error("Contact not found.");
  }
  const { name, designation, contactNo, email, address, projectId } =
    contactDetails;
  contact.name = name;
  contact.designation = designation;
  contact.contactNo = contactNo;
  contact.email = email;
  contact.address = address;
  contact.projectId = projectId;
  await contact.save();
  return true;
}

export async function deleteContact(id, isHardDelete = false) {
  let contact = await Contact.findById(id);
  let result;
  if (!contact) {
    throw new Error("Contact not found.");
  }
  if (isHardDelete) {
    const res = await Contact.deleteOne({ _id: id });
    result = res.deletedCount === 1;
  } else {
    contact.isActive = false;
    result = true;
    await contact.save();
  }
  return result;
}
