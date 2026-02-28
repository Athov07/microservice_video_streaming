import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

// ===============================
// Create Gmail Transporter
// ===============================
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // false for port 587
  auth: {
    user: process.env.EMAIL_USER, // your gmail
    pass: process.env.EMAIL_PASS, // your gmail app password
  },
});

// ===============================
// Verify SMTP Connection (Runs Once)
// ===============================
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Connection Failed:");
    console.error(error.message);
  } else {
    console.log("SMTP Server is Ready to Send Emails");
  }
});

// ===============================
// Send OTP Email Function
// ===============================
export const sendOtpEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: `"Auth System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Email Verification</h2>
          <p>Your OTP code is:</p>
          <h1 style="color: #4CAF50;">${otp}</h1>
          <p>This OTP will expire in 5 minutes.</p>
          <br/>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.messageId);
    return true;

  } catch (error) {
    console.error("Email Sending Failed:");
    console.error(error.message);
    throw new Error("Email could not be sent");
  }
};