import { useEffect, useState } from "react";
import { Layout } from "./Dashboard";
import {
  Divider,
  Grid,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableSortLabel,
  IconButton,
} from "@mui/material";

import {
  Edit as EditIcon,
  AutoStories as AutoStoriesIcon,
  DeleteForever as DeleteForeverIcon,
} from "@mui/icons-material";

import Moment from "react-moment";
import AlertBox from "../components/AlertBox";
import SearchBar from "../components/SearchBar";
import {
  StyledTableRow,
  StyledTableCell,
  StyledEmptyRows,
} from "../components/StyledTable";

import ResumeService from "../services/resume.service";
import sortData from "../utils/sorter";
import { openResume, editResume, removeResume } from "../utils/resumeOperation";

function CustomTableHead({ resumeList, setResumeList, setAllResume }) {
  const tableHeadStyle = {
    color: (theme) => theme.palette.primary.main,
    backgroundColor: (theme) => theme.palette.divider,
  };

  const sharedUserField = "Shared By";
  const createdDateField = "Create Date";
  const modifiedDateField = "Last Modified Date";
  const [orderDirection, setOrderDirection] = useState({
    [createdDateField]: "asc",
    [modifiedDateField]: "asc",
    [sharedUserField]: "asc",
  });

  const handleSortRequest = (field, label) => {
    return () => {
      const sortedResume = sortData(resumeList, orderDirection[field], label);
      setResumeList(sortedResume);
      setAllResume(resumeList);
      setOrderDirection((prev) => ({
        ...prev,
        [field]: orderDirection[field] === "asc" ? "desc" : "asc",
      }));
    };
  };

  return (
    <TableHead sx={tableHeadStyle}>
      <TableRow>
        <StyledTableCell
          align="center"
          onClick={handleSortRequest(sharedUserField, "user")}
        >
          <TableSortLabel
            active={true}
            direction={orderDirection[sharedUserField]}
          >
            Shared By
          </TableSortLabel>
        </StyledTableCell>
        <StyledTableCell
          align="center"
          onClick={handleSortRequest(createdDateField, "created_date")}
        >
          <TableSortLabel
            active={true}
            direction={orderDirection[createdDateField]}
          >
            Created Date
          </TableSortLabel>
        </StyledTableCell>

        <StyledTableCell
          align="center"
          onClick={handleSortRequest(modifiedDateField, "last_modified_date")}
        >
          <TableSortLabel
            active={true}
            direction={orderDirection[modifiedDateField]}
          >
            Last Modified Date
          </TableSortLabel>
        </StyledTableCell>

        <StyledTableCell align="center">View</StyledTableCell>
        <StyledTableCell align="center">Edit</StyledTableCell>
        <StyledTableCell align="center">Delete</StyledTableCell>
      </TableRow>
    </TableHead>
  );
}

function CustomTableRows({
  resumeList,
  setResumeList,
  openResume,
  setSelection,
  editResume,
  removeResume,
}) {
  resumeList = resumeList ?? [];
  return resumeList.map((row) => {
    const { resume, right, user } = row;
    const {
      created_date: createdDate,
      last_modified_date: lastModifiedDate,
      resume_id: resumeId,
    } = resume;

    return (
      <StyledTableRow key={row.id}>
        <StyledTableCell component="td" align="center" scope="row">
          {user}
        </StyledTableCell>

        <StyledTableCell component="td" align="center" scope="row">
          <Moment fromNow ago>
            {createdDate}
          </Moment>{" "}
          ago
        </StyledTableCell>

        <StyledTableCell component="td" align="center" scope="row">
          <Moment fromNow ago>
            {lastModifiedDate}
          </Moment>{" "}
          ago{" "}
        </StyledTableCell>

        <StyledTableCell component="td" align="center" scope="row">
          <IconButton
            onClick={right >= 0 ? openResume(resumeId) : null}
            disabled={right < 0}
          >
            <AutoStoriesIcon />
          </IconButton>
        </StyledTableCell>

        <StyledTableCell component="td" align="center" scope="row">
          <IconButton
            onClick={right >= 1 ? editResume(resumeId) : null}
            disabled={right < 1}
          >
            <EditIcon />
          </IconButton>
        </StyledTableCell>

        <StyledTableCell component="td" align="center" scope="row">
          <IconButton
            onClick={
              right >= 2
                ? removeResume({
                    resumeList,
                    setResumeList,
                    setSelection,
                    resumeId,
                  })
                : null
            }
            disabled={right < 2}
          >
            <DeleteForeverIcon />
          </IconButton>
        </StyledTableCell>
      </StyledTableRow>
    );
  });
}

