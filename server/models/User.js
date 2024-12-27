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
    password: {
        type: String,
        required: true,
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