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