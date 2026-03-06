const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// GET /api/reviews/:productId
router.get('/:productId', async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .populate('user', 'name')
            .sort('-createdAt');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/reviews
router.post('/', protect, async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const existing = await Review.findOne({ user: req.user._id, product: productId });
        if (existing) return res.status(400).json({ message: 'You already reviewed this product' });

        const review = await Review.create({
            user: req.user._id,
            product: productId,
            rating: Number(rating),
            comment,
        });

        // Update product rating
        const reviews = await Review.find({ product: productId });
        const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
        await Product.findByIdAndUpdate(productId, { rating: Math.round(avgRating * 10) / 10, reviewCount: reviews.length });

        const populated = await Review.findById(review._id).populate('user', 'name');
        res.status(201).json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
