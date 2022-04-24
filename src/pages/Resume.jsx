import Classic from "../components/Templates/Classic";
import getJson from "lodash/get";
import setJson from "lodash/set";
import CustomIframe from "../components/CustomIframe";

import {
  Box,
  Button,
  Divider,
  Input,
  Popper,
  Stack,
  Typography,
  Grid,
  Alert,
} from "@mui/material";

import ThemeTogglerIcon from "../components/Dashboard/ThemeTogglerIcon";
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  PublishOutlined as PublishOutlinedIcon,
} from "@mui/icons-material";

import ResumeService from "../services/resume.service";
import { useState, useEffect, createContext, useMemo } from "react";

export const template = {
  1: Classic,
  2: Classic,
};

export function InputBox(props) {
  const { updateContent, inputProps, setInputProps } = props;
  const containerStyle = {
    padding: 1.5,
    backgroundColor: (theme) => theme.palette.background.paper,
    color: (theme) => theme.palette.toggleIcon.hover,
    borderWidth: 1.5,
    minWidth: "400px",
    boxShadow: 1,
  };

  const inputStyle = {
    padding: ".5rem",
    width: "100%",
  };

  const onCancel = () => {
    setInputProps({ ...inputProps, initialValue: "", open: false });
  };

  const onChange = (event) => {
    setInputProps((prev) => {
      return { ...prev, initialValue: event.target.value };
    });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setInputProps((prev) => {
      updateContent(prev.keyLabels, false, prev.initialValue)(event);
      return { ...prev, initialValue: event.target.value, open: false };
    });
  };

  return (
    <Popper
      id="input-box"
      open={inputProps.open}
      anchorEl={inputProps.anchorEl}
    >
      <Box sx={containerStyle}>
        <Typography variant="h6">Content update</Typography>
        <Input
          sx={inputStyle}
          type="text"
          onChange={onChange}
          value={inputProps.initialValue}
        />
        <Divider mt={2} mb={3} />

        <Stack direction="row" spacing={2} mt={2} justifyContent="space-around">
          <Button
            color="success"
            variant="contained"
            onClick={onSubmit}
            startIcon={<CheckIcon />}
          >
            Update
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={onCancel}
            startIcon={<CloseIcon />}
          >
            Cancel
          </Button>
        </Stack>
      </Box>
    </Popper>
  );
}

export const ResumeContext = createContext(null);

function Notification(props) {
  const { message = null, severity, setNotification } = props;

  return (
    message && (
      <Alert
        sx={{
          position: "fixed",
          zIndex: 100000,
          padding: 1.5,
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          verticalAlign: "middle",
        }}
        severity={severity}
        onClose={() => setNotification({ message: null, severity: "info" })}
      >
        {message}
      </Alert>
    )
  );
}

function Resume(props) {
  const { templateId = 1, editable = true, initialData = null } = props;

  const [notification, setNotification] = useState({
    message: null,
    severity: "info",
  });

  const [data, setData] = useState(initialData);

  const provided = useMemo(
    () => ({ data, setData: (value) => setData(value) }),
    [data]
  );

  const [inputProps, setInputProps] = useState({
    open: false,
    initialValue: "",
    anchorEl: null,
    keyLabels: [],
  });

  const updateContent = (keyLabels, open = false, customData = null) => {
    return (event) => {
      setInputProps((prev) => ({
        ...prev,
        open,
        keyLabels,
        anchorEl: event.target,
      }));

      setData((prev) => {
        const data =
          customData ?? event.target.value ?? getJson(prev, keyLabels);
        setJson(prev, keyLabels, data);
        setInputProps((prop) => ({ ...prop, initialValue: data }));
        return prev;
      });
    };
  };

  useEffect(() => {
    async function retrieveResume() {
      const resumeId = props.match.params.uid;
      const response = await ResumeService.getResume(resumeId);
      setData(response.content);
    }

    if (editable) retrieveResume();
  }, [editable, props.match?.params?.uid]);

  const Template = template[templateId];

  return editable ? (
    <>
      <ControlGroup
        data={data}
        resumeId={props.match.params.uid}
        setNotification={setNotification}
      />
      <Grid
        item
        width="100%"
        sx={editable && { position: "relative", top: "2%" }}
      >
        <Notification {...notification} setNotification={setNotification} />
        <CustomIframe>
          <InputBox
            {...{
              inputProps,
              setInputProps,
              updateContent,
              setData: provided.setData,
            }}
          />

          <ResumeContext.Provider value={{ provided, editable, updateContent }}>
            <Template />
          </ResumeContext.Provider>
        </CustomIframe>
      </Grid>
    </>
  ) : (
    <CustomIframe>
      <ResumeContext.Provider value={{ provided, editable, updateContent }}>
        <Template />
        <Grid
          container
          sx={{ position: "static", zIndex: 100000, top: "0%", left: "50%" }}
        >
          <ThemeTogglerIcon />
        </Grid>
      </ResumeContext.Provider>
    </CustomIframe>
  );
}

function ControlGroup({ resumeId, data, setNotification, editable = true }) {
  const saveResume = () => {
    const saveResponse = ResumeService.updateResume(resumeId, data);
    saveResponse
      .then((resp) => {
        setNotification({
          message: "Saved successfully.",
          severity: "success",
        });
      })
      .catch((error) => {
        setNotification({ message: error.message, severity: "error" });
      });
  };

  const publishResume = () => {
    const publishResponse = ResumeService.publishView(resumeId);
    publishResponse
      .then((resp) => {
        setNotification({
          message: `Published successfully.
          ${window.location.origin}/view/${resp.view_id}`,
          severity: "success",
        });
      })
      .catch((error) => {
        setNotification({ message: error.message, severity: "error" });
      });
    return publishResponse;
  };

  return (
    <Grid
      container
      bgcolor={(theme) => theme.palette.background.paper}
      flexDirection="row"
      mt={3}
      width="100%"
    >
      <Grid
        container
        alignSelf="center"
        justifySelf="center"
        zIndex={100000}
        position="fixed"
        m={0}
        columnGap={3}
        top="0%"
        padding={2}
        background="blue"
        bgcolor={(theme) => theme.palette.background.paper}
        justifyContent="center"
      >
        <Grid item>
          <Button
            variant="contained"
            onClick={saveResume}
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
        </Grid>
        {/* <Grid item>
      <Button
        variant="outlined"
        onClick={exportPdf}
        startIcon={<PictureAsPdfIcon />}
      >
        Download PDF
      </Button>
    </Grid> */}

        <Grid item>
          <Button
            variant="contained"
            onClick={publishResume}
            startIcon={<PublishOutlinedIcon />}
          >
            Publish
          </Button>
        </Grid>
        <Grid item>
          <ThemeTogglerIcon />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Resume;
