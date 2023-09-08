import React, { useEffect, useState } from "react";
import { getAsync } from "../../services/apiHandlerService";
import { ProjectsUrl } from "../../Constants";
import { Box, Divider, Typography } from "@mui/material";
import ProjectsCard from "../../components/ProjectsCard";

function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await getAsync(ProjectsUrl);
      setProjects(response.payload);
      console.log(projects);
    }
    fetchData();
    // eslint-disable-next-line
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">Projects</Typography>
      <Divider />
      <Box
        sx={{
          display: "flex",
          flexFlow: "wrap",
        }}
      >
        {projects.map((project) => {
          return <ProjectsCard project={project} />;
        })}
      </Box>
    </Box>
  );
}

export default Projects;
