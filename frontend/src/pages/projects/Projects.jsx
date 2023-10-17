import React, { useEffect, useState } from "react";
import { getAsync } from "../../services/apiHandlerService";
import { ProjectsUrl } from "../../Constants";
import { Box, CardMedia, Divider, Modal, Typography } from "@mui/material";
import AppCard from "../../components/AppCard";
import CreateProjectModal from "../../components/CreateProjectModal";
import { modalContainerStyle } from "../../helpers/styles";
import loadingGif from "../../assets/images/loading1.gif"

function Projects() {
  const categoriesNavigateUrl = "/projects";
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [isCreateProjectMode, setCreateProjectMode] = useState(false);
  const closeCreateProjectModal = () => setCreateProjectMode(false);
  const [render, setRender] = useState(0);
  const reRender = () => setRender(render + 1);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const response = await getAsync(ProjectsUrl);
      setProjects(response.payload);
      setIsLoading(false);
      // console.log({projects});
    }
    fetchData();
    // eslint-disable-next-line
  }, [render]);

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
          return (
            <AppCard
              data={project}
              url={categoriesNavigateUrl}
              key={project._id}
            />
          );
        })}

        <AppCard
          action={() => setCreateProjectMode(true)}
          actionText={"Create New Project"}
        />
      </Box>

      {/* Create new Category Modal */}
      <Modal open={isCreateProjectMode} onClose={closeCreateProjectModal}>
        <CreateProjectModal
          path={ProjectsUrl}
          forceRender={reRender}
          closeModal={closeCreateProjectModal}
        />
      </Modal>

      {/* Loading Modal */}
      <Modal open={isLoading}>
        <Box
          sx={{
            ...modalContainerStyle,
            height: "15rem",
            width: "15rem",
            bgcolor: "transparent",
            boxShadow: 0,
          }}
        >
          <CardMedia
            component="img"
            image={loadingGif}
            alt="Loading..."
          />
          <Typography variant="h4" color="white">
            LOADING...
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
}

export default Projects;
