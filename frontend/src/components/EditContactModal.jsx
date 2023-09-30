import React, { useState } from "react";
import axios from "axios";
import { ContactsUrl } from "../Constants";
import { modalContainerStyle } from "../helpers/styles";
import { Box, Button, TextField, Typography, Modal } from "@mui/material";
import { useAtom } from "jotai";
import { contactsAtom } from "../store";
import ConfirmationModal from "./ConfirmationModal";

function EditContactModal({ data, closeModal, forceRender }) {
  const [_, setContacts] = useAtom(contactsAtom);

  const [name, setName] = useState(data?.name);
  const [designation, setDesignation] = useState(data?.designation);
  const [contactNo, setContactNo] = useState(data?.contactNo);
  const [email, setEmail] = useState(data?.email);
  const [address, setAddress] = useState(data?.address);
  const [message, setMessage] = useState(data ? "" : "Invalid Contact data.");

  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const closeDeleteModal = () => {
    setDeleteMessage("");
    setIsDeleteMode(false);
  };

  const submitUpdateContact = (e) => {
    e.preventDefault();
    // console.log("submitted:.......");
    if (!data) {
      setMessage("Invalid Transaction data.");
    }
    if (!(name && designation)) {
      setMessage("Please complete all fields.");
    } else if (isNaN(Number(contactNo))) {
      setMessage("Please enter a valid Contact no.");
    } else if (contactNo.length !== 10) {
      setMessage("Please enter 10 digit Contact no.");
    } else {
      axios
        .put(ContactsUrl + `/${data._id}`, {
          name,
          designation,
          contactNo,
          email,
          address,
        })
        .then((response) => {
          setMessage("Transaction Updated Successfully.");
          console.log(response);
          closeModal();
          forceRender();
          setContacts(response.data);
        })
        .catch((error) => {
          setMessage(error.response.data.message);
          console.log(error);
        });
    }
  };

  const submitDeleteContact = (e) => {
    axios
      .delete(ContactsUrl + `/${data._id}`, {
        isHardDelete: true,
      })
      .then((response) => {
        setDeleteMessage("Transaction Deleted Successfully.");
        console.log(response);
        closeModal();
        forceRender();
        setContacts(response.data);
      })
      .catch((error) => {
        setDeleteMessage(error.response.data.message);
        console.log(error);
      });
  };

  return (
    <Box
      // onSubmit={submitUpdateContact}
      sx={{
        ...modalContainerStyle,
        px: 6,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography variant="h5" id="modal-title" color="black">
        Edit Contact
      </Typography>
      <Box sx={{ width: "21rem", mx: "1rem" }}>
        <TextField
          margin="normal"
          value={name}
          required
          fullWidth
          name="contact-name"
          label="Name"
          size="small"
          sx={{ bgcolor: "#fff" }}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <TextField
          margin="normal"
          value={designation}
          required
          fullWidth
          name="contact-description"
          label="Designation"
          size="small"
          multiline
          sx={{ bgcolor: "#fff" }}
          onChange={(e) => {
            setDesignation(e.target.value);
          }}
        />
        <TextField
          margin="normal"
          value={contactNo}
          fullWidth
          name="contactNo"
          label="Contact No"
          size="small"
          sx={{ bgcolor: "#fff" }}
          onChange={(e) => {
            setContactNo(e.target.value);
          }}
        />
        <TextField
          margin="normal"
          value={email}
          fullWidth
          name="address"
          label="Contact Email"
          size="small"
          sx={{ bgcolor: "#fff" }}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <TextField
          margin="normal"
          value={address}
          fullWidth
          multiline
          name="address"
          label="Contact Address"
          size="small"
          sx={{ bgcolor: "#fff" }}
          onChange={(e) => {
            setAddress(e.target.value);
          }}
        />
      </Box>

      <Typography sx={{ color: "red", ml: 2, mt: 1 }}>{message}</Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1, mb: 2 }}>
        <Button
          color="grey"
          variant="contained"
          sx={{ mr: 2, bgcolor: "#fff" }}
          onClick={() => {
            closeModal();
          }}
        >
          CANCEL
        </Button>
        <Button
          color="error"
          variant="outlined"
          sx={{ mr: 2 }}
          onClick={() => setIsDeleteMode(true)}
        >
          DELETE
        </Button>
        <Button
          type="submit"
          variant="contained"
          onClick={(e) => submitUpdateContact(e)}
        >
          UPDATE
        </Button>
      </Box>

      <Modal open={isDeleteMode} onClose={closeDeleteModal}>
        <ConfirmationModal
          errorText={deleteMessage}
          confirmationText={"Are you sure you want to delete this contact ?"}
          onCancel={closeDeleteModal}
          onConfirm={submitDeleteContact}
        />
      </Modal>
    </Box>
  );
}

export default EditContactModal;
