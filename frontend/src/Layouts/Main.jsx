import React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

function Main() {
  return (
    <Box
      sx={{
        bgcolor: "#fafafa",
      }}
    >
      <Outlet />
    </Box>
  );
}

export default Main;
