const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  seats: { type: Array, default: Array(30).fill(false) }, // false means available, true means booked
});

module.exports = mongoose.model("Event", EventSchema);
