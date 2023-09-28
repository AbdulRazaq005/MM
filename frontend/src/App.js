import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./routes";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { atom } from "jotai";
import "./styles/App.css";
import { getAsync } from "./services/apiHandlerService";
import { ContactsUrl } from "./Constants";
import { useSetAtom } from "jotai";

const response = await getAsync(ContactsUrl);
export const contactsAtom = atom(response.payload);

function App() {
  useEffect(() => {
    async function fetchData() {}
    fetchData();
    // eslint-disable-next-line
  }, []);

  const router = createBrowserRouter(routes);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      {" "}
      // Localization for MUI Date-Picker component
      <div sx={{ height: "100vh" }}>
        <RouterProvider router={router} />
      </div>
    </LocalizationProvider>
  );
}

export default App;
