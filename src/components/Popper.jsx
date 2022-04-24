import { Popper } from "@mui/material";

export default function UserAccessControl(props) {
  const { children, anchorEl } = props;
  const open = Boolean(anchorEl);
  const id = open ? "user-popper" : undefined;
  return (
    <Popper id={id} open={open} anchorEl={anchorEl}>
      {children}
    </Popper>
  );
}
