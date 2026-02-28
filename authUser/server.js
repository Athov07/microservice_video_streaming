import dotenv from "dotenv";
dotenv.config();

import express from "express";
import "./utils/sendEmail.js";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import rateLimiter from "./middleware/rateLimiter.js";
import helmet from "helmet";
import protectedRoutes from "./routes/protectedRoutes.js";
import passport from "passport";
import session from "express-session";
import { configurePassport } from "./config/passport.js";


const app = express();

// Core middlewares
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(rateLimiter);

app.use(helmet()); // secure headers
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // configure frontend origin

// Session (required for Passport OAuth)
app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Configure passport strategies
configurePassport();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes); // protected routes
app.use("/api/user", protectedRoutes);

// Global error handler (must be last)
app.use(errorHandler);

// Start server after DB connects
const startServer = async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start");
    process.exit(1);
  }
};

startServer();