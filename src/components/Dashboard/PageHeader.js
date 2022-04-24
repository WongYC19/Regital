import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import {
  AppBar,
  Avatar,
  Button,
  IconButton,
  Link,
  Grid,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

import ThemeTogglerIcon from "./ThemeTogglerIcon";
import WidgetsIcon from "@mui/icons-material/Widgets";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import ProfilePicture from "../controls/ProfilePicture";
import { styled } from "@mui/system";

const CustomAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "width",
})(({ theme, open, width }) => ({
  backgroundColor: theme.palette.primary.main,
  padding: 0,
  margin: 0,
  width: open && `calc('100%' - ${width})`,
  // marginRight: open && width,
}));

const CustomToolBar = styled(Toolbar, { name: "toolBar", slot: "root" })(
  ({ theme }) => ({
    ...theme.mixins.toolbar,
  })
);

function PageHeader(props) {
  const { open, toggleDrawer, drawerWidth } = props;
  const { logoutUser } = useContext(AuthContext);

  return (
    <CustomAppBar
      position="fixed"
      enableColorOnDark
      width={drawerWidth}
      open={open}
    >
      <CustomToolBar>
        <Grid
          container
          flexDirection="row"
          justifyContent="flex-start"
          sx={{
            display: open ? "none" : "flex",
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer()}
            edge="start"
          >
            <WidgetsIcon />
          </IconButton>

          <Typography variant="h6" lineHeight={2} sx={{ marginLeft: "5px" }}>
            <Link underline="hover" color="primary.contrastText" href="/">
              Welcome To Regital
            </Link>
          </Typography>
        </Grid>

        <Grid container justifyContent="flex-end" sx={{ marginRight: "auto" }}>
          <ThemeTogglerIcon />

          <Link underline="none" href="/profile">
            <Tooltip title="Update your profile">
              <IconButton size="medium">
                <ProfilePicture />
              </IconButton>
            </Tooltip>
          </Link>

          <Tooltip title="Logout">
            <Button size="medium" onClick={logoutUser}>
              <Avatar
                sx={(theme) => ({
                  backgroundColor: theme.palette.secondary.main,
                })}
              >
                <ExitToAppIcon />
              </Avatar>
            </Button>
          </Tooltip>
        </Grid>
      </CustomToolBar>
    </CustomAppBar>
  );
}

export default PageHeader;
