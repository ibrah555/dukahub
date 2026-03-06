const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/auth');

// GET /api/users — admin: all customers
router.get('/', protect, admin, async (req, res) => {
    try {
        const users = await User.find({ role: 'customer' }).select('-password').sort('-createdAt');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/users/:id — admin: customer detail + order history
router.get('/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        const orders = await Order.find({ user: req.params.id }).sort('-createdAt');
        res.json({ user, orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
