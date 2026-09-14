const express = require('express');
const router = express.Router();
const Sentiment = require('sentiment');
const Review = require('../models/Review');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

const sentiment = new Sentiment();

// Get all reviews for a product
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Post a review (protected, verified-purchase only)
router.post('/', auth, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    // Check if this user has an order containing this product
    const hasPurchased = await Order.findOne({
      user: req.userId,
      'items.product': productId
    });

    if (!hasPurchased) {
      return res.status(403).json({ message: 'You can only review products you have purchased.' });
    }

    // Prevent duplicate reviews on the same product by the same user
    const existingReview = await Review.findOne({ product: productId, user: req.userId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product.' });
    }

    // Sentiment check: does the comment's tone match the star rating?
    const result = sentiment.analyze(comment);
    let flagged = false;

    if (rating >= 4 && result.score < -2) flagged = true; // high rating, very negative text
    if (rating <= 2 && result.score > 2) flagged = true;  // low rating, very positive text

    const review = new Review({
      product: productId,
      user: req.userId,
      rating,
      comment,
      verifiedPurchase: true,
      flagged
    });

    await review.save();
    const populatedReview = await review.populate('user', 'name');
    res.status(201).json(populatedReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;