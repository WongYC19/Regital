import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  Divider,
  Typography,
} from "@mui/material";

import stringAvatar from "../utils/stringAvatar";
import SelectRights from "./SelectRights";

export default function AllowedUserList(props) {
  const { allowedUsers = [], updatePermission } = props;
  return (
    <List dense>
      {allowedUsers.map((item) => {
        const { id, allowed_user: allowedUser, right } = item;

        const {
          first_name: firstName,
          last_name: lastName,
          profile_picture: profilePicture,
          id: userId,
        } = allowedUser;
        const fullName = firstName + " " + lastName;

        let avatarProps = {
          src: profilePicture,
          ...stringAvatar(fullName),
        };

        return (
          <ListItem
            key={id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <ListItemAvatar>
              <Avatar {...avatarProps} />
            </ListItemAvatar>
            <Typography
              variant="h6"
              sx={{ ml: 1, mr: 3, flexGrow: 1 }}
              primary={fullName}
            >
              {fullName}
            </Typography>
            <SelectRights
              sx={{ alignSelf: "flex-end", justifySelf: "flex-end" }}
              userId={userId}
              updatePermission={updatePermission}
              right={right}
            />
            <Divider />
          </ListItem>
        );
      })}
    </List>
  );
}
