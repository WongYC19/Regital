import { Route, Redirect } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import ProfileService from "../services/profile.service";

function PrivateRoute({ component: Component, ...rest }) {
  const { isAuthenticated, userProfile, setUserProfile } =
    useContext(AuthContext);

  useEffect(() => {
    async function getUserProfile() {
      try {
        const profile = await ProfileService.getUserProfile();
        setUserProfile((prev) => ({ ...prev, ...profile }));
      } catch (error) {}
    }

    if (isAuthenticated && Object.keys(userProfile ?? {}).length === 0) {
      getUserProfile();
    }
    return () => {};
  }, [isAuthenticated]);

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
