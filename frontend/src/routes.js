import Auth from "./pages/Auth";
import AppLayout from "./Layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import Test from "./pages/Test";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Login from "./pages/Login";

const routes = [
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/login",
    element: <Login />,
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
