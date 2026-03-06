'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { api, formatPrice } from '@/lib/api';
import { FiTruck, FiShield, FiCreditCard, FiHeadphones, FiArrowRight, FiZap } from 'react-icons/fi';

export default function HomePage() {
    const [featured, setFeatured] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.getProducts('featured=true&limit=8'),
            api.getCategories(),
        ]).then(([prodData, catData]) => {
            setFeatured(prodData.products || []);
            setCategories(catData || []);
        }).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const categoryIcons = { 'Electronics': '💻', 'Phones & Tablets': '📱', 'Fashion': '👗', 'Home & Kitchen': '🏠', 'Supermarket': '🛒', 'Health & Beauty': '💄' };

    return (
        <>
            <Navbar />
            <main>
                {/* Hero */}
                <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-kenyan-black">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-accent-500 rounded-full blur-3xl" />
                        <div className="absolute bottom-10 right-20 w-96 h-96 bg-primary-400 rounded-full blur-3xl" />
                    </div>
                    <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 relative z-10">
                        <div className="max-w-2xl">
                            <span className="inline-flex items-center gap-2 bg-accent-500/20 text-accent-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                                <FiZap size={14} /> Free Delivery on Orders Over KES 5,000
                            </span>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
                                Shop the Best <br />
                                <span className="bg-gradient-to-r from-accent-400 to-accent-300 bg-clip-text text-transparent">Deals in Kenya</span>
                            </h1>
                            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                                Discover thousands of products at unbeatable prices. Pay with M-Pesa, get fast delivery to all 47 counties.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link href="/products" className="btn-accent !text-base !py-3.5 !px-8 flex items-center gap-2">
                                    Shop Now <FiArrowRight />
                                </Link>
                                <Link href="/products?featured=true" className="btn-outline !border-white/30 !text-white hover:!bg-white/10 !text-base !py-3.5 !px-8">
                                    Today&apos;s Deals
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Trust bar */}
                <section className="bg-white border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { icon: <FiTruck />, title: 'Free Delivery', sub: 'Orders over KES 5,000' },
                            { icon: <FiShield />, title: 'Secure Shopping', sub: '100% protected' },
                            { icon: <FiCreditCard />, title: 'M-Pesa Ready', sub: 'Pay with M-Pesa' },
                            { icon: <FiHeadphones />, title: '24/7 Support', sub: 'Always here to help' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center text-xl">{item.icon}</div>
                                <div>
                                    <p className="font-semibold text-sm text-gray-800">{item.title}</p>
                                    <p className="text-xs text-gray-400">{item.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Categories */}
                <section className="max-w-7xl mx-auto px-4 py-16">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Shop by Category</h2>
                            <p className="text-gray-400 mt-1">Find exactly what you need</p>
                        </div>
                        <Link href="/products" className="text-primary-600 text-sm font-semibold hover:underline flex items-center gap-1">
                            View All <FiArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                        {categories.map(cat => (
                            <Link key={cat._id} href={`/products?category=${cat._id}`}
                                className="card card-hover p-6 flex flex-col items-center text-center group">
                                <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">{categoryIcons[cat.name] || '📦'}</span>
                                <span className="font-semibold text-sm text-gray-800">{cat.name}</span>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Flash deals header */}
                <section className="max-w-7xl mx-auto px-4 pb-16">
                    <div className="bg-gradient-to-r from-red-500 to-accent-500 rounded-2xl p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center justify-between">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                                <FiZap /> Flash Deals
                            </h2>
                            <p className="text-white/80 mt-1">Up to 50% off on selected items</p>
                        </div>
                        <Link href="/products?sort=price_asc" className="mt-4 md:mt-0 bg-white text-red-600 font-semibold px-6 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                            See All Deals
                        </Link>
                    </div>
                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[...Array(4)].map((_, i) => <div key={i} className="skeleton rounded-2xl h-80" />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {featured.slice(0, 8).map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </section>

                {/* Banner CTA */}
                <section className="max-w-7xl mx-auto px-4 pb-16">
                    <div className="bg-gradient-to-r from-kenyan-black to-primary-900 rounded-2xl p-8 md:p-12 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">New to DukaHub?</h2>
                        <p className="text-gray-300 mb-6 max-w-lg mx-auto">Sign up today and get 15% off your first order with code <span className="text-accent-400 font-bold">NEWUSER</span></p>
                        <Link href="/register" className="btn-accent !text-base !py-3.5 !px-10">Create Account</Link>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
