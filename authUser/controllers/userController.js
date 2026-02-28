import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";
import streamifier from "streamifier";


// =========================================
// Upload Profile Image
// =========================================

export const uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user.id; // from auth middleware

    // Upload to Cloudinary
    const streamUpload = (buffer) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profile_images" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });

    const result = await streamUpload(req.file.buffer);

    // Save image URL to DB
    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage: result.secure_url },
      { new: true }
    );

    res.json({
      success: true,
      message: "Profile image uploaded",
      imageUrl: result.secure_url,
      user,
    });

  } catch (error) {
    next(error);
  }
};



// =========================================
// Get Profile
// =========================================
 
export const getProfile = async (req, res, next) => {
  try {
    // Always fetch fresh data from DB
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
      cached: false,
    });

  } catch (error) {
    next(error);
  }
};