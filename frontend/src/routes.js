import AppLayout from "./Layouts/AppLayout";
// import Dashboard from "./pages/Dashboard";
import Projects from "./pages/projects/Projects";
import ProjectDetails from "./pages/projects/ProjectDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CategoryDetails from "./pages/projects/CategoryDetails";
import Contacts from "./pages/projects/Contacts";
import EditProjectDetails from "./pages/projects/EditProjectDetails";
import EditCategoryDetails from "./pages/projects/EditCategoryDetails";
import ProjectTransactions from "./pages/projects/ProjectTransactions";
import Loans from "./pages/loans/Loans";
import LoanDetails from "./pages/loans/LoanDetails";
import Portfolio from "./pages/Portfolio";
import Expenditure from "./pages/expenditure/Expenditure";
import { ModuleTypeEnum } from "./helpers/enums";
import LoanTransactions from "./pages/loans/LoanTransactions";
import ExpenditureTransactions from "./pages/expenditure/ExpenditureTransactions";

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
        path: "projects",
        element: <Projects />,
      },
      {
        path: "projects/:id",
        element: <ProjectDetails />,
      },
      {
        path: "projects/:id/edit",
        element: <EditProjectDetails />,
      },
      {
        path: "projects/categories/:id",
        element: <CategoryDetails />,
      },
      {
        path: "projects/categories/:id/edit",
        element: <EditCategoryDetails />,
      },
      {
        path: "projects/transactions",
        element: <ProjectTransactions />,
      },
      {
        path: "contacts",
        element: <Contacts />,
      },
      {
        path: "loans",
        element: <Loans />,
      },
      {
        path: "loans/:id",
        element: <LoanDetails />,
      },
      {
        path: "loans/transactions",
        element: <LoanTransactions />,
      },
      {
        path: "expenditure",
        element: <Expenditure />,
      },
      {
        path: "expenditure/transactions",
        element: <ExpenditureTransactions />,
      },
      {
        path: "portfolio",
        element: <Portfolio />,
      },
      {
        path: "*",
        element: <Expenditure />,
      },
    ],
  },
];

export default routes;
