import React, { useState } from "react";
import axios from "axios";
import { modalContainerStyle } from "../helpers/styles";
import {
  Box,
  Button,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { BankAccountOptions } from "../helpers/enums";
import { DatePicker } from "@mui/x-date-pickers";
import { parseDateTime, toMoment } from "../helpers/dateTimeHelpers";
import ConfirmationModal from "./ConfirmationModal";
import { useNavigate } from "react-router-dom";

function EditLoanModal({ data, path, closeModal, forceRender }) {
  const navigate = useNavigate();

  const [name, setName] = useState(data?.name);
  const [description, setDescription] = useState(data?.description);
  const [bankEnum, setBankEnum] = useState(data?.bankEnum);
  const [loanAmount, setLoanAmount] = useState(data?.loanAmount);
  const [principalAmountPaid, setPrincipalAmountPaid] = useState(
    data?.principalAmountPaid
  );
  const [interestAmountPaid, setInterestAmountPaid] = useState(
    data?.interestAmountPaid
  );
  const [sanctionedDate, setSanctionedDate] = useState(data?.sanctionedDate);
  const [tenure, setTenure] = useState(data?.tenure);
  const [interestRate, setInterestRate] = useState(data?.interestRate);
  const [repaymentStartDate, setRepaymentStartDate] = useState(
    data?.repaymentStartDate
  );
  const [emiAmount, setEmiAmount] = useState(data?.emiAmount);
  const [message, setMessage] = useState("");

  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const closeDeleteModal = () => {
    setDeleteMessage("");
    setIsDeleteMode(false);
  };
  const [deleteMessage, setDeleteMessage] = useState("");

  const submitCreateNewLoan = (e) => {
    e.preventDefault();
    if (!(name && bankEnum && loanAmount && tenure && interestRate)) {
      setMessage("Please complete all required fields");
    } else if (isNaN(Number(loanAmount))) {
      setMessage("Please enter a valid Estimate amount");
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
        .put(path + `/${data._id}`, {
          name,
          description,
          bankEnum,
          loanAmount,
          principalAmountPaid,
          interestAmountPaid,
          tenure,
          interestRate,
          sanctionedDate,
          repaymentStartDate,
          emiAmount,
        })
        .then((response) => {
          setMessage("Loan Updated Successfully.");
          // console.log(response);
          closeModal();
          forceRender();
        })
        .catch((error) => {
          setMessage(error.response.data.message);
          console.log(error);
        });
    }
  };

  const submitDeleteLoan = (e) => {
    e.preventDefault();
    axios
      .delete(path + `/${data._id}`, {})
      .then((response) => {
        setDeleteMessage("Transaction Deleted Successfully.");
        console.log(response);
        closeModal();
        navigate("/loans");
      })
      .catch((error) => {
        setDeleteMessage(error.response.data.message);
        console.log(error);
      });
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
            value={name}
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
            value={loanAmount}
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
            value={principalAmountPaid}
            margin="normal"
            required
            fullWidth
            name="principal-amount"
            label="Principal Amount Paid"
            size="small"
            sx={{ bgcolor: "#fff" }}
            onChange={(e) => {
              setPrincipalAmountPaid(e.target.value);
            }}
          />
          <TextField
            value={interestAmountPaid}
            margin="normal"
            required
            fullWidth
            name="interest-amount"
            label="Interest Amount Paid"
            size="small"
            sx={{ bgcolor: "#fff" }}
            onChange={(e) => {
              setInterestAmountPaid(e.target.value);
            }}
          />
          <TextField
            value={interestRate}
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
            value={tenure}
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
            value={description}
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
            value={emiAmount}
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
            sx={{ bgcolor: "#fff", width: "100%", mt: 3 }}
            onChange={(moment) => setRepaymentStartDate(parseDateTime(moment))}
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
            sx={{ bgcolor: "#fff", mt: 3 }}
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
      </Box>
      <Typography sx={{ color: "red", mt: 1, ml: "1rem" }}>
        {message}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0, mb: 2 }}>
        <Button
          color="grey"
          variant="contained"
          sx={{ my: 2, mr: 2, bgcolor: "#fff" }}
          onClick={() => {
            closeModal();
          }}
        >
          CANCEL
        </Button>
        <Button
          color="error"
          variant="outlined"
          sx={{ my: 2, mr: 2 }}
          onClick={() => setIsDeleteMode(true)}
        >
          DELETE
        </Button>
        <Button type="submit" variant="contained" sx={{ mt: 2, mb: 2 }}>
          UPDATE
        </Button>
      </Box>

      {/* Delete Confirmation Modal */}
      <Modal open={isDeleteMode} onClose={closeDeleteModal}>
        <ConfirmationModal
          errorText={deleteMessage}
          confirmationText={"Are you sure you want to delete this Loan ?"}
          onCancel={closeDeleteModal}
          onConfirm={submitDeleteLoan}
        />
      </Modal>
    </Box>
  );
}

export default EditLoanModal;
