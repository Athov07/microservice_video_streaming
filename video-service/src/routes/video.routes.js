const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");
const videoController = require("../controllers/video.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.post(
  "/upload",
  verifyToken,
  upload.single("video"),
  videoController.createVideo
);

router.get("/user/:userId", videoController.getVideosByUser);

module.exports = router;