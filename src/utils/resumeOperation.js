import jsPDF from "jspdf";
import ResumeService from "../services/resume.service";
import ProfileService from "../services/profile.service";
import ReactDOMServer from "react-dom/server";
import Resume from "../pages/Resume";

export async function getResumeList({ setResumeList, setSelection }) {
  const response = await ResumeService.getResumeList();
  setResumeList(response);
  setSelection((prev) => ({ ...prev, loading: true }));
}

export async function getUsers(setUserList) {
  const userData = await ProfileService.getUsers();
  setUserList(userData);
}

export function openResume(resumeId) {
  return (event) => {
    const win = window.open(`/shared_resume/view/${resumeId}`, "_blank");
    win.focus();
  };
}

export function editResume(resumeId) {
  return (event) => {
    const win = window.open(`/resume/${resumeId}`, "_blank");
    win.focus();
  };
}

export function publishResume({ setSelection, resumeId, viewId }) {
  return (event) => {
    setSelection((prev) => ({
      ...prev,
      resumeId,
      viewId,
      showPublish: true,
    }));
  };
}

export function downloadResume(resumeId) {
  return async (event) => {
    const resumeContent = await ResumeService.getResume(resumeId);
    const data = resumeContent;
    const initialData = data?.content ?? {};
    const templateId = parseInt(data.template_id);

    const resumeProps = {
      templateId: templateId,
      editable: false,
      showIcon: false,
      initialData,
    };

    const resumeMarkup = ReactDOMServer.renderToStaticMarkup(
      <Resume {...resumeProps} />
    );

    const html = `<!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8"></meta>
        </head>
        <body>${resumeMarkup}</body>
      </html>`;

    var doc = new jsPDF();
    doc.html(html, {
      html2canvas: {
        width: 200,
      },
      callback: function (doc) {
        doc.save("resume.pdf");
      },
    });
  };
}

function updateSetter(setter, obj) {
  setter((prevSelection) => ({ ...prevSelection, ...obj }));
}

export function removeResume({
  resumeList,
  setResumeList,
  setSelection,
  resumeId,
}) {
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
        updateSetter(setSelection, { severity: "success", message: data });
      })

      .catch((error) => {
        updateSetter(setSelection, {
          severity: "error",
          message: error?.message,
        });
      });
  };
}

async function revokePermission({
  resumeId,
  userId,
  setResumeList,
  setSelection,
}) {
  try {
    const accessResponse = await ResumeService.revokePermission(
      resumeId,
      userId
    );

    const data = accessResponse.data;

    setResumeList((prev) => {
      const resumeIndex = prev.findIndex(
        (resume) => resume.resume_id === resumeId
      );

      let permissions = prev[resumeIndex].permissions;
      permissions = permissions.filter((item) => item.user !== userId);
      prev[resumeIndex].permissions = permissions;

      updateSetter(setSelection, {
        allowedUsers: permissions,
        message: data?.message ?? "Revoke user access right successfully.",
        severity: "success",
      });
      return prev;
    });
  } catch (error) {
    updateSetter(setSelection, {
      message: error.message,
      severity: "error",
    });
  }
}

async function grantPermission({
  resumeId,
  userId,
  inputRight,
  setSelection,
  setResumeList,
}) {
  try {
    const newAllowedUser = await ResumeService.grantPermission(
      resumeId,
      userId,
      inputRight
    );

    setResumeList((prev) => {
      const resumeIndex = prev.findIndex(
        (resume) => resume.resume_id === resumeId
      );
      const allowedUsers = prev[resumeIndex].permissions;
      const userIndex = allowedUsers.findIndex((p) => p.user === userId);
      // if user is not allow before, then add the user to the list
      if (userIndex === -1) {
        const newAllowedUsers = prev[resumeIndex].permissions.concat([
          newAllowedUser,
        ]);

        prev[resumeIndex].permissions = newAllowedUsers;

        updateSetter(setSelection, {
          allowedUsers: newAllowedUsers,
          message: "Granted view access right to new user.",
          severity: "success",
        });
        return prev;
      }

      prev[resumeIndex].permissions[userIndex].right = inputRight;

      updateSetter(setSelection, {
        message: `Updated access right for user ${
          newAllowedUser.allowed_user.first_name +
          " " +
          newAllowedUser.allowed_user.last_name
        }.`,
        severity: "success",
        allowedUsers: prev[resumeIndex].permissions,
      });

      return prev;
    });
  } catch (error) {
    updateSetter(setSelection, {
      message: error.message,
      severity: "error",
    });
  }
}
function permissionSetter({ resume, resumeId, setResumeList, setSelection }) {
  return (userId, inputRight) => {
    if ((inputRight === "null") | (inputRight === null)) {
      revokePermission({
        resumeId,
        userId,
        setResumeList,
        setSelection,
      });
      return false;
    }

    grantPermission({
      resumeId,
      userId,
      inputRight,
      resume,
      setSelection,
      setResumeList,
    });
  };
}

export function toggleAccess({
  selection,
  setSelection,
  resumeList,
  setResumeList,
  resumeId,
  inputRight = null,
}) {
  return (event) => {
    const anchorEl = selection.anchorEl ? null : event.currentTarget;
    const resume = resumeList.find((resume) => resume.resume_id === resumeId);
    const allowedUsers = resume.permissions;
    // const allowedUserId = allowedUsers.imgData;

    // updateSetter(setSelection, { allowedUsers: allowedUsers });
    const updatePermission = permissionSetter({
      resumeId,
      resume,
      inputRight,
      setSelection,
      setResumeList,
    });

    // Update list of allowed user
    updateSetter(setSelection, {
      resumeId,
      showAccess: anchorEl,
      updatePermission,
      allowedUsers: allowedUsers,
    });
  };
}

export function closePublish(setSelection) {
  updateSetter(setSelection, { showPublish: false });
  //   setSelection((prev) => ({ ...prev, showPublish: false }));
}
