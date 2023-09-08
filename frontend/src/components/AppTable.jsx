import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Divider, Typography } from "@mui/material";

export default function AppTable({ data, columns }) {
  return (
    <>
      {data && Array.isArray(data) && data.length !== 0 && (
        <Box>
          <Typography sx={{ fontSize: 20, fontWeight: "600", mt: 4 }}>
            Events
          </Typography>
          <TableContainer component={Paper} size="small" sx={{ mt: 2 }}>
            <Table aria-label="simple table" size="small">
              <TableHead sx={{ bgcolor: "#c2c2c2" }}>
                <TableRow>
                  {columns.map((column) => {
                    return (
                      <TableCell key={column}>
                        <Typography sx={{ fontSize: 20, fontWeight: "600" }}>
                          {column}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => {
                  return (
                    <TableRow key={row[columns[0]]}>
                      {columns.map((col) => {
                        return <TableCell>{row[col]}</TableCell>;
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </>
  );
}
