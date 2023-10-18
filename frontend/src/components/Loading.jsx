import React from "react";
import { modalContainerStyle } from "../helpers/styles";
import { Box, CardMedia, Typography } from "@mui/material";
import loadingGif from "../assets/images/loading1.gif";

function Loading({}) {
  return (
    <Box
      sx={{
        ...modalContainerStyle,
        height: "15rem",
        width: "15rem",
        bgcolor: "transparent",
        boxShadow: 0,
      }}
    >
      <CardMedia
        component="img"
        image={loadingGif}
        alt="Loading..."
      />
      <Typography variant="h4" color="white">
        LOADING...
      </Typography>
    </Box>
  );
}

export default Loading;
