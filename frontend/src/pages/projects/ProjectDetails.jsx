import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAsync } from "../../services/apiHandlerService";
import { ProjectsUrl } from "../../Constants";
import Details from "../../components/Details";
import AppTable from "../../components/AppTable";
import AppCard from "../../components/AppCard";
import { displayDate } from "../../helpers/dateTimeHelpers";
import { Box, Modal, Divider, Typography, Button } from "@mui/material";
import CreateCategoryModal from "../../components/CreateCategoryModal";
import { modalContainerStyle } from "../../helpers/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { displayCurrency } from "../../helpers/displayFormatHelpers";
import Loading from "../../components/Loading";

function ProjectDetails() {
  let { id } = useParams();
  const navigate = useNavigate();
  const categoriesNavigateUrl = "/projects/categories";
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [render, setRender] = useState(0);
  const reRender = () => setRender(render + 1);
  const [isCreateCategoryMode, setCreateCategoryMode] = useState(false);
  const closeCreateCategoryModal = () =>
    setCreateCategoryMode(!isCreateCategoryMode);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const closeDeleteModal = () => {
    setDeleteMessage("");
    setIsDeleteMode(false);
  };
  const [deleteMessage, setDeleteMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      const url = ProjectsUrl + `/${id}`;
      setIsLoading(true);
      const response = await getAsync(url);
      setData(response.payload);
      setIsLoading(false);
      // console.log("pageData: ", data);
    }
    fetchData();
    // eslint-disable-next-line
  }, [render]);

  const eventSlots = {
    date: ({ data }) => displayDate(data),
  };

  function submitDeleteProject(e) {
    e.preventDefault();
    let isDeleteAllowed = true;
    if (data.categories?.length) {
      setDeleteMessage("Project having sub-categories cannot be deleted.");
      isDeleteAllowed = false;
      return;
    }
    if (isDeleteAllowed) {
      axios
        .delete(ProjectsUrl + `/${id}`)
        .then((response) => {
          setDeleteMessage("Project Deleted Successfully");
          console.log(response);
          setIsDeleteMode(false);
          navigate("/projects");
        })
        .catch((error) => {
          setDeleteMessage(error.response.data.message);
          console.log(error);
        });
    }
  }

  return (
    <Box sx={{ px: 4, py: 2, color: "#444" }}>
      <Typography variant="h5" color="gray">
        Project Details
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
      <Typography
        paragraph="true"
        variant="h6"
        sx={{ mt: 1, whiteSpace: "break-spaces" }}
      >
        {data.description}
      </Typography>
      {data.vendor?.name && (
        <Typography variant="h6" sx={{ mt: 0 }}>
          Vendor : {data.vendor?.name}
        </Typography>
      )}
      <Typography variant="h6" sx={{ mt: 0, color: "green" }}>
        Estimate : {displayCurrency(data.estimate)}
      </Typography>
      <Typography variant="h6" sx={{ mb: 1, color: "#b84300" }}>
        Total Cost : {displayCurrency(data.totalCost)}
      </Typography>

      <Details data={data.details} />
      <AppTable
        name="Event Details"
        data={data.events}
        columns={["name", "date", "description"]}
        slots={eventSlots}
      />

      <Box sx={{ mt: 5, mb: 2 }}>
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

          <AppCard
            action={() => setCreateCategoryMode(true)}
            actionText={"Create New Category"}
          />
        </Box>
      </Box>

      <Divider />
      <Box sx={{ display: "flex" }}>
        <Button
          color="error"
          variant="outlined"
          sx={{ my: 2, ml: "auto" }}
          onClick={() => setIsDeleteMode(true)}
        >
          Delete Project
        </Button>
      </Box>

      {/* Create new Category Modal */}
      <Modal open={isCreateCategoryMode} onClose={closeCreateCategoryModal}>
        <CreateCategoryModal
          targetId={id}
          path={ProjectsUrl + "/add-category"}
          forceRender={reRender}
          closeModal={closeCreateCategoryModal}
        />
      </Modal>

      {/* Delete Category Modal */}
      <Modal open={isDeleteMode} onClose={closeDeleteModal}>
        <Box
          sx={{
            ...modalContainerStyle,
          }}
        >
          <Typography variant="h6" sx={{ mt: 1 }}>
            Are you sure you want to delete{" "}
            <Typography variant="a" sx={{ color: "blue" }}>
              {data.name}
            </Typography>{" "}
            project ?
          </Typography>
          <Typography sx={{ color: "red", mt: 1 }}>{deleteMessage}</Typography>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              color="grey"
              variant="contained"
              sx={{ mt: 2, mb: 2, mr: 2, bgcolor: "#fff" }}
              onClick={closeDeleteModal}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{ mt: 2, mb: 2 }}
              onClick={(e) => submitDeleteProject(e)}
            >
              Confirm Delete
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Loading Modal */}
      <Modal open={isLoading}>
        <Loading />
      </Modal>
    </Box>
  );
}

export default ProjectDetails;
