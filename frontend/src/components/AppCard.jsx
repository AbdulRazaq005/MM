import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useGlobalStore from "../store";
import { displayCurrency } from "../helpers/displayFormatHelpers";

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
            image="https://plus.unsplash.com/premium_photo-1673697239995-b47ddb416705?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
            {data.estimate !== undefined && (
              <Typography sx={{ mt: 1, color: "grey" }}>
                Estimate : {displayCurrency(data.estimate)}
              </Typography>
            )}
            {data.totalCost !== undefined && (
              <Typography sx={{ mt: 0, color: "red" }}>
                Total Cost : {displayCurrency(data.totalCost)}
              </Typography>
            )}
            {data.totalCost !== undefined && data.estimate !== undefined && (
              <Typography sx={{ mt: 0, color: "green" }}>
                Remaining : {displayCurrency(data.estimate - data.totalCost)}
              </Typography>
            )}
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
