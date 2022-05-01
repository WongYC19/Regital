import stringAvatar from "../../utils/stringAvatar";
import { Avatar } from "@mui/material";
// import AuthService from "../../services/auth.service";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext } from "react";

export default function ProfilePicture(props) {
  const { userProfile, logoutUser } = useContext(AuthContext);

  let { profilePicture, firstName, lastName } = userProfile;
  let fullName = firstName + " " + lastName;

  if (!fullName) logoutUser();
  // fullName = "Anonymous User";
  const imageURL =
    profilePicture !== "" || profilePicture === null
      ? `${profilePicture}`
      : null;
  const innerProps = { ...stringAvatar(fullName) };
  if (imageURL) innerProps["src"] = imageURL;
  return <Avatar {...innerProps} />;
}
