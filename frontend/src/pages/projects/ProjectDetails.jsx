import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAsync } from "../../services/apiHandlerService";
import { ProjectsUrl } from "../../Constants";
import { Box, Divider, Typography } from "@mui/material";
import Details from "../../components/Details";
import AppTable from "../../components/AppTable";
import ProjectsCard from "../../components/ProjectsCard";

function ProjectDetails() {
  let { id } = useParams();
  const [data, setData] = useState({});

  useEffect(() => {
    async function fetchData() {
      const url = ProjectsUrl + `/${id}`;
      const response = await getAsync(url);
      setData(response.payload);
      console.log("pageData: ", data);
    }
    fetchData();
    // eslint-disable-next-line
  }, []);
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5">Project Details</Typography>
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
      <AppTable data={data.events} columns={["name", "date", "description"]} />

      {data.categories && data.categories.length !== 0 && (
        <Box>
          <Typography sx={{ fontSize: 20, fontWeight: "600", mt: 5, mb: 0 }}>
            Categories
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexFlow: "wrap",
            }}
          >
            {data.categories.map((card) => {
              return <ProjectsCard key={card._id} project={card} />;
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default ProjectDetails;
