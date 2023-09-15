import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function ContactsCard({ data }) {
  return (
    <>
      {data && (
        <Card sx={{ width: "18.5rem", mr: 4, mt: 2, bgcolor: "#eee" }}>
          <CardActionArea
            sx={{ display: "flex", flexDirection: "column", pt: 2 }}
          >
            <AccountCircleIcon
              sx={{
                width: 170,
                height: 170,
              }}
            />
            <CardContent sx={{ textAlign: "center", mt: 0, pt: 0 }}>
              <Typography gutterBottom sx={{ fontSize: 30, m: 0 }}>
                {data.name}
              </Typography>
              <Typography color="text.secondary">{data.designation}</Typography>
              <Typography sx={{ fontSize: 20, m: 0, color: "red" }}>
                {data.contactNo}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {data.email}
              </Typography>
              <Typography sx={{ fontSize: 16, mt: 1, lineHeight: 1.3 }}>
                {data.address}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      )}
    </>
  );
}
