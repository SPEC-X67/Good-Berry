const Wishlist = require('../../models/Wishlist');
const Product = require('../../models/Product');
const Variant = require('../../models/Variant');

exports.getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ userId: req.user.id })
            .populate('products.productId')
            .populate('products.variantId');

        const wishlistItems = wishlist.products
            .filter(item => !item.productId.unListed) 
            .map(item => {
                const variant = item.variantId;
                const firstPackSize = variant.packSizePricing[0];
                const stockStatus = firstPackSize.quantity > 0 ? (firstPackSize.quantity < 20 ? `Limited Stock (${firstPackSize.quantity})` : "IN STOCK") : "OUT OF STOCK";

                return {
                    productId: item.productId._id,
                    name: item.productId.name,
                    description: item.productId.description,
                    image: variant.images[0],
                    salePrice: firstPackSize.salePrice,
                    price: firstPackSize.price,
                    stockStatus,
                    variantId: variant._id
                };
            });

        res.status(200).json({ success: true, data: wishlistItems });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.addToWishlist = async (req, res) => {
    try {
        const { productId, variantId } = req.body;

        const product = await Product.findById(productId);
        const variant = await Variant.findById(variantId);

        if (!product || !variant) {
            return res.status(404).json({ success: false, message: "Product or variant not found" });
        }

        let wishlist = await Wishlist.findOne({ userId: req.user.id });

        const wishlistItem = {
            productId: productId,
            variantId: variantId
        };

        if (!wishlist) {
            wishlist = new Wishlist({ userId: req.user.id, products: [wishlistItem] });
        } else {
            wishlist.products.push(wishlistItem);
        }

        await wishlist.save();
        res.status(200).json({ success: true, data: wishlist });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.removeFromWishlist = async (req, res) => {
    try {
        const { productId, variantId } = req.params;
        const wishlist = await Wishlist.findOne({ userId: req.user.id });

        if (wishlist) {
            wishlist.products = wishlist.products.filter(item => item.productId.toString() !== productId || item.variantId.toString() !== variantId);
            await wishlist.save();
        }

        res.status(200).json({ success: true, data: wishlist });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
