import React, { useState } from "react";
import { ContactsUrl } from "../../Constants";
import {
  Box,
  Button,
  Divider,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import ContactsCard from "../../components/ContactsCard";
import axios from "axios";
import { useAtom } from "jotai";
import { contactsAtom } from "../../store";
import EditContactModal from "../../components/EditContactModal";

function Contacts() {
  const [contacts, setContacts] = useAtom(contactsAtom);
  const [isCreateContact, setIsCreateContact] = useState(false);
  const closeCreateContact = () => setIsCreateContact(false);
  const [render, setRender] = useState(0);
  const reRender = () => setRender(render + 1);

  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  const [activeEditContact, setActiveEditContact] = useState({});
  const [isEditContactMode, setEditContactMode] = useState(false);
  const closeEditContactModal = () => setEditContactMode(false);

  const submitCreateNewContact = (e) => {
    e.preventDefault();
    if (!(name && designation && contactNo)) {
      setMessage("Please complete all fields");
    } else if (isNaN(Number(contactNo))) {
      setMessage("Please enter a valid Contact no.");
    } else if (contactNo.length !== 10) {
      setMessage("Please enter 10 digit Contact no.");
    } else {
      axios
        .post(ContactsUrl, {
          name,
          designation,
          contactNo,
          email,
          address,
        })
        .then((response) => {
          setMessage("Contact Created Successfully.");
          console.log(response);
          setRender(render + 1);
          setContacts(response.data);
          closeCreateContact();
        })
        .catch((error) => {
          setMessage(error.response.data.message);
          console.log(error);
        });
    }
  };

  function createNewContactComponent() {
    if (isCreateContact) {
      return (
        <Box
          sx={{
            pt: 3,
            width: "25rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography component="h1" variant="h6">
            Create New Contact
          </Typography>
          <Box
            component="form"
            noValidate
            sx={{ mt: 1 }}
            onSubmit={submitCreateNewContact}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              name="contact-name"
              label="Name"
              size="small"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="designation"
              label="Designation"
              size="small"
              onChange={(e) => {
                setDesignation(e.target.value);
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="email"
              label="Email Address"
              autoComplete="email"
              size="small"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="phone"
              label="Contact No"
              autoComplete="phone"
              size="small"
              value={contactNo}
              onChange={(e) => {
                setContactNo(e.target.value);
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="address"
              label="Address"
              autoComplete="address"
              size="small"
              multiline
              onChange={(e) => {
                setAddress(e.target.value);
              }}
            />
            <Typography sx={{ color: "red" }}>{message}</Typography>

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                color="grey"
                variant="contained"
                sx={{ mt: 2, mb: 2, mr: 2, bgcolor: "#fff" }}
                onClick={closeCreateContact}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained" sx={{ mt: 2, mb: 2 }}>
                CREATE
              </Button>
            </Box>
          </Box>
        </Box>
      );
    }
    return <></>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", my: 1 }}>
        <Typography variant="h4">Contacts</Typography>

        <Button
          variant="contained"
          color="warning"
          size="small"
          sx={{ height: "fit-content" }}
          onClick={() => {
            setMessage("");
            setIsCreateContact(!isCreateContact);
          }}
        >
          Create Contact
        </Button>
      </Box>
      <Divider />
      {createNewContactComponent()}
      <Divider />
      <Box
        sx={{
          display: "flex",
          flexFlow: "wrap",
          py: 3,
        }}
      >
        {contacts.map((contact) => {
          return (
            <ContactsCard
              data={contact}
              key={contact._id}
              onClickAction={() => {
                setActiveEditContact(contact);
                setEditContactMode(true);
              }}
            />
          );
        })}
      </Box>

      {/* Edit Contact Modal */}
      <Modal open={isEditContactMode} onClose={closeEditContactModal}>
        <EditContactModal
          data={activeEditContact}
          forceRender={reRender}
          closeModal={closeEditContactModal}
        />
      </Modal>
    </Box>
  );
}

export default Contacts;
