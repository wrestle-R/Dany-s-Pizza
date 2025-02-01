const mongoose = require('mongoose');



const cartItemSchema = new mongoose.Schema({
    menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true },
    quantity: { type: Number, required: true },
    name: String,    // Add these fields to store denormalized data
    price: Number,   // This helps with performance and data consistency
  });
  
  const cartSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    items: [cartItemSchema],
    totalPrice: { type: Number, default: 0 },
  });

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
