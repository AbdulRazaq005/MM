import AppLayout from "./Layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import Test from "./pages/Test";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";

const routes = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/*",
    element: <AppLayout />,
    children: [
      {
        path: "*",
        element: <Dashboard />,
      },
      {
        path: "projects",
        element: <Projects />,
      },
      {
        path: "project-details/:id",
        element: <ProjectDetails />,
      },
      {
        path: "test",
        element: <Test />,
      },
    ],
  },
];

export default routes;
