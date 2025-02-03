const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  customerName: { type: String, required: true },
  seatNumber: { type: Number, required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  time: { type: String, required: true }  // Format: HH:mm (24-hour)
});

module.exports = mongoose.model("Booking", BookingSchema);
