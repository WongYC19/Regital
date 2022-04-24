import { createContext, useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router";
import AuthService from "../services/auth.service";
import TokenService from "../services/token.service";
import ProfileService from "../services/profile.service";
import api from "../services/api";
import { snakeToCamelObject } from "../utils/caseConversion";
import useLocalStorage from "../hooks/useLocalStorage";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const history = useHistory();
  const location = useLocation();

  const defaultProfile = JSON.parse(
    localStorage.getItem("userprofile") ?? "{}"
  );
  const [userProfile, setUserProfile] = useLocalStorage(
    "userprofile",
    defaultProfile
  );
  const defaultAuth = AuthService.isAuthenticated();
  const [isAuthenticated, setIsAuthenticated] = useState(defaultAuth);

  useEffect(() => {
    async function getUserProfile() {
      const profile = await ProfileService.getUserProfile();
      setUserProfile((prev) => ({ ...prev, ...profile }));
    }

    if (Object.keys(userProfile ?? {}).length === 0) {
      getUserProfile();
    }
    return () => {};
  });

  async function loginUser(data) {
    const authObject = await AuthService.login(data);
    const notEmpty = Object.keys(authObject).length > 0;

    const isAuthenticated = !!authObject && notEmpty;
    setIsAuthenticated(isAuthenticated);

    if (!isAuthenticated) {
      console.log("Not authenticated, clean up and redirect to login page.");
      AuthService.cleanUp();
      history.push("/login");
      return authObject;
    }

    // Update authentication
    TokenService.setAuth(authObject);
    const response = await api.get(api.endpoints["userProfile"]);
    let userProfile = snakeToCamelObject(response.data);
    setUserProfile(userProfile);
    return authObject;
  }

  async function logoutUser(data) {
    await AuthService.logout();
    setIsAuthenticated(false);
    AuthService.cleanUp();
    history.push("/login");
  }

  const contextData = {
    userProfile,
    setUserProfile,
    history,
    location,
    isAuthenticated,
    loginUser,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
