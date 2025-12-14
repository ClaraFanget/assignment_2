const express = require("express");
const router = express.Router();

const packageJson = require("../package.json");

router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    version: packageJson.version,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
