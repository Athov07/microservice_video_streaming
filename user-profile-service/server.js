require("dotenv").config();
const express = require("express");
const cors = require("cors");

const profileRoutes = require("./src/routes/profile.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/profile", profileRoutes);

app.listen(process.env.PORT, () => {
  console.log(`User Profile Service running on port ${process.env.PORT}`);
});