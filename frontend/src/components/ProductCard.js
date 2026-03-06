'use client';
import Link from 'next/link';
import { FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/api';

export default function ProductCard({ product }) {
    const { addItem } = useCart();
    const discount = product.comparePrice > product.price
        ? Math.round((1 - product.price / product.comparePrice) * 100)
        : 0;

    const placeholder = 'data:image/svg+xml,' + encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect fill="#e2e8f0" width="400" height="400"/><text x="50%" y="50%" text-anchor="middle" fill="#94a3b8" font-size="48" dy=".3em">📦</text></svg>`
    );

    return (
        <div className="card card-hover group flex flex-col">
            <Link href={`/products/${product.slug}`} className="relative aspect-square overflow-hidden bg-gray-50">
                <img
                    src={product.images?.[0] || placeholder}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {discount > 0 && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                        -{discount}%
                    </span>
                )}
                {product.featured && (
                    <span className="absolute top-3 right-3 bg-accent-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide">
                        Hot
                    </span>
                )}
            </Link>
            <div className="p-4 flex flex-col flex-1">
                <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-1">{product.category?.name || 'General'}</p>
                <Link href={`/products/${product.slug}`}>
                    <h3 className="font-semibold text-sm text-gray-800 hover:text-primary-600 transition-colors line-clamp-2 mb-2">{product.name}</h3>
                </Link>
                {product.rating > 0 && (
                    <div className="flex items-center gap-1 mb-2">
                        <FiStar className="text-accent-500 fill-accent-500" size={12} />
                        <span className="text-xs font-medium text-gray-600">{product.rating}</span>
                        <span className="text-xs text-gray-400">({product.reviewCount})</span>
                    </div>
                )}
                <div className="mt-auto">
                    <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
                        {product.comparePrice > product.price && (
                            <span className="text-xs text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>
                        )}
                    </div>
                    <button
                        onClick={(e) => { e.preventDefault(); addItem(product); }}
                        className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-primary-600/20 hover:shadow-lg"
                    >
                        <FiShoppingCart size={15} /> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
