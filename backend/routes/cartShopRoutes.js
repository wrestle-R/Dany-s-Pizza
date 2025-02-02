const express = require("express");
const { getCart, addToCart, removeFromCart, updateCartQuantity } = require("../controllers/cartShopController");

const router = express.Router();

router.get("/", getCart);
router.post("/add", addToCart);
router.put("/update", updateCartQuantity);
router.delete("/remove", removeFromCart);

module.exports = router;
