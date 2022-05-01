import { OutlinedInput, InputAdornment, IconButton } from "@mui/material";
import { Cancel as CancelIcon } from "@mui/icons-material";

export default function SearchBar(props) {
  const {
    id = "outlined-search",
    label = "Search field",
    variant = "contained",
    value,
    onChange = () => {},
    onCancelSearch = () => {},
    ...rest
  } = props;

  return (
    <OutlinedInput
      id={id}
      value={value}
      label={label}
      type="text"
      variant={variant}
      autoFocus
      notched
      sx={{
        borderColor: (theme) => theme.palette.secondary.main,
        "& legend": {
          visibility: "visible",
        },
      }}
      onChange={onChange}
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            onClick={onCancelSearch}
            edge="end"
            sx={{ color: (theme) => theme.palette.primary.main }}
          >
            <CancelIcon />
          </IconButton>
        </InputAdornment>
      }
      {...rest}
    />
  );
}
