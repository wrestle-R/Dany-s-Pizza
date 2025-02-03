// const Event = require("../models/events");
// const Booking = require("../models/booking");

// // Book a seat
// exports.bookSeat = async (req, res) => {
//   try {
//     const { eventId, customerName, seatNumber, date, time } = req.body;

//     const event = await Event.findById(eventId);
//     if (!event) return res.status(404).json({ error: "Event not found" });

//     // Ensure time is between 7 PM - 11 PM with 1-hour intervals
//     const allowedTimes = ["19:00", "20:00", "21:00", "22:00"];
//     if (!allowedTimes.includes(time)) {
//       return res.status(400).json({ error: "Invalid time slot" });
//     }

//     // Check if seat is already booked for the given date and time
//     const existingBooking = await Booking.findOne({ eventId, seatNumber, date, time });
//     if (existingBooking) {
//       return res.status(400).json({ error: "Seat already booked for this slot" });
//     }

//     const newBooking = new Booking({ eventId, customerName, seatNumber, date, time });
//     await newBooking.save();

//     res.status(201).json(newBooking);
//   } catch (error) {
//     res.status(500).json({ error: "Error booking seat" });
//   }
// };

// // Get booked seats for an event
// exports.getBookedSeats = async (req, res) => {
//   try {
//     const { eventId } = req.params;
//     const { date, time } = req.query; // Get date and time from query params

//     const query = { eventId };
//     if (date) query.date = date;
//     if (time) query.time = time;

//     const bookings = await Booking.find(query);
//     res.status(200).json(bookings);
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching booked seats" });
//   }
// };

// // Cancel a booking (Only by the user who booked it)
// exports.cancelBooking = async (req, res) => {
//   try {
//     const { bookingId, customerName } = req.params;

//     const booking = await Booking.findById(bookingId);
//     if (!booking) return res.status(404).json({ error: "Booking not found" });

//     if (booking.customerName !== customerName) {
//       return res.status(403).json({ error: "Unauthorized to cancel this booking" });
//     }

//     await Booking.findByIdAndDelete(bookingId);
//     res.status(200).json({ message: "Booking canceled successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Error canceling booking" });
//   }
// };
