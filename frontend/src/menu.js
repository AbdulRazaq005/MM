import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import DomainAddIcon from "@mui/icons-material/DomainAdd";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import MovingIcon from "@mui/icons-material/Moving";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import FlightIcon from "@mui/icons-material/Flight";
import CommuteIcon from "@mui/icons-material/Commute";

// Find Icons names : https://mui.com/material-ui/material-icons/

const menuListItems = [
  [
    {
      label: "Projects",
      path: "projects",
      icon: <DomainAddIcon />,
    },
    {
      label: "Loans",
      path: "project-details/657665365465",
      icon: <AccountBalanceWalletIcon />,
    },
    {
      label: "Investments",
      path: "",
      icon: <MovingIcon />,
    },
  ],
  [
    {
      label: "Expenditures",
      path: "test",
      icon: <CurrencyRupeeIcon />,
    },
    {
      label: "Banking",
      path: "",
      icon: <AccountBalanceIcon />,
    },
    {
      label: "Analytics",
      path: "",
      icon: <BarChartIcon />,
    },
  ],
  [
    {
      label: "Travels",
      path: "",
      icon: <FlightIcon />,
    },
    {
      label: "Outings",
      path: "/register",
      icon: <CommuteIcon />,
    },
  ],
  [
    {
      label: "Settings",
      path: "/login",
      icon: <SettingsIcon />,
    },
  ],
];

export default menuListItems;
