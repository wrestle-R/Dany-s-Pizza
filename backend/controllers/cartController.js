const Cart = require('../models/cart');
const Menu = require('../models/menu');
const mongoose = require('mongoose');

// Add item to cart
exports.addToCart = async (req, res) => {
  const { customerId, menuItemId, quantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(customerId) || !mongoose.Types.ObjectId.isValid(menuItemId)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    // Find or create cart
    let cart = await Cart.findOne({ customer: customerId });
    if (!cart) {
      cart = new Cart({
        customer: customerId,
        items: [],
        totalPrice: 0,
      });
    }

    // Find menu item
    const menuItem = await Menu.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.menuItemId.toString() === menuItemId
    );

    if (existingItemIndex > -1) {
      // Update existing item quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        menuItemId: menuItem._id,
        quantity: quantity,
        name: menuItem.name,
        price: menuItem.price
      });
    }

    // Recalculate total price
    cart.totalPrice = cart.items.reduce((total, item) => {
      return total + (item.quantity * item.price);
    }, 0);

    await cart.save();

    // Format response
    const formattedCart = {
      items: cart.items.map(item => ({
        _id: item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      totalPrice: cart.totalPrice
    };

    res.status(200).json(formattedCart);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Error adding item to cart' });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  const { customerId, menuItemId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(customerId) || !mongoose.Types.ObjectId.isValid(menuItemId)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    const cart = await Cart.findOne({ customer: customerId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Remove item from cart
    cart.items = cart.items.filter(
      item => item.menuItemId.toString() !== menuItemId
    );

    // Recalculate total price
    cart.totalPrice = cart.items.reduce((total, item) => {
      return total + (item.quantity * item.price);
    }, 0);

    await cart.save();

    // Format response
    const formattedCart = {
      items: cart.items.map(item => ({
        _id: item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      totalPrice: cart.totalPrice
    };

    res.status(200).json(formattedCart);
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Error removing item from cart' });
  }
};

// Get cart
exports.getCart = async (req, res) => {
  const { customerId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    return res.status(400).json({ message: 'Invalid customer ID format' });
  }

  try {
    const cart = await Cart.findOne({ customer: customerId })
      .populate('items.menuItemId', 'name price image');

    if (!cart) {
      // Return empty cart instead of 404
      return res.status(200).json({
        items: [],
        totalPrice: 0
      });
    }

    // Format response
    const formattedCart = {
      items: cart.items.map(item => ({
        _id: item.menuItemId._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.menuItemId.image
      })),
      totalPrice: cart.totalPrice
    };

    res.status(200).json(formattedCart);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Error fetching cart' });
  }
};

// Update item quantity in cart
exports.updateCartItemQuantity = async (req, res) => {
  const { customerId, menuItemId, quantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(customerId) || !mongoose.Types.ObjectId.isValid(menuItemId)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  if (quantity < 1) {
    return res.status(400).json({ message: 'Quantity must be at least 1' });
  }

  try {
    const cart = await Cart.findOne({ customer: customerId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find item in cart
    const itemIndex = cart.items.findIndex(
      item => item.menuItemId.toString() === menuItemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity;

    // Recalculate total price
    cart.totalPrice = cart.items.reduce((total, item) => {
      return total + (item.quantity * item.price);
    }, 0);

    await cart.save();

    // Format response
    const formattedCart = {
      items: cart.items.map(item => ({
        _id: item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      totalPrice: cart.totalPrice
    };

    res.status(200).json(formattedCart);
  } catch (error) {
    console.error('Update cart quantity error:', error);
    res.status(500).json({ message: 'Error updating item quantity' });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  const { customerId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    return res.status(400).json({ message: 'Invalid customer ID format' });
  }

  try {
    const cart = await Cart.findOne({ customer: customerId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Clear cart items and reset total price
    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();

    res.status(200).json({
      items: [],
      totalPrice: 0
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Error clearing cart' });
  }
};

// controllers/cartController.js
exports.updateQuantity = async (req, res) => {
  const { customerId, menuItemId, quantity } = req.body;

  // Validate customerId and menuItemId
  if (!mongoose.Types.ObjectId.isValid(customerId) || !mongoose.Types.ObjectId.isValid(menuItemId)) {
    return res.status(400).json({ message: "Invalid customer or menu item ID format" });
  }

  if (typeof quantity !== "number" || quantity < 0) {
    return res.status(400).json({ message: "Quantity must be a positive number or zero" });
  }

  try {
    // Find the customer's cart
    let cart = await Cart.findOne({ customer: customerId }).populate("items.menuItemId", "price");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex(item => item.menuItemId._id.toString() === menuItemId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (quantity === 0) {
      // Remove item if quantity is set to 0
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }

    // Recalculate total price
    cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.menuItemId.price, 0);

    await cart.save();

    res.status(200).json({
      message: "Cart updated successfully",
      cart: {
        items: cart.items.map(item => ({
          _id: item.menuItemId._id,
          name: item.menuItemId.name,
          price: item.menuItemId.price,
          quantity: item.quantity
        })),
        totalPrice: cart.totalPrice
      }
    });
  } catch (error) {
    console.error("Update quantity error:", error);
    res.status(500).json({ message: "Server error while updating cart" });
  }
};

