import React, { useEffect, useState } from "react";
import axios from "axios";
import { LastTransactionKey, TransactionsUrl } from "../Constants";
import { modalContainerStyle } from "../helpers/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box, Button, TextField, Typography, MenuItem } from "@mui/material";
import useGlobalStore from "../store";
import {
  BankAccountOptions,
  ModuleTypeEnum,
  PaymentModeTypeEnum,
  PaymentModeTypeOptions,
  TransactionStatusEnum,
  TransactionTypeEnum,
  TransactionTypeOptions,
} from "../helpers/enums";
import { parseDateTime, toMoment } from "../helpers/dateTimeHelpers";
import { toNumber } from "lodash";
import moment from "moment";

function CreateTransactionModal({
  targetId,
  closeModal,
  forceRender,
  loanName,
  moduleType,
  fromContact,
  toContact,
}) {
  const contacts = useGlobalStore((state) => state.contacts);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fromContactId, setFromContactId] = useState(fromContact);
  const [toContactId, setToContactId] = useState(toContact);
  const [transactionTypeEnum, setTransactionTypeEnum] = useState("");
  const [paymentModeEnum, setPaymentModeEnum] = useState("");
  const [bankEnum, setBankEnum] = useState("");
  const [moduleTypeEnum, setModuleTypeEnum] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [principalAmount, setPrincipalAmount] = useState(0);
  const [interestAmount, setInterestAmount] = useState(0);
  const [message, setMessage] = useState("");

  // initialization based on module
  useEffect(() => {
    let m = moment();
    setTransactionDate(parseDateTime(m));
    setModuleTypeEnum(moduleType ?? ModuleTypeEnum.Projects);

    if (moduleType === ModuleTypeEnum.Loans) {
      let name = m.format("YYYY MMMM");
      setName(name + (loanName ? ` - ${loanName}` : ""));
      setTransactionTypeEnum(TransactionTypeEnum.Debit);
      setPaymentModeEnum(PaymentModeTypeEnum.BankAccountTransfer);
    }
  }, []);

  useEffect(() => {
    if (principalAmount || interestAmount)
      setTransactionAmount(
        toNumber(principalAmount) + toNumber(interestAmount)
      );
  }, [principalAmount, interestAmount]);

  function isFromAndToContactsVisible() {
    return moduleTypeEnum === ModuleTypeEnum.Projects;
  }
  function isPrincipalAndInterestAmountsVisible() {
    return moduleTypeEnum === ModuleTypeEnum.Loans;
  }

  const submitAddNewTransaction = (e) => {
    e.preventDefault();
    // console.log("submitted:.......");

    // If description not entered set same as transaction name
    if (description === "") setDescription(name);

    const isUpi = [
      PaymentModeTypeEnum.Upi,
      // PaymentModeTypeEnum.BankAccountTransfer,
    ].includes(paymentModeEnum);
    if (
      !(
        name &&
        // description &&
        fromContactId &&
        toContactId &&
        transactionTypeEnum &&
        paymentModeEnum &&
        transactionDate &&
        transactionAmount
      )
    ) {
      setMessage("Please complete all fields.");
    } else if (isNaN(Number(transactionAmount))) {
      setMessage("Please enter a valid Transaction Amount.");
    } else if (isUpi && !bankEnum) {
      setMessage("Please select bank account for UPI transaction.");
    } else if (fromContactId === toContactId) {
      setMessage("From party and To party cannot be same.");
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
          principalAmount,
          interestAmount,
          fromContactId,
          toContactId,
          moduleEnum: moduleTypeEnum,
          statusEnum: TransactionStatusEnum.Successful,
        })
        .then((response) => {
          setMessage("Transaction Added Successfully.");
          // console.log(response);

          if (moduleTypeEnum === ModuleTypeEnum.Projects) {
            saveTransactionToLocalStorage({
              transactionTypeEnum: transactionTypeEnum,
              paymentModeEnum: paymentModeEnum,
              bankEnum: bankEnum,
              transactionDate: transactionDate,
              fromContactId,
            });
          }
          closeModal();
          forceRender();
        })
        .catch((error) => {
          setMessage(error.response.data.message);
          console.log(error);
        });
    }
  };

  function getContactDisplayName(contact) {
    return (
      contact.name +
      (contact.designation ? " (" + contact.designation + ")" : "")
    );
  }

  function saveTransactionToLocalStorage(transaction) {
    let transactionStr = JSON.stringify(transaction);
    localStorage.setItem(LastTransactionKey, transactionStr);
  }
  function loadTransactionFromLocalStorage(transaction) {
    let transactionStr = localStorage[LastTransactionKey];
    try {
      console.log("transactionStr", transactionStr);

      if (!transactionStr) {
        setMessage("Cannot find any last saved transactions.");
        console.log("Cannot find any last saved transactions.");
        return;
      }
      let transaction = JSON.parse(transactionStr);
      console.log("transaction", transaction);
      setTransactionTypeEnum(transaction.transactionTypeEnum);
      setPaymentModeEnum(transaction.paymentModeEnum);
      setBankEnum(transaction.bankEnum);
      setTransactionDate(transaction.transactionDate);
      // setTransactionAmount(transactionAmount);
      setFromContactId(transaction.fromContactId);
      // setToContactId(toContactId);
    } catch (error) {
      setMessage("Error while loading last saved transaction.");
      console.error(error);
    }
  }

  return (
    <Box
      component="form"
      noValidate
      onSubmit={submitAddNewTransaction}
      sx={{
        ...modalContainerStyle,
        px: 6,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography variant="h5" id="modal-title" color="black">
        Add Transaction
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

          {isPrincipalAndInterestAmountsVisible() && (
            <TextField
              margin="normal"
              required
              fullWidth
              name="principal-amount"
              label="Principal Amount"
              size="small"
              sx={{ bgcolor: "#fff" }}
              onChange={(e) => {
                // setTransactionAmount(principalAmount + interestAmount);
                setPrincipalAmount(e.target.value);
              }}
            />
          )}
          {isPrincipalAndInterestAmountsVisible() && (
            <TextField
              margin="normal"
              required
              fullWidth
              name="interest-amount"
              label="Interest Amount"
              size="small"
              sx={{ bgcolor: "#fff" }}
              onChange={(e) => {
                setInterestAmount(e.target.value);
                // setTransactionAmount(principalAmount + interestAmount);
              }}
            />
          )}

          <TextField
            value={transactionAmount}
            margin="normal"
            required
            fullWidth
            name="amount"
            label={
              isPrincipalAndInterestAmountsVisible() ? "Total Amount" : "Amount"
            }
            size="small"
            sx={{ bgcolor: "#fff" }}
            onChange={(e) => {
              setTransactionAmount(e.target.value);
            }}
          />
          {isFromAndToContactsVisible() && (
            <TextField
              margin="normal"
              value={fromContactId}
              required={[
                PaymentModeTypeEnum.Upi,
                PaymentModeTypeEnum.BankAccountTransfer,
              ].includes(paymentModeEnum)}
              fullWidth
              name="from-contact"
              label="From Party"
              size="small"
              select
              sx={{ bgcolor: "#fff" }}
              onChange={(e) => {
                setFromContactId(e.target.value);
              }}
            >
              {contacts.map((contact) => (
                <MenuItem key={contact._id} value={contact._id}>
                  {getContactDisplayName(contact)}
                </MenuItem>
              ))}
            </TextField>
          )}
          {isFromAndToContactsVisible() && (
            <TextField
              margin="normal"
              value={toContactId}
              required={[
                PaymentModeTypeEnum.Upi,
                PaymentModeTypeEnum.BankAccountTransfer,
              ].includes(paymentModeEnum)}
              fullWidth
              name="to-contact"
              label="To Party"
              size="small"
              select
              sx={{ bgcolor: "#fff" }}
              onChange={(e) => {
                setToContactId(e.target.value);
              }}
            >
              {contacts.map((contact) => (
                <MenuItem key={contact._id} value={contact._id}>
                  {getContactDisplayName(contact)}
                </MenuItem>
              ))}
            </TextField>
          )}
        </Box>
        <Box sx={{ width: "21rem", mx: "1rem" }}>
          <TextField
            margin="normal"
            value={transactionTypeEnum}
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
            value={paymentModeEnum}
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
            value={bankEnum}
            required={[
              PaymentModeTypeEnum.Upi,
              // PaymentModeTypeEnum.BankAccountTransfer,
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
            value={toMoment(transactionDate)}
            label="Transaction Date"
            slotProps={{
              textField: { size: "small" },
              required: false,
            }}
            sx={{ bgcolor: "#fff", width: "100%", mt: 2 }}
            onChange={(moment) => setTransactionDate(parseDateTime(moment))}
          />
        </Box>
      </Box>

      <Typography sx={{ color: "red", ml: 2, my: 1 }}>{message}</Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0, mb: 2 }}>
        {moduleTypeEnum === ModuleTypeEnum.Projects && (
          <Button
            onClick={() => loadTransactionFromLocalStorage()}
            variant="contained"
            color="warning"
            sx={{ mr: 2 }}
          >
            Load Last Transaction
          </Button>
        )}
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
