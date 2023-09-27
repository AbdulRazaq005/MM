import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AppCard({ data, url }) {
  const navigate = useNavigate();
  function navigateToProjectDetails() {
    navigate(url + `/${data._id}`);
  }

  return (
    <>
      {data && (
        <Card
          sx={{ width: "18.5rem", mr: 4, mt: 2, mb: 1 }}
          onClick={navigateToProjectDetails}
        >
          <CardActionArea>
            <CardMedia
              component="img"
              height="140"
              image="https://source.unsplash.com/random?wallpapers"
              alt="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {data.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {data.description}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      )}
    </>
  );
}
