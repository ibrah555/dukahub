'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { api } from '@/lib/api';
import { FiFilter, FiX } from 'react-icons/fi';

function ProductsContent() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState({
        category: searchParams.get('category') || '',
        sort: searchParams.get('sort') || 'newest',
        q: searchParams.get('q') || '',
        featured: searchParams.get('featured') || '',
    });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        api.getCategories().then(setCategories).catch(() => { });
    }, []);

    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.q) params.set('q', filters.q);
        if (filters.category) params.set('category', filters.category);
        if (filters.sort) params.set('sort', filters.sort);
        if (filters.featured) params.set('featured', filters.featured);
        params.set('page', page);
        params.set('limit', 12);

        api.getProducts(params.toString())
            .then(data => { setProducts(data.products); setTotalPages(data.pages); setTotal(data.total); })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [filters, page]);

    return (
        <>
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            {filters.q ? `Results for "${filters.q}"` : filters.featured ? 'Featured Products' : 'All Products'}
                        </h1>
                        <p className="text-sm text-gray-400 mt-1">{total} products found</p>
                    </div>
                    <button onClick={() => setShowFilters(!showFilters)} className="md:hidden btn-outline !py-2 !px-4 text-sm flex items-center gap-2">
                        <FiFilter size={14} /> Filters
                    </button>
                </div>

                <div className="flex gap-8">
                    {/* Sidebar filters */}
                    <aside className={`${showFilters ? 'fixed inset-0 z-50 bg-white p-6 overflow-auto' : 'hidden'} md:block md:static md:w-56 shrink-0`}>
                        <div className="flex justify-between items-center mb-4 md:hidden">
                            <h3 className="font-bold text-lg">Filters</h3>
                            <button onClick={() => setShowFilters(false)}><FiX size={22} /></button>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-sm text-gray-700 mb-3">Category</h4>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                                        <input type="radio" name="cat" checked={!filters.category} onChange={() => setFilters(f => ({ ...f, category: '' }))} className="accent-primary-600" />
                                        All Categories
                                    </label>
                                    {categories.map(cat => (
                                        <label key={cat._id} className="flex items-center gap-2 text-sm cursor-pointer">
                                            <input type="radio" name="cat" checked={filters.category === cat._id} onChange={() => setFilters(f => ({ ...f, category: cat._id }))} className="accent-primary-600" />
                                            {cat.name}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm text-gray-700 mb-3">Sort By</h4>
                                <select value={filters.sort} onChange={(e) => setFilters(f => ({ ...f, sort: e.target.value }))}
                                    className="input-field text-sm !py-2">
                                    <option value="newest">Newest</option>
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                    <option value="rating">Top Rated</option>
                                </select>
                            </div>
                            {(filters.category || filters.q || filters.featured) && (
                                <button onClick={() => setFilters({ category: '', sort: 'newest', q: '', featured: '' })}
                                    className="text-sm text-red-500 hover:underline">Clear all filters</button>
                            )}
                        </div>
                    </aside>

                    {/* Product grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[...Array(6)].map((_, i) => <div key={i} className="skeleton rounded-2xl h-80" />)}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-6xl mb-4">🔍</p>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
                                <p className="text-gray-400">Try adjusting your search or filters</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {products.map(p => <ProductCard key={p._id} product={p} />)}
                                </div>
                                {totalPages > 1 && (
                                    <div className="flex justify-center gap-2 mt-8">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                            <button key={p} onClick={() => setPage(p)}
                                                className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${p === page ? 'bg-primary-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="skeleton w-20 h-20 rounded-full" /></div>}>
            <ProductsContent />
        </Suspense>
    );
}
