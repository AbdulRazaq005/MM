import DomainAddIcon from "@mui/icons-material/DomainAdd";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import BarChartIcon from "@mui/icons-material/BarChart";
import PaidIcon from "@mui/icons-material/Paid";
import DehazeOutlinedIcon from "@mui/icons-material/DehazeOutlined";

// Find Icons names : https://mui.com/material-ui/material-icons/

const menuListItems = [
  [
    {
      label: "Projects",
      path: "projects",
      icon: <DomainAddIcon sx={{ fontSize: "1.8rem" }} />,
      submenuItems: [
        {
          label: "Transactions",
          path: "projects/transactions",
          icon: <DehazeOutlinedIcon sx={{ fontSize: "1.5rem" }} />,
        },
        {
          label: "Contacts",
          path: "contacts",
          icon: <ContactPhoneIcon sx={{ fontSize: "1.5rem" }} />,
        },
      ],
    },
  ],
  [
    {
      label: "Loans",
      path: "loans",
      icon: <AccountBalanceWalletIcon sx={{ fontSize: "1.8rem" }} />,
      submenuItems: [
        {
          label: "Transactions",
          path: "loans/transactions",
          icon: <DehazeOutlinedIcon sx={{ fontSize: "1.5rem" }} />,
        },
      ],
    },
  ],
  [
    {
      label: "Expenditures",
      path: "expenditure",
      icon: <BarChartIcon sx={{ fontSize: "1.8rem" }} />,
      submenuItems: [
        {
          label: "Transactions",
          path: "expenditure/transactions",
          icon: <DehazeOutlinedIcon sx={{ fontSize: "1.5rem" }} />,
        },
      ],
    },
  ],
  [
    {
      label: "Portfolio",
      path: "/portfolio",
      icon: <PaidIcon sx={{ fontSize: "1.8rem" }} />,
    },
  ],
  // [
  //   {
  //     label: "Analytics",
  //     path: "",
  //     icon: <BarChartIcon />,
  //   },
  // ],
  // [
  //   {
  //     label: "Travels",
  //     path: "",
  //     icon: <FlightIcon />,
  //   },
  // ],
  // [
  //   {
  //     label: "Settings",
  //     path: "",
  //     icon: <SettingsIcon />,
  //   },
  // ],
];

export default menuListItems;
