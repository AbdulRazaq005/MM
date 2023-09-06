import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

function AppHeader({ handleDrawerToggle }) {
  return (
    <Box sx={{ display: "flex", height: "5rem", p: 0, m: 0 }}>
      <AppBar position="fixed" sx={{ height: "5rem", py: 1, px: 2 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography sx={{ ml: "5%" }} variant="h5">
            Monetary Management
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default AppHeader;
