const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Get personalized recommendations for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    // Find all orders by this user, get the categories they've bought
    const userOrders = await Order.find({ user: req.userId }).populate('items.product');

    const purchasedProductIds = new Set();
    const purchasedCategories = new Set();
    const categorySourceProduct = {};

    userOrders.forEach(order => {
      order.items.forEach(item => {
        if (item.product) {
          purchasedProductIds.add(item.product._id.toString());
          purchasedCategories.add(item.product.category);
          categorySourceProduct[item.product.category] = item.product.name;
        }
      });
    });

    let recommendations = [];

    if (purchasedCategories.size > 0) {
      // Recommend other products in the same categories, excluding already purchased ones
      const categoryProducts = await Product.find({
        category: { $in: Array.from(purchasedCategories) },
        _id: { $nin: Array.from(purchasedProductIds) }
      }).limit(8);

      recommendations = categoryProducts.map(p => ({
        ...p.toObject(),
        reason: `Because you bought ${categorySourceProduct[p.category]}`
      }));
    }

    // If not enough personalized recommendations, fill with "Popular" products
    if (recommendations.length < 4) {
      const allOrders = await Order.find().populate('items.product');
      const salesCount = {};

      allOrders.forEach(order => {
        order.items.forEach(item => {
          if (item.product) {
            const id = item.product._id.toString();
            salesCount[id] = (salesCount[id] || 0) + item.quantity;
          }
        });
      });

      const popularIds = Object.entries(salesCount)
        .sort((a, b) => b[1] - a[1])
        .map(([id]) => id)
        .filter(id => !purchasedProductIds.has(id) && !recommendations.find(r => r._id.toString() === id));

      const popularProducts = await Product.find({ _id: { $in: popularIds } }).limit(8 - recommendations.length);

      const popularWithReason = popularProducts.map(p => ({
        ...p.toObject(),
        reason: `Popular in ${p.category}`
      }));

      recommendations = [...recommendations, ...popularWithReason];
    }

    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;