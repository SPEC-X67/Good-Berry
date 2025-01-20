const Wishlist = require('../../models/Wishlist');

exports.getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ userId: req.user.id }).populate('products');
        console.log(wishlist);
        res.status(200).json({ success: true, data: wishlist });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.addToWishlist = async (req, res) => {
    try {
        console.log(req.user.id)
        const { productId } = req.body;
        let wishlist = await Wishlist.findOne({ userId: req.user.id });

        if (!wishlist) {
            wishlist = new Wishlist({ userId: req.user.id, products: [productId] });
        } else {
            wishlist.products.push(productId);
        }

        await wishlist.save();
        res.status(200).json({ success: true, data: wishlist });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const wishlist = await Wishlist.findOne({ userId: req.user.id });

        if (wishlist) {
            wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
            await wishlist.save();
        }

        res.status(200).json({ success: true, data: wishlist });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
