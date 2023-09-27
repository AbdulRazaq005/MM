import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAsync } from "../../services/apiHandlerService";
import { ProjectsUrl } from "../../Constants";
import Details from "../../components/Details";
import AppTable from "../../components/AppTable";
import AppCard from "../../components/AppCard";
import axios from "axios";
import { displayDate } from "../../helpers/dateTimeHelpers";
import { modalContainerStyle } from "../../helpers/styles";
import {
  Box,
  Button,
  Card,
  Modal,
  Divider,
  TextField,
  Typography,
} from "@mui/material";

function ProjectDetails() {
  let { id } = useParams();
  const categoriesNavigateUrl = "/projects/categories";
  const [data, setData] = useState({});
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [estimate, setEstimate] = useState(0);
  const [message, setMessage] = useState("");
  const [render, setRender] = useState(0);
  const [isCreateCaregoryMode, setCreateCaregoryMode] = useState(false);
  const closeCreateCaregoryModal = () =>
    setCreateCaregoryMode(!isCreateCaregoryMode);

  useEffect(() => {
    async function fetchData() {
      const url = ProjectsUrl + `/${id}`;
      const response = await getAsync(url);
      setData(response.payload);
      // console.log("pageData: ", data);
    }
    fetchData();
    // eslint-disable-next-line
  }, [render]);

  const submitCreateNewCategory = (e) => {
    e.preventDefault();
    if (!(name && description)) {
      setMessage("Please complete all fields");
    } else if (isNaN(Number(estimate))) {
      setMessage("Please enter a valid Estimate amount");
    } else {
      axios
        .post(ProjectsUrl + "/add-category", {
          projectId: id,
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

  const eventSlots = {
    date: ({ data }) => displayDate(data),
  };

  return (
    <Box sx={{ p: 4, color: "#444" }}>
      <Typography variant="h5" color="gray">
        Project Details
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
        slots={eventSlots}
      />

      <Box sx={{ mt: 5 }}>
        <Typography
          sx={{ fontSize: 23, fontWeight: "600", color: "#555", mb: 0 }}
        >
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
            Create new Category
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
                  setCreateCaregoryMode(!isCreateCaregoryMode);
                }}
              >
                CANCEL
              </Button>
              <Button
                type="submit"
                // color="success"
                variant="contained"
                sx={{ mt: 2, mb: 2 }}
              >
                CREATE
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default ProjectDetails;
