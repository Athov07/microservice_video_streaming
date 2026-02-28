import React, { useState } from "react";
import API from "../services/api";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import Alert from "../components/Alert";

export default function OTPVerificationPage({ email, onVerified }) {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const handleVerifyOtp = async () => {
    try {
      const res = await API.post("/auth/verify-otp", { email, otp });
      setMessage("OTP verified successfully!");
      if (onVerified) onVerified(res.data.user);
    } catch (err) {
      setMessage(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="page-container flex items-center justify-center min-h-screen bg-bg">
      <Card className="w-full max-w-md">
        <h1 className="heading text-center">Verify OTP</h1>
        {message && <Alert type="error" message={message} />}
        <Input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="mb-4"
        />
        <Button onClick={handleVerifyOtp} className="w-full">Verify OTP</Button>
      </Card>
    </div>
  );
}