import { Box, Button, CardActionArea, Typography } from "@mui/material";
import React from "react";
import { displayCurrency } from "../helpers/displayFormatHelpers";
import EditIcon from "@mui/icons-material/Edit";

function PortfolioCard({ data, color, actionText, action, type }) {
  function onClickAction() {
    if (action) {
      action(type, data);
    }
  }

  return data ? (
    <Box
      sx={{
        bgcolor: "white",
        width: "49%",
        border: "#f3f3f3 solid 0.05rem",
        borderRadius: "0.75rem",
        boxShadow: "0px 10px 15px 5px #f5f5f5",
        px: 4,
        py: 2,
        my: 1,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box>
        <Typography
          variant="h6"
          sx={{
            color: "#444",
            fontWeight: "600",
          }}
        >
          {data.name}
        </Typography>
        {data.description && (
          <Typography
            sx={{
              color: "#888",
              fontWeight: "550",
            }}
          >
            {data.description}
          </Typography>
        )}
        <Typography
          variant="h5"
          sx={{
            fontSize: "1.5rem",
            color: color,
            fontWeight: "550",
            mt: 1,
            width: "100%",
            ml: "auto",
          }}
        >
          {displayCurrency(data.value)}
        </Typography>
      </Box>
      <Box>
        <Button
          onClick={onClickAction}
          sx={{
            bgcolor: "#f5f5f5",
            ml: 3,
            color: "grey",
          }}
        >
          <EditIcon />
        </Button>
      </Box>
    </Box>
  ) : (
    <CardActionArea
      onClick={onClickAction}
      sx={{
        width: "49%",
        border: "#eee solid 0.1rem",
        borderRadius: "0.75rem",
        boxShadow: "0px 10px 15px 5px #fff",
        textAlign: "center",
        bgcolor: "#eee",
        height: "100%",
        py: 2,
        my: 1,
      }}
    >
      <Typography
        sx={{
          fontSize: 100,
          lineHeight: 0.75,
          color: "grey",
          fontFamily: "courier",
        }}
      >
        +
      </Typography>
      <Typography sx={{ fontSize: 20, ml: 2, color: "grey" }}>
        {actionText}
      </Typography>
    </CardActionArea>
  );
}
// }

export default PortfolioCard;
