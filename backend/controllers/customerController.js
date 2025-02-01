const Customer = require('../models/customer');  // Import the Customer model
const { hashPassword, comparePasswords } = require('../helpers/auth');  // Utility functions for password security
const jwt = require('jsonwebtoken');

// Register a new customer
const registerCustomer = async (req, res) => {
    try {
        const { firstName, username, email, password } = req.body;

        // Validate required fields
        if (!firstName || !username || !email || !password) {
            return res.status(400).json({ error: "All fields are required." });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long." });
        }

        // Check if email or username already exists
        const existingCustomer = await Customer.findOne({ $or: [{ email }, { username }] });
        if (existingCustomer) {
            return res.status(400).json({ error: "Email or Username is already taken." });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create a new customer
        const customer = await Customer.create({
            firstName,
            username,
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            message: "Customer registered successfully",
            customer: { id: customer._id, firstName: customer.firstName, username: customer.username, email: customer.email }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Server error. Please try again later." });
    }
};

// Login an existing customer
const loginCustomer = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the customer by email
        const customer = await Customer.findOne({ email });
        if (!customer) {
            return res.status(400).json({ error: "Invalid email or password." });
        }

        // Compare passwords
        const match = await comparePasswords(password, customer.password);
        if (!match) {
            return res.status(400).json({ error: "Invalid email or password." });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: customer._id, firstName: customer.firstName, username: customer.username, email: customer.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        // Set token in HTTP-only cookie
        res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

        res.json({
            message: "Login successful",
            token,
            customer: { id: customer._id, firstName: customer.firstName, username: customer.username, email: customer.email }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error. Please try again later." });
    }
};

// Get customer profile (Protected Route)
const getCustomerProfile = (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized. No token provided." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Invalid or expired token." });
        }
        res.json({ customer: { id: decoded.id, firstName: decoded.firstName, username: decoded.username, email: decoded.email } });
    });
};

module.exports = {
    registerCustomer,
    loginCustomer,
    getCustomerProfile
};
