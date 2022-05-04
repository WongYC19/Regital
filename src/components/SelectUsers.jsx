import { Autocomplete, TextField, Box, Avatar } from "@mui/material";

export default function SelectUsers(props) {
  let { userList, allowedUsers = [], updatePermission } = props;

  const allowedUsersId = allowedUsers.map((item) => item.user);
  userList = userList.filter((user) => !allowedUsersId.includes(user.id));

  const getOptionLabel = (option) => option.first_name + " " + option.last_name;

  const renderOption = (props, option) => {
    return (
      <Box component="li" {...props} key={option.id}>
        <Avatar
          src={option.profile_picture}
          alt=""
          loading="lazy"
          sx={{ mr: 1 }}
        />
        {getOptionLabel(option)}
      </Box>
    );
  };

  const renderInput = (params) => {
    return (
      <TextField
        {...params}
        inputProps={{
          ...params.inputProps,
          autoComplete: "new-password",
        }}
        label="Select a user"
        sx={{ ml: 2, width: "80%" }}
      />
    );
  };

  const changeUser = (event, value) => {
    try {
      const { id: userId } = value;
      updatePermission(userId, 0);
    } catch (error) {
      console.warn(`Error in selecting user: ${error.message}`);
    }
  };

  return (
    <Autocomplete
      id="select-users"
      options={userList}
      getOptionLabel={getOptionLabel}
      renderOption={renderOption}
      renderInput={renderInput}
      onChange={changeUser}
      sx={{ p: 0, m: 0 }}
    />
  );
}
