import { Brightness4, Brightness7 } from "@material-ui/icons";
import { ColorModeContext } from "../../contexts/ThemeContext";
import { useTheme } from "@mui/material/styles";
import { useContext } from "react";
import { Tooltip, IconButton } from "@mui/material";

import { styled } from "@mui/system";

export function ThemeTogglerIcon() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const ToggleIcon = styled(IconButton)(({ theme }) => ({
    color: "background.default",
    borderRadius: "50%",
    padding: theme.spacing(1),

    "& .MuiSvgIcon-root": {
      fontSize: 2.5 * theme.typography.fontSize,
    },
  }));

  const SunIcon = styled(Brightness7)(({ theme }) => ({
    color: theme.palette.toggleIcon.main,
  }));

  const MoonIcon = styled(Brightness4)(({ theme }) => ({
    color: theme.palette.toggleIcon.main,
  }));

  return (
    <ToggleIcon onClick={colorMode.toggleColorMode}>
      <Tooltip
        arrow
        title={`Switch to ${
          theme.palette.mode === "dark" ? "light" : "dark"
        } mode`}
      >
        {theme.palette.mode === "light" ? <SunIcon /> : <MoonIcon />}
      </Tooltip>
    </ToggleIcon>
  );
}

export default ThemeTogglerIcon;
