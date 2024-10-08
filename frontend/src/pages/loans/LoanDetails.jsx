import { Avatar, Box, Button, Divider, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { getAsync } from "../../services/apiHandlerService";
import { LoansUrl } from "../../Constants";
import TextInformationCard from "../../components/TextInformationCard";
import PaidIcon from "@mui/icons-material/Paid";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import { displayCurrency } from "../../helpers/displayFormatHelpers";
import { GetBankNameFromEnum, ModuleTypeEnum } from "../../helpers/enums";
import Details from "../../components/Details";
import { PieChart } from "@mui/x-charts/PieChart";
import LinearProgressBar from "../../components/LinearProgressBar";
import CreateTransactionModal from "../../components/CreateTransactionModal";
import useGlobalStore from "../../store";
import AppTable from "../../components/AppTable";
import { displayDate } from "../../helpers/dateTimeHelpers";
import EditTransactionModal from "../../components/EditTransactionModal";

function LoanDetails() {
  let { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [details, setDetails] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [loanProgress, setLoanProgress] = React.useState(0);

  const [render, setRender] = useState(0);
  const reRender = () => setRender(render + 1);
  const user = useGlobalStore((state) => state.user);

  const [isAddTransactionMode, setAddTransactionMode] = useState(false);
  const closeAddTransactionModal = () => setAddTransactionMode(false);

  const [isEditTransactionMode, setEditTransactionMode] = useState(false);
  const [activeEditTransaction, setActiveEditTransaction] = useState({});
  const closeEditTransactionModal = () => setEditTransactionMode(false);

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
  }, [id, render]);

  const transactionSlots = {
    name: ({ data, rowData }) => {
      return (
        <Typography
          color={"primary"}
          sx={{
            fontSize: 18,
            fontWeight: 550,
            ":hover": { cursor: "pointer" },
          }}
          onClick={() => {
            setActiveEditTransaction(rowData);
            setEditTransactionMode(true);
          }}
        >
          {data}
        </Typography>
      );
    },
    date: ({ data }) => displayDate(data),
    amount: ({ data, rowData }) => {
      return (
        <Typography sx={{ fontSize: 18, fontWeight: 550, ml: 0 }}>
          {displayCurrency(data)}
        </Typography>
      );
    },
    principalAmount: ({ data, rowData }) => {
      return (
        <Typography color="green" sx={{ fontSize: 18, fontWeight: 550, ml: 0 }}>
          {displayCurrency(data)}
        </Typography>
      );
    },
    interestAmount: ({ data, rowData }) => {
      return (
        <Typography color="red" sx={{ fontSize: 18, fontWeight: 550, ml: 0 }}>
          {displayCurrency(data)}
        </Typography>
      );
    },
  };

  return (
    <Box sx={{ px: 2, py: 4, color: "#444" }}>
      <Box sx={{ display: "flex", width: "100%" }}>
        <Typography
          variant="h4"
          sx={{ color: "#666", fontWeight: "600", mb: 1 }}
        >
          Loan Details
        </Typography>
        <Box sx={{ ml: "auto" }}>
          <Button
            variant="contained"
            size="small"
            sx={{ height: "fit-content" }}
            onClick={() => setAddTransactionMode(!isAddTransactionMode)}
          >
            Add Transaction
          </Button>
          <Button
            variant="contained"
            size="small"
            color="warning"
            sx={{ height: "fit-content", ml: 2 }}
          >
            Edit Details
          </Button>
        </Box>
      </Box>
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
              color="#ef8517"
            />
            <TextInformationCard
              label={"Interest Amount Paid"}
              value={displayCurrency(data.interestAmountPaid)}
              icon={
                <AccountBalanceIcon sx={{ height: "100%", width: "100%" }} />
              }
              color="#f54b72"
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
                  // valueFormatter: (item) => `${item.value.toFixed(2)}%`,
                  valueFormatter: (item) => displayCurrency(item.value),
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
      {/* Transactions */}
      <AppTable
        name="Transactions"
        data={data.transactions}
        columns={[
          "name",
          "date",
          // "fromContact",
          // "toContact",
          "amount",
          "principalAmount",
          "interestAmount",
        ]}
        slots={transactionSlots}
        customColumns={{
          principalAmount: "Principal",
          interestAmount: "Interest",
        }}
      />

      {/* Add new Transaction Modal */}
      <Modal open={isAddTransactionMode} onClose={closeAddTransactionModal}>
        <CreateTransactionModal
          targetId={id}
          forceRender={reRender}
          closeModal={closeAddTransactionModal}
          moduleType={ModuleTypeEnum.Loans}
          loanName={data.name}
          fromContact={user.contact}
          toContact={data.bankContact}
        />
      </Modal>

      {/* Edit Transaction Modal */}
      <Modal open={isEditTransactionMode} onClose={closeEditTransactionModal}>
        <EditTransactionModal
          data={activeEditTransaction}
          forceRender={reRender}
          closeModal={closeEditTransactionModal}
        />
      </Modal>

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
  let principalAmountPaidPercent =
    (100 * principalAmountPaid) / (principalAmountPaid + interestAmountPaid);
  if (isNaN(principalAmountPaidPercent)) principalAmountPaidPercent = 0.00001;

  let interestAmountPaidPercent =
    (100 * interestAmountPaid) / (principalAmountPaid + interestAmountPaid);
  if (isNaN(interestAmountPaidPercent)) interestAmountPaidPercent = 0.00001;

  return [
    {
      id: 0,
      value: principalAmountPaid ? principalAmountPaid : 0.00001,
      label: `Principal Amount Paid ( ${principalAmountPaidPercent.toFixed(
        2
      )} % )`,
      color: "#00C49F",
    },
    {
      id: 1,
      value: interestAmountPaid ? interestAmountPaid : 0.00001,
      label: `Interest Amount Paid ( ${interestAmountPaidPercent.toFixed(
        2
      )} % )`,
      color: "#e62d50d9",
    },
  ];
}

function getLoanProgressPercent(data) {
  return (100 * data.principalAmountPaid) / data.loanAmount;
}

export default LoanDetails;
