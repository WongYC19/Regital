import {
  FormControl,
  FormControlLabel,
  Checkbox as MuiCheckbox,
} from "@mui/material";

function Checkbox(props) {
  const defaultProps = { color: "primary", checked: false };
  props = { ...defaultProps, ...props };

  return (
    <FormControl>
      <FormControlLabel
        control={<MuiCheckbox {...props} />}
        label={props.label}
      />
    </FormControl>
  );
}

export default Checkbox;
