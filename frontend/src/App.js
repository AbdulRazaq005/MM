import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./routes";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import "./styles/App.css";

function App() {
  const router = createBrowserRouter(routes);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}> // Localization for MUI Date-Picker component
      <div sx={{ height: "100vh" }}>
        <RouterProvider router={router} />
      </div>
    </LocalizationProvider>
  );
}

export default App;
