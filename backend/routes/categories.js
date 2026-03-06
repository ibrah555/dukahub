const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET /api/categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort('name');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/categories/:slug
router.get('/:slug', async (req, res) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug });
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/categories — admin
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
    try {
        const { name, description } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : '';
        const category = await Category.create({ name, description, image });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/categories/:id — admin
router.put('/:id', protect, admin, upload.single('image'), async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        category.name = req.body.name || category.name;
        category.description = req.body.description || category.description;
        if (req.file) category.image = `/uploads/${req.file.filename}`;
        const updated = await category.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/categories/:id — admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        await Category.deleteOne({ _id: req.params.id });
        res.json({ message: 'Category removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
