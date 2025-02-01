const express = require("express");
const router = express.Router();
const {
  registerCustomer,
  loginCustomer,
  getCustomerProfile,
} = require("../controllers/customerController");
const {
  
  getMenuItems,
 
  getPizzaItems,
  getNonPizzaItems,
  getVegItems,
} = require("../controllers/menuController");


// Customer routes
router.post("/customer/register", registerCustomer);
router.post("/customer/login", loginCustomer);
router.get("/customer/getprofile", getCustomerProfile);

// Menu routes
router.get("/menu", getMenuItems);
router.get("/menu/pizza", getPizzaItems);
router.get("/menu/non-pizza", getNonPizzaItems);
router.get("/menu/veg", getVegItems);

// Cart routes - Updated with customerId in URL


module.exports = router;