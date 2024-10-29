import React, { useState } from "react";
import { modalContainerStyle } from "../helpers/styles";
import { Box, Button, TextField, Typography } from "@mui/material";
import { PortfolioTypeEnum } from "../helpers/enums";

function CreateUpdatePortfolioItemModal({ data, action, closeModal, type }) {
  const [name, setName] = useState(data?.name);
  const [description, setDescription] = useState(data?.description);
  const [value, setValue] = useState(data?.value);
  const [message, setMessage] = useState("");
  let itemName = "Bank account";
  if (type === PortfolioTypeEnum.Asset) itemName = "Asset";
  if (type === PortfolioTypeEnum.Investment) itemName = "Investment";

  const submitCreateNewProject = (e) => {
    e.preventDefault();
    if (!(name && value)) {
      setMessage("Please complete all fields");
    } else if (isNaN(Number(value))) {
      setMessage("Please enter a valid Estimate amount");
    } else {
      action(type, {
        _id: data?._id,
        name,
        description,
        value,
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
        {data ? `Update ${itemName}` : `Create ${itemName}`}
      </Typography>
      <Box
        component="form"
        noValidate
        sx={{ mt: 1 }}
        onSubmit={submitCreateNewProject}
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
        <TextField
          value={value}
          margin="normal"
          required
          fullWidth
          name="portfolio-item-value"
          label="Value"
          size="small"
          sx={{ bgcolor: "#fff" }}
          onChange={(e) => {
            setValue(e.target.value);
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
            {data ? "Update" : "Create"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default CreateUpdatePortfolioItemModal;
