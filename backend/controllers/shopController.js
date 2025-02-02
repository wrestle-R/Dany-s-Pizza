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
