import React, { useState } from "react";
import axios from "axios";
import { modalContainerStyle } from "../helpers/styles";
import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";
import { BankAccountOptions, ContactTypeEnum } from "../helpers/enums";
import { DatePicker } from "@mui/x-date-pickers";
import { parseDateTime, toMoment } from "../helpers/dateTimeHelpers";
import { ContactsUrl } from "../Constants";
import useGlobalStore from "../store";

function CreateLoanModal({ path, closeModal, forceRender }) {
  const setContacts = useGlobalStore((state) => state.setContacts);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [bankEnum, setBankEnum] = useState("");
  const [loanAmount, setLoanAmount] = useState(0);
  const [sanctionedDate, setSanctionedDate] = useState("");
  const [tenure, setTenure] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [repaymentStartDate, setRepaymentStartDate] = useState("");
  const [emiAmount, setEmiAmount] = useState(0);
  const [message, setMessage] = useState("");

  const submitCreateNewLoan = (e) => {
    e.preventDefault();
    if (!(name && bankEnum && loanAmount && tenure && interestRate)) {
      setMessage("Please complete all required fields");
    } else if (isNaN(Number(loanAmount))) {
      setMessage("Please enter a valid Loan amount");
    } else if (
      isNaN(Number(tenure)) ||
      Number(tenure) < 0 ||
      Number(tenure) > 100
    ) {
      setMessage("Please enter a valid tenure between 0 & 100");
    } else if (
      isNaN(Number(interestRate)) ||
      Number(interestRate) < 0 ||
      Number(interestRate) > 100
    ) {
      setMessage("Please enter a valid interest rate between 0 & 100");
    } else {
      axios
        .post(path, {
          name,
          description,
          bankEnum,
          loanAmount,
          tenure,
          interestRate,
          sanctionedDate,
          repaymentStartDate,
          emiAmount,
        })
        .then((response) => {
          setMessage("Loan Created Successfully.");
          console.log(response);

          axios.get(ContactsUrl).then((resp) => {
            if (resp.status === 200 && Array.isArray(resp?.data)) {
              console.log("get contacts resp: ", resp);
              setContacts(resp.data);
            }
          });

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
      component="form"
      noValidate
      onSubmit={submitCreateNewLoan}
      sx={{
        ...modalContainerStyle,
        px: 6,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography variant="h5" id="modal-title" color="black">
        Create New Loan
      </Typography>
      <Box
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
      >
        <Box sx={{ width: "21rem", mx: "1rem" }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="loan-name"
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
            name="loan-amount"
            label="Loan Amount"
            size="small"
            sx={{ bgcolor: "#fff" }}
            onChange={(e) => {
              setLoanAmount(e.target.value);
            }}
          />
          <TextField
            margin="normal"
            value={bankEnum}
            required
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
            required
            fullWidth
            name="loan-interest-rate"
            label="Interest Rate"
            size="small"
            sx={{ bgcolor: "#fff" }}
            onChange={(e) => {
              setInterestRate(e.target.value);
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="loan-tenure"
            label="Tenure"
            size="small"
            sx={{ bgcolor: "#fff" }}
            onChange={(e) => {
              setTenure(e.target.value);
            }}
          />
        </Box>
        <Box sx={{ width: "21rem", mx: "1rem" }}>
          <TextField
            margin="normal"
            fullWidth
            name="loan-description"
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
            fullWidth
            name="loan-emi"
            label="EMI Amount"
            size="small"
            sx={{ bgcolor: "#fff" }}
            onChange={(e) => {
              setEmiAmount(e.target.value);
            }}
          />
          <DatePicker
            size="small"
            value={toMoment(sanctionedDate)}
            label="Loan Sanctioned Date"
            slotProps={{
              textField: { size: "small" },
              required: false,
            }}
            sx={{ bgcolor: "#fff", width: "100%", mt: 2 }}
            onChange={(moment) => setSanctionedDate(parseDateTime(moment))}
          />
          <DatePicker
            size="small"
            value={toMoment(repaymentStartDate)}
            label="Loan Repayment Start Date"
            slotProps={{
              textField: { size: "small" },
              required: false,
            }}
            sx={{ bgcolor: "#fff", width: "100%", mt: 2 }}
            onChange={(moment) => setRepaymentStartDate(parseDateTime(moment))}
          />
        </Box>
      </Box>
      <Typography sx={{ color: "red", mt: 1, ml: "1rem" }}>
        {message}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          color="grey"
          variant="contained"
          sx={{ mt: 2, mb: 2, mr: 2, bgcolor: "#fff" }}
          onClick={() => {
            closeModal();
          }}
        >
          CANCEL
        </Button>
        <Button type="submit" variant="contained" sx={{ mt: 2, mb: 2 }}>
          CREATE
        </Button>
      </Box>
    </Box>
  );
}

export default CreateLoanModal;
