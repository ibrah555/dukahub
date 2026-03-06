import Link from 'next/link';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

export default function Footer() {
    return (
        <footer className="bg-kenyan-black text-gray-300 mt-20">
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-lg">D</span>
                            </div>
                            <span className="text-xl font-bold text-white">DukaHub</span>
                        </div>
                        <p className="text-sm leading-relaxed text-gray-400">Kenya&apos;s premier online shopping destination. Quality products, fast delivery, secure M-Pesa payments.</p>
                    </div>
                    <div>
                        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link href="/products" className="hover:text-accent-400 transition-colors">All Products</Link></li>
                            <li><Link href="/products?featured=true" className="hover:text-accent-400 transition-colors">Deals</Link></li>
                            <li><Link href="/account" className="hover:text-accent-400 transition-colors">My Account</Link></li>
                            <li><Link href="/cart" className="hover:text-accent-400 transition-colors">Cart</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-white font-semibold mb-4">Categories</h3>
                        <ul className="space-y-2.5 text-sm">
                            {['Electronics', 'Fashion', 'Phones & Tablets', 'Home & Kitchen', 'Supermarket', 'Health & Beauty'].map(cat => (
                                <li key={cat}><Link href={`/products?category=${encodeURIComponent(cat)}`} className="hover:text-accent-400 transition-colors">{cat}</Link></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-white font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-2"><FiPhone size={14} className="text-accent-400" /> +254 700 123 456</li>
                            <li className="flex items-center gap-2"><FiMail size={14} className="text-accent-400" /> support@dukahub.co.ke</li>
                            <li className="flex items-center gap-2"><FiMapPin size={14} className="text-accent-400" /> Nairobi, Kenya</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <p>&copy; {new Date().getFullYear()} DukaHub. All rights reserved.</p>
                    <div className="flex gap-4">
                        <span>M-Pesa</span><span>Visa</span><span>Mastercard</span><span>Cash on Delivery</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
