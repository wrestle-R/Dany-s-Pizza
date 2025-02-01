const mongoose = require('mongoose');
const { Schema } = mongoose;

const customerSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6 // Enforce a minimum password length
    },
    time_created_at: {
        type: Date,
        default: Date.now // Automatically set creation timestamp
    }
});

const CustomerModel = mongoose.model('Customer', customerSchema);

module.exports = CustomerModel;
