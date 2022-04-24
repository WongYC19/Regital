import CenteredContainer from "../components/CenteredContainer";
import Control from "../components/controls/Control";
import { Avatar, Grid, Link, Typography } from "@mui/material";
import AuthService from "../services/auth.service";
import ThemeTogglerIcon from "../components/Dashboard/ThemeTogglerIcon";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { registerValidator } from "../utils/formValidation";

function SignUpPage() {
  // const { signUpUser } = useContext(AuthContext);
  const CSRFToken = AuthService.CSRFToken;

  return (
    <CenteredContainer>
      <Typography variant="h5">
        Welcome to Regital Portal <ThemeTogglerIcon />
      </Typography>

      <Avatar
        sx={{
          mt: 0.5,
          bgcolor: "secondary.main",
          p: 2.5,
        }}
      >
        <HowToRegIcon />
      </Avatar>

      <Control.Form
        onSubmit={AuthService.signUp}
        validator={registerValidator}
        redirectOnSuccess="/login"
        successMessage="Account registered successfully. Redirecting to login page."
      >
        <CSRFToken />

        <Grid
          container
          direction="column"
          alignItems="space-between"
          rowSpacing={4}
        >
          <Grid item>
            <Typography align="center" variant="h5">
              Sign Up
            </Typography>
          </Grid>

          <Grid item sx={{ "& .MuiFormControl-root": { width: "100%" } }}>
            <Control.Input
              type="email"
              name="email"
              id="email"
              label="Email Address"
              placeholder="Email Address"
              autoComplete="email"
              required
            />
          </Grid>
          <Grid item sx={{ "& .MuiFormControl-root": { width: "100%" } }}>
            <Control.Input
              type="password"
              name="password"
              id="password"
              autoComplete="new-password"
              label="Password"
              placeholder="Set a password"
              adornments={true}
              required
            />
          </Grid>
          <Grid item sx={{ "& .MuiFormControl-root": { width: "100%" } }}>
            <Control.Input
              type="password"
              name="confirmPassword"
              id="password2"
              autoComplete="new-password"
              label="Password Confirmation"
              placeholder="Confirm the password"
              adornments={true}
              required
            />
          </Grid>
          <Grid item>
            <Grid container justifyContent="space-between" columnGap={5}>
              <Grid item>
                <Control.Input
                  type="text"
                  name="firstName"
                  id="firstName"
                  label="First Name"
                  placeholder="John"
                  autoComplete="given-name"
                  autoFocus
                />
              </Grid>
              <Grid item>
                <Control.Input
                  type="text"
                  name="lastName"
                  id="lastName"
                  label="Last Name"
                  placeholder="Smith"
                  autoComplete="family-name"
                  autoFocus
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item sx={{ "& .MuiButton-root": { width: "100%" } }}>
            <Control.Button
              variant="contained"
              type="submit"
              sx={Control.buttonStyle}
            >
              Create Account
            </Control.Button>
          </Grid>
        </Grid>
      </Control.Form>

      <Typography variant="initial" sx={{ mb: 3 }}>
        Already Have an account?{" "}
        <Link always="underline" href="/login">
          Sign In
        </Link>
      </Typography>
    </CenteredContainer>
  );
}

export default SignUpPage;
