const express = require("express");
const router = express.Router();
const { createEvent, getEvents } = require("../controllers/eventController");
const multer = require("multer");
const path = require("path");

// Ensure "Event-uploads" directory exists
const fs = require("fs");
const uploadDir = "Event-uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Event-uploads/"); // ✅ Ensure this matches static folder in `server.js`
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.post("/", upload.single("image"), createEvent); // ✅ POST route for adding events
router.get("/", getEvents); // ✅ GET route for fetching events

module.exports = router;
