const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/verifyToken");
const {
  getMyProfile,
  updateProfile,
  getMyVideos
} = require("../controllers/profile.controller");

router.get("/me", verifyToken, getMyProfile);
router.put("/me", verifyToken, updateProfile);
router.get("/me/videos", verifyToken, getMyVideos);

module.exports = router;