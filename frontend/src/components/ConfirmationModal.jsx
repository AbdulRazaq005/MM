import React, { useState } from "react";
import { modalContainerStyle } from "../helpers/styles";
import { Box, Button, Typography } from "@mui/material";

function ConfirmationModal({
  onCancel,
  onConfirm,
  confirmationText,
  errorText,
}) {
  return (
    <Box
      sx={{
        ...modalContainerStyle,
      }}
    >
      <Typography variant="h6" sx={{ mt: 1 }}>
        {confirmationText}
      </Typography>
      <Typography sx={{ color: "red", mt: 1 }}>{errorText}</Typography>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          color="grey"
          variant="contained"
          sx={{ mt: 2, mb: 2, mr: 2, bgcolor: "#fff" }}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          sx={{ mt: 2, mb: 2 }}
          onClick={onConfirm}
        >
          Confirm
        </Button>
      </Box>
    </Box>
  );
}

export default ConfirmationModal;
