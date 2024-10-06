import { Avatar, Box, Button, Divider, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { getAsync } from "../../services/apiHandlerService";
import { LoansUrl } from "../../Constants";
import TextInformationCard from "../../components/TextInformationCard";
import PaidIcon from "@mui/icons-material/Paid";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import { displayCurrency } from "../../helpers/displayFormatHelpers";
import { GetBankNameFromEnum } from "../../helpers/enums";
import Details from "../../components/Details";
import { PieChart } from "@mui/x-charts/PieChart";
import LinearProgressBar from "../../components/LinearProgressBar";

function LoanDetails() {
  let { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [details, setDetails] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [loanProgress, setLoanProgress] = React.useState(0);

  useEffect(() => {
    async function fetchData() {
      const url = LoansUrl + `/${id}`;
      setIsLoading(true);
      const response = await getAsync(url);
      setData(response.payload);
      setDetails(getLoanDetails(response.payload));
      setPieChartData(getPieChartData(response.payload));
      setIsLoading(false);
      setLoanProgress(getLoanProgressPercent(response.payload));
      //   console.log("pageData: ", data, details);
    }
    fetchData();
    // eslint-disable-next-line
  }, []);

  return (
    <Box sx={{ px: 2, py: 4, color: "#444" }}>
      <Typography variant="h4" sx={{ color: "#666", fontWeight: "600", mb: 1 }}>
        Loan Details
      </Typography>
      <Divider />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" sx={{ mt: 4, fontWeight: "550" }}>
          {data.name}
        </Typography>
        <Link to={window.location.pathname + "/edit"} sx={{ mt: "auto" }}>
          <Button
            variant="contained"
            size="small"
            color="warning"
            sx={{ height: "fit-content" }}
          >
            Edit Details
          </Button>
        </Link>
      </Box>
      <Typography
        paragraph="true"
        variant="h6"
        sx={{ mt: 1, whiteSpace: "break-spaces" }}
      >
        {data.description}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: {
            lg: "row",
            xs: "column",
          },
          width: "100%",
          backgroundColor: "",
        }}
      >
        {/* Main Content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            mr: "3%",
            mb: "1rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexFlow: "wrap",
              justifyContent: "space-between",
            }}
          >
            <TextInformationCard
              label={"Sanctioned Amount"}
              value={displayCurrency(data.loanAmount)}
              icon={
                <AccountBalanceWalletIcon
                  sx={{ height: "100%", width: "100%" }}
                />
              }
              color="#2680d4"
            />
            <TextInformationCard
              label={"Principal Amount Paid"}
              value={displayCurrency(data.principalAmountPaid)}
              icon={<PaidIcon sx={{ height: "100%", width: "100%" }} />}
              color="#28b55b"
            />
            <TextInformationCard
              label={"Outstanding Amount"}
              value={displayCurrency(
                data.loanAmount - data.principalAmountPaid
              )}
              icon={
                <CurrencyExchangeIcon sx={{ height: "100%", width: "100%" }} />
              }
              color="#d48517"
            />
            <TextInformationCard
              label={"Interest Amount Paid"}
              value={displayCurrency(data.loanAmount - data.interestAmountPaid)}
              icon={
                <AccountBalanceIcon sx={{ height: "100%", width: "100%" }} />
              }
              color="#f34b72"
            />
          </Box>

          {/* Details */}
          <Details data={details} />

          {/* Progress bar */}
          <Box sx={{ width: "100%", mt: 1 }}>
            <LinearProgressBar name="Loan Progress" value={loanProgress} />
          </Box>
        </Box>

        {/* Right bar */}
        <Box
          sx={{
            pt: 1,
            display: "flex",
            flexDirection: {
              lg: "column",
              xs: "row",
            },
          }}
        >
          <Box
            sx={{
              width: {
                lg: "18rem",
                xs: "50%",
              },
              height: "18rem",
              pl: 2,
            }}
          >
            <PieChart
              series={[
                {
                  data: pieChartData,
                  valueFormatter: (item) => `${item.value.toFixed(2)}%`,
                  innerRadius: 50,
                  outerRadius: 100,
                  cornerRadius: 3,
                  highlightScope: { fade: "global", highlight: "item" },
                  faded: {
                    innerRadius: 50,
                    additionalRadius: -5,
                    color: "gray",
                  },
                  cx: 120,
                  cy: 100,
                  // paddingAngle: 5,
                  // startAngle: -45,
                  // endAngle: 225,
                },
              ]}
              slotProps={{
                legend: {
                  direction: "row",
                  position: { vertical: "bottom", horizontal: "left" },
                  padding: 0,
                },
              }}
            />
          </Box>
          <Divider sx={{ mt: 3, mb: 2 }} />
          <Box
            sx={{
              width: {
                lg: "18rem",
                xs: "50%",
              },
            }}
          >
            <Typography variant="h6" sx={{ m: 1, color: "#666" }}>
              Loan Members
            </Typography>
            {data.loanUsers &&
              data.loanUsers.map((user) => {
                // [...data.loanUsers, ...data.loanUsers, ...data.loanUsers].map(
                // (user) => {
                return (
                  <Box
                    sx={{
                      display: "flex",
                      backgroundColor: "#E9E9E9",
                      p: 1,
                      my: 1,
                      borderRadius: "2rem",
                    }}
                  >
                    <Avatar sx={{ bgcolor: "#3e50b5" }}>
                      {user.name.slice(0, 1)}
                    </Avatar>
                    <Typography
                      variant="h6"
                      sx={{ mt: 0.5, ml: 2, color: "#666" }}
                    >
                      {user.name}
                    </Typography>
                  </Box>
                );
              })}
          </Box>
        </Box>
      </Box>

      {/* Loading Modal */}
      <Modal open={isLoading}>
        <Loading />
      </Modal>
    </Box>
  );
}

