'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { api, formatPrice } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { FiStar, FiShoppingCart, FiHeart, FiMinus, FiPlus, FiChevronRight } from 'react-icons/fi';

export default function ProductDetailPage({ params }) {
    const { slug } = params;
    const router = useRouter();
    const { addItem } = useCart();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [related, setRelated] = useState([]);
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(true);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');

    const placeholder = 'data:image/svg+xml,' + encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><rect fill="#f1f5f9" width="600" height="600"/><text x="50%" y="50%" text-anchor="middle" fill="#94a3b8" font-size="80" dy=".3em">📦</text></svg>`
    );

    useEffect(() => {
        setLoading(true);
        api.getProduct(slug).then(data => {
            setProduct(data);
            if (data.sizes?.length) setSelectedSize(data.sizes[0]);
            if (data.colors?.length) setSelectedColor(data.colors[0]);
            api.getReviews(data._id).then(setReviews).catch(() => { });
            if (data.category?._id) {
                api.getProducts(`category=${data.category._id}&limit=4`).then(d => {
                    setRelated((d.products || []).filter(p => p._id !== data._id));
                }).catch(() => { });
            }
        }).catch(() => router.push('/products'))
            .finally(() => setLoading(false));
    }, [slug]);

    const handleAddReview = async (e) => {
        e.preventDefault();
        try {
            const r = await api.createReview({ productId: product._id, ...reviewForm });
            setReviews(prev => [r, ...prev]);
            setReviewForm({ rating: 5, comment: '' });
        } catch (err) { alert(err.message); }
    };

    if (loading) return (
        <><Navbar /><div className="max-w-7xl mx-auto px-4 py-12"><div className="grid md:grid-cols-2 gap-12"><div className="skeleton aspect-square rounded-2xl" /><div className="space-y-4"><div className="skeleton h-8 w-3/4 rounded" /><div className="skeleton h-12 w-1/3 rounded" /><div className="skeleton h-24 w-full rounded" /></div></div></div><Footer /></>
    );

    if (!product) return null;

    const images = product.images?.length ? product.images : [placeholder];
    const discount = product.comparePrice > product.price ? Math.round((1 - product.price / product.comparePrice) * 100) : 0;

    const nextImage = () => setSelectedImage((selectedImage + 1) % images.length);
    const prevImage = () => setSelectedImage((selectedImage - 1 + images.length) % images.length);

    return (
        <>
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                    <a href="/" className="hover:text-primary-600">Home</a>
                    <FiChevronRight size={12} />
                    <a href="/products" className="hover:text-primary-600">Products</a>
                    <FiChevronRight size={12} />
                    <span className="text-gray-600 truncate">{product.name}</span>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                    {/* Images Carousel */}
                    <div>
                        <div className="group relative aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-4 border border-gray-100 shadow-sm">
                            <img src={images[selectedImage]} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                            {discount > 0 && <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-xl z-10">-{discount}%</span>}

                            {images.length > 1 && (
                                <>
                                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-800 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
                                        <FiChevronRight className="rotate-180" size={20} />
                                    </button>
                                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-800 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
                                        <FiChevronRight size={20} />
                                    </button>
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                                        {images.map((_, i) => (
                                            <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === selectedImage ? 'bg-primary-600 w-4' : 'bg-gray-300'}`} />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                        {images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {images.map((img, i) => (
                                    <button key={i} onClick={() => setSelectedImage(i)} className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${i === selectedImage ? 'border-primary-600' : 'border-gray-200'}`}>
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div>
                        <p className="text-xs uppercase tracking-wider text-primary-600 font-semibold mb-2">{product.category?.name}</p>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <FiStar key={s} size={16} className={s <= Math.round(product.rating) ? 'text-accent-500 fill-accent-500' : 'text-gray-300'} />
                                ))}
                            </div>
                            <span className="text-sm text-gray-500">({product.reviewCount} reviews)</span>
                        </div>
                        <div className="flex items-baseline gap-3 mb-6">
                            <span className="text-3xl font-extrabold text-gray-900">{formatPrice(product.price)}</span>
                            {product.comparePrice > product.price && (
                                <span className="text-lg text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>
                            )}
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

                        {/* Variants Selection */}
                        <div className="space-y-6 mb-8">
                            {product.colors?.length > 0 && (
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-3">Color: <span className="font-normal text-gray-500">{selectedColor}</span></label>
                                    <div className="flex flex-wrap gap-2">
                                        {product.colors.map(color => (
                                            <button key={color} onClick={() => setSelectedColor(color)}
                                                className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${selectedColor === color ? 'bg-primary-600 border-primary-600 text-white shadow-md' : 'bg-white border-gray-200 text-gray-700 hover:border-primary-600'}`}>
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {product.sizes?.length > 0 && (
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-3">Size: <span className="font-normal text-gray-500">{selectedSize}</span></label>
                                    <div className="flex flex-wrap gap-2">
                                        {product.sizes.map(size => (
                                            <button key={size} onClick={() => setSelectedSize(size)}
                                                className={`min-w-[3rem] px-4 py-2 rounded-xl border text-sm font-bold transition-all ${selectedSize === size ? 'bg-gray-900 border-gray-900 text-white shadow-md' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-900'}`}>
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-4 mb-6 pt-6 border-t border-gray-100">
                            {product.brand && <div className="text-sm"><span className="text-gray-400">Brand:</span> <span className="font-semibold">{product.brand}</span></div>}
                            <div className="text-sm"><span className="text-gray-400">Availability:</span> <span className={product.stock > 0 ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'}>{product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}</span></div>
                        </div>

                        {product.stock > 0 && (
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:bg-gray-50 transition-colors"><FiMinus size={16} /></button>
                                    <span className="px-6 font-bold text-lg">{qty}</span>
                                    <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="p-3 hover:bg-gray-50 transition-colors"><FiPlus size={16} /></button>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button onClick={() => addItem(product, qty, selectedSize, selectedColor)} disabled={product.stock < 1}
                                className="btn-primary flex-1 h-14 flex items-center justify-center gap-3 text-lg shadow-xl shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed">
                                <FiShoppingCart size={22} /> Add to Cart
                            </button>
                            <button onClick={() => user && api.toggleWishlist(product._id)} className="w-14 h-14 flex items-center justify-center border-2 border-gray-200 rounded-2xl hover:border-red-400 hover:text-red-500 transition-all shadow-sm">
                                <FiHeart size={24} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Reviews */}
                <section className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews ({reviews.length})</h2>
                    {user && (
                        <form onSubmit={handleAddReview} className="card p-6 mb-8">
                            <h3 className="font-semibold mb-4">Write a Review</h3>
                            <div className="flex items-center gap-2 mb-4">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <button key={s} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: s }))}>
                                        <FiStar size={22} className={s <= reviewForm.rating ? 'text-accent-500 fill-accent-500' : 'text-gray-300'} />
                                    </button>
                                ))}
                            </div>
                            <textarea value={reviewForm.comment} onChange={(e) => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                                placeholder="Share your experience..." className="input-field mb-4" rows={3} />
                            <button type="submit" className="btn-primary text-sm">Submit Review</button>
                        </form>
                    )}
                    <div className="space-y-4">
                        {reviews.map(review => (
                            <div key={review._id} className="card p-5">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold text-sm">
                                            {review.user?.name?.charAt(0) || 'U'}
                                        </div>
                                        <span className="font-semibold text-sm">{review.user?.name || 'User'}</span>
                                    </div>
                                    <div className="flex">{[1, 2, 3, 4, 5].map(s => <FiStar key={s} size={12} className={s <= review.rating ? 'text-accent-500 fill-accent-500' : 'text-gray-300'} />)}</div>
                                </div>
                                {review.comment && <p className="text-sm text-gray-600">{review.comment}</p>}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Related */}
                {related.length > 0 && (
                    <section className="mt-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {related.map(p => <ProductCard key={p._id} product={p} />)}
                        </div>
                    </section>
                )}
            </main>
            <Footer />
        </>
    );
}
