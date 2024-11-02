import React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import BreadCrumb from "../components/BreadCrumb";

function Main() {
  return (
    <Box
      sx={{
        height: "100%",
        maxWidth: "1200px",
        flexGrow: 1,
      }}
    >
      <BreadCrumb />
      <Outlet />
    </Box>
  );
}

export default Main;
