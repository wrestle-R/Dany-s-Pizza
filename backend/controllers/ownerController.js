const Owner = require('../models/owner')  // Assuming you have an 'Owner' model
const { hashPassword, comparePasswords } = require('../helpers/auth')
const currentDateTime = new Date()
const jwt = require('jsonwebtoken')

// A simple test endpoint for the owner
const test = (req, res) => {
    res.json("Owner test is working")
}

// Register an owner
const registerOwner = async (req, res) => {
    try {
        const { firstName, email, password } = req.body;
        
        // Check if name is provided
        if (!firstName) {
            return res.json({
                error: "Name is a mandatory field"
            });
        }

        if (!password || password.length < 6) {
            return res.json({
                error: "Password is mandatory and must be at least 6 characters long"
            });
        }

        const exist = await Owner.findOne({ email });
        if (exist) {
            return res.json({
                error: 'The email is already taken'
            });
        }

        const hashedPassword = await hashPassword(password);
        
        const owner = await Owner.create({
            firstName,
            email,
            password: hashedPassword,
            time_created_at: currentDateTime,
        });

        console.log('Owner created:', owner);  // Check if the owner is created
        return res.json(owner);

    } catch (error) {
        console.error('Error in registration:', error);  // Log any errors
        res.status(500).json({ error: "Server error" });
    }
};


// Log in an owner
const loginOwner = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the owner exists
        const owner = await Owner.findOne({ email });
        if (!owner) {
            return res.status(404).json({ error: 'The owner does not exist' });
        }

        // Check if the passwords match
        const match = await comparePasswords(password, owner.password);
        if (!match) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        // Generate JWT token
        jwt.sign(
            { email: owner.email, id: owner._id, firstName: owner.firstName },
            process.env.JWT_SECRET,
            {},
            (err, token) => {
                if (err) throw err;

                // Send both token & owner data
                res.cookie('token', token, { httpOnly: true }).json({
                    token, 
                    owner: { email: owner.email, id: owner._id, firstName: owner.firstName }
                });
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error. Please try again later." });
    }
};


// Get the owner's profile
const getOwner = (req, res) => {
    const token = req.cookies.token
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, owner) => {
            if (err) {
                throw err
            } else {
                res.json(owner)
            }
        })
    } else {
        res.json(null)
    }
}

module.exports = {
    test,
    registerOwner,
    loginOwner,
    getOwner
}
