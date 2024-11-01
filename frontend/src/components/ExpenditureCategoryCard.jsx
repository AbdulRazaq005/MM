import { Box, Button, CardActionArea, Typography } from "@mui/material";
import React from "react";
import { displayCurrency } from "../helpers/displayFormatHelpers";
import EditIcon from "@mui/icons-material/Edit";

function ExpenditureCategoryCard({
  data,
  value,
  color,
  actionText,
  action,
  type,
  isEditMode,
}) {
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
        px: 2.5,
        py: 1,
        my: 1,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box>
        <Typography
          // variant="h7"
          sx={{
            color: "#444",
            fontSize: "1.2rem",
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
      </Box>
      <Box sx={{ bgcolor: "", display: "flex" }}>
        <Typography
          variant="h5"
          sx={{
            fontSize: "1.4rem",
            color: color,
            fontWeight: "550",
            mt: 1,
            width: "100%",
            ml: "auto",
          }}
        >
          {displayCurrency(value)}
        </Typography>
        {isEditMode && (
          <Button
            onClick={onClickAction}
            sx={{
              bgcolor: "#f1f1f1",
              ml: 3,
              color: "grey",
            }}
          >
            <EditIcon />
          </Button>
        )}
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
        display: "flex",
        alignItems: "center",
      }}
    >
      <Typography
        sx={{
          fontSize: 50,
          lineHeight: 0.75,
          color: "grey",
          fontFamily: "courier",
        }}
      >
        +
      </Typography>
      <Typography
        sx={{
          fontSize: 20,
          ml: 2,
          color: "grey",
        }}
      >
        {actionText}
      </Typography>
    </CardActionArea>
  );
}
// }

export default ExpenditureCategoryCard;
