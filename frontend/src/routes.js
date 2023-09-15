import AppLayout from "./Layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import Test from "./pages/Test";
import Projects from "./pages/projects/Projects";
import ProjectDetails from "./pages/projects/ProjectDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CategoryDetails from "./pages/projects/CategoryDetails";
import Contacts from "./pages/projects/Contacts";

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
        path: "projects/:id",
        element: <ProjectDetails />,
      },
      {
        path: "projects/categories/:id",
        element: <CategoryDetails />,
      },
      {
        path: "contacts",
        element: <Contacts />,
      },
      {
        path: "test",
        element: <Test />,
      },
    ],
  },
];

export default routes;
