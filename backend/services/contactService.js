import Contact from "../models/contactModel.js";

export async function getContacts() {
  let contacts = await Contact.find({ isActive: true });
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
    ContactType,
  });
  return await getContacts();
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
  } = contactDetails;
  contact.name = name;
  contact.designation = designation;
  contact.contactNo = contactNo;
  contact.email = email;
  contact.address = address;
  contact.projectId = projectId;
  contact.ContactType = ContactType;
  await contact.save();
  return await getContacts();
}

export async function deleteContact(id, isHardDelete = false) {
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
  return await getContacts();
}
