import jwt from "jsonwebtoken";
import User from "../models/User.js";
import CustomError from "../utils/customError.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // Token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new CustomError("Not authorized, token missing", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    req.user = user; // attach user to request
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new CustomError("Access token expired", 401));
    }
    next(error);
  }
};