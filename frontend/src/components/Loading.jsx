import React, { useEffect, useState } from "react";
import { modalContainerStyle } from "../helpers/styles";
import { Box, CardMedia, Typography } from "@mui/material";
import { getAsync } from "../services/apiHandlerService";

function arrayBufferToBase64(buffer) {
  var byteArray = new Uint8Array(buffer);
  const charArray = Array.from(byteArray, (byte) => String.fromCharCode(byte));
  const binaryString = charArray.join("");
  const base64 = btoa(binaryString);
  return "data:image/gif;base64," + base64;
}

function Loading({}) {
  const [loadingBase64, setLoadingbase64] = useState("");

  useEffect(() => {
    async function fetchData() {
      const response = await getAsync("/loading1.gif", {
        responseType: "arraybuffer",
      });
      var base64 = arrayBufferToBase64(response.payload);
      setLoadingbase64(base64);
      localStorage["loadingBase64"] = base64;
      console.log({ loadingBase64, base64 });
    }
    if (!localStorage["loadingBase64"]) {
      fetchData();
    }
    // eslint-disable-next-line
  }, []);

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
      {localStorage["loadingBase64"] && (
        <CardMedia
          component="img"
          image={localStorage["loadingBase64"]}
          alt="Loading..."
        />
      )}
      <Typography variant="h4" color="white">
        LOADING...
      </Typography>
    </Box>
  );
}

export default Loading;
