const mongoose = require('mongoose');

// Define the schema for a Chef
const chefSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    specialty: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true
    },
    
  },
  {
    timestamps: true // Adds createdAt and updatedAt fields automatically
  }
);

// Create a model using the schema
const Chef = mongoose.model('Chef', chefSchema);

module.exports = Chef;
