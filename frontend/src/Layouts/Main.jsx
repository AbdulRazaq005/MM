import React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import BreadCrumb from "../components/BreadCrumb";

function Main() {
  return (
    <Box
      sx={{
        bgcolor: "#fafafa",
        overflowY: "scroll",
      }}
    >
      <BreadCrumb />
      <Outlet />
    </Box>
  );
}

export default Main;
