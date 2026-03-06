require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Order = require('./models/Order');
const DiscountCode = require('./models/DiscountCode');

const seed = async () => {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await DiscountCode.deleteMany({});

    console.log('Cleared existing data');

    // Create admin
    const admin = await User.create({
        name: 'Admin User',
        email: 'admin@dukahub.co.ke',
        password: 'admin123',
        phone: '0712345678',
        county: 'Nairobi',
        role: 'admin',
    });

    // Create customers
    const customer1 = await User.create({
        name: 'Jane Wanjiku',
        email: 'jane@example.com',
        password: 'password123',
        phone: '0722334455',
        county: 'Nairobi',
        address: 'Westlands, Nairobi',
    });

    const customer2 = await User.create({
        name: 'John Ochieng',
        email: 'john@example.com',
        password: 'password123',
        phone: '0733445566',
        county: 'Mombasa',
        address: 'Nyali, Mombasa',
    });

    const customer3 = await User.create({
        name: 'Mary Chebet',
        email: 'mary@example.com',
        password: 'password123',
        phone: '0744556677',
        county: 'Kisumu',
        address: 'Milimani, Kisumu',
    });

    console.log('Created users');

    // Create categories
    const mainCategories = await Category.insertMany([
        { name: 'Electronics', slug: 'electronics', description: 'Laptops, TVs, cameras and more' },
        { name: 'Phones & Tablets', slug: 'phones-tablets', description: 'Smartphones, tablets and accessories' },
        { name: 'Fashion', slug: 'fashion', description: 'Clothing, shoes, bags and accessories' },
        { name: 'Home & Kitchen', slug: 'home-kitchen', description: 'Furniture, appliances and home decor' },
        { name: 'Supermarket', slug: 'supermarket', description: 'Groceries, beverages and household items' },
        { name: 'Health & Beauty', slug: 'health-beauty', description: 'Skincare, makeup and wellness products' },
    ]);

    const fashionId = mainCategories.find(c => c.name === 'Fashion')._id;

    const subCategories = await Category.insertMany([
        { name: "Men's Clothing", slug: 'mens-clothing', description: 'Shirts, trousers, jackets for men', parent: fashionId },
        { name: "Women's Clothing", slug: 'womens-clothing', description: 'Dresses, tops, skirts for women', parent: fashionId },
    ]);

    const categories = [...mainCategories, ...subCategories];
    const catMap = {};
    categories.forEach(c => { catMap[c.name] = c._id; });
    console.log('Created categories and subcategories');

    // Create products
    const products = await Product.create([
        // Electronics
        { name: 'Samsung 55" Smart TV', slug: 'samsung-55-smart-tv-' + Date.now().toString(36), description: 'Samsung 55 inch 4K UHD Smart TV with Crystal Display. HDR support, built-in WiFi, and multiple HDMI ports. Experience stunning picture quality.', price: 65999, comparePrice: 79999, category: catMap['Electronics'], stock: 15, brand: 'Samsung', featured: true, rating: 4.5, reviewCount: 23, images: [] },
        { name: 'HP Pavilion Laptop 15', slug: 'hp-pavilion-laptop-15-' + Date.now().toString(36), description: 'HP Pavilion 15.6" laptop with Intel Core i5, 8GB RAM, 512GB SSD. Perfect for work and entertainment with sleek design.', price: 89999, comparePrice: 105000, category: catMap['Electronics'], stock: 8, brand: 'HP', featured: true, rating: 4.3, reviewCount: 17, images: [] },
        { name: 'Sony Wireless Headphones', slug: 'sony-wireless-headphones-' + Date.now().toString(36), description: 'Sony WH-1000XM5 wireless noise-cancelling headphones. Industry-leading noise cancellation with 30-hour battery life.', price: 35999, comparePrice: 42000, category: catMap['Electronics'], stock: 20, brand: 'Sony', featured: false, rating: 4.8, reviewCount: 45, images: [] },

        // Phones & Tablets
        { name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max-' + Date.now().toString(36), description: 'Apple iPhone 15 Pro Max 256GB. Titanium design, A17 Pro chip, 48MP camera system, USB-C. The most powerful iPhone ever.', price: 189999, comparePrice: 210000, category: catMap['Phones & Tablets'], stock: 10, brand: 'Apple', featured: true, rating: 4.9, reviewCount: 67, images: [] },
        { name: 'Samsung Galaxy S24 Ultra', slug: 'samsung-galaxy-s24-ultra-' + Date.now().toString(36), description: 'Samsung Galaxy S24 Ultra 256GB with S Pen. AI-powered features, 200MP camera, titanium frame, and Snapdragon 8 Gen 3.', price: 169999, comparePrice: 185000, category: catMap['Phones & Tablets'], stock: 12, brand: 'Samsung', featured: true, rating: 4.7, reviewCount: 38, images: [] },

        // Fashion - Men's
        {
            name: "Men's Classic Leather Jacket",
            slug: 'mens-classic-leather-jacket-' + Date.now().toString(36),
            description: 'Premium genuine leather jacket for men. Classic biker style with zipped pockets. Available in black and brown.',
            price: 8999,
            comparePrice: 12999,
            category: catMap["Men's Clothing"],
            stock: 30,
            brand: 'Urban Style',
            featured: false,
            rating: 4.4,
            reviewCount: 15,
            sizes: ['M', 'L', 'XL'],
            colors: ['Black', 'Brown'],
            images: [
                'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d5ec?q=80&w=600&h=600&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&h=600&auto=format&fit=crop'
            ]
        },
        // Fashion - Women's
        {
            name: "Women's Ankara Maxi Dress",
            slug: 'womens-ankara-maxi-dress-' + Date.now().toString(36),
            description: 'Beautiful African print Ankara maxi dress. Vibrant colors, comfortable fit, perfect for special occasions. Made in Kenya.',
            price: 3499,
            comparePrice: 4999,
            category: catMap["Women's Clothing"],
            stock: 50,
            brand: 'Nairobae Fashion',
            featured: true,
            rating: 4.6,
            reviewCount: 42,
            sizes: ['S', 'M', 'L'],
            colors: ['Blue/Red', 'Green/Yellow'],
            images: [
                'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&h=600&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=600&h=600&auto=format&fit=crop'
            ]
        },
        { name: 'Nike Air Force 1 Sneakers', slug: 'nike-air-force-1-sneakers-' + Date.now().toString(36), description: 'Nike Air Force 1 classic white sneakers. Timeless design, premium leather, and Air cushioning for all-day comfort.', price: 14999, comparePrice: 18000, category: catMap['Fashion'], stock: 20, brand: 'Nike', featured: false, rating: 4.7, reviewCount: 56, images: [], sizes: ['38', '39', '40', '41', '42'], colors: ['White'] },

        // Home & Kitchen
        { name: 'Ramtons 2-Burner Gas Cooker', slug: 'ramtons-2-burner-gas-cooker-' + Date.now().toString(36), description: 'Ramtons 2-burner table-top gas cooker with auto-ignition. Sturdy build, easy to clean, perfect for Kenyan kitchens.', price: 4999, comparePrice: 6500, category: catMap['Home & Kitchen'], stock: 35, brand: 'Ramtons', featured: false, rating: 4.3, reviewCount: 19, images: [] },
        { name: 'Vitafoam Orthopaedic Mattress 5x6', slug: 'vitafoam-mattress-5x6-' + Date.now().toString(36), description: 'Vitafoam 5x6 orthopaedic mattress, 8-inch thickness. Medium-firm support for healthy sleep. 5-year warranty.', price: 18999, comparePrice: 24999, category: catMap['Home & Kitchen'], stock: 10, brand: 'Vitafoam', featured: true, rating: 4.5, reviewCount: 33, images: [] },
        { name: 'Mika Blender 1.5L', slug: 'mika-blender-1-5l-' + Date.now().toString(36), description: 'Mika 1.5L blender with grinding mill. 400W motor, 2-speed control with pulse function. Ideal for smoothies and grinding.', price: 3999, comparePrice: 5500, category: catMap['Home & Kitchen'], stock: 40, brand: 'Mika', featured: false, rating: 4.1, reviewCount: 11, images: [] },

        // Supermarket
        { name: 'Brookside Fresh Milk 1L (Pack of 6)', slug: 'brookside-fresh-milk-6pk-' + Date.now().toString(36), description: 'Brookside full cream fresh milk, 1 litre pack of 6. Fresh from Kenyan dairy farms. Rich and nutritious.', price: 999, comparePrice: 0, category: catMap['Supermarket'], stock: 100, brand: 'Brookside', featured: false, rating: 4.6, reviewCount: 8, images: [] },
        { name: 'Mumias Sugar 2Kg', slug: 'mumias-sugar-2kg-' + Date.now().toString(36), description: 'Mumias premium white sugar, 2Kg pack. Locally produced, perfect for everyday use in cooking and beverages.', price: 350, comparePrice: 0, category: catMap['Supermarket'], stock: 200, brand: 'Mumias', featured: false, rating: 4.0, reviewCount: 5, images: [] },
        { name: 'Tuskys Mixed Spices Bundle', slug: 'tuskys-mixed-spices-' + Date.now().toString(36), description: 'Assorted Kenyan spice bundle including pilau masala, curry powder, turmeric, and chili flakes. Essential kitchen spices.', price: 799, comparePrice: 1200, category: catMap['Supermarket'], stock: 80, brand: 'DukaHub Kitchen', featured: false, rating: 4.4, reviewCount: 14, images: [] },

        // Health & Beauty
        { name: 'Nivea Body Lotion 400ml', slug: 'nivea-body-lotion-400ml-' + Date.now().toString(36), description: 'Nivea Cocoa Butter body lotion 400ml. Deep moisture for dry skin, enriched with cocoa butter and Vitamin E.', price: 899, comparePrice: 1100, category: catMap['Health & Beauty'], stock: 60, brand: 'Nivea', featured: false, rating: 4.5, reviewCount: 22, images: [] },
        { name: 'Nice & Lovely Hair Relaxer', slug: 'nice-lovely-hair-relaxer-' + Date.now().toString(36), description: 'Nice & Lovely no-lye hair relaxer kit. Gentle formula with olive oil, leaves hair silky smooth and manageable.', price: 599, comparePrice: 750, category: catMap['Health & Beauty'], stock: 45, brand: 'Nice & Lovely', featured: false, rating: 4.2, reviewCount: 18, images: [] },
    ]);

    console.log(`Created ${products.length} products`);

    // Create sample orders
    const orders = await Order.create([
        {
            user: customer1._id,
            items: [
                { product: products[3]._id, name: products[3].name, price: products[3].price, qty: 1 },
                { product: products[7]._id, name: products[7].name, price: products[7].price, qty: 2 },
            ],
            totalAmount: 189999 + (3499 * 2),
            paymentMethod: 'mpesa',
            paymentStatus: 'paid',
            mpesaCode: 'SIM1A2B3C4D',
            status: 'Delivered',
            shippingAddress: 'Westlands, Nairobi',
            county: 'Nairobi',
            phone: '0722334455',
        },
        {
            user: customer2._id,
            items: [
                { product: products[1]._id, name: products[1].name, price: products[1].price, qty: 1 },
            ],
            totalAmount: 89999,
            paymentMethod: 'card',
            paymentStatus: 'paid',
            status: 'Processing',
            shippingAddress: 'Nyali, Mombasa',
            county: 'Mombasa',
            phone: '0733445566',
        },
        {
            user: customer3._id,
            items: [
                { product: products[10]._id, name: products[10].name, price: products[10].price, qty: 1 },
                { product: products[12]._id, name: products[12].name, price: products[12].price, qty: 1 },
            ],
            totalAmount: 4999 + 3999,
            paymentMethod: 'cod',
            paymentStatus: 'pending',
            status: 'Pending',
            shippingAddress: 'Milimani, Kisumu',
            county: 'Kisumu',
            phone: '0744556677',
        },
        {
            user: customer1._id,
            items: [
                { product: products[0]._id, name: products[0].name, price: products[0].price, qty: 1 },
            ],
            totalAmount: 65999,
            paymentMethod: 'mpesa',
            paymentStatus: 'paid',
            mpesaCode: 'SIM5E6F7G8H',
            status: 'Delivered',
            shippingAddress: 'Westlands, Nairobi',
            county: 'Nairobi',
            phone: '0722334455',
        },
        {
            user: customer2._id,
            items: [
                { product: products[4]._id, name: products[4].name, price: products[4].price, qty: 1 },
                { product: products[8]._id, name: products[8].name, price: products[8].price, qty: 1 },
            ],
            totalAmount: 169999 + 14999,
            paymentMethod: 'mpesa',
            paymentStatus: 'paid',
            mpesaCode: 'SIM9I0J1K2L',
            status: 'Processing',
            shippingAddress: 'Nyali, Mombasa',
            county: 'Mombasa',
            phone: '0733445566',
        },
    ]);

    console.log(`Created ${orders.length} orders`);

    // Create discount codes
    await DiscountCode.create([
        { code: 'KARIBU10', type: 'percent', value: 10, minOrder: 1000, expiresAt: new Date('2026-12-31') },
        { code: 'SAVE500', type: 'fixed', value: 500, minOrder: 5000, expiresAt: new Date('2026-06-30') },
        { code: 'NEWUSER', type: 'percent', value: 15, minOrder: 2000, expiresAt: new Date('2026-12-31') },
    ]);

    console.log('Created discount codes');
    console.log('\n--- Seed Complete ---');
    console.log('Admin login: admin@dukahub.co.ke / admin123');
    console.log('Customer login: jane@example.com / password123');

    process.exit(0);
};

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
