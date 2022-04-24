// import CookiesService from "./cookie.service";
const TOKEN_KEY = "token";

class TokenService {
  getLocalRefreshToken() {
    const token = JSON.parse(localStorage.getItem(TOKEN_KEY) ?? "{}");
    // const token = JSON.parse(CookiesService.getCookie(TOKEN_KEY) ?? "{}");
    return token?.refresh;
  }

  getLocalAccessToken() {
    const token = JSON.parse(localStorage.getItem(TOKEN_KEY) ?? "{}");
    // const token = JSON.parse(CookiesService.getCookie(TOKEN_KEY) ?? "{}");
    return token?.access;
  }

  // updateLocalAccessToken(token) {
  //   let user = JSON.parse(localStorage.getItem(TOKEN_KEY));
  //   user.accessToken = token.access;
  //   localStorage.setItem("user", JSON.stringify(user));
  // }

  getAuth() {
    const token = JSON.parse(localStorage.getItem(TOKEN_KEY) ?? "{}");
    // const token = JSON.parse(CookiesService.getCookie(TOKEN_KEY) ?? "{}");
    return token;
  }

  setAuth(AuthObject) {
    // const existingAuth = JSON.parse(
    //   CookiesService.getCookie(TOKEN_KEY) ?? "{}"
    // );
    // const newAuth = { ...existingAuth, ...AuthObject };
    // CookiesService.setCookie(TOKEN_KEY, JSON.stringify(newAuth));
    localStorage.setItem(TOKEN_KEY, JSON.stringify(AuthObject));
  }

  removeAuth() {
    // CookiesService.deleteCookie(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }
}

export default new TokenService();
