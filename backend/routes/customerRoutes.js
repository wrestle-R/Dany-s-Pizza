
const express = require('express');
const router = express.Router();
const { registerCustomer, loginCustomer, getCustomerProfile } = require('../controllers/customerController');  // Import controller methods

// Route for customer registration
router.post('/customer/register', registerCustomer);

// Route for customer login
router.post('/customer/login', loginCustomer);

// Route to get customer profile (requires authentication)
router.get('/customer/getprofile', getCustomerProfile);

module.exports = router;
