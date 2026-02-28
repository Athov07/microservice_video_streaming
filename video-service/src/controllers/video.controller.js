const { v4: uuidv4 } = require("uuid");
const pool = require("../config/mysql");
const VideoMeta = require("../models/videoMeta.model");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const { producer } = require("../config/kafka");

exports.createVideo = async (req, res) => {
  try {
    const { title, category, visibility, description, tags } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Video file required" });
    }

    // Get userId from JWT middleware
    const userId = req.user.id; // make sure JWT payload contains "id"

    const videoId = uuidv4();

    // Upload to Cloudinary
    const uploadToCloudinary = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "video" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const uploadResult = await uploadToCloudinary();

    const videoUrl = uploadResult.secure_url;
    const duration = uploadResult.duration || 0;

    // Store in MySQL
    await pool.execute(
      `INSERT INTO videos 
       (video_id, user_id, title, category, visibility, duration, video_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [videoId, userId, title, category, visibility, duration, videoUrl]
    );

    // Publish Kafka Event
    await producer.send({
      topic: "video-events",
      messages: [
        {
          key: "VIDEO_CREATED",
          value: JSON.stringify({
            event: "VIDEO_CREATED",
            videoId: videoId,
            userId: userId,
            videoUrl: videoUrl,
            createdAt: new Date().toISOString(),
          }),
        },
      ],
    });

    // Store metadata in MongoDB
    await VideoMeta.create({
      videoId,
      description,
      tags: tags ? tags.split(",") : [],
    });

    res.status(201).json({
      message: "Video uploaded successfully",
      videoId,
      videoUrl,
    });

  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: err.message });
  }
};

