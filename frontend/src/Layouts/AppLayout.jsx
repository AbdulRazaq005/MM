import React from "react";
import Header from "./Header";
import { Box } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Sidebar from "./Sidebar";
import Main from "./Main";
import menuListItems from "../menu";

const darkTheme = createTheme({
  palette: {
    primary: {
      light: "#757ce8",
      main: "#3f50b5",
      dark: "#002884",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#000",
    },
  },
});

export default function AppLayout() {
  const drawerWidth = 240;
  const [menuOpen, setMenuOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          bgcolor: "#f3f3f3",
          height: "100vh",
          alignItems: "center",
        }}
      >
        {/* Header */}
        <Header handleDrawerToggle={handleDrawerToggle} />

        {/* Body */}
        <Box
          sx={{
            display: "flex",
            width: "100%",
            maxWidth: "1400px",
            height: "100%",
          }}
        >
          <Box sx={{ width: { sm: drawerWidth }, flexShrink: { md: 0 } }}>
            <Sidebar
              menuOpen={menuOpen}
              handleDrawerToggle={handleDrawerToggle}
              drawerWidth={drawerWidth}
              menuListItems={menuListItems}
            />
          </Box>
          <Box sx={{ flexGrow: 1, p: 3 }}>
            <Main />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}