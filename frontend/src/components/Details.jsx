import React from "react";
import { Box, Typography, Tooltip, Divider } from "@mui/material";

function Details({ data }) {
  return (
    <>
      {data && Array.isArray(data) && data.length !== 0 && (
        <Box sx={{ my: 2, display: "flex", flexDirection: "column", bgcolor: "#fff", border: "solid 1px #eee", borderRadius: 2 }}>
          <Box sx={{ mx: 2.2, my: 1, p: 0 }}>
            {data.map((detail) => {
              return (
                <Box key={detail._id} sx={{ display: "flex" }}>
                  <Typography
                    size="small"
                    sx={{ m: 0, p: 0, width: "30%", fontSize: 16 }}
                  >
                    <Tooltip title={detail.key} placement="right-end">
                      {detail.key}
                    </Tooltip>
                  </Typography>
                  <Typography sx={{ ml: 3, p: 0, fontSize: 18 }}>
                    : {detail.value}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </>
  );
}

export default Details;
