import { styled } from "@mui/system";

import { IconButton } from "@mui/material";

const StyledIconButton = styled(IconButton, {
  name: "icon-button",
  slot: "root",
})(({ theme }) => ({
  "&:hover": {
    // backgroundColor: theme.palette.primary.contrastText,
    // backgroundColor: theme.palette.secondary.contrastText,
    // ".MuiSvgIcon-root": {
    //   color: theme.palette.secondary.hover,
    // },
  },
}));

export default StyledIconButton;
