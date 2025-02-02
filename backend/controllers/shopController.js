const Shop = require("../models/shop");

exports.createShopItem = async (req, res) => {
  try {
    const { title, description, price } = req.body;
    if (!req.file) return res.status(400).json({ error: "Image is required" });

    const newShopItem = new Shop({
      title,
      description,
      price,
      image: req.file.path,
    });

    await newShopItem.save();
    res.status(201).json(newShopItem);
  } catch (error) {
    res.status(500).json({ error: "Error adding shop item" });
  }
};

exports.getShopItems = async (req, res) => {
  try {
    const items = await Shop.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: "Error fetching shop items" });
  }
};

// Delete shop item
exports.deleteShopItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Shop.findByIdAndDelete(id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting shop item" });
  }
};

// Update shop item
exports.updateShopItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price } = req.body;

    const updateData = { title, description, price };
    if (req.file) updateData.image = req.file.path;

    const item = await Shop.findByIdAndUpdate(id, updateData, { new: true });
    if (!item) return res.status(404).json({ error: "Item not found" });

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: "Error updating shop item" });
  }
};
