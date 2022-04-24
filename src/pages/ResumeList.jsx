import { useState, useEffect } from "react";
import { Layout } from "./Dashboard";
import {
  Grid,
  Typography,
  Tooltip,
  Paper,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableContainer,
  TableSortLabel,
} from "@mui/material";

import {
  Edit as EditIcon,
  Group as GroupIcon,
  Close as CloseIcon,
  DeleteForever as DeleteForeverIcon,
  PublishedWithChanges as PublishedWithChangesIcon,
  Unpublished as UnpublishedIcon,
  PictureAsPdf as PictureAsPdfIcon,
} from "@mui/icons-material";

import Moment from "react-moment";
import ResumeService from "../services/resume.service";
import ProfileService from "../services/profile.service";
import AllowedUserList from "../components/AllowedUserList";
import Popout from "../components/Popout";
import ShareDialog from "../components/ShareDialog";
import UserAccessControl from "../components/Popper";
import StyledIconButton from "../components/StyledIconButton";
import AlertBox from "../components/AlertBox";
import SelectUsers from "../components/SelectUsers";

import * as html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  StyledTableRow,
  StyledTableCell,
  StyledEmptyRows,
} from "../components/StyledTable";

function CustomResumeList(props) {
  const {
    data: resumeList,
    editResume = () => {},
    downloadResume = () => {},
    removeResume = () => {},
    toggleAccess = () => {},
    publishResume = () => {},
  } = props;
  return resumeList.map((item) => {
    let {
      id,
      title: template,
      last_modified_date: lastModifiedDate,
      created_date: createdDate,
      permissions,
      resume_id: resumeId,
      view_id: viewId,
    } = item;
    return (
      <StyledTableRow key={id}>
        <StyledTableCell>{template}</StyledTableCell>
        <StyledTableCell>
          <Moment fromNow ago>
            {createdDate}
          </Moment>{" "}
          ago
        </StyledTableCell>
        <StyledTableCell>
          <Moment fromNow ago>
            {lastModifiedDate}
          </Moment>{" "}
          ago
        </StyledTableCell>

        <StyledTableCell>
          <Tooltip title="Open for Edit">
            <StyledIconButton onClick={editResume(resumeId)}>
              <EditIcon />
            </StyledIconButton>
          </Tooltip>
        </StyledTableCell>

        <StyledTableCell>
          <Tooltip title="Manage the permissions">
            <StyledIconButton onClick={toggleAccess(resumeId, permissions)}>
              <GroupIcon />
            </StyledIconButton>
          </Tooltip>
        </StyledTableCell>

        <StyledTableCell>
          <Tooltip
            title={viewId ? "Refresh for new link" : "Create a new link"}
          >
            <StyledIconButton onClick={publishResume(resumeId, viewId)}>
              {viewId ? <PublishedWithChangesIcon /> : <UnpublishedIcon />}
            </StyledIconButton>
          </Tooltip>
        </StyledTableCell>

        <StyledTableCell>
          <Tooltip title="Download as PDF">
            <StyledIconButton onClick={downloadResume(resumeId)}>
              <PictureAsPdfIcon />
            </StyledIconButton>
          </Tooltip>
        </StyledTableCell>

        <StyledTableCell>
          <Tooltip title="Delete the resume">
            <StyledIconButton onClick={removeResume(resumeId)}>
              <DeleteForeverIcon />
            </StyledIconButton>
          </Tooltip>
        </StyledTableCell>
      </StyledTableRow>
    );
  });
}