export default function SharedResumeList() {
  const [searched, setSearched] = useState("");
  const [resumeList, setResumeList] = useState([]);
  const [allResume, setAllResume] = useState([]);
  const [selection, setSelection] = useState({
    severity: "info",
    message: null,
  });

  const requestSearch = (searchedVal) => {
    setSearched(searchedVal);

    if (searchedVal === "") {
      setResumeList(allResume);
      return false;
    }
    const pattern = new RegExp(searchedVal, "gi");
    const filteredRows = resumeList.filter((row) => row.user.match(pattern));
    setResumeList(filteredRows);
  };

  const cancelSearch = () => {
    setSearched("");
    requestSearch("");
  };

  useEffect(() => {
    async function getSharedResume() {
      const response = await ResumeService.getSharedResume();
      setAllResume(response ?? []);
      setResumeList(response);
    }

    getSharedResume();
  }, []);

  const tableStyle = {
    margin: "auto",
    maxWidth: "95%",
  };

  return (
    <Layout>
      <Grid container mt={10} ml={3} rowGap={1} direction="column">
        <Grid item>
          <Typography variant="h5">Resume List Shared by Others</Typography>
        </Grid>

        <Grid item>
          <SearchBar
            value={searched}
            onChange={(event) => requestSearch(event.target.value)}
            onCancelSearch={cancelSearch}
          />
        </Grid>

        <Grid item>
          <Divider />
        </Grid>

        <Grid item>
          <AlertBox setSelection={selection} selection={selection} />
        </Grid>

        <Grid item>
          <TableContainer
            sx={tableStyle}
            aria-label="simple table"
            component={Grid}
          >
            <Table stickyHeader={true}>
              <CustomTableHead
                {...{ resumeList, setResumeList, setAllResume }}
              />

              <TableBody>
                {resumeList.length === 0 ? (
                  <StyledEmptyRows columnCounts={6} />
                ) : (
                  <CustomTableRows
                    {...{
                      resumeList,
                      setResumeList,
                      openResume,
                      editResume,
                      removeResume,
                      setSelection,
                    }}
                  />
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Layout>
  );
}

// const removeResume = (resumeId) => {
//   return (event) => {
//     const confirmDelete = window.confirm(
//       "Are you sure to delete the resume? Deleted resume can't be recovered."
//     );

//     if (!confirmDelete) return false;

//     const response = ResumeService.deleteResume(resumeId);

//     response
//       .then((data) => {
//         const updatedAllRows = allRows.filter(
//           (row) => row.resume.id !== resumeId
//         );

//         const updatedRows = rows.filter((row) => row.resume.id !== resumeId);

//         setAllRows(updatedAllRows);
//         setRows(updatedRows);
//         setSelection((prev) => ({
//           ...prev,
//           severity: "success",
//           message: data,
//         }));
//       })
//       .catch((error) => {
//         console.error("Error:", error.message);
//         setSelection((prev) => ({
//           ...prev,
//           severity: "error",
//           message: error.message,
//         }));
//       });
//   };
// };

// const resp = [
//   {
//     "id":14,
//     "title":"Classic Resume",
//     "view_id": "5fa78651-c56c-4b18-8292-9487d1df1a2e",
//     "permissions": [
//         {
//           "id":18,
//           "resume":"e8cb6fcf-49c8-4239-a8b1-f50917799ef6 - Yik Chun Wong (666dfbb4-16dd-42d9-99cb-26ad9975d918) last modified resume on 2022-02-07",
//           "allowed_user": {
//             "id":"cee9d2bf-c9d3-4742-9b7c-3bfede03b391",
//             "first_name":"Yik",
//             "last_name":"Wong",
//             "profile_picture": null
//           },
//           "right": 0,
//           "user":"cee9d2bf-c9d3-4742-9b7c-3bfede03b391"}
//       ],
//       "created_date":"2022-02-07T17:19:34.600797Z",
//       "last_modified_date":"2022-02-07T17:19:34.600797Z",
//       "resume_id":"e8cb6fcf-49c8-4239-a8b1-f50917799ef6",
//       "content": {},
//       "created_by":"666dfbb4-16dd-42d9-99cb-26ad9975d918"
//     },

//     {
//       "id":15,
//       "title":"Classic Resume",
//       "view_id":"f4addb54-aaa8-49fa-bb73-ab1b578ce086",
//       "permissions": [
//         {
//           "id":30,
//           "resume":"730b695b-9935-44d5-9db0-596bfb9cf7e5 - Yik Chun Wong (666dfbb4-16dd-42d9-99cb-26ad9975d918) last modified resume on 2022-03-04",
//           "allowed_user": {
//             "id": "6111f422-8e24-46a7-abc5-376b02f7419f",
//             "first_name":"ASD",
//             "last_name":"123",
//             "profile_picture":null
//           },
//           "right":1,
//           "user":"6111f422-8e24-46a7-abc5-376b02f7419f"
//         }
//       ],

//       "created_date":"2022-02-09T00:29:57.184867Z",
//       "last_modified_date":"2022-03-04T20:31:58.614516Z",
//       "resume_id":"730b695b-9935-44d5-9db0-596bfb9cf7e5",
//       "content": {
//         "about-me":"Resume 2",
//         "project-category": "undefined",
//         "project-topic":"undefined",
//         "project-description":"undefined",
//         "position":"undefined",
//         "location":"undefined",
//         "timeline-period":"undefined",
//         "timeline-content":"undefined"
//       },
//       "created_by": "666dfbb4-16dd-42d9-99cb-26ad9975d918"
//     },

//     {
//       "id":16,
//       "title":"Classic Resume",
//       "view_id": "efeae457-0e65-4c34-a55b-f55655135f79",
//       "permissions": [
//         {
//           "id":34,
//           "resume":"2daf6d05-ac14-4ef7-b7f3-a66e8dd540b9 - Yik Chun Wong (666dfbb4-16dd-42d9-99cb-26ad9975d918) last modified resume on 2022-04-03",
//           "allowed_user": {
//             "id":"22b3dbcc-3866-48f6-b372-b36ce65cb0d0",
//             "first_name":"bigquery",
//             "last_name":"asd",
//             "profile_picture":null
//         },
//         "right": 0,
//         "user": "22b3dbcc-3866-48f6-b372-b36ce65cb0d0"
//       },
//       {"id":35,"resume":"2daf6d05-ac14-4ef7-b7f3-a66e8dd540b9 - Yik Chun Wong (666dfbb4-16dd-42d9-99cb-26ad9975d918) last modified resume on 2022-04-03","allowed_user":{"id":"6111f422-8e24-46a7-abc5-376b02f7419f","first_name":"ASD","last_name":"123","profile_picture":null},"right":0,"user":"6111f422-8e24-46a7-abc5-376b02f7419f"}],"created_date":"2022-03-05T15:00:07.759655Z","last_modified_date":"2022-04-03T16:31:15.357973Z","resume_id":"2daf6d05-ac14-4ef7-b7f3-a66e8dd540b9","content":{"profile":{"description":"About yourself asd asd asd asdasda dasd asd asdasd asda asd asd asd asd asd asd asd asd asdasd asd asd asd asd asd asd asd asd sa d&nbsp;","email":"ycwong360@gmail.com","githubURL":"https://github.com/WongYC19/QuickView","address":"Kuala Lumpur, Malaysia","linkedinURL":"https://www.linkedin.com/in/yc-022b04131/"},"skills":[{"name":"Sample Skill","level":"novice"},{"name":"asdasdasdasd","level":"expert"}],"project":[{"thumbnail":"gg","category":"Project Category","topic":"Project Topic","description":"Project description"}],"experience":[{"title":"Job Title","institution":"Company Name","periodStart":"2020","periodEnd":"Present","description":"Job description"}],"education":[{"title":"Bachelor","institution":"University of Sample","periodStart":"2017","periodEnd":"2019","description":"Education description"}],"languages":[{"name":"English","level":"expert"}]},"created_by":"666dfbb4-16dd-42d9-99cb-26ad9975d918"}
//  ]
