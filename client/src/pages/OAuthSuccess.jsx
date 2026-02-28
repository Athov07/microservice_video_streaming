import { useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const accessToken = queryParams.get("accessToken");
    const refreshToken = queryParams.get("refreshToken");
    // console.log("accessToken:", queryParams.get("accessToken"));
    // console.log("refreshToken:", queryParams.get("refreshToken"));

    if (!accessToken) {
      navigate("/login");
      return;
    }

    // ave tokens properly
    localStorage.setItem("accessToken", accessToken);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
      // console.log("Saved refreshToken:", refreshToken);
    } else {
      console.warn("No refreshToken found in URL!");
    }

    // Fetch user profile
    authService
      .getProfile(accessToken)
      .then((res) => {
        const user = res.data.user;
        login(user, accessToken, refreshToken);
        navigate("/profile");
      })
      .catch((err) => {
        console.error("Failed to fetch profile:", err);
        navigate("/login");
      });
  }, [location, navigate, login]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg font-medium">Logging you in...</p>
    </div>
  );
}