import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAsync } from "../../services/apiHandlerService";
import { CategoriesUrl, TransactionsUrl } from "../../Constants";
import Details from "../../components/Details";
import AppTable from "../../components/AppTable";
import AppCard from "../../components/AppCard";
import axios from "axios";
import { displayDate } from "../../helpers/dateTimeHelpers";
import { modalContainerStyle } from "../../helpers/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Box,
  Button,
  Divider,
  TextField,
  Typography,
  Card,
  Modal,
  MenuItem,
} from "@mui/material";
import {
  BankAccountOptions,
  ModuleTypeEnum,
  PaymentModeTypeEnum,
  PaymentModeTypeOptions,
  TransactionStatusEnum,
  TransactionTypeOptions,
} from "../../helpers/enums";

function CategoryDetails() {
  let { id } = useParams();
  const categoriesNavigateUrl = "/projects/categories";
  const [data, setData] = useState({});
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [estimate, setEstimate] = useState(0);
  const [message, setMessage] = useState("");
  const [render, setRender] = useState(0);
  const [isCreateCaregoryMode, setCreateCaregoryMode] = useState(false);
  const [isAddTransactionMode, setAddTransactionMode] = useState(false);
  const closeCreateCaregoryModal = () =>
    setCreateCaregoryMode(!isCreateCaregoryMode);

  const [transactionName, setTransactionName] = useState("");
  const [transactionDescription, setTransactionDescription] = useState("");
  const [fromContactId, setFromContactId] = useState("");
  const [toContactId, setToContactId] = useState("");
  const [transactionTypeEnum, setTransactionTypeEnum] = useState("");
  const [paymentModeEnum, setPaymentModeEnum] = useState("");
  const [bankEnum, setBankEnum] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [transactionAmount, setTransactionAmount] = useState(0);
  const closeAddTransactionModal = () =>
    setAddTransactionMode(!isAddTransactionMode);

  useEffect(() => {
    async function fetchData() {
      const url = CategoriesUrl + `/${id}`;
      const response = await getAsync(url);
      setData(response.payload);
      // console.log("pageData: ", data);
    }
    fetchData();
    // eslint-disable-next-line
  }, [id, render]);

  const submitCreateNewCategory = (e) => {
    e.preventDefault();
    if (!(transactionName && transactionDescription)) {
      setMessage("Please complete all fields");
    } else if (isNaN(Number(estimate))) {
      setMessage("Please enter a valid Estimate amount");
    } else {
      axios
        .post(CategoriesUrl + "/add-category", {
          categoryId: id,
          name,
          description,
          estimate,
        })
        .then((response) => {
          setMessage("Category Created Successfully.");
          console.log(response);
          closeCreateCaregoryModal();
          setRender(render + 1);
        })
        .catch((error) => {
          setMessage(error.response.data.message);
          console.log(error);
        });
    }
  };

  const submitAddNewTransaction = (e) => {
    e.preventDefault();
    if (!(name && description)) {
      setMessage("Please complete all fields");
    } else if (isNaN(Number(transactionAmount))) {
      setMessage("Please enter a valid Transaction Amount");
    } else {
      axios
        .post(TransactionsUrl, {
          targetId: id,
          name: transactionName,
          description: transactionDescription,
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
          closeAddTransactionModal();
          setRender(render + 1);
        })
        .catch((error) => {
          setMessage(error.response.data.message);
          console.log(error);
        });
    }
  };

  const transactionSlots = {
    fromContact: ({ data }) => data.name,
    toContact: ({ data }) => data.name,
    date: ({ data }) => displayDate(data),
    amount: ({ data, rowData }) => {
      return (
        <Typography
          color={rowData.typeEnum === "DEBIT" ? "red" : "green"}
          sx={{ fontSize: 18, fontWeight: 550 }}
        >
          {data}
        </Typography>
      );
    },
  };
  const customColumns = {
    fromContact: "From",
    toContact: "To",
    paymentModeEnum: "Mode",
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" color="gray">
        Category Details
      </Typography>
      <Divider />

      <Typography variant="h4" sx={{ mt: 3 }}>
        {data.name}
      </Typography>
      <Typography paragraph="true" variant="h6" sx={{ mt: 0 }}>
        {data.description}
      </Typography>
      <Typography variant="h6" sx={{ mt: 0, color: "green" }}>
        Estimate : {data.estimate}
      </Typography>
      <Typography variant="h6" sx={{ mb: 1, color: "#b84300" }}>
        Total Cost : {data.totalCost}
      </Typography>

      <Details data={data.details} />
      <AppTable
        name="Event Details"
        data={data.events}
        columns={["name", "date", "description"]}
      />

      <Box sx={{ mt: 5 }}>
        <Typography sx={{ fontSize: 25, fontWeight: "600", color: "#555" }}>
          Categories
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexFlow: "wrap",
          }}
        >
          {data.categories &&
            data.categories.length !== 0 &&
            data.categories.map((card) => {
              return (
                <AppCard
                  key={card._id}
                  data={card}
                  url={categoriesNavigateUrl}
                />
              );
            })}
          <Card
            sx={{
              width: "18.5rem",
              mt: 2,
              mb: 1,
              textAlign: "center",
              marginBottom: "auto",
              minHeight: 140,
              bgcolor: "#eee",
              ":hover": { bgcolor: "#fff", cursor: "pointer" },
            }}
            onClick={() => {
              setCreateCaregoryMode(!isCreateCaregoryMode);
            }}
          >
            <Typography
              sx={{
                pt: 1.5,
                fontSize: 100,
                lineHeight: 0.75,
                color: "gray",
                fontFamily: "courier",
              }}
            >
              +
            </Typography>
            <Typography sx={{ color: "#555", fontSize: 20 }}>
              Create New Category
            </Typography>
          </Card>
        </Box>
      </Box>

      <AppTable
        name="Transactions"
        data={data.transactions}
        columns={[
          "name",
          "date",
          "fromContact",
          "toContact",
          "amount",
          "paymentModeEnum",
        ]}
        slots={transactionSlots}
        customColumns={customColumns}
      />
      <Box sx={{ display: "flex" }}>
        <Button
          variant="contained"
          sx={{ my: 3, ml: "auto" }}
          onClick={() => setAddTransactionMode(!isAddTransactionMode)}
        >
          Add Transaction
        </Button>
      </Box>

      {/* ========================Modals======================= "/}

      {/* Create new Category Modal */}
      <Modal open={isCreateCaregoryMode} onClose={closeCreateCaregoryModal}>
        <Box
          sx={{
            ...modalContainerStyle,
            px: 6,
            width: "25rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="h5" id="modal-title" color="black">
            Create New Category
          </Typography>
          <Box
            component="form"
            noValidate
            sx={{ mt: 1 }}
            onSubmit={submitCreateNewCategory}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              name="category-name"
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
              name="description"
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
              name="estimate"
              label="Estimate"
              size="small"
              sx={{ bgcolor: "#fff" }}
              onChange={(e) => {
                setEstimate(e.target.value);
              }}
            />
            <Typography sx={{ color: "red" }}>{message}</Typography>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                color="grey"
                variant="contained"
                sx={{ mt: 2, mb: 2, mr: 2, bgcolor: "#fff" }}
                onClick={() => {
                  closeCreateCaregoryModal();
                }}
              >
                CANCEL
              </Button>
              <Button type="submit" variant="contained" sx={{ mt: 2, mb: 2 }}>
                CREATE
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* Add new Transaction Modal */}

      <Modal open={isAddTransactionMode} onClose={closeAddTransactionModal}>
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
                  setTransactionName(e.target.value);
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
                  setTransactionDescription(e.target.value);
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

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", mt: 0, mb: 2 }}
          >
            <Button
              color="grey"
              variant="contained"
              sx={{ mr: 2, bgcolor: "#fff" }}
              onClick={() => {
                closeAddTransactionModal();
              }}
            >
              CANCEL
            </Button>
            <Button type="submit" variant="contained">
              CREATE
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default CategoryDetails;
