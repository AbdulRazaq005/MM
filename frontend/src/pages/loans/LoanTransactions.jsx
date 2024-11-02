import {
  BankAccountOptions,
  ContactTypeEnum,
  ModuleTypeEnum,
  PaymentModeTypeOptions,
} from "../../helpers/enums";
import { useState } from "react";
import useGlobalStore from "../../store";
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
import { TransactionsUrl } from "../../Constants";
import { displayDate } from "../../helpers/dateTimeHelpers";
import { displayCurrency } from "../../helpers/displayFormatHelpers";
import { parseDateTime } from "../../helpers/dateTimeHelpers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Loading from "../../components/Loading";
import Modal from "@mui/material/Modal";
import moment from "moment";

export default function LoanTransactions() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const contacts = useGlobalStore((state) => state.contacts);
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
      moduleEnum: ModuleTypeEnum.Loans,
    };

    setIsLoading(true);
    const response = await getAsync(TransactionsUrl, params);
    setIsLoading(false);
    if (response.success) {
      let _data = response.payload;
      // _data?.sort((a, b) => a.typeEnum.localeCompare(b.typeEnum));
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

  function getContactDisplayName(contact) {
    return (
      contact?.name +
      (contact?.designation ? " (" + contact?.designation + ")" : "")
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">Loan Transactions</Typography>
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
            {PaymentModeTypeOptions.map((option) => (
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
            {BankAccountOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            margin="normal"
            fullWidth
            name="to-contact"
            label="Loan Account"
            size="small"
            select
            sx={{ bgcolor: "#fff", width: " 20rem", mr: "01em" }}
            onChange={(e) => {
              setToContactId(e.target.value);
            }}
            value={toContactId}
          >
            {contacts
              .filter((c) => c.contactType === ContactTypeEnum.Bank)
              .map((contact) => (
                <MenuItem key={contact._id} value={contact._id}>
                  {getContactDisplayName(contact)}
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
        data={data}
        columns={[
          "name",
          "date",
          "amount",
          "principalAmount",
          "interestAmount",
        ]}
        slots={transactionSlots}
        customColumns={{
          principalAmount: "Principal",
          interestAmount: "Interest",
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
