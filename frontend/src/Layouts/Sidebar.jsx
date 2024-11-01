import * as React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import menuListItems from "../menu";
import { Typography } from "@mui/material";

const drawer = (
  <Box sx={{ width: 280, pl: 2, fontSize: "1.5rem" }}>
    <Divider />
    <List>
      {menuListItems.map((subList, index) => {
        const subMenu = subList.map((item) => {
          return (
            <React.Fragment key={item.label}>
              <Link to={item.path}>
                <ListItem sx={{ pl: 0, bgcolor: "#fff", height: "3rem" }}>
                  <ListItemButton>
                    <Box sx={{ width: "2.8rem" }}>{item.icon}</Box>
                    <Typography
                      sx={{ fontWeight: "500", fontSize: "1.1rem", mb: 0 }}
                    >
                      {item.label}
                    </Typography>
                  </ListItemButton>
                </ListItem>
                {item.submenuItems &&
                  item.submenuItems.map((subItem) => {
                    return (
                      <Link to={subItem.path}>
                        <ListItem
                          sx={{ pl: 5, bgcolor: "#fff", height: "3rem" }}
                        >
                          <ListItemButton>
                            <Box sx={{ width: "2.8rem" }}>{subItem.icon}</Box>
                            <Typography
                              sx={{
                                fontWeight: "500",
                                fontSize: "1.1rem",
                                m: 0,
                                mb: 0.5,
                              }}
                            >
                              {subItem.label}
                            </Typography>
                          </ListItemButton>
                        </ListItem>
                      </Link>
                    );
                  })}
              </Link>
            </React.Fragment>
          );
        });
        return (
          <Box key={index} sx={{ mb: 1 }}>
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
        color: "#555",
        boxShadow: 2,
        display: { xs: "none", md: "block" },
        pt: "35%",
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
          display: { xs: "none", md: "block", mt: 20 },
        }}
        open
      >
        {drawer}
      </Box>
    </Box>
  );
}

export default Sidebar;
