const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  isPizza: { type: Boolean, required: true },  // Added isPizza field
  description: { type: String, required: true },  // Added description field
  isVeg: {type:Boolean, required:true},
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
