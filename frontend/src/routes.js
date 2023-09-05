import Auth from "./pages/Auth";
import AppLayout from "./Layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import Test from "./pages/Test";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";

const routes = [
  {
    path: "/auth",
    element: <Auth />,
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
    ],
  },
];

export default routes;
