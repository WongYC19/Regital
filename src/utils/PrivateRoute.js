import { Route, Redirect } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import ProfileService from "../services/profile.service";

function PrivateRoute({ component: Component, ...rest }) {
  const { isAuthenticated, userProfile, setUserProfile, logoutUser } =
    useContext(AuthContext);

  async function getUserProfile() {
    try {
      const profile = await ProfileService.getUserProfile();
      setUserProfile((prev) => ({ ...prev, ...profile }));
    } catch (error) {}
  }

  useEffect(() => {
    if (Object.keys(userProfile ?? {}).length === 0) {
      getUserProfile();
    }
    return () => {};
  }, [userProfile, setUserProfile, isAuthenticated, getUserProfile]);

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} {...rest} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
}

export default PrivateRoute;
