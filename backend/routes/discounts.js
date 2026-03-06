const express = require('express');
const router = express.Router();
const DiscountCode = require('../models/DiscountCode');
const { protect, admin } = require('../middleware/auth');

// GET /api/discounts — admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const discounts = await DiscountCode.find().sort('-createdAt');
        res.json(discounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/discounts — admin create
router.post('/', protect, admin, async (req, res) => {
    try {
        const { code, type, value, minOrder, expiresAt } = req.body;
        const discount = await DiscountCode.create({ code, type, value, minOrder, expiresAt });
        res.status(201).json(discount);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/discounts/:id — admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        await DiscountCode.deleteOne({ _id: req.params.id });
        res.json({ message: 'Discount code removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/discounts/validate — customer validates code
router.post('/validate', protect, async (req, res) => {
    try {
        const { code, orderTotal } = req.body;
        const discount = await DiscountCode.findOne({ code: code.toUpperCase(), active: true });
        if (!discount) return res.status(404).json({ message: 'Invalid discount code' });
        if (new Date() > discount.expiresAt) return res.status(400).json({ message: 'Discount code has expired' });
        if (orderTotal < discount.minOrder) return res.status(400).json({ message: `Minimum order of KES ${discount.minOrder} required` });

        let discountAmount = 0;
        if (discount.type === 'percent') {
            discountAmount = Math.round(orderTotal * discount.value / 100);
        } else {
            discountAmount = discount.value;
        }

        res.json({ valid: true, discountAmount, type: discount.type, value: discount.value });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
