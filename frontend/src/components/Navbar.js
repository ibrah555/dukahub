'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch, FiHeart, FiLogOut, FiGrid } from 'react-icons/fi';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { itemCount } = useCart();
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) window.location.href = `/products?q=${encodeURIComponent(searchQuery.trim())}`;
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4">
                {/* Top bar */}
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <img src="/logo.png" alt="DukaHub Logo" className="h-10 w-auto object-contain" />
                        <span className="text-xl font-bold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent hidden sm:block">DukaHub</span>
                    </Link>

                    {/* Search bar */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-6">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search products, brands..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-4 pr-12 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                            />
                            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-primary-600 transition-colors">
                                <FiSearch size={18} />
                            </button>
                        </div>
                    </form>

                    {/* Right icons */}
                    <div className="flex items-center gap-1 sm:gap-2">
                        {user && (
                            <Link href="/account/wishlist" className="p-2.5 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all" title="Wishlist">
                                <FiHeart size={20} />
                            </Link>
                        )}
                        <Link href="/cart" className="relative p-2.5 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all" title="Cart">
                            <FiShoppingCart size={20} />
                            {itemCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-accent-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                        {user ? (
                            <div className="relative group">
                                <button className="p-2.5 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all">
                                    <FiUser size={20} />
                                </button>
                                <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <div className="px-4 py-2 border-b border-gray-50">
                                        <p className="font-semibold text-sm truncate">{user.name}</p>
                                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                    </div>
                                    <Link href="/account" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                                        <FiUser size={15} /> My Account
                                    </Link>
                                    {user.role === 'admin' && (
                                        <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                                            <FiGrid size={15} /> Admin Dashboard
                                        </Link>
                                    )}
                                    <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                        <FiLogOut size={15} /> Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link href="/login" className="btn-primary text-sm !py-2 !px-4">Sign In</Link>
                        )}
                        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2.5 text-gray-600 hover:text-primary-600 rounded-xl transition-all">
                            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                        </button>
                    </div>
                </div>

                {/* Category bar */}
                <div className="hidden md:flex items-center gap-1 py-2 text-sm overflow-x-auto">
                    {['Electronics', 'Phones & Tablets', 'Fashion', 'Home & Kitchen', 'Supermarket', 'Health & Beauty'].map(cat => (
                        <Link key={cat} href={`/products?category=${encodeURIComponent(cat)}`}
                            className="px-3 py-1.5 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg whitespace-nowrap transition-all font-medium">
                            {cat}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white animate-fadeIn">
                    <form onSubmit={handleSearch} className="p-4">
                        <div className="relative">
                            <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none" />
                            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2"><FiSearch /></button>
                        </div>
                    </form>
                    <div className="px-4 pb-4 space-y-1">
                        {['Electronics', 'Phones & Tablets', 'Fashion', 'Home & Kitchen', 'Supermarket', 'Health & Beauty'].map(cat => (
                            <Link key={cat} href={`/products?category=${encodeURIComponent(cat)}`}
                                className="block px-3 py-2.5 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors" onClick={() => setMenuOpen(false)}>
                                {cat}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
