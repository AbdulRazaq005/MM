import React from "react";
import Header from "./Header";
import { Box } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Sidebar from "./Sidebar";
import Main from "./Main";
import menuListItems from "../menu";
import { useEffect } from "react";
import { getAsync } from "../services/apiHandlerService";
import { ContactsUrl, UserProfileUrl } from "../Constants";
import useGlobalStore from "../store";
import { ContactTypeEnum } from "../helpers/enums";

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
  const drawerWidth = 280;
  const [menuOpen, setMenuOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const setContacts = useGlobalStore((state) => state.setContacts);
  const setUser = useGlobalStore((state) => state.setUser);
  useEffect(() => {
    InitStateValues();
  }, []);

  async function InitStateValues() {
    const userResponse = await getAsync(UserProfileUrl);
    if (userResponse.success) {
      setUser(userResponse.payload);
    }
    const contactResponse = await getAsync(ContactsUrl);
    if (contactResponse.success) {
      setContacts(contactResponse.payload);
    }
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          bgcolor: "#fafafa",
          height: "100vh",
          alignItems: "center",
        }}
      >
        {/* Header */}
        <Box sx={{ height: "10%" }}>
          <Header handleDrawerToggle={handleDrawerToggle} />
        </Box>

        {/* Body */}
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "90%",
          }}
        >
          <Box sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
            <Sidebar
              menuOpen={menuOpen}
              handleDrawerToggle={handleDrawerToggle}
              drawerWidth={drawerWidth}
              menuListItems={menuListItems}
            />
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              px: 2,
              overflowY: "scroll",
              marginX: "auto",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Main />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
