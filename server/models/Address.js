const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    street: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    state: {
        type: String,
        trim: true
    },
    zip: {
        type: String,
        trim: true
    },
    country: {
        type: String,
        trim: true
    },
    name: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        trim: true
    },
    mobile: {
        type: String,
        trim: true
    },
    isDefault: {
        type: Boolean,
        default: false
    }
},
{ timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);

