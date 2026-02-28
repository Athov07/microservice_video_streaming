const mongoose = require("mongoose");

const videoMetaSchema = new mongoose.Schema({
  videoId: {
    type: String,
    required: true,
  },
  description: String,
  tags: [String],
  thumbnails: [String],
  extraData: Object,
}, { timestamps: true });

module.exports = mongoose.model("VideoMeta", videoMetaSchema);