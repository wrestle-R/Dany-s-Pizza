const express = require("express");
const router = express.Router();
const { createShopItem, getShopItems, deleteShopItem, updateShopItem } = require("../controllers/shopController");
const multer = require("multer");
const path = require("path");

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Shop-uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/", upload.single("image"), createShopItem);
router.get("/", getShopItems);
router.delete("/:id", deleteShopItem);  // Delete route
router.put("/:id", upload.single("image"), updateShopItem);  // Edit route

module.exports = router;
