import { Avatar, Grid, Link, Typography } from "@mui/material";

import Control from "../components/controls/Control";
import CenteredContainer from "../components/CenteredContainer";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ThemeTogglerIcon from "../components/Dashboard/ThemeTogglerIcon";

import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import AuthService from "../services/auth.service";
import { loginValidator } from "../utils/formValidation";

function LoginPage() {
  const { loginUser } = useContext(AuthContext);
  const CSRFToken = AuthService.CSRFToken;

  return (
    <CenteredContainer>
      <Typography variant="h5">
        Welcome to Regital Portal <ThemeTogglerIcon />
      </Typography>
      <Avatar
        sx={{
          mt: 1,
          bgcolor: "secondary.main",
          p: 2.5,
        }}
      >
        <AccountCircleIcon
          sx={{ color: "background.default" }}
          fontSize="large"
        />
      </Avatar>

      <Control.Form
        onSubmit={loginUser}
        validator={loginValidator}
        successMessage="Login success. Redirecting to dashboard."
        redirectOnSuccess="/"
      >
        <CSRFToken />
        <Grid container direction="column" rowGap={4} spacing={0}>
          <Typography align="center" variant="h5">
            Sign In
          </Typography>

          <Grid
            item
            xs={12}
            sx={{ "& .MuiFormControl-root": { width: "100%" } }}
          >
            <Control.Input
              type="text"
              label="Email"
              variant="outlined"
              name="email"
              placeholder="johnsmith@mail.com"
              autoComplete="email"
              required
            />
          </Grid>

          <Grid
            item
            xs={12}
            width="inherit"
            sx={{ "& .MuiFormControl-root": { width: "100%" } }}
          >
            <Control.Input
              label="Password"
              type="password"
              name="password"
              variant="outlined"
              placeholder="Enter Password"
              autoComplete="current-password"
              required
              adornments={true}
            />
          </Grid>

          <Grid item justifyContent="center" xs={12} width="inherit">
            <Control.Button
              variant="contained"
              type="submit"
              sx={Control.buttonStyle}
            >
              Log In
            </Control.Button>
          </Grid>

          <Grid
            container
            direction="row"
            justifyContent="space-between"
            columnGap={15}
          >
            <Grid item>
              <Typography variant="initial" sx={{ color: "text.secondary" }}>
                Don't have an account?{" "}
                <Link underline="always" color="text.primary" href="/signup">
                  Sign up
                </Link>
              </Typography>
            </Grid>

            <Grid item>
              <Link
                underline="always"
                href="/password_reset"
                color="text.primary"
              >
                Forgot Password?
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Control.Form>
    </CenteredContainer>
  );
}

export default LoginPage;
