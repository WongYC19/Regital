import {
  Alert,
  DialogContentText,
  DialogActions,
  Input,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LinkIcon from "@mui/icons-material/Link";
import ResumeService from "../services/resume.service";
import { useState } from "react";

export default function ShareDialog(props) {
  const { selection, setResumeList } = props;
  const { resumeId, viewId } = selection;

  const createLink = (viewId) =>
    viewId ? window.location.origin + "/view/" + viewId : "";

  const [link, setLink] = useState(createLink(viewId));

  const [showAlert, setShowAlert] = useState({
    severity: "info",
    message: null,
  });

  const closeAlert = (event) =>
    setShowAlert((prev) => ({ ...prev, message: null }));

  const publishResume = (resumeId) => {
    return (event) => {
      const response = ResumeService.publishView(resumeId);
      response
        .then((data) => {
          const newId = data.view_id;

          setResumeList((prev) => {
            const index = prev.findIndex((item) => item.resume_id === resumeId);
            prev[index].view_id = newId;
            return prev;
          });

          const updatedLink = createLink(newId);
          setLink(updatedLink);
          setShowAlert({
            severity: "success",
            message: "Link has been created successfully!",
          });
        })
        .catch((error) => {
          setShowAlert({ severity: "error", message: error.message });
        });
    };
  };

  const copyLink = () => {
    navigator.clipboard.writeText(link);
    setShowAlert({
      severity: "success",
      message: "Link has been copied successfully!",
    });
  };
  const description = "Note: Creating a new link will break the existing link.";

  const flexBox = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    marginTop: "16px",
  };

  return (
    <>
      <Typography color="warning.main">{description}</Typography>
      {showAlert.message ? (
        <Alert
          sx={{
            mt: 2,
          }}
          variant="filled"
          onClose={closeAlert}
          severity={showAlert.severity}
        >
          {showAlert.message}
        </Alert>
      ) : null}
      <div style={flexBox}>
        <DialogContentText sx={{ fontWeight: 700 }}>
          Create a new link
        </DialogContentText>
        <DialogActions>
          <Tooltip title="Create new link">
            <IconButton
              aria-label="create-link"
              onClick={publishResume(resumeId)}
            >
              <LinkIcon />
            </IconButton>
          </Tooltip>
        </DialogActions>
      </div>

      <div style={flexBox}>
        <DialogContentText sx={{ fontWeight: 700 }}>
          Copy existing link
        </DialogContentText>
        <DialogActions>
          <Tooltip title="Copy the link">
            <IconButton
              aria-label="copy-link"
              bgcolor="secondary.hover"
              onClick={copyLink}
            >
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
        </DialogActions>
      </div>
      <Input fullWidth disabled value={link} />
    </>
  );
}
