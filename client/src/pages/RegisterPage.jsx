import React, { useState } from "react";
import authService from "../services/api";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import Alert from "../components/Alert";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ==============================
  // EMAIL VALIDATION (FOR OTP)
  // ==============================
  const validateEmail = () => {
    if (!form.email) return "Email is required";
    if (!form.email.includes("@")) return "Email must contain @";
    return null;
  };

// ==============================
// FULL VALIDATION (FOR REGISTER)
// ==============================
const validateRegister = () => {
  const { name, password, confirmPassword, otp } = form;

  if (!name || !password || !confirmPassword || !otp) {
    return "All fields are required";
  }

  // Strong password validation
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordRegex.test(password)) {
    return "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match";
  }

  return null;
};

  // ==============================
  // SEND OTP
  // ==============================
  const handleSendOtp = async () => {
    setError("");
    setSuccess("");

    const emailError = validateEmail();
    if (emailError) return setError(emailError);

    try {
      setLoading(true);
      await authService.sendOtp(form.email);
      setOtpSent(true);
      setSuccess("OTP sent to your email");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // RESEND OTP
  // ==============================
  const handleResendOtp = async () => {
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      await authService.resendOtp(form.email);
      setSuccess("OTP resent successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // REGISTER
  // ==============================
  const handleRegister = async () => {
    setError("");
    setSuccess("");

    const validationError = validateRegister();
    if (validationError) return setError(validationError);

    try {
      setLoading(true);

      await authService.register(
        form.name,
        form.email,
        form.password,
        form.otp
      );

      setSuccess("Registration successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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
    <div className="flex items-center justify-center pt-20 bg-gray-100">
      <Card className="w-full max-w-md p-6 ">
        <h1 className="text-2xl font-bold text-center mb-4">Register</h1>

        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        {/* EMAIL */}
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="mb-3"
          disabled={otpSent}
        />

        {!otpSent ? (
          <Button
            onClick={handleSendOtp}
            className="w-full mb-4"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP"}
          </Button>
        ) : (
          <>
            <Input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="mb-3"
            />

            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="mb-3"
            />

            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="mb-3"
            />

            <Input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={form.otp}
              onChange={handleChange}
              className="mb-2"
            />

            <div className="flex justify-between items-center mb-4">
              <Button
                type="button"
                onClick={handleResendOtp}
                className="w-full text-sm text-blue-600  bg-red-500 hover:bg-red-600"
                disabled={loading}
              >
                Resend OTP
              </Button>
            </div>

            <Button
              onClick={handleRegister}
              className="w-full"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </>
        )}

        {/* GOOGLE LOGIN */}
        <div className="my-4 text-center text-gray-500 text-sm">
          OR
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-gray-600 hover:bg-gray-400 text-white flex items-center justify-center gap-3 py-2 rounded-lg"
        > <img width="28" height="26" src="https://img.icons8.com/color/48/google-logo.png" alt="google-logo"/>
          Continue with Google
        </button>
      </Card>
    </div>
  );
}