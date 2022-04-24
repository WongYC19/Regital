class CookiesService {
  setCookie(name, value, seconds = null) {
    let expires = "";
    if (seconds) {
      const date = new Date();
      date.setTime(date.getTime() + seconds * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    const cookieValue = name + "=" + (value ?? "") + expires + "; path=/";
    document.cookie = cookieValue;
  }

  getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      var cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  getCookieNames() {
    let cookies = document.cookie;
    return cookies.split(";").map((cookie) => cookie.trim().split("=")[0]);
  }

  deleteCookie(name, path = "/") {
    document.cookie =
      name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=" + path;
  }
}

export default new CookiesService();

//   getCookie(name) {
//     let nameEQ = name + "=";
//     const cookies = document.cookie.split(";");
//     let targetCookie = null;

//     cookies.forEach((cookie) => {
//       cookie = cookie.trim();
//       if (cookie.indexOf(nameEQ) === 0) {
//         targetCookie = cookie.substring(nameEQ.length, cookie.length);
//         return targetCookie;
//       }
//     });

//     return targetCookie;
//   }
