const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Video Library Backend is running 🚀"
  });
});

module.exports = app;
