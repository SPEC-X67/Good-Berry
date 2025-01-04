const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true 
    },
    password: {
        type: String,
        required: false,
    },
    role : {
        type: String,
        required: true,
        default: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isBlocked: {
        type: Boolean,
        default: false
    }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;