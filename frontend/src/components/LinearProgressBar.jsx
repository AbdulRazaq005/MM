import { Box, LinearProgress, Typography } from "@mui/material";
import { isNumber } from "lodash";

function LinearProgressBar({ name, value }) {
  return (
    <Box sx={{ p: 0.5 }}>
      <Typography variant="h6" sx={{ color: "text.secondary" }}>
        {name}
      </Typography>
      <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "20rem", height: "0.75rem", flex: 1 }}>
          <LinearProgress
            variant="determinate"
            value
            color="success"
            sx={{ height: "100%", borderRadius: "1rem", color: "#58a667" }}
          />
        </Box>
        {isNumber(value) && (
          <Typography variant="h6" sx={{ color: "text.secondary", ml: 2 }}>
            {`${value} %`}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default LinearProgressBar;
