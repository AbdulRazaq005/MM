import React, { useEffect, useState } from "react";
import { ExpenditureUrl } from "../../Constants";
import { getAsync } from "../../services/apiHandlerService";
import { Box, Button, Divider, Modal, Typography } from "@mui/material";
import Loading from "../../components/Loading";
import { displayCurrency } from "../../helpers/displayFormatHelpers";
import axios from "axios";
import TextInformationCard from "../../components/TextInformationCard";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import ExpenditureCategoryCard from "../../components/ExpenditureCategoryCard";
import {
  ExpenditureCategoryType,
  ModuleTypeEnum,
  TransactionTypeEnum,
} from "../../helpers/enums";
import CreateUpdateExpenditureItemModal from "../../components/CreateUpdateExpenditureItemModal";
import AppTable from "../../components/AppTable";
import CreateTransactionModal from "../../components/CreateTransactionModal";
import EditTransactionModal from "../../components/EditTransactionModal";
import useGlobalStore from "../../store";
import {
  displayDate,
  parseDateTime,
  toMoment,
} from "../../helpers/dateTimeHelpers";
import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";

function Expenditure() {
  const [isLoading, setIsLoading] = useState(false);
  const [render, setRender] = useState(0);
  const reRender = () => setRender(render + 1);
  const [isExpenditureItemModalOpen, setIsExpenditureItemModalOpen] =
    useState(false);
  const [data, setData] = useState({});
  const [activeItemData, setActiveItemData] = useState({});
  const [activeItemType, setActiveItemType] = useState("");
  const [isIncomeEditMode, setIsIncomeEditMode] = useState(false);
  const [isExpenseEditMode, setIsIExpenseEditMode] = useState(false);
  const [addTransactionType, setAddTransactionType] = useState("");
  const [fromDate, setFromDate] = useState(
    parseDateTime(moment().startOf("month"))
  );
  const [toDate, setToDate] = useState(parseDateTime(moment().endOf("month")));

  const user = useGlobalStore((state) => state.user);
  const [isAddTransactionMode, setAddTransactionMode] = useState(false);
  const closeAddTransactionModal = () => {
    setAddTransactionMode(false);
    setAddTransactionType("");
  };
  const openAddTransactionModal = (type) => {
    setAddTransactionType(type);
    setAddTransactionMode(true);
  };

  const [isEditTransactionMode, setEditTransactionMode] = useState(false);
  const [activeEditTransaction, setActiveEditTransaction] = useState({});
  const closeEditTransactionModal = () => setEditTransactionMode(false);

  useEffect(() => {
    // const _fromDate = parseDateTime(moment().startOf("month"));
    // const _toDate = parseDateTime(moment().endOf("month"));
    // setFromDate(_fromDate);
    // setToDate(_toDate);

    async function fetchData() {
      setIsLoading(true);
      const response = await getAsync(ExpenditureUrl, {
        fromDate: fromDate,
        toDate: toDate,
      });
      let _data = response.payload;
      _data?.transactions?.sort((a, b) => a.typeEnum.localeCompare(b.typeEnum));
      setData(_data);
      setIsLoading(false);
    }
    fetchData();

    // eslint-disable-next-line
  }, [render]);

  useEffect(() => {
    let incomeCategories = [];
    let expenseCategories = [];
    incomeCategories = data?.expenditureCategories?.filter(
      (c) => c.type === ExpenditureCategoryType.Income
    );
    expenseCategories = data?.expenditureCategories?.filter(
      (c) => c.type === ExpenditureCategoryType.Expense
    );
    setIsIncomeEditMode(incomeCategories?.length === 0 ? true : false);
    setIsIExpenseEditMode(expenseCategories?.length === 0 ? true : false);
    // eslint-disable-next-line
  }, [data]);

  function toggleExpenditureItemModal(type, itemData) {
    if (!isExpenditureItemModalOpen) {
      setActiveItemType(type);
      setActiveItemData(itemData);
    } else {
      setActiveItemType("");
    }
    setIsExpenditureItemModalOpen(!isExpenditureItemModalOpen);
  }

  function getTotalValue(type) {
    let incomeCategories = [];
    let expenseCategories = [];

    incomeCategories = data?.expenditureCategories?.filter(
      (c) => c.type === ExpenditureCategoryType.Income
    );
    expenseCategories = data?.expenditureCategories?.filter(
      (c) => c.type === ExpenditureCategoryType.Expense
    );

    let totalIncome = data?.transactions
      ?.filter((t) => incomeCategories.find((c) => c._id === t.targetId))
      .reduce((total, item) => total + item.amount, 0);
    let totalExpense = data?.transactions
      ?.filter((t) => expenseCategories.find((c) => c._id === t.targetId))
      .reduce((total, item) => total + item.amount, 0);

    if (type === ExpenditureCategoryType.Income) {
      return totalIncome;
    }
    if (type === ExpenditureCategoryType.Expense) {
      return totalExpense;
    }
    return totalIncome - totalExpense;
  }

  function getTotalCategoryValue(categoryId) {
    let totalValue = data?.transactions
      ?.filter((t) => categoryId === t.targetId)
      .reduce((total, item) => total + item.amount, 0);

    return totalValue;
  }

  function upsertExpenditureItem(type, { _id, name, description }) {
    // console.log("UPSERT:", type, { _id, name, description });
    let payload = {
      _id,
      name,
      description,
      type,
    };
    if (_id) {
      axios
        .put(ExpenditureUrl + `/${_id}`, payload)
        .then((res) => {
          reRender();
          setActiveItemData({});
          setActiveItemType("");
          toggleExpenditureItemModal();
        })
        .catch((err) => console.err(err));
    } else {
      axios
        .post(ExpenditureUrl, payload)
        .then((res) => {
          reRender();
          setActiveItemData({});
          setActiveItemType("");
          toggleExpenditureItemModal();
        })
        .catch((err) => console.err(err));
    }
  }

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

  function getTransactionCategoryOptions() {
    let categoryOptions = data.expenditureCategories
      ?.filter((c) => c.type === addTransactionType)
      .map((o) => {
        return { label: o.name, value: o._id };
      });
    return categoryOptions;
  }

  return (
    <Box sx={{ px: 2, py: 3, color: "#444" }}>
      <Box
        sx={{
          my: 2,
          mx: 1,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          // flexDirection: "column",
          alignContent: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{ color: "#666", fontWeight: "600", mt: 0 }}
        >
          Expenditure
        </Typography>
        <Box sx={{ display: "flex", mx: 1 }}>
          <DatePicker
            size="small"
            value={toMoment(fromDate)}
            label="From Date"
            slotProps={{
              textField: { size: "small", fullWidth: true },
            }}
            sx={{ bgcolor: "#fff", width: "10rem" }}
            onChange={(moment) => setFromDate(parseDateTime(moment))}
          />
          <DatePicker
            size="small"
            value={toMoment(toDate)}
            label="To Date"
            slotProps={{
              textField: { size: "small", fullWidth: true },
            }}
            sx={{ bgcolor: "#fff", width: "10rem", mx: 2 }}
            onChange={(moment) => setToDate(parseDateTime(moment))}
          />
          <Button variant="outlined" color="primary" onClick={reRender}>
            Go
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          // mt: 1,
          display: "flex",
          flexFlow: "wrap",
          justifyContent: "space-between",
        }}
      >
        <TextInformationCard
          width="32%"
          label={"Total Budget"}
          value={displayCurrency(getTotalValue(ExpenditureCategoryType.Income))}
          icon={<AccountBalanceIcon sx={{ height: "100%", width: "100%" }} />}
          color="#5fa827"
        />
        <TextInformationCard
          width="32%"
          label={"Total Expenses"}
          value={displayCurrency(
            getTotalValue(ExpenditureCategoryType.Expense)
          )}
          icon={<PermMediaIcon sx={{ height: "100%", width: "100%" }} />}
          color="#D65076"
        />
        <TextInformationCard
          width="32%"
          label={"Balance"}
          value={displayCurrency(getTotalValue(""))}
          icon={<AssessmentIcon sx={{ height: "100%", width: "100%" }} />}
          color="#4b70b4"
        />
      </Box>

      {/* Income Streams */}
      <Box
        sx={{
          mt: 4,
          mb: 1,
          px: 0,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignContent: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: "#888", fontWeight: "600", ml: 1 }}
        >
          Income Streams
        </Typography>
        <Box sx={{ ml: "auto" }}>
          {!isIncomeEditMode && (
            <Button
              variant="outlined"
              color="info"
              size="small"
              sx={{ height: "fit-content", py: 0 }}
              onClick={() =>
                openAddTransactionModal(ExpenditureCategoryType.Income)
              }
            >
              Add Transaction
            </Button>
          )}
          <Button
            variant="outlined"
            color={isIncomeEditMode ? "error" : "warning"}
            sx={{ fontWeight: "500", py: 0, ml: 1 }}
            onClick={() => setIsIncomeEditMode(!isIncomeEditMode)}
          >
            {isIncomeEditMode ? "Cancel" : "Edit"}
          </Button>
        </Box>
      </Box>
      <Divider />
      <Box
        sx={{
          mt: 1,
          display: "flex",
          flexFlow: "wrap",
          justifyContent: "space-between",
        }}
      >
        {data?.expenditureCategories
          ?.filter((item) => item.type === ExpenditureCategoryType.Income)
          .map((item) => {
            return (
              <ExpenditureCategoryCard
                data={item}
                value={getTotalCategoryValue(item._id)}
                color="#5fa827"
                actionText="Update Income Stream"
                action={toggleExpenditureItemModal}
                type={ExpenditureCategoryType.Income}
                isEditMode={isIncomeEditMode}
              />
            );
          })}
        {isIncomeEditMode && (
          <ExpenditureCategoryCard
            actionText="Add New Income Stream"
            action={toggleExpenditureItemModal}
            type={ExpenditureCategoryType.Income}
          />
        )}
      </Box>

      {/* Expenses */}
      <Box
        sx={{
          mt: 4,
          mb: 1,
          px: 0,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignContent: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: "#888", fontWeight: "600", ml: 1 }}
        >
          Expenses
        </Typography>
        <Box sx={{ ml: "auto" }}>
          {!isExpenseEditMode && (
            <Button
              variant="outlined"
              color="info"
              size="small"
              sx={{ height: "fit-content", py: 0 }}
              onClick={() =>
                openAddTransactionModal(ExpenditureCategoryType.Expense)
              }
            >
              Add Transaction
            </Button>
          )}
          <Button
            variant="outlined"
            color={isExpenseEditMode ? "error" : "warning"}
            sx={{ fontWeight: "500", py: 0, ml: 1 }}
            onClick={() => setIsIExpenseEditMode(!isExpenseEditMode)}
          >
            {isExpenseEditMode ? "Cancel" : "Edit"}
          </Button>
        </Box>
      </Box>
      <Divider />
      <Box
        sx={{
          mt: 1,
          display: "flex",
          flexFlow: "wrap",
          justifyContent: "space-between",
        }}
      >
        {data?.expenditureCategories
          ?.filter((item) => item.type === ExpenditureCategoryType.Expense)
          .map((item) => {
            return (
              <ExpenditureCategoryCard
                data={item}
                value={getTotalCategoryValue(item._id)}
                color="#D65076"
                actionText="Update Expense"
                action={toggleExpenditureItemModal}
                type={ExpenditureCategoryType.Expense}
                isEditMode={isExpenseEditMode}
              />
            );
          })}
        {isExpenseEditMode && (
          <ExpenditureCategoryCard
            actionText="Add New Expense"
            action={toggleExpenditureItemModal}
            type={ExpenditureCategoryType.Expense}
          />
        )}
      </Box>

      {/* Create and Update Expenditure Item Modal */}
      <Modal open={isExpenditureItemModalOpen}>
        <CreateUpdateExpenditureItemModal
          data={activeItemData}
          closeModal={toggleExpenditureItemModal}
          action={upsertExpenditureItem}
          type={activeItemType}
          forceRender={reRender}
        />
      </Modal>

      {/* Transactions */}
      <AppTable
        name="Transactions"
        options={data.expenditureCategories}
        data={data.transactions}
        columns={["name", "date", "typeEnum", "targetId", "amount"]}
        slots={transactionSlots}
        customColumns={{
          typeEnum: "Type",
          targetId: "Category",
        }}
      />

      {/* Add new Transaction Modal */}
      <Modal open={isAddTransactionMode} onClose={closeAddTransactionModal}>
        <CreateTransactionModal
          typeEnum={
            addTransactionType === ExpenditureCategoryType.Expense
              ? TransactionTypeEnum.Debit
              : TransactionTypeEnum.Credit
          }
          targetOptions={getTransactionCategoryOptions()}
          forceRender={reRender}
          closeModal={closeAddTransactionModal}
          moduleType={ModuleTypeEnum.Expenditure}
          loanName={data.name}
          fromContact={user?.contact}
          toContact={user?.contact}
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

export default Expenditure;
