import React from "react";
import { useParams } from "react-router-dom";

function ProjectDetails() {

  let { id } = useParams();
  return <div>Project Details : {id}</div>;
}

export default ProjectDetails;
