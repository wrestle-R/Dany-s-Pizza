const express = require('express');
const router = express.Router();
const chefController = require('../controllers/chefController');

// Create a new chef (without image)
router.post('/', chefController.createChef);

// Update an existing chef (without image)
router.put('/:id', chefController.updateChef);

// Get all chefs
router.get('/', chefController.getAllChefs);

// Delete a chef
router.delete('/:id', chefController.deleteChef);

module.exports = router;
