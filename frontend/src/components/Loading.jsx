import React, { useEffect, useState } from "react";
import { modalContainerStyle } from "../helpers/styles";
import { Box, CardMedia, LinearProgress, Typography } from "@mui/material";
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
      const response = await getAsync("/loading.gif", {
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
        width: "100%",
        top: 0,
        px: 0,
        bgcolor: "transparent",
        boxShadow: 0,
      }}
    >
      <LinearProgress color="warning" />
    </Box>
  );
}

export default Loading;
