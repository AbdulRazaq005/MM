import React, { useState } from "react";
import axios from "axios";
import { TransactionsUrl } from "../Constants";
import { modalContainerStyle } from "../helpers/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Modal,
} from "@mui/material";
import { useAtomValue } from "jotai";
import { contactsAtom } from "../store";
import {
  BankAccountOptions,
  ModuleTypeEnum,
  PaymentModeTypeEnum,
  PaymentModeTypeOptions,
  TransactionStatusEnum,
  TransactionTypeOptions,
} from "../helpers/enums";
import { toMoment } from "../helpers/dateTimeHelpers";
import ConfirmationModal from "./ConfirmationModal";

function EditTransactionModal({ data, closeModal, forceRender }) {
  console.log("tran Data: ", data);
  const contacts = useAtomValue(contactsAtom);
  const [name, setName] = useState(data?.name);
  const [description, setDescription] = useState(data?.description);
  const [fromContactId, setFromContactId] = useState(data?.fromContact._id);
  const [toContactId, setToContactId] = useState(data?.toContact._id);
  const [transactionTypeEnum, setTransactionTypeEnum] = useState(
    data?.typeEnum
  );
  const [paymentModeEnum, setPaymentModeEnum] = useState(data?.paymentModeEnum);
  const [bankEnum, setBankEnum] = useState(data?.bankEnum);
  const [transactionDate, setTransactionDate] = useState(data?.date);
  const [transactionAmount, setTransactionAmount] = useState(data?.amount);
  const [message, setMessage] = useState(
    data ? "" : "Invalid transaction data."
  );

  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const closeDeleteModal = () => {
    setDeleteMessage("");
    setIsDeleteMode(false);
  };
  const [deleteMessage, setDeleteMessage] = useState("");

  const submitUpdateTransaction = (e) => {
    e.preventDefault();
    // console.log("submitted:.......");
    if (!data) {
      setMessage("Invalid Transaction data");
    }
    const isUpi = [
      PaymentModeTypeEnum.Upi,
      PaymentModeTypeEnum.BankAccountTransfer,
    ].includes(paymentModeEnum);
    if (
      !(
        name &&
        description &&
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
        .put(TransactionsUrl + `/${data._id}`, {
          targetId: data.targetId,
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
          setMessage("Transaction Updated Successfully.");
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

  const submitDeleteTransaction = (e) => {
    e.preventDefault();
    axios
      .delete(TransactionsUrl + `/${data._id}`, {
        isHardDelete: true,
      })
      .then((response) => {
        setDeleteMessage("Transaction Deleted Successfully.");
        console.log(response);
        closeModal();
        forceRender();
      })
      .catch((error) => {
        setDeleteMessage(error.response.data.message);
        console.log(error);
      });
  };

  function getContactDisplayName(contact) {
    return (
      contact.name +
      (contact.designation ? " (" + contact.designation + ")" : "")
    );
  }

  return (
    <Box
      component="form"
      noValidate
      onSubmit={submitUpdateTransaction}
      sx={{
        ...modalContainerStyle,
        px: 6,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography variant="h5" id="modal-title" color="black">
        Edit Transaction
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
            value={name}
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
            value={description}
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
            value={transactionAmount}
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
            <MenuItem value={""}>-</MenuItem>
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
              textField: { size: "small", fullWidth: true },
            }}
            sx={{ bgcolor: "#fff", width: "100%", mt: 2 }}
            onChange={(moment) => setTransactionDate(moment.toISOString())}
          />
        </Box>
      </Box>

      <Typography sx={{ color: "red", ml: 2, mt: 1 }}>{message}</Typography>

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
        <Button
          color="error"
          variant="outlined"
          sx={{ mr: 2 }}
          onClick={() => setIsDeleteMode(true)}
        >
          DELETE
        </Button>
        <Button
          type="submit"
          variant="contained"
          onClick={submitUpdateTransaction}
        >
          UPDATE
        </Button>
      </Box>

      <Modal open={isDeleteMode} onClose={closeDeleteModal}>
        <ConfirmationModal
          errorText={deleteMessage}
          confirmationText={
            "Are you sure you want to delete this transaction ?"
          }
          onCancel={closeDeleteModal}
          onConfirm={submitDeleteTransaction}
        />
      </Modal>
    </Box>
  );
}

export default EditTransactionModal;
