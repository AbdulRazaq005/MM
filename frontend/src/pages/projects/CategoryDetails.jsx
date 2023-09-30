import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAsync } from "../../services/apiHandlerService";
import { CategoriesUrl } from "../../Constants";
import Details from "../../components/Details";
import AppTable from "../../components/AppTable";
import AppCard from "../../components/AppCard";
import { displayDate } from "../../helpers/dateTimeHelpers";
import { Box, Button, Divider, Typography, Modal } from "@mui/material";
import CreateCategoryModal from "../../components/CreateCategoryModal";
import CreateTransactionModal from "../../components/CreateTransactionModal";

function CategoryDetails() {
  let { id } = useParams();
  const categoriesNavigateUrl = "/projects/categories";
  const [data, setData] = useState({});
  const [render, setRender] = useState(0);
  const reRender = () => setRender(render + 1);
  const [isCreateCaregoryMode, setCreateCaregoryMode] = useState(false);
  const closeCreateCaregoryModal = () => setCreateCaregoryMode(false);
  const [isAddTransactionMode, setAddTransactionMode] = useState(false);
  const closeAddTransactionModal = () => setAddTransactionMode(false);

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

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" sx={{ mt: 3 }}>
          {data.name}
        </Typography>
        <Link to={window.location.pathname + "/edit"} sx={{ mt: "auto" }}>
          <Button
            variant="contained"
            size="small"
            color="warning"
            sx={{ height: "fit-content" }}
          >
            Edit Details
          </Button>
        </Link>
      </Box>
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
          <AppCard
            actionText={"Create New Category"}
            action={() => setCreateCaregoryMode(true)}
          />
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

      {/* Create new Category Modal */}
      <Modal open={isCreateCaregoryMode} onClose={closeCreateCaregoryModal}>
        <CreateCategoryModal
          targetId={id}
          path={CategoriesUrl + "/add-category"}
          forceRender={reRender}
          closeModal={closeCreateCaregoryModal}
        />
      </Modal>

      {/* Add new Transaction Modal */}
      <Modal open={isAddTransactionMode} onClose={closeAddTransactionModal}>
        <CreateTransactionModal
          targetId={id}
          forceRender={reRender}
          closeModal={closeAddTransactionModal}
        />
      </Modal>
    </Box>
  );
}

export default CategoryDetails;
