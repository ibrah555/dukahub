'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { FiHeart } from 'react-icons/fi';

export default function WishlistPage() {
    const { user, loading: authLoading } = useAuth();
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        if (user) {
            api.getMe().then(data => setWishlist(data.wishlist || [])).catch(() => { });
        }
    }, [user]);

    if (authLoading) return <><Navbar /><div className="min-h-screen" /><Footer /></>;

    return (
        <>
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>
                {wishlist.length === 0 ? (
                    <div className="text-center py-20">
                        <FiHeart size={48} className="mx-auto text-gray-300 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-400">Save your favourite products here</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {wishlist.map(p => <ProductCard key={p._id} product={p} />)}
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}
