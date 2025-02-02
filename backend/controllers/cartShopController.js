const ShopCart = require("../models/cartShop");

// Get customer cart
exports.getCart = async (req, res) => {
  const { customerId } = req.query; // Receive customerId from frontend

  try {
    const cart = await ShopCart.findOne({ customerId }).populate("items.shopItemId");
    res.json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving cart" });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  const { customerId, shopItemId, quantity } = req.body;

  try {
    let cart = await ShopCart.findOne({ customerId });

    if (!cart) {
      cart = new ShopCart({ customerId, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.shopItemId.toString() === shopItemId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ shopItemId, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error adding item to cart" });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  const { customerId, itemId } = req.body;

  try {
    let cart = await ShopCart.findOne({ customerId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(item => item.shopItemId.toString() !== itemId);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error removing item from cart" });
  }
};

// Update cart quantity
exports.updateCartQuantity = async (req, res) => {
  const { customerId, itemId, quantity } = req.body;

  try {
    let cart = await ShopCart.findOne({ customerId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(item => item.shopItemId.toString() === itemId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      return res.json(cart);
    }

    res.status(404).json({ message: "Item not found in cart" });
  } catch (error) {
    res.status(500).json({ message: "Error updating quantity" });
  }
};
