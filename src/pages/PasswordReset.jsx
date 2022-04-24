import Control from "../components/controls/Control";
import {
  Button,
  Container,
  Divider,
  Link,
  Grid,
  Typography,
} from "@mui/material";
import ProfileService from "../services/profile.service";
import {
  resetPasswordValidator,
  resetPasswordConfirmValidator,
} from "../utils/formValidation";
import CenteredContainer from "../components/CenteredContainer";
import ThemeTogglerIcon from "../components/Dashboard/ThemeTogglerIcon";

function PasswordResetView(props) {
  return (
    <CenteredContainer
      sx={
        {
          // bgcolor: (theme) => theme.palette.secondary.main,
          // border: "none",
        }
      }
    >
      <Control.Form
        onSubmit={ProfileService.resetPassword}
        validator={resetPasswordValidator}
        successMessage="The verification email is sent to the mailbox. Please check it."
        sx={{
          // bgcolor: (theme) => theme.palette.secondary.main,
          // border: "none",
          // p: 0,
          m: 0,
        }}
      >
        <Grid container rowSpacing={5} direction="column">
          <Grid item>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              Reset your Password <ThemeTogglerIcon />
            </Typography>
            <Divider sx={{ mt: 1, mb: 0 }}></Divider>
          </Grid>

          <Grid item>
            <Typography variant="inherit">
              Enter your email address below and we'll send you a link to reset
              your password.
            </Typography>
            {/* <Typography variant="inherit">Please check it.</Typography> */}
          </Grid>

          <Grid item sx={{ "& .MuiFormControl-root": { width: "100%" } }}>
            <Control.Input
              variant="outlined"
              type="text"
              name="email"
              label="Email Address"
            />
          </Grid>

          <Grid item>
            <Control.Button
              type="submit"
              color="primary"
              sx={Control.buttonStyle}
            >
              Send
            </Control.Button>
          </Grid>

          <Grid item>
            <Link
              href="/login"
              underline="always"
              rel="noopener"
              color="primary"
              variant="inherit"
            >
              Back to Login Page
            </Link>
          </Grid>
        </Grid>
      </Control.Form>
    </CenteredContainer>
  );
}

function PasswordResetConfirmView(props) {
  const uid = props.match.params.uid;
  const token = props.match.params.token;
  const hiddenStyle = {
    display: "none",
    padding: 0,
    margin: 0,
    width: 0,
    height: 0,
  };

  const defaultValues = {
    uid,
    token,
  };

  return (
    <Container
      color="primary"
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "80%",
      }}
    >
      <Control.Form
        defaultValues={defaultValues}
        onSubmit={ProfileService.resetPasswordConfirm}
        validator={resetPasswordConfirmValidator}
        successMessage="The password has been updated. Please go to login page."
        redirectOnSuccess="/password_reset_done"
      >
        <Grid container flexDirection="column" rowGap={5}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Create new password <ThemeTogglerIcon />
          </Typography>

          <Grid item>
            <Typography variant="inherit">
              Your new password must be different from previous used passwords.
            </Typography>
          </Grid>

          <Grid item sx={hiddenStyle}>
            <Control.Input
              type="text"
              name="email"
              aria-label="Email Address"
              label="Email Address"
              autoComplete="email"
            />
          </Grid>

          <Grid item sx={{ "& .MuiFormControl-root": { width: "100%" } }}>
            <Control.Input
              type="password"
              name="newPassword"
              aria-label="New Password"
              label="New Password"
              autoComplete="new-password"
              adornments={true}
              required
            />
          </Grid>

          <Grid item sx={{ "& .MuiFormControl-root": { width: "100%" } }}>
            <Control.Input
              type="password"
              name="confirmPassword"
              aria-label="Confirm Password"
              label="Confirm Password"
              required
              autoComplete="confirmPassword"
              adornments={true}
            />
          </Grid>

          <Grid item sx={hiddenStyle}>
            <Control.Input
              type="text"
              name="uid"
              aria-label="UID"
              label="UID"
            />

            <Control.Input
              type="text"
              name="token"
              aria-label="Token"
              label="Token"
            />
          </Grid>

          <Grid item>
            <Control.Button type="submit" sx={Control.buttonStyle}>
              Reset Password
            </Control.Button>
          </Grid>

          <Grid item>
            <Link
              href="/password_reset"
              underline="always"
              rel="noopener"
              color="primary"
              variant="inherit"
            >
              Link is expired? Reset again
            </Link>
          </Grid>
        </Grid>
      </Control.Form>
    </Container>
  );
}

function PasswordResetDoneView(props) {
  return (
    <Grid
      container
      direction="column"
      rowGap={5}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        width: "80%",
        margin: "5rem",
        padding: 0,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        Successful password reset!
      </Typography>
      <Typography variant="inherit">
        You can now use your new password to log in to your account.
      </Typography>

      <Button
        href="/login"
        variant="contained"
        sx={{ ...Control.buttonStyle, width: "50%" }}
      >
        Login
      </Button>
    </Grid>
  );
}

export { PasswordResetView, PasswordResetConfirmView, PasswordResetDoneView };
