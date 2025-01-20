const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }]
}, { timestamps: true });

const Wishlist = mongoose.model("Wishlist", WishlistSchema);

module.exports = Wishlist;
