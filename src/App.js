import { BrowserRouter as Router, Route } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Resume from "./pages/Resume";
import ResumeList from "./pages/ResumeList";
import SharedResumeList from "./pages/SharedResumeList";
import PublicView from "./pages/PublicView";
import CssBaseline from "@mui/material/CssBaseline";
import CustomThemeProvider from "./contexts/ThemeContext";

import {
  PasswordResetView,
  PasswordResetConfirmView,
  PasswordResetDoneView,
} from "./pages/PasswordReset";

function App() {
  return (
    <Router>
      <CustomThemeProvider startingTheme="light">
        <CssBaseline />
        <AuthProvider>
          <PrivateRoute exact path="/" component={Dashboard} />
          <PrivateRoute exact path="/resume" component={ResumeList} />
          <PrivateRoute
            exact
            path="/shared_resume"
            component={SharedResumeList}
          />
          <PrivateRoute
            exact
            path="/shared_resume/view/:uid"
            component={Resume}
            editable={false}
          />
          <PrivateRoute exact path="/resume/:uid" component={Resume} />
          <PrivateRoute exact path="/profile" component={Profile} />
          <Route exact path="/view/:uid" component={PublicView} />
          <Route component={LoginPage} path="/login" />
          <Route component={SignUpPage} path="/signup" />
          <Route component={PasswordResetView} path="/password_reset" />
          <Route
            component={PasswordResetConfirmView}
            path="/password_reset_confirm"
            exact
          />
          <Route
            component={PasswordResetConfirmView}
            path="/password_reset_confirm/:uid/:token"
          />
          <Route
            component={PasswordResetDoneView}
            path="/password_reset_done"
          />
        </AuthProvider>
      </CustomThemeProvider>
    </Router>
  );
}

export default App;
