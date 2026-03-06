const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

// POST /api/orders — create order
router.post('/', protect, async (req, res) => {
    try {
        const { items, paymentMethod, shippingAddress, county, phone, discountCode, discountAmount } = req.body;
        if (!items || items.length === 0) return res.status(400).json({ message: 'No order items' });

        let totalAmount = 0;
        const orderItems = [];
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) return res.status(404).json({ message: `Product ${item.product} not found` });
            if (product.stock < item.qty) return res.status(400).json({ message: `${product.name} only has ${product.stock} in stock` });

            orderItems.push({
                product: product._id,
                name: product.name,
                image: product.images[0] || '',
                price: product.price,
                qty: item.qty,
            });
            totalAmount += product.price * item.qty;
            product.stock -= item.qty;
            await product.save();
        }

        totalAmount -= (discountAmount || 0);
        if (totalAmount < 0) totalAmount = 0;

        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            totalAmount,
            paymentMethod,
            shippingAddress,
            county,
            phone,
            discountCode: discountCode || '',
            discountAmount: discountAmount || 0,
            paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/orders/my — customer's orders
router.get('/my', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/orders — admin: all orders
router.get('/', protect, admin, async (req, res) => {
    try {
        const { status, date, page = 1, limit = 20 } = req.query;
        let filter = {};
        if (status) filter.status = status;

        if (date) {
            // Filter by the entire selected day
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);

            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);

            filter.createdAt = {
                $gte: startDate,
                $lte: endDate
            };
        }

        const total = await Order.countDocuments(filter);
        const orders = await Order.find(filter)
            .populate('user', 'name email phone')
            .sort('-createdAt')
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
        res.json({ orders, page: Number(page), pages: Math.ceil(total / Number(limit)), total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/orders/:id
router.get('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email phone');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PATCH /api/orders/:id/status — admin update
router.patch('/:id/status', protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        order.status = req.body.status;
        if (req.body.paymentStatus) order.paymentStatus = req.body.paymentStatus;
        const updated = await order.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
