// import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Typography } from "@mui/material";
import { toTitleCase } from "../helpers/tableHelpers";
import { TransactionTypeEnum } from "../helpers/enums";
import { displayCurrency } from "../helpers/displayFormatHelpers";
import { useEffect } from "react";
import { useState } from "react";
import { isNumber } from "lodash";

export default function AppTable({
  name,
  showTotal = false,
  data,
  options,
  columns,
  slots = {}, // Should be object of functions with names same as column names and all functions take (column value, row) as parameter.
  customColumns = {}, // Should be object of strings with key names same as column names.
}) {
  const [total, setTotal] = useState(0);
  const calculateTotal = (transactions) => {
    let _total = transactions?.reduce((cumulativeTotal, transaction) => {
      let amount = transaction.amount;
      if (transaction.typeEnum === TransactionTypeEnum.Credit)
        return cumulativeTotal - amount;
      else return cumulativeTotal + amount;
    }, 0);
    return _total;
  };

  useEffect(() => {
    setTotal(calculateTotal(data));
  }, [data]);

  function slot(column, row = {}) {
    const object = { data: row[column], rowData: row, options };
    return slots[column]?.(object) ?? row[column];
  }

  return (
    <>
      {data && Array.isArray(data) && data.length !== 0 && (
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              sx={{ fontSize: 23, fontWeight: "600", mt: 5, color: "#555" }}
            >
              {name}
            </Typography>
            {showTotal && isNumber(total) && (
              <Typography
                sx={{
                  mt: 5,
                  pr: "2rem",
                  fontSize: 20,
                  width: "100%",
                  textAlign: "right",
                  fontWeight: 600,
                }}
              >
                Total : {displayCurrency(total)}
              </Typography>
            )}
          </Box>
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
                          <TableCell key={column}>
                            <Typography
                              sx={{
                                fontSize: 17,
                                color: "#555",
                                ml: 0,
                              }}
                            >
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
