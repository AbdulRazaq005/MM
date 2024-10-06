import { Box, Typography } from "@mui/material";
import React from "react";

function TextInformationCard({ label, value, icon, color }) {
  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "#E9E9E9",
        width: "49%",
        padding: 2,
        my: "0.75rem",
        borderRadius: 3,
      }}
    >
      <Box sx={{ width: "20%" }}>
        <Box sx={{ height: "100%", width: "70%" }}>{icon}</Box>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" sx={{ color: "#666" }}>
          {label}
        </Typography>
        <Typography
          variant="h5"
          sx={{ mt: 1, fontWeight: "600", color: color }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

export default TextInformationCard;
