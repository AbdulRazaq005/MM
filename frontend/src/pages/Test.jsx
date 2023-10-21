import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { getAsync } from "../services/apiHandlerService";

function Test() {
  React.useEffect(() => {
    async function fetchData() {
      await getAsync("/api/projects");
    }
    fetchData();
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <Typography paragraph>
        This feature is still under development.
      </Typography>
    </Box>
  );
}

export default Test;
