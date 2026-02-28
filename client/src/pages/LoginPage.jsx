import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../services/api";
import { AuthContext } from "../context/AuthContext";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import Alert from "../components/Alert";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      return setError("All fields are required");
    }

    try {
      setLoading(true);

      const res = await authService.login(email, password);

      // Safely extract user, accessToken, and refreshToken
      const user = res.data.user || res.data?.data?.user;
      const accessToken = res.data.accessToken || res.data?.data?.accessToken;
      const refreshToken =
        res.data.refreshToken || res.data?.data?.refreshToken;

      if (!user || !accessToken || !refreshToken) {
        throw new Error(res.data?.message || "Invalid response from server");
      }

      // Save in AuthContext + localStorage
      login(user, accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      navigate("/profile"); // redirect after login
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // GOOGLE LOGIN
  // ==============================
  const handleGoogleLogin = () => {
    authService.googleLogin();
  };

  return (
    <div className="flex items-center justify-center bg-bg pt-10 ">
      <Card className="w-full max-w-md ">
        <h1 className="text-2xl font-bold text-center mb-4">Login</h1>

        {error && <Alert message={error} />}

        <form onSubmit={handleLogin}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-2"
          />
          <div className="text-right mb-4">
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="my-4 text-center text-gray-500">OR</div>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-gray-600 hover:bg-gray-400 text-white flex items-center justify-center gap-3 py-2 rounded-lg"
        >
          {" "}
          <img
            width="28"
            height="26"
            src="https://img.icons8.com/color/48/google-logo.png"
            alt="google-logo"
          />
          Continue with Google
        </button>
      </Card>
    </div>
  );
}
