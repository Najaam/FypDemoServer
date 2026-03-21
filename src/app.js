const express = require("express");
const cors = require("cors");
const testRoutes = require("./route/testRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running"
  });
});

app.use("/api/tests", testRoutes);

module.exports = app;