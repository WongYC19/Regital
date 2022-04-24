import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  FormHelperText,
} from "@mui/material";

function Select(props) {
  let { name, label, value, error = null, onChange, options } = props;

  options = [{ id: "default", value: "", title: "None" }].concat(options);

  return (
    <FormControl variant="outlined" {...(error && { error: true })}>
      <InputLabel>{label}</InputLabel>
      <MuiSelect label={label} name={name} value={value} onChange={onChange}>
        {options.map((item) => (
          <MenuItem key={item.id} value={item.value}>
            {item.title}
          </MenuItem>
        ))}
      </MuiSelect>

      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}

export default Select;
