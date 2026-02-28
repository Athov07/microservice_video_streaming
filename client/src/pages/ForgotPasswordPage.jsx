import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/api";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import Alert from "../components/Alert";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setMessage("");

    if (!email) return setError("Email is required");

    try {
      // Use authService function
      const res = await authService.forgotPassword(email);
      setMessage(res.data.message);

      // Redirect to Reset Password page with email as query param
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.log("Error:", err);
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center pt-20 bg-gray-100">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">Forgot Password</h1>

        {error && <Alert message={error} />}
        {message && <Alert type="success" message={message} />}

        <Input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4"
        />

        <Button onClick={handleSubmit} className="w-full">
          Send Reset OTP
        </Button>
      </Card>
    </div>
  );
}
