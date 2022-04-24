import {
  FormControl,
  FormLabel,
  RadioGroup as MuiRadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from "@mui/material";

const labelStyle = {
  fontWeight: "400",
};

function RadioGroup(props) {
  const defaultProps = {
    items: {},
    value: "",
    label: "",
  };
  props = { ...defaultProps, ...props };
  const { helperText, error, label, ...rest } = props;

  return (
    <FormControl error={error}>
      <FormLabel sx={labelStyle}>{label}</FormLabel>
      <MuiRadioGroup row {...rest}>
        {props.items.map((item) => (
          <FormControlLabel
            key={item.id}
            value={item.id}
            label={item.title}
            control={<Radio />}
          />
        ))}
      </MuiRadioGroup>
      {props.error ? <FormHelperText>{helperText}</FormHelperText> : null}
    </FormControl>
  );
}

export default RadioGroup;
