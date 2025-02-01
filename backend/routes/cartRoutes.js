
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Cart Routes
router.post('/add', cartController.addToCart);
router.post('/remove', cartController.removeFromCart);
router.get('/:customerId', cartController.getCart);
router.post('/clear', cartController.clearCart);
router.post('/update-quantity', cartController.updateQuantity);

module.exports = router;
