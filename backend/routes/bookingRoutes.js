const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");

// Fetch bookings for a specific event, date, and time
router.get("/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { date, time } = req.query;
    const bookings = await Booking.find({ eventId, date, time });
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Create a new booking
router.post("/", async (req, res) => {
  try {
    const { eventId, customerId, customerName, seatNumber, date, time } = req.body;
    const existingBooking = await Booking.findOne({ eventId, seatNumber, date, time });

    if (existingBooking) {
      return res.status(400).json({ error: "Seat already booked" });
    }

    const newBooking = new Booking({ eventId, customerId, customerName, seatNumber, date, time });
    await newBooking.save();
    res.status(201).json({ message: "Booking successful", booking: newBooking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Cancel a booking
router.delete("/", async (req, res) => {
  try {
    const { eventId, seatNumber, customerId, date, time } = req.body;
    const deletedBooking = await Booking.findOneAndDelete({ eventId, seatNumber, customerId, date, time });

    if (!deletedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
