import CustomError from "../utils/customError.js";

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new CustomError("You are not authorized to access this resource", 403)
      );
    }
    next();
  };
};