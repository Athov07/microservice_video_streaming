import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // your backend base URL
});

// Attach access token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API service functions
const authService = {
  // LOGIN
  login: async (email, password) => {
    return await API.post("/auth/login", { email, password });
  },

  // GOOGLE LOGIN → backend redirects directly

  // SEND OTP (for registration)
  sendOtp: async (email) => {
    return await API.post("/auth/send-otp", { email });
  },

  // RESEND OTP
  resendOtp: async (email) => {
    return await API.post("/auth/resend-otp", { email });
  },

  // REGISTER (with OTP)
  register: async (name, email, password, otp) => {
    return await API.post("/auth/register", { name, email, password, otp });
  },

  // FORGOT PASSWORD
  forgotPassword: async (email) => {
    return await API.post("/auth/forgot-password", { email });
  },

  // RESET PASSWORD
  resetPassword: async (email, otp, newPassword) => {
    return await API.post("/auth/reset-password", { email, otp, newPassword });
  },

  // GET PROFILE
  getProfile: async () => {
    return await API.get("/protected/profile");
  },

  // DASHBOARD → role-based data
  getDashboard: async () => {
    return await API.get("/protected/dashboard");
  },

  // LOGOUT
  logout: async (refreshToken) => {
    // send refreshToken in request body
    return await API.post("/auth/logout", { token: refreshToken });
  },

  // GOOGLE LOGIN → backend redirect
  googleLogin: () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  },

  uploadProfileImage: async (formData) => {
    return await API.post("/user/upload-profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default authService;
