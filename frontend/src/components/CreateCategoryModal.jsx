import React, { useState } from "react";
import axios from "axios";
import { modalContainerStyle } from "../helpers/styles";
import { Box, Button, TextField, Typography } from "@mui/material";

function CreateCategoryModal({ targetId, path, closeModal, forceRender }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [estimate, setEstimate] = useState(0);
  const [message, setMessage] = useState("");

  const submitCreateNewCategory = (e) => {
    e.preventDefault();
    if (!(name && description && estimate)) {
      setMessage("Please complete all fields");
    } else if (isNaN(Number(estimate))) {
      setMessage("Please enter a valid Estimate amount");
    } else {
      axios
        .post(path, {
          targetId,
          name,
          description,
          estimate,
        })
        .then((response) => {
          setMessage("Category Created Successfully.");
          console.log(response);
          closeModal();
          forceRender();
        })
        .catch((error) => {
          setMessage(error.response.data.message);
          console.log(error);
        });
    }
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
        Create New Category
      </Typography>
      <Box
        component="form"
        noValidate
        sx={{ mt: 1 }}
        onSubmit={submitCreateNewCategory}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          name="category-name"
          label="Name"
          size="small"
          sx={{ bgcolor: "#fff" }}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="description"
          label="Description"
          size="small"
          multiline
          sx={{ bgcolor: "#fff" }}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="estimate"
          label="Estimate"
          size="small"
          sx={{ bgcolor: "#fff" }}
          onChange={(e) => {
            setEstimate(e.target.value);
          }}
        />
        <Typography sx={{ color: "red" }}>{message}</Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
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
            CREATE
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default CreateCategoryModal;