export default function ResumeList(props) {
  const [resumeList, setResumeList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [selection, setSelection] = useState({
    showAccess: null,
    showPublish: false,
    resumeId: null,
    viewId: null,
    severity: "success",
    message: null,
    loading: false,
  });

  const fields = [
    "Template",
    "Created Date",
    "Last Modified Date",
    "Edit",
    "Permission",
    "Publish",
    "Download as PDF",
    "Remove",
  ];

  useEffect(() => {
    async function getResumeList() {
      const response = await ResumeService.getResumeList();
      setResumeList(response);
      setSelection((prev) => ({ ...prev, loading: true }));
    }

    async function getUsers() {
      const userData = await ProfileService.getUsers();
      setUserList(userData);
    }

    const isLoading = selection.loading;

    if (!isLoading) getResumeList();
    getUsers();
  }, [selection.loading]);

  const editResume = (resumeId) => {
    return (event) => {
      const win = window.open(`/resume/${resumeId}`, "_blank");
      win.focus();
    };
  };

  const publishResume = (resumeId, viewId) => {
    return (event) => {
      setSelection((prev) => ({
        ...prev,
        resumeId,
        viewId,
        showPublish: true,
      }));
    };
  };

  const downloadResume = (resumeId) => {
    return (event) => {
      const container = document.querySelector("#resume");

      let option = {
        useCORS: true,
        width: window.screen.availWidth,
        height: window.screen.availHeight,
        windowWidth: document.body.scrollWidth,
        windowHeight: document.body.scrollHeight,
        x: 0,
        y: window.pageYOffset,
        // html2canvas: { scale: 2 },
        // jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };
      // Alerts: asdjkll
      // html2pdf().set(option).from(element).save();
      // console.log("Element:", element);

      html2canvas(container, option).then((canvas) => {
        // document.body.appendChild(canvas);
        console.log("Canvas:", canvas);
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        console.log("Img Data:", imgData);
        pdf.addImage(imgData, "PNG", 0, 0);
        pdf.save("resume.pdf");
      });
    };
  };

  const removeResume = (resumeId) => {
    return (event) => {
      const confirmDelete = window.confirm(
        "Are you sure to delete the resume? Deleted resume can't be recovered."
      );

      if (!confirmDelete) return false;

      const response = ResumeService.deleteResume(resumeId);

      response
        .then((data) => {
          const updatedList = resumeList.filter(
            (item) => item.resume_id !== resumeId
          );
          setResumeList(updatedList);
          setSelection((prev) => ({
            ...prev,
            severity: "success",
            message: data,
          }));
        })
        .catch((error) => {
          setSelection((prev) => ({
            ...prev,
            severity: "error",
            message: error.message,
          }));
        });
    };
  };

  const toggleAccess = (resumeId) => {
    return (event) => {
      const anchorEl = selection.anchorEl ? null : event.currentTarget;
      const resume = resumeList.find((resume) => resume.resume_id === resumeId);
      const allowedUsers = resume.permissions;

      function updatePermission(allowedUserId, inputRight) {
        let accessResponse = null;
        if (inputRight === "null") {
          accessResponse = ResumeService.revokePermission(
            resumeId,
            allowedUserId
          );
        } else {
          accessResponse = ResumeService.grantPermission(
            resumeId,
            allowedUserId,
            inputRight
          );
        }

        accessResponse
          .then((data) => {
            setResumeList((prev) => {
              const resumeIndex = prev.findIndex(
                (resume) => resume.resume_id === resumeId
              );
              const allowedUsers = resume.permissions;

              // Revoke access right
              if (inputRight === "null") {
                let permissions = prev[resumeIndex].permissions;

                permissions = permissions.filter(
                  (p) => p.user !== allowedUserId
                );
                prev[resumeIndex].permissions = permissions;

                setSelection((prevSelection) => ({
                  ...prevSelection,
                  allowedUsers: permissions,
                  message:
                    data.message ?? "Revoke user access right successfully.",
                  severity: "success",
                }));
                return prev;
              }

              // Update access right
              const userIndex = allowedUsers.findIndex(
                (p) => p.user === allowedUserId
              );

              if (userIndex === -1) {
                const newAllowedUser = data;
                const newAllowedUsers = prev[resumeIndex].permissions.concat([
                  newAllowedUser,
                ]);
                prev[resumeIndex].permissions = newAllowedUsers;

                setSelection((prevSelection) => ({
                  ...prevSelection,
                  allowedUsers: newAllowedUsers,
                  message:
                    data.message ?? "Granted view access right to new user.",
                  severity: "success",
                }));
                return prev;
              }

              prev[resumeIndex].permissions[userIndex].right = inputRight;
              setSelection((prevSelection) => ({
                ...prevSelection,
                message: data.message ?? "Update the access right successfuly.",
                severity: "success",
              }));
              return prev;
            });
          })
          .catch((error) => {
            setSelection((prev) => ({
              ...prev,
              message: error.message,
              severity: "error",
            }));
          });
      }

      setSelection((prev) => ({
        ...prev,
        resumeId,
        showAccess: anchorEl,
        updatePermission,
        allowedUsers,
      }));
    };
  };

  const closePublish = () =>
    setSelection((prev) => ({ ...prev, showPublish: false }));

  return (
    <Layout>
      <Grid
        container
        gap={3}
        mt={10}
        // ml={5}
        ml={3}
        justifyContent="flex-start"
        alignItems="center"
        maxWidth="90%"
      >
        <Typography variant="h5">Resume List</Typography>
        <AlertBox variant="contained" {...{ selection, setSelection }} />
        <TableContainer>
          <Table>
            <TableHead>
              <StyledTableRow>
                {fields.map((item) => {
                  if (["Created Date", "Last Modified Date"].includes(item)) {
                    return (
                      <StyledTableCell key={item}>
                        <TableSortLabel active={true} direction={"asc"}>
                          {item}
                        </TableSortLabel>
                      </StyledTableCell>
                    );
                  }
                  return <StyledTableCell key={item}>{item}</StyledTableCell>;
                })}
              </StyledTableRow>
            </TableHead>

            <TableBody>
              <Popout
                title="Share your resume"
                openPopup={selection.showPublish}
                closePopup={closePublish}
              >
                <ShareDialog {...{ selection, setResumeList }} />
              </Popout>

              <UserAccessControl anchorEl={selection.showAccess} sx={{ p: 1 }}>
                <Paper color="secondary">
                  <Grid container alignItems="center">
                    <Grid item flexGrow={1} sx={{ pl: 1 }}>
                      <Typography variant="h6" sx={{ p: 1 }}>
                        User Access Control
                      </Typography>
                    </Grid>

                    <Grid item sx={{ pr: 1 }}>
                      <StyledIconButton
                        onClick={() =>
                          setSelection((prev) => ({
                            ...prev,
                            showAccess: null,
                          }))
                        }
                      >
                        <CloseIcon />
                      </StyledIconButton>
                    </Grid>
                  </Grid>

                  <SelectUsers
                    userList={userList}
                    allowedUsers={selection.allowedUsers}
                    updatePermission={selection.updatePermission}
                  />
                  <Divider sx={{ mt: 1 }} />
                  <AllowedUserList
                    allowedUsers={selection.allowedUsers}
                    updatePermission={selection.updatePermission}
                    resumeId={selection.resumeId}
                  />
                </Paper>
              </UserAccessControl>

              {resumeList.length === 0 ? (
                <StyledEmptyRows columnCounts={8} />
              ) : (
                <CustomResumeList
                  {...{
                    data: resumeList,
                    editResume,
                    removeResume,
                    toggleAccess,
                    publishResume,
                    downloadResume,
                  }}
                />
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Layout>
  );
}
