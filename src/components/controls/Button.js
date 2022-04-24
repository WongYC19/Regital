import { Button as MuiButton } from "@mui/material";
import { styled } from "@mui/system";

const StyledButton = styled(MuiButton, { name: "controlButton", slot: "root" })(
  ({ theme }) => ({
    padding: theme.spacing(1.25, 3),
    boxShadow: theme.shadows[1],
    textTransform: "none",

    "&:hover": {
      background: theme.palette.primary.hover,
      color: theme.palette.primary.contrastText,
    },
  })
);

export const buttonStyle = {
  boxShadow: (theme) => theme.shadows[7],

  background: (theme) =>
    `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,

  "&:hover": {
    background: (theme) =>
      `linear-gradient(45deg, ${theme.palette.secondary.hover} 20%, ${theme.palette.primary.hover} 90%)`,
  },

  padding: (theme) => theme.spacing(1.5, 2.5),
  width: "100%",
};

function Button(props) {
  const defaultProps = {
    children: "",
    size: "large",
    color: "primary",
    variant: "contained",
  };

  props = { ...defaultProps, ...props };
  return <StyledButton {...props} />;
}

export default Button;
