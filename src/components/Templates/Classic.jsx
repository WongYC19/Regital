import React from "react";
import { useEffect, useContext } from "react";

import {
  Box,
  Button,
  Divider,
  IconButton,
  Select,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";

import {
  Edit as EditIcon,
  EditLocation as EditLocationIcon,
  InsertLink as InsertLinkIcon,
} from "@mui/icons-material";

import { ResumeContext } from "../../pages/Resume";
import Editable from "../Editor";
import "../../static/classic.css";
import "../../static/classic.js";
import { navList } from "./navItem";
import initialData, { skillLevels } from "./initialData";
import ThemeTogglerIcon from "../Dashboard/ThemeTogglerIcon";

export default function Classic(props) {
  let { editable, provided } = useContext(ResumeContext);
  let { data, setData } = provided;

  const isEmpty = !data || Object.keys(data ?? {}).length === 0;
  data = isEmpty ? initialData : data;

  useEffect(() => {
    setData(data);
  }, [data, setData]);

  return (
    <>
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css"
      />

      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&amp;display=swap"
      />

      <Header editable={editable} />
      {editable ? null : <ThemeTogglerIcon />}
      <ProfileCard id="profile" name="Profile" data={data.profile} />

      <SkillsCard
        id="languages"
        name="Languages"
        data={data.languages}
        label="languages"
      />

      <SkillsCard
        id="skills"
        name="Professional Skills"
        data={data.skills}
        label="skills"
      />
      <ProjectCard id="projects" data={data.project} />

      <TimelineCard
        id="work-experience"
        name="Work Experience"
        data={data.experience}
        isEducation={false}
      />

      <TimelineCard
        id="academic"
        name="Education"
        isEducation={true}
        data={data.education}
      />

      <Footer />
    </>
  );
}

function TimelineCard(props) {
  const {
    id = "timeline-card",
    isEducation = false,
    name = isEducation ? "Work Experience" : "Academic",
    data = [],
  } = props;

  let { provided, updateContent, editable } = useContext(ResumeContext);
  const { setData } = provided;
  const educationClass = isEducation ? "education" : "";
  const key = isEducation ? "education" : "experience";

  const addTimeLine = (index) => {
    return (event) => {
      setData((prev) => {
        let currentTimeline = isEducation ? prev.education : prev.experience;
        currentTimeline = JSON.parse(JSON.stringify(currentTimeline));
        let sampleTimeline = isEducation
          ? initialData.education[0]
          : initialData.experience[0];
        sampleTimeline = JSON.parse(JSON.stringify(sampleTimeline));
        currentTimeline.splice(index + 1, 0, sampleTimeline);
        return { ...prev, [key]: currentTimeline };
      });
    };
  };

  const deleteTimeline = (index) => {
    return (event) => {
      setData((prev) => {
        let currentTimeline = isEducation ? prev.education : prev.experience;
        currentTimeline = currentTimeline.filter((value, idx) => idx !== index);
        return { ...prev, [key]: currentTimeline };
      });
    };
  };

  return (
    <Section id={id} name={name}>
      {data.map((item, index) => {
        const { title, institution, periodStart, periodEnd, description } =
          item;
        return (
          <React.Fragment key={index}>
            <div className="timeline__section">
              <div className={`timeline__head ${educationClass}`}>
                <Editable
                  id="position"
                  className={`timeline__position ${educationClass}`}
                  tagName="span"
                  initialValue={title}
                  disabled={!editable}
                  onInput={updateContent([key, index, "title"])}
                />{" "}
                <Editable
                  id="location"
                  className={`timeline__location ${educationClass}`}
                  tagName="span"
                  initialValue={institution}
                  disabled={!editable}
                  onInput={updateContent([key, index, "institution"])}
                />
              </div>

              <div className="timeline__body">
                <div>
                  <Editable
                    id="timeline-period"
                    tagName="span"
                    className="timeline__period"
                    initialValue={periodStart}
                    disabled={!editable}
                    onInput={updateContent([key, index, "periodStart"])}
                  />
                  <Typography variant="string" pl={0.5} pr={0.5}>
                    -
                  </Typography>

                  <Editable
                    id="timeline-period"
                    tagName="span"
                    className="timeline__period"
                    initialValue={periodEnd}
                    disabled={!editable}
                    onInput={updateContent([key, index, "periodEnd"])}
                  />
                </div>

                <Editable
                  id="timeline-content"
                  className="timeline__content"
                  name="editor"
                  contentEditable="true"
                  initialValue={description}
                  disabled={!editable}
                  onInput={updateContent([key, index, "description"])}
                />
              </div>
            </div>

            {editable && (
              <ButtonGroup
                addItem={addTimeLine(index)}
                deleteItem={deleteTimeline(index)}
                index={index}
                key={key}
                addDesc={`Add new ${key}`}
                deleteDesc={`Delete ${key}`}
              />
            )}
          </React.Fragment>
        );
      })}
    </Section>
  );
}

function ProjectCard(props) {
  const { id = "projects", data = [] } = props;
  const { provided, updateContent, editable } = useContext(ResumeContext);
  const { setData } = provided;

  const addProject = (index) => {
    return (event) => {
      setData((prev) => {
        const currentProject = JSON.parse(JSON.stringify(prev.project ?? {}));
        if (!currentProject) return prev;
        const sampleData = JSON.parse(JSON.stringify(initialData.project[0]));
        currentProject.splice(index + 1, 0, sampleData);
        return { ...prev, project: currentProject };
      });
    };
  };

  const deleteProject = (index) => {
    return (event) => {
      setData((prev) => {
        const currentProject = prev.project.filter(
          (value, idx) => idx !== index
        );

        return { ...prev, project: currentProject };
      });
    };
  };

  const handleDisplayError = (event) => {
    const imgElement = event.target;
    imgElement.onError = null;
    imgElement.src = "https://demofree.sirv.com/nope-not-here.jpg";
    return false;
  };

  return (
    <Section id={id} name="Project">
      {data.map((item, index) => {
        const { category, thumbnail, topic, description } = item;
        return (
          <React.Fragment key={index}>
            <div className="project__card">
              <div className="project__thumbnail">
                <img
                  onClick={updateContent(["project", index, "thumbnail"], true)}
                  src={thumbnail}
                  alt=""
                  srcSet=""
                  onError={handleDisplayError}
                />

                <Editable
                  id="project-category"
                  name="editor"
                  className="project__categories"
                  initialValue={category}
                  disabled={!editable}
                  onInput={updateContent(["project", index, "category"])}
                />
              </div>

              <div className="project__content">
                <Editable
                  id="project-topic"
                  className="project__topic"
                  tagName="div"
                  initialValue={topic}
                  disabled={!editable}
                  onInput={updateContent(["project", index, "topic"])}
                />
                <Editable
                  id="project-description"
                  className="project__description"
                  initialValue={description}
                  tagName="div"
                  disabled={!editable}
                  onInput={updateContent(["project", index, "description"])}
                />
              </div>
            </div>

            {editable && (
              <ButtonGroup
                addItem={addProject(index)}
                deleteItem={deleteProject(index)}
                index={index}
              />
            )}

            <Divider sx={{ mt: 2, mb: 2, borderTopWidth: 2.5 }} />
          </React.Fragment>
        );
      })}
    </Section>
  );
}

function ButtonGroup(props) {
  const {
    addItem,
    deleteItem,
    index,
    addDesc = "Add Project",
    deleteDesc = "Delete Project",
  } = props;

  return (
    <Stack direction="row" justifyContent="center" gap={3} mb={1}>
      <Button variant="contained" onClick={addItem}>
        {addDesc}
      </Button>
      {index > 0 && (
        <Button variant="contained" onClick={deleteItem}>
          {deleteDesc}
        </Button>
      )}
    </Stack>
  );
}

function ProfileCard(props) {
  const { id = "profile", data = [] } = props;
  let { description, email, address, linkedinURL, githubURL } = data;
  const { updateContent, editable } = useContext(ResumeContext);
  const iconStyle = { color: (theme) => theme.palette.text.secondary };
  if (!linkedinURL?.startsWith("http")) linkedinURL = "https://" + linkedinURL;
  if (!githubURL?.startsWith("http")) githubURL = "https://" + githubURL;

  return (
    <Section id={id} name="Profile">
      <div className="profile__card">
        <div className="profile__about">
          <h3 className="profile__topic">About Me</h3>
          <Editable
            id="about-me"
            className="profile__introduction"
            initialValue={description}
            disabled={!editable}
            onInput={updateContent(["profile", "description"])}
          />
        </div>

        <div className="profile__bio">
          <h3 className="profile__topic">Bio</h3>
          <div className="bio__list">
            <BioCard
              id="mail"
              icon="fa-solid fa-envelope"
              content={email}
              url={"mailto:" + email}
              updateContent={updateContent(["profile", "email"], true)}
              editIcon={<EditIcon sx={iconStyle} />}
              editable={editable}
            />
            <BioCard
              id="github"
              icon="fa-brands fa-github"
              content="Github Repository"
              url={githubURL}
              updateContent={updateContent(["profile", "githubURL"], true)}
              editIcon={<InsertLinkIcon sx={iconStyle} />}
              editable={editable}
            />

            <BioCard
              id="address"
              icon="fa-regular fa-address-card"
              content={address}
              url={
                "https://www.google.com/maps/place/" +
                address?.replace(" ", "+")
              }
              updateContent={updateContent(["profile", "address"], true)}
              editIcon={<EditLocationIcon sx={iconStyle} />}
              editable={editable}
            />
            <BioCard
              id="linkedin"
              icon="fa-brands fa-linkedin"
              content="LinkedIn"
              url={linkedinURL}
              updateContent={updateContent(["profile", "linkedinURL"], true)}
              editIcon={<InsertLinkIcon sx={iconStyle} />}
              editable={editable}
            />
          </div>
        </div>
      </div>
    </Section>
  );
}

function LevelOptions({
  initialLevel = "Not rated",
  selectionId = "selection-level",
  onChange = (event) => {},
}) {
  return (
    <Select
      onChange={onChange}
      name="select-skill"
      id={selectionId}
      value={initialLevel}
      sx={{ ml: 2, height: "20px" }}
    >
      {Object.keys(skillLevels).map((level) => {
        const optionAttrs = { key: level, value: level };
        return <MenuItem {...optionAttrs}>{level}</MenuItem>;
      })}
    </Select>
  );
}

function SkillsCard(props) {
  const {
    id = "skills",
    label = "skills",
    name = "Professional Skills",
    data = [],
  } = props;

  const { updateContent, editable, provided } = useContext(ResumeContext);
  const { setData } = provided;

  const addSkill = (index) => {
    return (event) => {
      setData((prev) => {
        let currentSkill = prev[label];
        currentSkill = JSON.parse(JSON.stringify(currentSkill));
        let sampleSkill = initialData[label][0];
        sampleSkill = JSON.parse(JSON.stringify(sampleSkill));
        currentSkill.splice(index + 1, 0, sampleSkill);
        return { ...prev, [label]: currentSkill };
      });
    };
  };

  const deleteSkill = (index) => {
    return (event) => {
      setData((prev) => {
        let currentSkill = prev[label];
        currentSkill = currentSkill.filter((value, idx) => idx !== index);
        return { ...prev, [label]: currentSkill };
      });
    };
  };
  return (
    <Section id={id} name={name}>
      <div className="skill__line">
        {data.map((skill, index) => {
          return (
            <div key={index}>
              <Editable
                className="skill__info"
                tagName="span"
                initialValue={skill.name}
                disabled={!editable}
                onInput={updateContent([label, index, "name"])}
              />

              {editable && (
                <LevelOptions
                  id={`selection-${id}-${index}}`}
                  initialLevel={skill.level}
                  onChange={updateContent([label, index, "level"])}
                />
              )}
              <div className="skill__bar">
                <div
                  className="skill__rate"
                  style={{ width: skillLevels[skill.level] + "%" }}
                  disabled={!editable}
                >
                  {skill.level}
                </div>
              </div>

              {editable && (
                <ButtonGroup
                  addItem={addSkill(index)}
                  deleteItem={deleteSkill(index)}
                  index={index}
                  key={skill.name}
                  addDesc={`Add ${label}`}
                  deleteDesc={`Delete ${label}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function Section(props) {
  const { id, name, children } = props;
  return (
    <section className="container section section__height" id={id}>
      <h2 className="section__title">{name}</h2>
      <section className="content section">{children}</section>
    </section>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer">
      <i className="fa-solid fa-copyright icon"></i>
      <span>All rights reserved ({currentYear})</span>
    </footer>
  );
}

function NavItem({ id, icon, name }) {
  return (
    <li className="nav__item">
      <a href={`#${id}`} className="nav__link">
        <i className={`${icon} icon`}></i>
        <span className="nav__name">{name}</span>
      </a>
    </li>
  );
}

function NavBar() {
  return (
    <nav className="nav container">
      <div className="nav__menu" id="nav-menu">
        <ul className="nav__list">
          {navList.map((item) => (
            <NavItem key={item.id} {...item} />
          ))}
        </ul>
      </div>
    </nav>
  );
}

function ScrollProgressBar() {
  return <div className="progress__bar"></div>;
}

function Header({ editable }) {
  const headerStyle = editable ? { position: "fixed" } : {};

  return (
    <header style={headerStyle} className="header" id="header">
      <NavBar />
      <ScrollProgressBar />
    </header>
  );
}

function BioCard(props) {
  const { id, url, icon, content, updateContent, editIcon, editable } = props;
  return (
    <div className="bio__item" id={id}>
      <span className="bio__icon">
        <i className={icon}></i>
      </span>
      <span className="bio__link"></span>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <a target="_blank" rel="noreferrer" className="bio__link" href={url}>
          {content}
        </a>

        {editable && (
          <IconButton onClick={updateContent} mr={3}>
            {editIcon}
          </IconButton>
        )}
      </Box>
    </div>
  );
}
