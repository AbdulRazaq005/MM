import {
  BankAccountOptions,
  ExpenditureCategoryType,
  ModuleTypeEnum,
  PaymentModeTypeOptions,
  TransactionTypeEnum,
} from "../../helpers/enums";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Divider,
} from "@mui/material";
import { getAsync } from "../../services/apiHandlerService";
import AppTable from "../../components/AppTable";
import { ExpenditureUrl, TransactionsUrl } from "../../Constants";
import { displayDate } from "../../helpers/dateTimeHelpers";
import { displayCurrency } from "../../helpers/displayFormatHelpers";
import { parseDateTime } from "../../helpers/dateTimeHelpers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Loading from "../../components/Loading";
import Modal from "@mui/material/Modal";
import moment from "moment";

export default function ExpenditureTransactions() {
  const [data, setData] = useState([]);
  const [expenditureCategories, setExpenditureCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [targetId, setTargetId] = useState("");
  const [name, setName] = useState("");
  const [fromContactId, setFromContactId] = useState("");
  const [toContactId, setToContactId] = useState("");
  const [transactionTypeEnum, setTransactionTypeEnum] = useState("");
  const [paymentModeEnum, setPaymentModeEnum] = useState("");
  const [bankEnum, setBankEnum] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [minAmount, setMinAmount] = useState(0);
  const [maxAmount, setMaxAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const response = await getAsync(ExpenditureUrl);
      let _data = response.payload.expenditureCategories;
      _data?.sort((a, b) => b.type.localeCompare(a.type));
      setExpenditureCategories(_data);
      setIsLoading(false);
    }
    fetchData();
    // eslint-disable-next-line
  }, []);

  function getTransactionCategoryOptions() {
    let categoryOptions = expenditureCategories?.map((o) => {
      return {
        label: o.name,
        value: o._id,
        color: o.type === ExpenditureCategoryType.Expense ? "red" : "green",
      };
    });
    return categoryOptions;
  }

  /************* FORM SUBMITTERS **************/
  const submitGetTransactions = async (e) => {
    e.preventDefault();

    if ((minAmount && !maxAmount) || (!minAmount && maxAmount)) {
      setErrorMessage("Both Min Amount and Max Amount must be provided");
      return;
    }
    if ((fromDate && !toDate) || (!fromDate && toDate)) {
      setErrorMessage("Both From Date and To Date must be provided");
      return;
    }
    if (
      isNaN(Number(minAmount)) ||
      isNaN(Number(maxAmount)) ||
      minAmount < 0 ||
      maxAmount < 0
    ) {
      setErrorMessage("Please enter a valid Amount.");
      return;
    }

    const params = {
      targetIds: targetId ? [targetId] : [],
      name: name ? name : undefined,
      fromDate: fromDate ? parseDateTime(fromDate) : undefined,
      toDate: toDate ? parseDateTime(toDate) : undefined,
      minAmount: minAmount ? minAmount : undefined,
      maxAmount: maxAmount ? maxAmount : undefined,
      fromContactIds: fromContactId ? [fromContactId] : undefined, // TODO: Add support for multiple contacts , for now only one contact is supported
      toContactIds: toContactId ? [toContactId] : undefined, // TODO: Add support for multiple contacts , for now only one contact is supported
      typeEnum: transactionTypeEnum ? transactionTypeEnum : undefined,
      paymentModeEnum: paymentModeEnum ? paymentModeEnum : undefined,
      bankEnum: bankEnum ? bankEnum : undefined,
      moduleEnum: ModuleTypeEnum.Expenditure,
    };

    setIsLoading(true);
    const response = await getAsync(TransactionsUrl, params);
    setIsLoading(false);
    if (response.success) {
      let _data = response.payload;
      _data?.sort((a, b) => a.typeEnum.localeCompare(b.typeEnum));
      setData(_data);
    } else setErrorMessage(response.payload.message);
  };

  const clearInputs = () => {
    setName("");
    setFromContactId("");
    setToContactId("");
    setTransactionTypeEnum("");
    setPaymentModeEnum("");
    setBankEnum("");
    setFromDate("");
    setToDate("");
    setMinAmount(0);
    setMaxAmount(0);
    setErrorMessage("");
    setTargetId("");
  };

  /************* TABLE CONFIG **************/
  const transactionSlots = {
    name: ({ data, rowData }) => {
      return (
        <Typography
          color={""}
          sx={{
            fontSize: 18,
            fontWeight: 550,
            // Removed Hover : pointer and onClick
          }}
        >
          {data}
        </Typography>
      );
    },
    date: ({ data }) => displayDate(data),
    typeEnum: ({ data, rowData }) => {
      return (
        <Typography sx={{ fontSize: 18, fontWeight: 500, ml: 0 }}>
          {data === TransactionTypeEnum.Credit ? "Income" : "Expense"}
        </Typography>
      );
    },
    amount: ({ data, rowData }) => {
      return (
        <Typography
          color={
            rowData.typeEnum === TransactionTypeEnum.Credit
              ? "#5fa827"
              : "#D65076"
          }
          sx={{ fontSize: 18, fontWeight: 550, ml: 0 }}
        >
          {displayCurrency(data)}
        </Typography>
      );
    },
    targetId: ({ data, options }) => {
      return (
        <Typography color="" sx={{ fontSize: 18, fontWeight: 550, ml: 0 }}>
          {options?.find((c) => c._id === data)?.name}
        </Typography>
      );
    },
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">Expenditure Transactions</Typography>
      <Divider />
      <Box
        component="form"
        onSubmit={submitGetTransactions}
        sx={{
          mt: 1,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-evenly",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            mx: "auto",
            flexWrap: "wrap",
            // justifyContent: "space-between",
          }}
        >
          <TextField
            margin="normal"
            fullWidth
            value={name}
            name="transaction-name"
            label="Name"
            size="small"
            sx={{ bgcolor: "#fff", width: " 20rem", mr: "1rem" }}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <TextField
            margin="normal"
            fullWidth
            value={minAmount ? minAmount : ""}
            name="minAmount"
            label="Min Amount"
            size="small"
            sx={{ bgcolor: "#fff", width: " 20rem", mr: "01em" }}
            onChange={(e) => {
              setMinAmount(e.target.value);
            }}
          />
          <TextField
            margin="normal"
            fullWidth
            value={maxAmount ? maxAmount : ""}
            name="maxAmount"
            label="Max Amount"
            size="small"
            sx={{ bgcolor: "#fff", width: " 20rem", mr: "01em" }}
            onChange={(e) => {
              setMaxAmount(e.target.value);
            }}
          />
          <TextField
            value={targetId}
            margin="normal"
            fullWidth
            name="expenditure-category"
            label="Category"
            size="small"
            select
            sx={{ bgcolor: "#fff", width: " 20rem", mr: "01em" }}
            onChange={(e) => {
              setTargetId(e.target.value);
            }}
          >
            {getTransactionCategoryOptions()?.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{ color: option.color }}
              >
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="normal"
            fullWidth
            name="paymentMode"
            label="Payment Mode"
            size="small"
            select
            sx={{ bgcolor: "#fff", width: " 20rem", mr: "01em" }}
            onChange={(e) => {
              setPaymentModeEnum(e.target.value);
            }}
            value={paymentModeEnum}
          >
            {PaymentModeTypeOptions?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="normal"
            fullWidth
            name="bank-name"
            label="Bank Account"
            size="small"
            select
            sx={{ bgcolor: "#fff", width: " 20rem", mr: "01em" }}
            onChange={(e) => {
              setBankEnum(e.target.value);
            }}
            value={bankEnum}
          >
            {BankAccountOptions?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <DatePicker
            size="small"
            label="From Date"
            value={fromDate ? moment(fromDate) : null}
            slotProps={{
              textField: { size: "small", fullWidth: true },
            }}
            sx={{
              bgcolor: "#fff",
              mt: 2,
              width: " 20rem",
              mr: "01em",
            }}
            onChange={(moment) => setFromDate(parseDateTime(moment))}
          />
          <DatePicker
            size="small"
            label="To Date"
            value={toDate ? moment(toDate) : null}
            slotProps={{
              textField: { size: "small", fullWidth: true },
            }}
            sx={{
              bgcolor: "#fff",
              mt: 2,
              width: " 20rem",
              mr: "01em",
            }}
            onChange={(moment) => setToDate(parseDateTime(moment))}
          />
        </Box>
        <Box
          sx={{
            mr: "auto",
            mt: 2,
          }}
        >
          {errorMessage && (
            <Typography sx={{ color: "red", mt: "0.5rem" }}>
              {errorMessage}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            sx={{ mr: "1rem", mt: "0.5rem" }}
          >
            Submit
          </Button>
          <Button
            type="reset"
            onClick={clearInputs}
            variant="outlined"
            color="error"
            sx={{ mr: "1rem", mt: "0.5rem" }}
          >
            CLEAR
          </Button>
        </Box>
      </Box>
      {/* {total && (
        <Typography
          sx={{
            mt: "1rem",
            pr: "2rem",
            fontSize: 20,
            width: "100%",
            textAlign: "right",
            fontWeight: 600,
          }}
        >
          Total : {displayCurrency(total)}
        </Typography>
      )} */}
      <AppTable
        name="Transactions"
        options={expenditureCategories}
        data={data}
        columns={["name", "date", "typeEnum", "targetId", "amount"]}
        slots={transactionSlots}
        customColumns={{
          typeEnum: "Type",
          targetId: "Category",
        }}
        showTotal={true}
      />

      {/* Loading Modal */}
      <Modal open={isLoading}>
        <Loading />
      </Modal>
    </Box>
  );
}
