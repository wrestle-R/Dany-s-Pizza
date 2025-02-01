const Menu = require("../models/menu");

// Create a new menu item
const createMenuItem = async (req, res) => {
  try {
    const { name, price, isPizza, description, isVeg } = req.body;
    const imagePath = req.file ? `uploads/${req.file.filename}` : null; // Store file path

    const newItem = new Menu({
      name,
      price,
      image: imagePath,
      isPizza,
      description,
      isVeg,
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// Get all menu items
const getMenuItems = async (req, res) => {
  try {
    const items = await Menu.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// Update a menu item
const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, isPizza, description, isVeg } = req.body;
    const imagePath = req.file ? `uploads/${req.file.filename}` : req.body.image;

    const updatedItem = await Menu.findByIdAndUpdate(
      id,
      { name, price, image: imagePath, isPizza, description, isVeg },
      { new: true }
    );

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// Delete a menu item
const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Menu.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = { createMenuItem, getMenuItems, updateMenuItem, deleteMenuItem };
