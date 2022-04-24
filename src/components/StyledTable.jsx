import { styled } from "@mui/system";
import {
  TableRow,
  TableCell,
  tableCellClasses,
  Typography,
} from "@mui/material";

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.table,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.background.table,

    "& td": {
      color: theme.palette.common.black,
    },
  },

  "& .MuiSvgIcon-root": {
    color: theme.palette.secondary.main,
  },

  "& .MuiButtonBase-root:disabled .MuiSvgIcon-root": {
    color: theme.palette.text.disabled,
  },

  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.secondary.hover,

    td: {
      color: theme.palette.text.primary,
    },
  },

  "&:hover": {
    td: {
      color: theme.palette.background.paper,
    },

    "& .MuiButtonBase-root:disabled .MuiSvgIcon-root": {
      color: theme.palette.text.disabled,
    },

    backgroundColor: theme.palette.secondary.table,
  },

  "& .MuiButtonBase-root:hover": {
    backgroundColor: theme.palette.primary.main,

    ".MuiSvgIcon-root": {
      color: theme.palette.text.primary,
    },
  },

  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export function StyledEmptyRows({ columnCounts = 1 }) {
  return (
    <StyledTableRow>
      <StyledTableCell>
        <Typography variant="h6" fontSize={14}>
          No record found.
        </Typography>
      </StyledTableCell>

      {[...Array(columnCounts - 1).keys()].map((item, index) => {
        return <StyledTableCell key={index}></StyledTableCell>;
      })}
    </StyledTableRow>
  );
}
