import React, { useState } from "react";
import axios from "axios";
import { TransactionsUrl } from "../Constants";
import { modalContainerStyle } from "../helpers/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box, Button, TextField, Typography, MenuItem } from "@mui/material";
import {
  BankAccountOptions,
  ModuleTypeEnum,
  PaymentModeTypeEnum,
  PaymentModeTypeOptions,
  TransactionStatusEnum,
  TransactionTypeOptions,
} from "../helpers/enums";

function CreateTransactionModal({ targetId, closeModal, forceRender }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fromContactId, setFromContactId] = useState("");
  const [toContactId, setToContactId] = useState("");
  const [transactionTypeEnum, setTransactionTypeEnum] = useState("");
  const [paymentModeEnum, setPaymentModeEnum] = useState("");
  const [bankEnum, setBankEnum] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [message, setMessage] = useState("");

  const submitAddNewTransaction = (e) => {
    e.preventDefault();
    if (!(name && description)) {
      setMessage("Please complete all fields");
    } else if (isNaN(Number(transactionAmount))) {
      setMessage("Please enter a valid Transaction Amount");
    } else {
      axios
        .post(TransactionsUrl, {
          targetId,
          name,
          description,
          typeEnum: transactionTypeEnum,
          paymentModeEnum: paymentModeEnum,
          bankEnum: bankEnum,
          date: transactionDate,
          amount: transactionAmount,
          fromContactId,
          toContactId,
          moduleEnum: ModuleTypeEnum.Projects,
          statusEnum: TransactionStatusEnum.Succssful,
        })
        .then((response) => {
          setMessage("Transaction Added Successfully.");
          console.log(response);
          closeModal();
          forceRender();
        })
        .catch((error) => {
          setMessage(error.response.data.message);
          console.log(error);
        });
    }
  };

  return (
    <Box
      sx={{
        ...modalContainerStyle,
        px: 6,
        // width: "50rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography variant="h5" id="modal-title" color="black">
        Add Transaction
      </Typography>
      <Box
        component="form"
        noValidate
        sx={{
          mt: 1,
          display: "flex",
          justifyContent: "space-between",
          flexDirection: {
            lg: "row",
            md: "row",
            sm: "column",
            xs: "column",
          },
        }}
        onSubmit={submitAddNewTransaction}
      >
        <Box sx={{ width: "21rem", mx: "1rem" }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="transaction-name"
            label="Name"
            size="small"
            sx={{ bgcolor: "#fff" }}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="transaction-description"
            label="Description"
            size="small"
            multiline
            sx={{ bgcolor: "#fff" }}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="amount"
            label="Amount"
            size="small"
            sx={{ bgcolor: "#fff" }}
            onChange={(e) => {
              setTransactionAmount(e.target.value);
            }}
          />
          <TextField
            margin="normal"
            required={[
              PaymentModeTypeEnum.Upi,
              PaymentModeTypeEnum.BankAccountTransfer,
            ].includes(paymentModeEnum)}
            fullWidth
            name="bank-name"
            label="Bank Account"
            size="small"
            select
            sx={{ bgcolor: "#fff" }}
            onChange={(e) => {
              setBankEnum(e.target.value);
            }}
          >
            {BankAccountOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="normal"
            required={[
              PaymentModeTypeEnum.Upi,
              PaymentModeTypeEnum.BankAccountTransfer,
            ].includes(paymentModeEnum)}
            fullWidth
            name="bank-name"
            label="Bank Account"
            size="small"
            select
            sx={{ bgcolor: "#fff" }}
            onChange={(e) => {
              setBankEnum(e.target.value);
            }}
          >
            {BankAccountOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box sx={{ width: "21rem", mx: "1rem" }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="typeEnum"
            label="Transaction Type"
            size="small"
            select
            sx={{ bgcolor: "#fff" }}
            onChange={(e) => {
              setTransactionTypeEnum(e.target.value);
            }}
          >
            {TransactionTypeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="normal"
            required
            fullWidth
            name="paymentMode"
            label="Payment Mode"
            size="small"
            select
            sx={{ bgcolor: "#fff" }}
            onChange={(e) => {
              setPaymentModeEnum(e.target.value);
            }}
          >
            {PaymentModeTypeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="normal"
            required={[
              PaymentModeTypeEnum.Upi,
              PaymentModeTypeEnum.BankAccountTransfer,
            ].includes(paymentModeEnum)}
            fullWidth
            name="bank-name"
            label="Bank Account"
            size="small"
            select
            sx={{ bgcolor: "#fff" }}
            onChange={(e) => {
              setBankEnum(e.target.value);
            }}
          >
            {BankAccountOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <DatePicker
            size="small"
            label="Controlled picker"
            sx={{ bgcolor: "#fff", width: "100%", mt: 2 }}
            onChange={(moment) => setTransactionDate(moment.toISOString())}
          />
        </Box>
      </Box>

      <Typography sx={{ color: "red" }}>{message}</Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0, mb: 2 }}>
        <Button
          color="grey"
          variant="contained"
          sx={{ mr: 2, bgcolor: "#fff" }}
          onClick={() => {
            closeModal();
          }}
        >
          CANCEL
        </Button>
        <Button type="submit" variant="contained">
          CREATE
        </Button>
      </Box>
    </Box>
  );
}

export default CreateTransactionModal;
