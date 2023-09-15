import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LogoutUrl } from "../Constants";

function AppHeader({ handleDrawerToggle }) {
  const navigate = useNavigate();
  const submitLogout = () => {
    axios
      .post(LogoutUrl)
      .then(() => {
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Box sx={{ display: "flex", p: 0, m: 0, height: "100%" }}>
      <AppBar position="fixed" sx={{ p: 2, height: "10%" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
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
          <Box>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={submitLogout}
            >
              LOGOUT
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default AppHeader;
