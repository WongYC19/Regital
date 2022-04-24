import {
  Tooltip,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function Popup(props) {
  const {
    title,
    children,
    openPopup,
    closePopup,
    labelledBy = "popup-label",
    describedBy = "popup-description",
  } = props;

  // const closePopup = () => setOpenPopup(false);

  return (
    <Dialog
      open={openPopup}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
    >
      <DialogTitle id={labelledBy}>
        <div style={{ display: "flex" }}>
          <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
            {title}
          </Typography>

          <Tooltip color="error" title="Close">
            <IconButton aria-label="close" onClick={closePopup}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </div>
      </DialogTitle>

      <DialogContent dividers>{children}</DialogContent>
    </Dialog>
  );
}
