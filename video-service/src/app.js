const dotenv = require("dotenv");
const express = require("express");
const connectMongo = require("./config/mongo");
const videoRoutes = require("./routes/video.routes");
const { connectProducer } = require("./config/kafka");



dotenv.config();
connectMongo();
(async () => {
  try {
    await connectProducer();
  } catch (error) {
    console.error("Kafka not available. Shutting down service.");
    process.exit(1);
  }
})();

const app = express();
// DEBUG ROUTE
app.get("/", (req, res) => {
  res.send("Video Service Working");
});

app.use(express.json());
app.use("/api/videos", videoRoutes);

module.exports = app;