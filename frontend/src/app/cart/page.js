'use client';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/api';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';

export default function CartPage() {
    const { items, removeItem, updateQty, subtotal, total, itemCount, discount, discountAmount } = useCart();

    const placeholder = 'data:image/svg+xml,' + encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="#f1f5f9" width="100" height="100"/><text x="50%" y="50%" text-anchor="middle" fill="#94a3b8" font-size="30" dy=".3em">📦</text></svg>`
    );

    return (
        <>
            <Navbar />
            <main className="max-w-5xl mx-auto px-4 py-8 animate-fadeIn">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Shopping Cart ({itemCount} items)</h1>
                {items.length === 0 ? (
                    <div className="text-center py-20">
                        <FiShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
                        <p className="text-gray-400 mb-6">Start shopping to add items to your cart</p>
                        <Link href="/products" className="btn-primary">Continue Shopping</Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-3">
                            {items.map(item => (
                                <div key={item._id} className="card p-4 flex gap-4">
                                    <Link href={`/products/${item.slug}`} className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                                        <img src={item.image || placeholder} alt={item.name} className="w-full h-full object-cover" />
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                        <Link href={`/products/${item.slug}`} className="font-semibold text-sm text-gray-800 hover:text-primary-600 line-clamp-2">{item.name}</Link>
                                        <p className="text-lg font-bold text-gray-900 mt-1">{formatPrice(item.price)}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                                <button onClick={() => updateQty(item._id, item.qty - 1)} className="p-1.5 hover:bg-gray-50"><FiMinus size={14} /></button>
                                                <span className="px-3 text-sm font-semibold">{item.qty}</span>
                                                <button onClick={() => updateQty(item._id, item.qty + 1)} className="p-1.5 hover:bg-gray-50"><FiPlus size={14} /></button>
                                            </div>
                                            <button onClick={() => removeItem(item._id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="card p-6 h-fit sticky top-24">
                            <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-semibold">{formatPrice(subtotal)}</span></div>
                                {discountAmount > 0 && (
                                    <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(discountAmount)}</span></div>
                                )}
                                <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span className="text-green-600 font-medium">{subtotal >= 5000 ? 'Free' : formatPrice(300)}</span></div>
                                <div className="border-t border-gray-100 pt-3 flex justify-between text-lg font-bold">
                                    <span>Total</span><span>{formatPrice(total + (subtotal < 5000 ? 300 : 0))}</span>
                                </div>
                            </div>
                            <Link href="/checkout" className="btn-primary w-full text-center mt-6 flex items-center justify-center gap-2">
                                Checkout <FiArrowRight />
                            </Link>
                            <Link href="/products" className="block text-center text-sm text-primary-600 hover:underline mt-3">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}
