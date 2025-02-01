const express = require("express");
const router = express.Router();
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const {
  test,
  registerOwner,
  loginOwner,
  getOwner,
} = require("../controllers/ownerController");
const {
  createMenuItem,
  getMenuItems,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// Middleware
router.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

// Auth Routes
router.get("/owner", test);
router.post("/owner/register", registerOwner);
router.post("/owner/login", loginOwner);
router.get("/owner/profile", getOwner);

// Menu Routes
router.get("/owner/menu/", getMenuItems);
router.post("/owner/menu/", upload.single("image"), createMenuItem);
router.put("/owner/menu/:id", upload.single("image"), updateMenuItem);
router.delete("/owner/menu/:id", deleteMenuItem);

// Serve uploaded images
router.use("/uploads", express.static("uploads"));

module.exports = router;
