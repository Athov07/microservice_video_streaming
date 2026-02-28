import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import React, { useContext, setUser } from "react";

import AuthLayout from "./layouts/AuthLayout";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OTPVerificationPage from "./pages/OTPVerificationPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import ProfilePage from "./pages/ProfilePage";
import DashboardPage from "./pages/DashboardPage";
import OAuthSuccess from "./pages/OAuthSuccess";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <AuthLayout>
        <Routes>
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* ================= PUBLIC ROUTES ================= */}
          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to="/profile" />}
          />

          <Route
            path="/register"
            element={!user ? <RegisterPage /> : <Navigate to="/profile" />}
          />

          <Route
            path="/verify-otp"
            element={
              !user ? <OTPVerificationPage /> : <Navigate to="/profile" />
            }
          />

          <Route
            path="/forgot-password"
            element={!user ? <ForgotPasswordPage /> : <Navigate to="/login" />}
          />

          <Route
            path="/reset-password"
            element={!user ? <ResetPasswordPage /> : <Navigate to="/login" />}
          />

          {/* ================= PROTECTED ROUTES ================= */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              user && user.role === "admin" ? (
                <DashboardPage />
              ) : (
                <Navigate to="/profile" />
              )
            }
          />

          <Route path="/oauth-success" element={<OAuthSuccess />} />

          {/* <Route
            path="/oauth-success"
            element={<OAuthSuccess setUser={setUser} />}
          /> */}

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthLayout>
    </Router>
  );
}

export default App;
