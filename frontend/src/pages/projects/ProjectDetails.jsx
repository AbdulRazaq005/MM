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

function ProjectDetails() {
  let { id } = useParams();
  const categoriesNavigateUrl = "/projects/categories";
  const [data, setData] = useState({});
  const [render, setRender] = useState(0);
  const reRender = () => setRender(render + 1);
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

  const eventSlots = {
    date: ({ data }) => displayDate(data),
  };

  return (
    <Box sx={{ p: 4, color: "#444" }}>
      <Typography variant="h5" color="gray">
        Project Details
      </Typography>
      <Divider />

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h4" sx={{ mt: 3 }}>
          {data.name}
        </Typography>
        <Link to={window.location.pathname + "/edit"}>
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

          <AppCard
            action={() => setCreateCaregoryMode(true)}
            actionText={"Create New Category"}
          />
        </Box>
      </Box>

      {/* Create new Category Modal */}
      <Modal open={isCreateCaregoryMode} onClose={closeCreateCaregoryModal}>
        <CreateCategoryModal
          targetId={id}
          path={ProjectsUrl + "/add-category"}
          forceRender={reRender}
          closeModal={closeCreateCaregoryModal}
        />
      </Modal>
    </Box>
  );
}

export default ProjectDetails;
