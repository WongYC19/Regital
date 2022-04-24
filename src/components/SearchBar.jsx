import { OutlinedInput, InputAdornment, IconButton } from "@mui/material";
import { Cancel as CancelIcon } from "@mui/icons-material";

export default function SearchBar(props) {
  const {
    id = "outlined-search",
    label = "Search field",
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
      sx={{ borderColor: (theme) => theme.palette.secondary.main }}
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
