import {
  TextField,
  InputAdornment,
  FormLabel,
  FormControl,
  IconButton,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";

const inputStyle = {
  padding: 5,
};

const labelStyle = {
  fontWeight: "700",
  marginBottom: "5px",
  display: "block",
};

function PasswordEye(props) {
  const { showPassword, setShowPassword } = props;
  const toggleShowPassword = (event) => setShowPassword(!showPassword);

  return (
    <InputAdornment position="end">
      <IconButton
        aria-label="toggle password visibility"
        onClick={toggleShowPassword}
        edge="end"
        sx={{ color: (theme) => theme.palette.secondary.contrastText }}
      >
        {showPassword ? <Visibility /> : <VisibilityOff />}
      </IconButton>
    </InputAdornment>
  );
}

function Input(props) {
  const defaultProps = {
    variant: "outlined",
    size: "medium",
    color: "primary",
    label: "",
    name: "",
    focus: "false",
    type: "text",
  };

  props = { ...defaultProps, ...props };
  const { label, required, focus, adornments, type, ...rest } = props;
  const [showPassword, setShowPassword] = useState(false);
  const passwordProp = { showPassword, setShowPassword };

  return (
    <FormControl>
      <FormLabel
        sx={labelStyle}
        children={label}
        filled={true}
        required={required}
        focus={focus}
      />
      <TextField
        {...rest}
        type={showPassword ? "text" : type}
        inputProps={{
          style: inputStyle,
        }}
        InputProps={{
          endAdornment: adornments ? <PasswordEye {...passwordProp} /> : null,
        }}
      />
    </FormControl>
  );
}

export default Input;
