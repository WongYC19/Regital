import { Grid, Alert, AlertTitle } from "@mui/material";
import { toTitleCase } from "../utils/caseConversion";

export default function AlertBox(props) {
  const { selection, setSelection } = props;
  const { severity = "info", message } = selection;
  const closeAlert = () => setSelection((prev) => ({ ...prev, message: null }));
  return !message ? null : (
    <Grid container flexDirection="column">
      <Alert onClose={closeAlert} severity={severity}>
        <AlertTitle>{toTitleCase(severity)}</AlertTitle>
        {message}
      </Alert>
    </Grid>
  );
}
