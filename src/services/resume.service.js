import axios from "axios";
import api, { API_URL } from "./api";
const RESUME_ENDPOINTS = api.endpoints["resume"];
const PERMISSION_ENDPOINTS = api.endpoints["permission"];
const VIEW_ENDPOINTS = api.endpoints["view"];
const TEMPLATE_ENDPOINTS = api.endpoints["templates"];
const SHARED_RESUME_ENDPOINTS = api.endpoints["sharedResume"];

class ResumeService {
  async templateList() {
    const response = await api.get(TEMPLATE_ENDPOINTS);
    return response;
  }

  async getResumeList() {
    const response = await api.get(RESUME_ENDPOINTS);
    const content = response.data;
    return content;
  }

  async getResume(resumeId) {
    const response = await api.get(RESUME_ENDPOINTS + resumeId + "/");
    return response.data;
  }

  async createResume(template) {
    const data = { template };
    const response = await api.post(RESUME_ENDPOINTS, data);
    return response.data;
  }

  async updateResume(resumeId, content) {
    const data = { content };
    const response = await api.put(RESUME_ENDPOINTS + resumeId + "/", data);
    return response.data;
  }

  async deleteResume(resumeId) {
    const response = await api.delete(RESUME_ENDPOINTS + resumeId + "/");
    return response.data;
  }

  async grantPermission(resumeId, targetUserId, right) {
    const data = {
      user: targetUserId,
      resume: resumeId,
      right,
    };
    const response = await api.post(PERMISSION_ENDPOINTS, data);
    return response.data;
  }

  async revokePermission(resumeId, targetUserId) {
    const data = { user: targetUserId, resume: resumeId };
    try {
      const response = await api.delete(PERMISSION_ENDPOINTS + "1/", { data });
      return response.data;
    } catch (error) {
      console.log(error);
      return {};
    }
  }

  async getSharedResume() {
    try {
      const response = await api.get(SHARED_RESUME_ENDPOINTS);
      return response.data;
    } catch (error) {
      console.log(error);
      return {};
    }
  }

  async publishView(resumeId) {
    const data = { resume_id: resumeId };
    const response = await api.post(VIEW_ENDPOINTS, data);
    return response.data;
  }

  async accessView(viewId) {
    const response = await axios.get(API_URL + VIEW_ENDPOINTS + viewId);
    return response.data;
  }
}

// resume component
// - author profile (tooltip: name)
// - template thumbnail
// - share
// - edit button (for author and authorized user)
// - delete button
// - authorize (profile pic at bottom, click to expand)
// - viewed count
// 1) add editing space
// 2) support save function
// 3) Fix pdf issue
// 4) add publish resume function
// 5) display list of resume by users

export default new ResumeService();
