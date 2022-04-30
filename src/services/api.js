import axios from "axios";
import TokenService from "./token.service";
import AuthService from "./auth.service";

export const API_URL = "/";

const apiEndpoints = {
  register: "api/register/",
  token: "api/token/",
  refreshToken: "api/token/refresh/",
  userProfile: "api/user_profile/",
  changePassword: "api/change_password/",
  resetPassword: "api/reset_password/",
  resetPasswordConfirm: "api/reset_password_confirm/",
  csrftoken: "api/get_csrf_token/",
  templates: "api/templates/",
  resume: "api/resume/",
  users: "api/users/",
  permission: "api/permission/",
  view: "api/view/",
  sharedResume: "api/shared_resume/",
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  defaults: {
    xsrfCookieName: "csrftoken",
    xsrfHeaderName: "X-CSRFToken",
  },
});

api.interceptors.request.use(
  (config) => {
    const accessToken = TokenService.getLocalAccessToken();
    config.headers["Authorization"] = "Bearer " + String(accessToken);
    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalConfig = error.config ?? {};

    if (originalConfig.url === "/login" || !error.response) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;
      const refreshToken = TokenService.getLocalRefreshToken();
      try {
        const newResponse = await axios.post(
          API_URL + apiEndpoints.refreshToken,
          {
            refresh: refreshToken,
          }
        );
        const authObject = newResponse.data;
        TokenService.setAuth(authObject);
      } catch (exception) {
        AuthService.logout();
      }

      return api(originalConfig);
    }

    return Promise.reject(error);
  }
);

api.endpoints = apiEndpoints;

export default api;
