const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        variantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Variant",
            required: true
        }
    }]
}, { timestamps: true });

const Wishlist = mongoose.model("Wishlist", WishlistSchema);

module.exports = Wishlist;
