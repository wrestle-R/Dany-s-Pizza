const mongoose = require("mongoose");

const ShopSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
});

const ShopModel = mongoose.model("Shop", ShopSchema);

module.exports = ShopModel;
