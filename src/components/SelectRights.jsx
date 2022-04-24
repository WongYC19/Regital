import { InputLabel, Select, MenuItem, CircularProgress } from "@mui/material";

import EditOffIcon from "@mui/icons-material/EditOff";
import LockTwoToneIcon from "@mui/icons-material/LockTwoTone";
// import RemoveRedEyeTwoToneIcon from "@mui/icons-material/RemoveRedEyeTwoTone";
import EditIcon from "@mui/icons-material/Edit";
import LockOpenTwoToneIcon from "@mui/icons-material/LockOpenTwoTone";
import { useState } from "react";

const RIGHTS = [
  ["null", "No rights", LockTwoToneIcon],
  [0, "View Only", EditOffIcon],
  [1, "View and Edit", EditIcon],
  [2, "Full Permissions", LockOpenTwoToneIcon],
];

export default function SelectRights(props) {
  const { userId, resumeId, right: inputRight, updatePermission } = props;
  const [selectedRight, setSelectedRight] = useState(inputRight ?? "null");
  const [loading, setLoading] = useState(false);

  const onSelect = (event) => {
    const selectedRight = event.target.value;
    setLoading(true);

    try {
      updatePermission(userId, selectedRight);
      setSelectedRight(selectedRight);
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <Select
          id={`select-${resumeId}`}
          value={selectedRight}
          onChange={onSelect}
        >
          {RIGHTS.map((item) => {
            const [rightValue, title, Icon] = item;
            return (
              <MenuItem key={rightValue} value={rightValue}>
                <InputLabel>
                  <Icon sx={{ mr: 1 }} /> {title}
                </InputLabel>
              </MenuItem>
            );
          })}
        </Select>
      )}
    </>
  );
}
