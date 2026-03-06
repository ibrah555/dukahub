const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET /api/products — list with search, filter, sort, pagination
router.get('/', async (req, res) => {
    try {
        const { q, category, minPrice, maxPrice, sort, page = 1, limit = 12, featured } = req.query;
        let filter = {};

        if (q) {
            filter.$text = { $search: q };
        }
        if (category) filter.category = category;
        if (featured === 'true') filter.featured = true;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        let sortObj = { createdAt: -1 };
        if (sort === 'price_asc') sortObj = { price: 1 };
        if (sort === 'price_desc') sortObj = { price: -1 };
        if (sort === 'rating') sortObj = { rating: -1 };
        if (sort === 'newest') sortObj = { createdAt: -1 };

        const total = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .populate('category', 'name slug')
            .sort(sortObj)
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        res.json({
            products,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            total,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/products/:slug
router.get('/:slug', async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug }).populate('category', 'name slug');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/products — admin create
router.post('/', protect, admin, upload.array('images', 5), async (req, res) => {
    try {
        const { name, description, price, comparePrice, category, stock, brand, featured } = req.body;
        const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
        const product = await Product.create({
            name, description, price: Number(price),
            comparePrice: Number(comparePrice) || 0,
            category, stock: Number(stock), brand,
            featured: featured === 'true',
            images,
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/products/:id — admin update
router.put('/:id', protect, admin, upload.array('images', 5), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const { name, description, price, comparePrice, category, stock, brand, featured } = req.body;
        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = Number(price);
        if (comparePrice !== undefined) product.comparePrice = Number(comparePrice);
        if (category) product.category = category;
        if (stock !== undefined) product.stock = Number(stock);
        if (brand !== undefined) product.brand = brand;
        if (featured !== undefined) product.featured = featured === 'true';
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(f => `/uploads/${f.filename}`);
            product.images = [...product.images, ...newImages];
        }

        const updated = await product.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/products/:id — admin delete
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        await Product.deleteOne({ _id: req.params.id });
        res.json({ message: 'Product removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
