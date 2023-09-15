import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAsync } from "../../services/apiHandlerService";
import { CategoriesUrl } from "../../Constants";
import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import Details from "../../components/Details";
import AppTable from "../../components/AppTable";
import ProjectsCard from "../../components/ProjectsCard";
import axios from "axios";

function CategoryDetails() {
  let { id } = useParams();
  const categoriesNavigateUrl = "/projects/categories";
  const [data, setData] = useState({});
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [estimate, setEstimate] = useState(0);
  const [message, setMessage] = useState("");
  const [isCreateCaregory, setIsCreateCaregory] = useState(false);
  const [render, setRender] = useState(0);

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

  const submitCreateNewCategory = (e) => {
    e.preventDefault();
    if (!(name && description)) {
      setMessage("Please complete all fields");
    } else if (isNaN(Number(estimate))) {
      setMessage("Please enter a valid Estimate amount");
    } else {
      axios
        .post(CategoriesUrl + "/add-category", {
          categoryId: id,
          name,
          description,
          estimate,
        })
        .then((response) => {
          setMessage("Category Created Successfully.");
          console.log(response);
          setIsCreateCaregory(!isCreateCaregory);
          setRender(render + 1);
        })
        .catch((error) => {
          setMessage(error.response.data.message);
          console.log(error);
        });
    }
  };

  function createNewCategoryComponent() {
    if (isCreateCaregory) {
      return (
        <Box
          sx={{
            pt: 3,
            width: "25rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography component="h1" variant="h6">
            Create New Category
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
              onChange={(e) => {
                setEstimate(e.target.value);
              }}
            />
            <Typography sx={{ color: "red" }}>{message}</Typography>
            <Button
              type="submit"
              fullWidth
              color="success"
              variant="contained"
              sx={{ mt: 2, mb: 2 }}
            >
              CREATE
            </Button>
          </Box>
        </Box>
      );
    }
    return <></>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" color="gray">
        Category Details
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
      <AppTable data={data.events} columns={["name", "date", "description"]} />

      <Box sx={{ mt: 3 }}>
        <Divider />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Typography sx={{ fontSize: 25, fontWeight: "600" }}>
            Categories
          </Typography>
          <Button
            variant="contained"
            color={isCreateCaregory ? "error" : "success"}
            size="small"
            onClick={() => {
              setIsCreateCaregory(!isCreateCaregory);
            }}
          >
            {isCreateCaregory ? "Cancel" : "Create Contact"}
          </Button>
        </Box>
        {createNewCategoryComponent()}
        {data.categories && data.categories.length !== 0 && (
          <Box
            sx={{
              display: "flex",
              flexFlow: "wrap",
            }}
          >
            {data.categories.map((card) => {
              return (
                <ProjectsCard
                  key={card._id}
                  data={card}
                  url={categoriesNavigateUrl}
                />
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default CategoryDetails;
