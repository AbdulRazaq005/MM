import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useGlobalStore from "../store";

export default function AppCard({ data, url, actionText, action }) {
  const navigate = useNavigate();
  const addBreadCrumb = useGlobalStore((state) => state.addBreadCrumb);

  function onClickAction() {
    if (url) {
      const href = url + "/" + data._id;
      addBreadCrumb(data.name, href);
      navigate(href);
    }
    if (action) {
      action();
    }
  }

  return (
    <Card
      sx={{ width: "18.5rem", mr: 4, mt: 2, mb: 1 }}
      onClick={onClickAction}
    >
      {data ? (
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
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ whiteSpace: "break-spaces" }}
            >
              {data.description}
            </Typography>
          </CardContent>
        </CardActionArea>
      ) : (
        <CardActionArea
          sx={{
            py: 2,
            textAlign: "center",
            bgcolor: "#eee",
            height: "100%",
          }}
        >
          <Typography
            sx={{
              fontSize: 100,
              lineHeight: 0.75,
              color: "gray",
              fontFamily: "courier",
            }}
          >
            +
          </Typography>
          <Typography sx={{ color: "#555", fontSize: 20, my: 0.5 }}>
            {actionText}
          </Typography>
        </CardActionArea>
      )}
    </Card>
  );
}
