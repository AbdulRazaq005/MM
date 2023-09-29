import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./routes";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import "moment/locale/en-gb";
import "./styles/App.css";
import { Box } from "@mui/material";

function App() {
  const router = createBrowserRouter(routes);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
      <Box sx={{ height: "100vh" }}>
        <RouterProvider router={router} />
      </Box>
    </LocalizationProvider>
  );
}

export default App;
