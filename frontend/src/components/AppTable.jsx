import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Typography } from "@mui/material";
import { toTitleCase } from "../helpers/tableHelpers";

export default function AppTable({
  name,
  data,
  columns,
  slots = {}, // Should be object of functions with names same as column names and all functions take column value as parameter.
  customColumns = {}, // Should be object of strings with key names same as column names.
}) {
  function slot(column, row = {}) {
    const object = { data: row[column], rowData: row };
    return slots[column]?.(object) ?? row[column];
  }

  return (
    <>
      {data && Array.isArray(data) && data.length !== 0 && (
        <Box>
          <Typography
            sx={{ fontSize: 23, fontWeight: "600", mt: 5, color: "#555" }}
          >
            {name}
          </Typography>
          <TableContainer component={Paper} size="small" sx={{ mt: 2 }}>
            <Table aria-label="simple table" size="small">
              <TableHead sx={{ bgcolor: "#ededed" }}>
                <TableRow sx={{ border: "1 solid black" }}>
                  {columns.map((column) => {
                    return (
                      <TableCell key={column}>
                        <Typography
                          sx={{
                            fontSize: 18,
                            fontWeight: "600",
                            color: "#595959",
                          }}
                        >
                          {customColumns[column] ?? toTitleCase(column)}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody sx={{ bgcolor: "#fff" }}>
                {data.map((row) => {
                  return (
                    <TableRow key={row[columns[0]]}>
                      {columns.map((column) => {
                        return (
                          <TableCell>
                            <Typography sx={{ fontSize: 17, color: "#555" }}>
                              {slot(column, row)}
                            </Typography>
                          </TableCell>
                        );
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
