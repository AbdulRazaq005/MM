import React, { useEffect } from "react";
import { getAsync } from "../../services/apiHandlerService";
import { ProjectsUrl } from "../../Constants";

function Projects() {
  useEffect(() => {
    async function fetchData() {
      await getAsync(ProjectsUrl);
    }
    fetchData();
  }, []);
  return <div>Projects</div>;
}

export default Projects;
