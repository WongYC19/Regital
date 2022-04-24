import { styled } from "@mui/system";

const CenteredContainer = styled("div", {
  name: "centeredContainer",
  slot: "root",
})(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  spacing: 0,
  margin: 0,
  minHeight: "100vh",
  rowGap: theme.spacing(1),
}));

export default CenteredContainer;
