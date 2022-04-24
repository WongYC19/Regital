import axios from "axios";
import api from "./api";
import TokenService from "./token.service";
import CookiesService from "./cookie.service";
import { camelToSnakeObject } from "../utils/caseConversion";

class AuthService {
  async login(data) {
    data["username"] = data["email"];

    const URL = api.defaults.baseURL + api.endpoints["token"];

    const csrftoken = CookiesService.getCookie("csrftoken");

    const config = {
      credentials: "include",
      headers: {
        "X-CSRFToken": csrftoken,
      },
      mode: "same-origin",
    };

    const loginResponse = await axios.post(URL, data, config);
    const authObject = loginResponse?.data;
    return authObject;
  }

  logout() {
    this.cleanUp();
  }

  async signUp(payload) {
    const params = new URLSearchParams();

    payload = camelToSnakeObject(payload);

    for (let [key, value] of Object.entries(payload)) {
      params.append(key, value);
    }
    const csrftoken = CookiesService.getCookie("csrftoken");

    const config = {
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-CSRFToken": csrftoken,
      },
    };

    const registerResponse = await axios.post(
      api.defaults.baseURL + api.endpoints.register,
      params,
      config
    );

    return registerResponse;
  }

  CSRFToken() {
    let csrftoken = CookiesService.getCookie("csrftoken");
    if (!csrftoken) {
      const URL = api.defaults.baseURL + api.endpoints["csrftoken"];
      axios.get(URL).then((response) => {
        csrftoken = response.data["csrftoken"];
        CookiesService.setCookie("csrftoken", csrftoken, 5 * 60);
      });
    }

    if (!csrftoken) return null;
    return <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />;
  }

  isAuthenticated() {
    const authenticated = !!TokenService.getAuth()?.access;
    return authenticated;
  }

  cleanUp() {
    TokenService.removeAuth();
    const names = ["csrftoken", "userprofile", "token"];
    names.forEach((name) => CookiesService.deleteCookie(name));
    localStorage.removeItem("userprofile");
  }
}

export default new AuthService();
