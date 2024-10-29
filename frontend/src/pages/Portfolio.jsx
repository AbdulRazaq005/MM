import React, { useEffect, useState } from "react";
// import useGlobalStore from "../store";
import { PortfolioUrl } from "../Constants";
import { getAsync } from "../services/apiHandlerService";
import { Box, Modal, Typography } from "@mui/material";
import Loading from "../components/Loading";
import { displayCurrency } from "../helpers/displayFormatHelpers";
import axios from "axios";
import TextInformationCard from "../components/TextInformationCard";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import PortfolioCard from "../components/PortfolioCard";
import { PortfolioTypeEnum } from "../helpers/enums";
import CreateUpdatePortfolioItemModal from "../components/CreateUpdatePortfolioItemModal";

function Portfolio() {
  const [isLoading, setIsLoading] = useState(false);
  const [isPortfolioItemModalOpen, setIsPortfolioItemModalOpen] =
    useState(false);
  const [data, setData] = useState({});
  const [activeItemData, setActiveItemData] = useState({});
  const [activeItemType, setActiveItemType] = useState("");

  // const user = useGlobalStore((state) => state.user);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const response = await getAsync(PortfolioUrl);
      setData(response.payload);
      setIsLoading(false);
      console.log("pageData: ", response.payload);
    }
    fetchData();
    // eslint-disable-next-line
  }, []);

  function togglePortfolioItemModal(type, itemData) {
    if (!isPortfolioItemModalOpen) {
      setActiveItemType(type);
      setActiveItemData(itemData);
    } else {
      setActiveItemType("");
    }
    setIsPortfolioItemModalOpen(!isPortfolioItemModalOpen);
  }

  function getTotalValue(type) {
    let items = [];
    if (type === PortfolioTypeEnum.BankAccount) items = data?.bankAccounts;
    if (type === PortfolioTypeEnum.Asset) items = data?.assets;
    if (type === PortfolioTypeEnum.Investment) items = data?.investments;

    return items?.reduce((total, item) => total + item.value, 0);
  }

  function upsertPortfolioItem(type, { _id, name, description, value }) {
    let payload = data;
    console.log("portfolioItemData", type, { _id, name, description, value });

    if (_id) {
      // update item
      let updateItemData = {
        _id,
        name,
        description,
        value,
      };
      let idx = -1;
      switch (type) {
        case PortfolioTypeEnum.BankAccount:
          idx = payload?.bankAccounts?.findIndex((item) => item._id === _id);
          console.log("idx", idx, payload.bankAccounts[idx]);
          payload.bankAccounts[idx] = updateItemData;
          break;
        case PortfolioTypeEnum.Asset:
          idx = payload?.assets?.findIndex((item) => item._id === _id);
          payload.assets[idx] = updateItemData;
          break;
        case PortfolioTypeEnum.Investment:
          idx = payload?.investments?.findIndex((item) => item._id === _id);
          payload.investments[idx] = updateItemData;
          break;
        default: {
          break;
        }
      }
    } else {
      // insert item
      let insertItemData = {
        name,
        description,
        value,
      };
      switch (type) {
        case PortfolioTypeEnum.BankAccount:
          payload?.bankAccounts?.push(insertItemData);
          break;
        case PortfolioTypeEnum.Asset:
          payload?.assets?.push(insertItemData);
          break;
        case PortfolioTypeEnum.Investment:
          payload?.investments?.push(insertItemData);
          break;
        default: {
          break;
        }
      }
    }
    axios
      .post(PortfolioUrl, payload)
      .then((res) => {
        setData(res.data);
        setActiveItemData({});
        setActiveItemType("");
        togglePortfolioItemModal();
      })
      .catch((err) => console.err(err));
  }

  return (
    <Box sx={{ px: 2, py: 3, color: "#444" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          height: "5rem",
          mb: 2,
        }}
      >
        <Box
          sx={{
            my: 3,
            mx: 1,
            width: "50%",
            display: "flex",
            flexDirection: "column",
            alignContent: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: "#888", fontWeight: "600", mt: 0 }}
          >
            NET WORTH
          </Typography>
          <Typography
            variant="h4"
            sx={{
              color: "#555",
              fontWeight: "600",
              mt: 0.5,
              fontSize: "2.5rem",
            }}
          >
            {displayCurrency(data.netWorth)}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          mt: 6,
          display: "flex",
          flexFlow: "wrap",
          justifyContent: "space-between",
        }}
      >
        <TextInformationCard
          width="32%"
          label={"Total Bank Balance"}
          value={displayCurrency(getTotalValue(PortfolioTypeEnum.BankAccount))}
          icon={<AccountBalanceIcon sx={{ height: "100%", width: "100%" }} />}
          color="#7ca145"
        />
        <TextInformationCard
          width="32%"
          label={"Total Assets Value"}
          value={displayCurrency(getTotalValue(PortfolioTypeEnum.Asset))}
          icon={<PermMediaIcon sx={{ height: "100%", width: "100%" }} />}
          color="#4b70b4"
        />
        <TextInformationCard
          width="32%"
          label={"Total Investments"}
          value={displayCurrency(getTotalValue(PortfolioTypeEnum.Investment))}
          icon={<AssessmentIcon sx={{ height: "100%", width: "100%" }} />}
          color="#D65076"
        />
      </Box>

      {/* Bank Accounts */}
      <Typography
        variant="h6"
        sx={{ color: "#888", fontWeight: "600", mt: 4, ml: 1 }}
      >
        Bank Accounts
      </Typography>
      <Box
        sx={{
          mt: 1,
          display: "flex",
          flexFlow: "wrap",
          justifyContent: "space-between",
        }}
      >
        {data?.bankAccounts?.map((item) => {
          return (
            <PortfolioCard
              data={item}
              color="#88B04B"
              actionText="Update Bank Account"
              action={togglePortfolioItemModal}
              type={PortfolioTypeEnum.BankAccount}
            />
          );
        })}
        <PortfolioCard
          actionText="Add New Bank Account"
          action={togglePortfolioItemModal}
          type={PortfolioTypeEnum.BankAccount}
        />
      </Box>

      {/* Assets */}
      <Typography
        variant="h6"
        sx={{ color: "#888", fontWeight: "600", mt: 4, ml: 1 }}
      >
        Assets
      </Typography>
      <Box
        sx={{
          mt: 1,
          display: "flex",
          flexFlow: "wrap",
          justifyContent: "space-between",
        }}
      >
        {data?.assets?.map((item) => {
          return (
            <PortfolioCard
              data={item}
              color="#4b70b4"
              actionText="Update Asset"
              action={togglePortfolioItemModal}
              type={PortfolioTypeEnum.Asset}
            />
          );
        })}
        <PortfolioCard
          actionText="Add New Asset"
          action={togglePortfolioItemModal}
          type={PortfolioTypeEnum.Asset}
        />
      </Box>

      {/* Investments */}
      <Typography
        variant="h6"
        sx={{ color: "#888", fontWeight: "600", mt: 4, ml: 1 }}
      >
        Investments
      </Typography>
      <Box
        sx={{
          mt: 1,
          display: "flex",
          flexFlow: "wrap",
          justifyContent: "space-between",
        }}
      >
        {data?.investments?.map((item) => {
          return (
            <PortfolioCard
              data={item}
              color="#D65076"
              actionText="Update Investment"
              action={togglePortfolioItemModal}
              type={PortfolioTypeEnum.Investment}
            />
          );
        })}
        <PortfolioCard
          actionText="Add New Investment"
          action={togglePortfolioItemModal}
          type={PortfolioTypeEnum.Investment}
        />
      </Box>

      {/* Create and Update Portfolio Item Modal */}
      <Modal open={isPortfolioItemModalOpen}>
        <CreateUpdatePortfolioItemModal
          data={activeItemData}
          closeModal={togglePortfolioItemModal}
          action={upsertPortfolioItem}
          type={activeItemType}
        />
      </Modal>

      {/* Loading Modal */}
      <Modal open={isLoading}>
        <Loading />
      </Modal>
    </Box>
  );
}

export default Portfolio;
