import { Layout } from "./Dashboard";
import { Grid, Typography } from "@mui/material";
import { useContext } from "react";
import Control from "../components/controls/Control";

import {
  changePasswordValidator,
  profileValidator,
} from "../utils/formValidation";

import { AuthContext } from "../contexts/AuthContext";
import AuthService from "../services/auth.service";
import ProfilePicture from "../components/controls/ProfilePicture";

import ProfileService from "../services/profile.service";
import TokenService from "../services/token.service";

function ProfileForm() {
  const genderItems = [
    { id: "male", title: "Male", value: "male" },
    { id: "female", title: "Female", value: "female" },
    { id: "other", title: "Other", value: "other" },
    { id: "unknown", title: "Unknown", value: "unknown" },
  ];

  const { userProfile, setUserProfile } = useContext(AuthContext);

  async function updateUserProfile(event) {
    const response = await ProfileService.updateUserProfile(event);
    const data = response.data;
    if (!data) return false;
    TokenService.setAuth(data["token"]); // update token
    setUserProfile((prev) => ({ ...prev, ...data }));
  }

  async function changeProfilePicture(event) {
    const response = await ProfileService.updateProfilePicture(event);
    const profilePicture = response.profilePicture;
    if (!profilePicture) return false;
    setUserProfile((prev) => ({ ...prev, profilePicture }));
    return userProfile;
  }

  async function deleteProfilePicture(event) {
    const response = await ProfileService.deleteProfilePicture(event);
    if (response.profilePicture) {
      const data = { profilePicture: "/static/profiles" };
      setUserProfile((prev) => ({ ...prev, ...data }));
    }

    return userProfile;
  }

  const CSRFToken = AuthService.CSRFToken;
  return (
    <Control.Form
      setDefaultValues={ProfileService.getUserProfile}
      onSubmit={updateUserProfile}
      defaultValues={userProfile}
      validator={profileValidator}
      successMessage={"User profile updated successfully!"}
    >
      <CSRFToken />
      <Grid container direction="column" gap={5} justifyContent="center">
        <Grid item>
          <Typography variant="h6">Profile Picture</Typography>
        </Grid>
        <Grid container gap={5} justifyContent="flex-start">
          <ProfilePicture />

          <label htmlFor="profile-picture">
            <input
              style={{ display: "none" }}
              id="profile-picture"
              type="file"
              accept="image/*"
              onChange={changeProfilePicture}
            />
            <Control.Button
              variant="contained"
              color="primary"
              type="button"
              children="Upload New Picture"
              component="span"
              size="large"
            />
          </label>

          <Control.Button
            aria-label="delete"
            variant="outlined"
            color="secondary"
            children="Delete"
            type="button"
            size="large"
            onClick={deleteProfilePicture}
          />
        </Grid>

        <Grid
          container
          gap={5}
          direction="column"
          justifyContent="center"
          alignContent="center"
        >
          <Grid container direction="row" gap={5} flexWrap="nowrap">
            <Control.Input
              variant="outlined"
              label="First Name"
              name="firstName"
            ></Control.Input>

            <Control.Input
              variant="outlined"
              label="Last Name"
              name="lastName"
            ></Control.Input>
          </Grid>

          <Control.RadioGroup
            label="Gender"
            name="gender"
            items={genderItems}
          />

          <Control.Input
            variant="outlined"
            label="Phone Number"
            name="phoneNumber"
          />

          <Control.Input variant="outlined" label="Location" name="location" />
        </Grid>

        <Grid container justifyContent="flex-end">
          <Control.Button
            type="submit"
            variant="contained"
            children="Save Changes"
          />
        </Grid>
      </Grid>
    </Control.Form>
  );
}

function ChangePasswordForm() {
  // const { changePassword } = useContext(AuthContext);
  const CSRFToken = AuthService.CSRFToken;

  async function changePassword(data) {
    const changePasswordResponse = await ProfileService.changePassword(data);
    return changePasswordResponse;
  }

  return (
    <Control.Form
      validator={changePasswordValidator}
      onSubmit={changePassword}
      successMessage={"Password updated successfully!"}
    >
      <CSRFToken />

      <Grid container direction="column" gap={5} justifyContent="center">
        <Grid item>
          <Typography variant="h6">Change Password</Typography>
        </Grid>

        <Grid item sx={{ display: "none" }}>
          <Control.Input
            type="text"
            disabled
            autoComplete="email"
            name="email"
            adornments={false}
            inputProps={{
              type: "hidden",
            }}
          ></Control.Input>
        </Grid>

        <Control.Input
          required
          variant="outlined"
          name="oldPassword"
          type="password"
          label="Current Password"
          autoComplete="password"
          adornments={true}
        ></Control.Input>

        <Control.Input
          required
          name="newPassword"
          type="password"
          label="New Password"
          autoComplete="newPassword"
          adornments={true}
        ></Control.Input>

        <Control.Input
          required
          type="password"
          name="confirmPassword"
          label="Confirm New Password"
          autoComplete="confirmNewPassword"
          adornments={true}
        ></Control.Input>

        <Grid container justifyContent="flex-end">
          <Control.Button children="Change Password" type="submit" />
        </Grid>
      </Grid>
    </Control.Form>
  );
}

function Profile() {
  return (
    <Layout>
      <Grid
        container
        justifyContent="center"
        alignContent="center"
        direction="column"
        mt={10}
      >
        <Grid item>
          <ProfileForm />
        </Grid>
        <Grid item>
          <ChangePasswordForm />
        </Grid>
      </Grid>
    </Layout>
  );
}

export default Profile;
