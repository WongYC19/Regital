import {
  Alert as MuiAlert,
  AlertTitle,
  Box,
  Collapse,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";

import { useState } from "react";

function CloseIcon(props) {
  return (
    <IconButton
      aria-label="close"
      color="inherit"
      size="small"
      onClick={props.closeBox}
    >
      <Close fontSize="inherit" />
    </IconButton>
  );
}
export default function Alert(props) {
  const {
    title = "Operation Success",
    message = "Success.",
    variant = "filled",
    severity = "success",
    showDefault = false,
  } = props;

  const [showBox, setShowBox] = useState(showDefault);
  const closeBox = () => {
    setShowBox(false);
  };

  const alertStyle = {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    position: "absolute",
    zIndex: 1,
  };

  return (
    <Box sx={alertStyle}>
      <Collapse in={showBox}>
        <MuiAlert
          variant={variant}
          severity={severity}
          action={<CloseIcon closeBox={closeBox} />}
        >
          <AlertTitle>{title}</AlertTitle>
          {message}
        </MuiAlert>
      </Collapse>
    </Box>
  );
}
