const Chef = require('../models/chef');

// Create a new chef without an image
exports.createChef = async (req, res) => {
  try {
    const { name, specialty, country } = req.body;

    const newChef = new Chef({
      name,
      specialty,
      country,
    });

    const savedChef = await newChef.save();
    res.status(201).json(savedChef); // Return the saved chef data
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding chef' });
  }
};

// Update an existing chef without image handling
exports.updateChef = async (req, res) => {
  try {
    const { name, specialty, country } = req.body;

    const updatedChef = await Chef.findByIdAndUpdate(
      req.params.id,
      { name, specialty, country },
      { new: true }
    );

    if (!updatedChef) {
      return res.status(404).json({ message: 'Chef not found!' });
    }

    res.status(200).json(updatedChef); // Return the updated chef data
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating chef' });
  }
};

// Get all chefs
exports.getAllChefs = async (req, res) => {
  try {
    const chefs = await Chef.find();
    res.status(200).json(chefs); // Return the list of chefs
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching chefs' });
  }
};

// Delete a chef
exports.deleteChef = async (req, res) => {
  try {
    const deletedChef = await Chef.findByIdAndDelete(req.params.id);

    if (!deletedChef) {
      return res.status(404).json({ message: 'Chef not found!' });
    }

    res.status(200).json({ message: 'Chef deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting chef' });
  }
};
