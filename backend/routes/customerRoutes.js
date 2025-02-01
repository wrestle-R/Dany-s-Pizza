const express = require('express');
const router = express.Router();
const { registerCustomer, loginCustomer, getCustomerProfile } = require('../controllers/customerController');  // Import controller methods
const cartController = require('../controllers/cartController');

//auth
router.post('/customer/register', registerCustomer);
router.post('/customer/login', loginCustomer);
router.get('/customer/getprofile', getCustomerProfile);



module.exports = router;
