import {
  Card,
  CardContent,
  CardMedia,
  Skeleton,
  Typography,
  Tooltip,
  Grid,
  IconButton,
} from "@mui/material";
import { AddBox as AddBoxIcon } from "@material-ui/icons";
import { useState, useEffect } from "react";
import api from "../../services/api";
import ResumeService from "../../services/resume.service";

function TemplateCard(props) {
  const {
    id,
    thumbnail,
    title = "Resume Template",
    description = "New template is now available",
    ...rest
  } = props;

  const createResume = (templateId) => {
    return () => {
      const response = ResumeService.createResume(templateId);
      response
        .then((item) => {
          const resumeId = item?.resume_id;
          if (resumeId) window.open(`/resume/${resumeId}`, "_blank");
        })
        .catch((error) => {
          console.error("Create resume error:", error.message);
        });
    };
  };

  return (
    <Card {...rest}>
      <div>
        <CardMedia component="img" image={thumbnail} alt="" />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
            <Tooltip title="Create a new resume">
              <IconButton
                onClick={createResume(id)}
                color="toggleIcon"
                sx={{ bgcolor: "text.icon", ml: 2 }}
              >
                <AddBoxIcon />
              </IconButton>
            </Tooltip>
          </Typography>

          <Typography
            variant="body2"
            p={0}
            color="text.secondary"
            textAlign="justify"
            paragraph
          >
            {description}
          </Typography>
        </CardContent>
      </div>
    </Card>
  );
}

function TemplateCardPlaceholder(props) {
  return (
    <Card {...props}>
      <CardContent>
        <Skeleton animation={false} height={200} style={{ marginBottom: 6 }} />
        <Skeleton animation="wave" variant="h1" style={{ marginBottom: 6 }} />
        <Skeleton animation="wave" variant="text" width="80%" height="10%" />
        <Skeleton animation="wave" variant="text" width="80%" height="10%" />
        <Skeleton animation="wave" variant="text" width="80%" height="10%" />
        <Skeleton animation="wave" variant="text" width="80%" height="10%" />
        <Skeleton animation="wave" variant="rectangular" height="10%" />
      </CardContent>
    </Card>
  );
}

function TemplateList() {
  const [loading, setLoading] = useState(true);
  const [templateList, setTemplateList] = useState([]);

  const imgStyles = {
    width: "400px",
    height: "400px",
  };

  useEffect(() => {
    async function getTemplateList() {
      const response = await api.get(api.endpoints["templates"]);
      setTemplateList(response.data ?? []);
      setLoading(false);
    }

    getTemplateList();

    return () => {};
  }, []);

  return (
    <Grid
      container
      direction="row"
      justifyContent="left"
      gap={3}
      mt={10}
      ml={3}
    >
      {templateList.map((template) => {
        return (
          <Grid item key={template.uuid}>
            {loading ? (
              <TemplateCardPlaceholder sx={imgStyles} />
            ) : (
              <TemplateCard {...template} sx={imgStyles} />
            )}
          </Grid>
        );
      })}
    </Grid>
  );
}

function ResumeList() {
  return <div className="resume__list"></div>;
}

export { TemplateList, ResumeList };
