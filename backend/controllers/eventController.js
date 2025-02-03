const Event = require("../models/events");

// Create an event
exports.createEvent = async (req, res) => {
  try {
    const { title, description, price } = req.body;
    if (!req.file) return res.status(400).json({ error: "Image is required" });

    const newEvent = new Event({
      title,
      description,
      price: Number(price), // ✅ Convert price to number
      image: req.file.path,
      seats: Array(30).fill(false),
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error adding event:", error);
    res.status(500).json({ error: "Error adding event" });
  }
};

// Get all events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Error fetching events" });
  }
};
