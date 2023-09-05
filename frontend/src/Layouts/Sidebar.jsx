import * as React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import menuListItems from "../menu";

const drawer = (
  <Box sx={{ width: 240 }}>
    <Divider />
    <List>
      {menuListItems.map((subList, index) => {
        const subMenu = subList.map((item) => {
          return (
            <React.Fragment>
              <Link to={item.path}>
                <ListItem key={item.label} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              </Link>
            </React.Fragment>
          );
        });
        return (
          <Box key={index}>
            {subMenu}
            <Divider />
          </Box>
        );
      })}
    </List>
  </Box>
);

function Sidebar(props) {
  const { window } = props;

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        minHeight: "100%",
        boxShadow: 2,
        display: { xs: "none", md: "block" },
      }}
    >
      <CssBaseline />
      <Drawer
        container={container}
        variant="temporary"
        open={props.menuOpen}
        onClose={props.handleDrawerToggle}
        sx={{
          display: { xs: "block", md: "none" },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            bgcolor: "inherit",
          }}
        >
          <Button
            onClick={props.handleDrawerToggle}
            variant="contained"
            sx={{ borderRadius: 8 }}
          >
            {"<"}
          </Button>
        </Toolbar>
        {drawer}
      </Drawer>
      {/* main menu */}
      <Box
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
        }}
        open
      >
        {drawer}
      </Box>
    </Box>
  );
}

export default Sidebar;
