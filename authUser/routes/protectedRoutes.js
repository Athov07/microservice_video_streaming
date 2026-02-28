import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { uploadProfileImage, getProfile } from "../controllers/userController.js";
import { auditLogger } from "../middleware/auditMiddleware.js";

const router = express.Router();

// Any authenticated user
router.get("/profile", protect, getProfile);

// Only admin
router.get(
  "/admin-dashboard",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome to Admin Dashboard",
    });
  }
);


router.post(
  "/upload-profile",
  protect,
  upload.single("image"),
  auditLogger({
    action: "VIEW_PROFILE",
    module: "USER",
  }),
  uploadProfileImage
);



export default router;