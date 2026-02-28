const pool = require("../config/mysql");

exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.execute(
      "SELECT * FROM user_profiles WHERE user_id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, bio, avatar_url, banner_url } = req.body;

    await pool.execute(
      `INSERT INTO user_profiles (user_id, username, bio, avatar_url, banner_url)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       username = VALUES(username),
       bio = VALUES(bio),
       avatar_url = VALUES(avatar_url),
       banner_url = VALUES(banner_url)`,
      [userId, username, bio, avatar_url, banner_url]
    );

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




const axios = require("axios");

exports.getMyVideos = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID missing" });
    }

    const response = await fetch(
      `${process.env.VIDEO_SERVICE_URL}/api/videos/user/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Video Service Error:", errorData);
      return res.status(response.status).json({
        message: "Video service error",
      });
    }

    const data = await response.json();

    return res.status(200).json(data);

  } catch (error) {
    console.error("Internal Fetch Error:", error.message);
    return res.status(500).json({
      message: "Failed to fetch videos",
    });
  }
};