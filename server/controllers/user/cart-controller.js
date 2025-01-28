const mongoose = require('mongoose');
const Cart = require('../../models/Cart');
const Product = require('../../models/Product');
const Variant = require('../../models/Variant');
const Coupon = require('../../models/Coupon');

const cartController = {
  // Get cart items
  getCart: async (req, res) => {
    console.log(req.user);
    try {
      const userId = req.user.id;

      const cart = await Cart.findOne({ userId }).populate('items.productId');
      if (!cart) {
        return res.json([]);
      }

      const filteredItems = cart.items.filter(item => !item.productId.unListed);

      res.json(filteredItems);
    } catch (error) {
      console.error('Get cart error:', error);
      res.status(500).json({ error: 'Error fetching cart items' });
    }
  },

  // Add item to cart
  addToCart: async (req, res) => {
    try {
      const userId = req.user.id;
      console.log(req.body)
      const { productId, quantity, packageSize, flavor, name, image, price, salePrice } = req.body;

      if (!productId || !quantity || !packageSize) {
        return res.status(400).json({
          error: 'Missing required fields: productId, quantity, and packageSize are required'
        });
      }

      const product = await Product.findOne({ _id: productId });
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const variant = await Variant.findOne({ productId: productId, title : flavor });
      console.log("Varient",variant);
      
      if (!variant) {
        return res.status(400).json({ 
          message: `Product variant not found for product ID: ${productId}` 
        });
      }

      const packSize = variant.packSizePricing.find(
        pack => pack.size === packageSize
      );
        

      let cart = await Cart.findOne({ userId });

      if (!cart) {
        cart = new Cart({
          userId,
          items: []
        });
      }


      const existingItemIndex = cart.items.findIndex(
        item => item.productId.toString() === productId &&
               item.packageSize === packageSize &&
               item.flavor === flavor  
      );

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        cart.items.push({
          productId,
          packageSize,
          quantity,
          flavor,
          name,
          image,
          price,
          salePrice
        });
      }

      await cart.save();

      res.json(cart.items);
    } catch (error) {
      console.error('Add to cart error:', error);
      res.status(500).json({ error: 'Error adding item to cart' });
    }
  },

  // Sync cart
  syncCart: async (req, res) => {
    const userId = req.user.id;
    const localCart = req.body;
  
    try {
      let cart = await Cart.findOne({ userId });
  
      if (!cart) {
        cart = new Cart({
          userId,
          items: [],
        });
      }
  
      const serverCart = cart.items || [];

      localCart.forEach(localItem => {
        const existingItem = serverCart.find(
          item =>
            item.productId.toString() === localItem.productId &&
            item.packageSize === localItem.packageSize &&
            item.flavor === localItem.flavor
        );
  
        if (existingItem) {
          existingItem.quantity += localItem.quantity;
        } else {
          serverCart.push({
            ...localItem,
            productId: localItem.productId 
          });
        }
      });
  
      cart.items = serverCart;
      await cart.save();
  
      res.json(cart.items);
    } catch (error) {
      console.error('Error syncing cart:', error);
      res.status(500).json({ message: 'Failed to sync cart' });
    }
  },

  // Update item quantity
  updateQuantity: async (req, res) => {
    try {
      const userId = req.user.id;
      const { itemId } = req.params;
      const { quantity, packageSize, flavor } = req.body; 
      console.log(userId, itemId, quantity, packageSize, flavor);
  
      if (!quantity || !packageSize || !flavor) {  
        return res.status(400).json({
          error: 'Missing required fields: quantity, packageSize, and flavor are required'
        });
      }
  
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
  
      const itemIndex = cart.items.findIndex(
        item => item.productId.toString() === itemId &&
          item.packageSize === packageSize &&
          item.flavor === flavor  
      );
  
      if (itemIndex === -1) {
        return res.status(404).json({ error: 'Item not found in cart' });
      }
  
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
  
      res.json(cart.items);
    } catch (error) {
      console.error('Update quantity error:', error);
      res.status(500).json({ error: 'Error updating item quantity' });
    }
  },

  // Remove item from cart
 removeItem: async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    const { packageSize, flavor } = req.body; 

    console.log(userId, itemId, packageSize, flavor);

    if (!packageSize || !flavor) { 
      return res.status(400).json({
        error: 'Missing required fields: packageSize and flavor'
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      item => !(item.productId.toString() === itemId &&
        item.packageSize === packageSize &&
        item.flavor === flavor)  
    );

    await cart.save();
    res.json({ itemId, packageSize, flavor }); 
  } catch (error) {
    console.error('Remove item error:', error);
    res.status(500).json({ error: 'Error removing item from cart' });
  }
},

  // Clear cart
  clearCart: async (req, res) => {
    try {
      const userId = req.user.id;
      const cart = await Cart.findOne({ userId });

      if (cart) {
        cart.items = [];
        await cart.save();
      }

      res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
      console.error('Clear cart error:', error);
      res.status(500).json({ error: 'Error clearing cart' });
    }
  },

  checkQuantity : async (req, res) => {
    try {
      const { productId, packageSize, flavor } = req.body;
  
      if (!productId || !packageSize || !flavor) {
        return res.status(400).json({ error: 'Missing required fields: productId, packageSize, and flavor are required' });
      }
  
      const variant = await Variant.findOne({ productId, title: flavor });
      if (!variant) {
        return res.status(404).json({ error: 'Variant not found' });
      }
  
      const packSize = variant.packSizePricing.find(pack => pack.size === packageSize);
      if (!packSize) {
        return res.status(404).json({ error: 'Package size not found' });
      }
  
      res.json({ quantity: packSize.quantity });
    } catch (error) {
      console.error('Check quantity error:', error);
      res.status(500).json({ error: 'Error checking quantity' });
    }
  }
};

module.exports = cartController;