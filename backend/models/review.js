const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  customerName: { type: String, required: true },
  chefRating: { type: Number, required: true, min: 1, max: 5 },
  menuRating: { type: Number, required: true, min: 1, max: 5 },
  locationRating: { type: Number, required: true, min: 1, max: 5 },
  description: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