function getLoanDetails(data) {
  let result = [];
  let bankName = GetBankNameFromEnum(data.bankEnum);
  if (bankName)
    result.push({
      key: "Bank Name",
      value: bankName,
    });
  if (data.tenure)
    result.push({
      key: "Loan Tenure",
      value: data.tenure + " years",
    });
  if (data.interestRate)
    result.push({
      key: "Interest Rate",
      value: data.interestRate + " %",
    });
  if (data.emiAmount)
    result.push({
      key: "EMI Amount",
      value: displayCurrency(data.emiAmount) + " per month",
    });
  if (data.sanctionedDate)
    result.push({
      key: "Sanctioned Date",
      value: data.sanctionedDate,
    });
  if (data.repaymentStartDate)
    result.push({
      key: "Repayment Start Date",
      value: data.repaymentStartDate,
    });
  return result;
}

function getPieChartData({ principalAmountPaid, interestAmountPaid }) {
  let principalAmountPaidPercent = (
    (100 * principalAmountPaid) /
    (principalAmountPaid + interestAmountPaid)
  ).toFixed(2);
  if (isNaN(principalAmountPaidPercent)) principalAmountPaidPercent = 0;

  let interestAmountPaidPercent = (
    (100 * interestAmountPaid) /
    (principalAmountPaid + interestAmountPaid)
  ).toFixed(2);
  if (isNaN(interestAmountPaidPercent)) interestAmountPaidPercent = 0;

  return [
    {
      id: 0,
      value: principalAmountPaidPercent,
      label: `Principal Amount Paid ( ${principalAmountPaidPercent} % )`,
      color: "#00C49F",
    },
    {
      id: 1,
      value: interestAmountPaidPercent,
      label: `Interest Amount Paid ( ${interestAmountPaidPercent} % )`,
      color: "#e62d50d9",
    },
  ];
}
function getLoanProgressPercent(data) {
  return (100 * data.principalAmountPaid) / data.loanAmount;
}

export default LoanDetails;
