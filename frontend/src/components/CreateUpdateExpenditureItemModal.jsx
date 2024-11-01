import React, { useState } from "react";
import { modalContainerStyle } from "../helpers/styles";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { PortfolioTypeEnum } from "../helpers/enums";
import ConfirmationModal from "./ConfirmationModal";
import axios from "axios";
import { ExpenditureUrl } from "../Constants";

function CreateUpdateExpenditureItemModal({
  data,
  action,
  closeModal,
  type,
  forceRender,
}) {
  const [name, setName] = useState(data?.name);
  const [description, setDescription] = useState(data?.description);
  const [message, setMessage] = useState("");

  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const closeDeleteModal = () => {
    setDeleteMessage("");
    setIsDeleteMode(false);
  };
  const [deleteMessage, setDeleteMessage] = useState("");

  let itemName = "Bank account";
  if (type === PortfolioTypeEnum.Asset) itemName = "Asset";
  if (type === PortfolioTypeEnum.Investment) itemName = "Investment";

  const submitExpenditureCategory = (e) => {
    e.preventDefault();
    if (!name) {
      setMessage("Please complete all fields");
    } else {
      action(type, {
        _id: data?._id,
        name,
        description,
      });
    }
  };

  const submitDeleteExpenditureCategory = (e) => {
    e.preventDefault();
    axios
      .delete(ExpenditureUrl + `/${data._id}`, {
        isHardDelete: true,
      })
      .then((response) => {
        setDeleteMessage("Expenditure Category Deleted Successfully.");
        console.log(response);
        closeModal();
        forceRender();
      })
      .catch((error) => {
        setDeleteMessage(error.response.data.message);
        console.log(error);
      });
  };

  return (
    <Box
      sx={{
        ...modalContainerStyle,
        px: 6,
        width: "25rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography variant="h5" id="modal-title" color="black">
        {data ? `Update ${itemName}` : `Create ${itemName}`}
      </Typography>
      <Box
        component="form"
        noValidate
        sx={{ mt: 1 }}
        onSubmit={submitExpenditureCategory}
      >
        <TextField
          value={name}
          margin="normal"
          required
          fullWidth
          name="portfolio-item-name"
          label="Name"
          size="small"
          sx={{ bgcolor: "#fff" }}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <TextField
          value={description}
          margin="normal"
          fullWidth
          name="portfolio-item-description"
          label="Description"
          size="small"
          multiline
          sx={{ bgcolor: "#fff" }}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <Typography sx={{ color: "red" }}>{message}</Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            color="error"
            variant="outlined"
            sx={{ mt: 2, mb: 2, mr: 2 }}
            onClick={() => setIsDeleteMode(true)}
          >
            DELETE
          </Button>
          <Button
            color="grey"
            variant="contained"
            sx={{ mt: 2, mb: 2, mr: 2, bgcolor: "#fff" }}
            onClick={() => {
              closeModal();
            }}
          >
            CANCEL
          </Button>
          <Button type="submit" variant="contained" sx={{ mt: 2, mb: 2 }}>
            {data ? "Update" : "Create"}
          </Button>
        </Box>
      </Box>

      {/* Confirmation Modal */}
      <Modal open={isDeleteMode} onClose={closeDeleteModal}>
        <ConfirmationModal
          errorText={deleteMessage}
          confirmationText={
            "Are you sure you want to delete this Expenditure Category ?"
          }
          onCancel={closeDeleteModal}
          onConfirm={submitDeleteExpenditureCategory}
        />
      </Modal>
    </Box>
  );
}

export default CreateUpdateExpenditureItemModal;
