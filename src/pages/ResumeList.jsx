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
import AllowedUserList from "../components/AllowedUserList";
import Popout from "../components/Popout";
import ShareDialog from "../components/ShareDialog";
import UserAccessControl from "../components/Popper";
import StyledIconButton from "../components/StyledIconButton";
import AlertBox from "../components/AlertBox";
import SelectUsers from "../components/SelectUsers";

import sortData from "../utils/sorter";
import {
  getUsers,
  getResumeList,
  editResume,
  publishResume,
  downloadResume,
  removeResume,
  toggleAccess,
  closePublish,
} from "../utils/resumeOperation";

import {
  StyledTableRow,
  StyledTableCell,
  StyledEmptyRows,
} from "../components/StyledTable";

function CustomResumeList(props) {
  const {
    selection,
    setSelection,
    resumeList,
    setResumeList,
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
            <StyledIconButton
              onClick={toggleAccess({
                selection,
                setSelection,
                resumeList,
                setResumeList,
                resumeId,
              })}
            >
              <GroupIcon />
            </StyledIconButton>
          </Tooltip>
        </StyledTableCell>

        <StyledTableCell>
          <Tooltip
            title={viewId ? "Refresh for new link" : "Create a new link"}
          >
            <StyledIconButton
              onClick={publishResume({ setSelection, resumeId, viewId })}
            >
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
            <StyledIconButton
              onClick={removeResume({
                resumeList,
                setResumeList,
                setSelection,
                resumeId,
              })}
            >
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
    anchorEl: null,
    severity: "success",
    message: null,
    loading: false,
    allowedUsers: null,
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

  const sortableFields = ["Created Date", "Last Modified Date"];

  const initialOrderDirection = sortableFields.reduce((obj, field) => {
    obj[field] = "asc";
    return obj;
  }, {});

  const [orderDirection, setOrderDirection] = useState(initialOrderDirection);

  const handleSortRequest = (field, label) => {
    return () => {
      const sortedResume = sortData(resumeList, orderDirection[field], label);
      setResumeList(sortedResume);
      setOrderDirection((prev) => ({
        ...prev,
        [field]: orderDirection[field] === "asc" ? "desc" : "asc",
      }));
    };
  };

  useEffect(() => {
    const isLoading = selection.loading;
    if (!isLoading) getResumeList({ setResumeList, setSelection });
    getUsers(setUserList);
  }, [selection.loading]);

  return (
    <Layout>
      <Popout
        title="Share your resume"
        openPopup={selection.showPublish}
        closePopup={() => closePublish(setSelection)}
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

          <Divider sx={{ mt: 1, height: "10px" }} />

          <AllowedUserList
            allowedUsers={selection.allowedUsers}
            updatePermission={selection.updatePermission}
            resumeId={selection.resumeId}
          />
        </Paper>
      </UserAccessControl>

      <Grid
        container
        gap={3}
        mt={10}
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
                  if (sortableFields.includes(item)) {
                    return (
                      <StyledTableCell
                        key={item}
                        onClick={handleSortRequest(item, "created_date")}
                      >
                        <TableSortLabel
                          active={true}
                          direction={orderDirection[item]}
                        >
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
              {resumeList.length === 0 ? (
                <StyledEmptyRows columnCounts={8} />
              ) : (
                <CustomResumeList
                  {...{
                    resumeList,
                    setResumeList,
                    selection,
                    setSelection,
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
