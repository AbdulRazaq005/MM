import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import DomainAddIcon from "@mui/icons-material/DomainAdd";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import MovingIcon from "@mui/icons-material/Moving";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import FlightIcon from "@mui/icons-material/Flight";
import CommuteIcon from "@mui/icons-material/Commute";
import PaidIcon from "@mui/icons-material/Paid";

// Find Icons names : https://mui.com/material-ui/material-icons/

const menuListItems = [
  [
    {
      label: "Projects",
      path: "projects",
      icon: <DomainAddIcon />,
    },
    {
      label: "Transactions",
      path: "transactions",
      icon: <PaidIcon />,
    },
    {
      label: "Contacts",
      path: "/contacts",
      icon: <ContactPhoneIcon />,
    },
  ],
  [
    {
      label: "Loans",
      path: "loans",
      icon: <AccountBalanceWalletIcon />,
    },
  ],
  [
    {
      label: "Expenditures",
      path: "",
      icon: <CurrencyRupeeIcon />,
    },
  ],
  [
    {
      label: "Portfolio",
      path: "/portfolio",
      icon: <MovingIcon />,
    },
  ],
  [
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
  ],
  [
    {
      label: "Settings",
      path: "",
      icon: <SettingsIcon />,
    },
  ],
];

export default menuListItems;
