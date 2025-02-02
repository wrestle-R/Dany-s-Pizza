const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  items: [
    {
      shopItemId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
      quantity: { type: Number, required: true, default: 1 },
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("ShopCart", CartSchema);
