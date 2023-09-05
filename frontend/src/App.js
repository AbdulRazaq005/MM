import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./routes";
import "./styles/App.css";

function App() {
  const router = createBrowserRouter(routes);

  return (
    <div sx={{ height: "100vh" }}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
