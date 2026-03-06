'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { api, formatPrice, KENYAN_COUNTIES } from '@/lib/api';
import { FiCheck, FiCreditCard, FiSmartphone, FiDollarSign } from 'react-icons/fi';

export default function CheckoutPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { items, subtotal, total, discountAmount, discount, clearCart, setDiscount } = useCart();
    const [form, setForm] = useState({
        shippingAddress: user?.address || '',
        county: user?.county || 'Nairobi',
        phone: user?.phone || '',
        paymentMethod: 'mpesa',
    });
    const [discountCode, setDiscountCode] = useState('');
    const [processing, setProcessing] = useState(false);
    const [step, setStep] = useState(1); // 1=shipping, 2=payment, 3=confirm

    const handleApplyDiscount = async () => {
        try {
            const data = await api.validateDiscount({ code: discountCode, orderTotal: subtotal });
            setDiscount({ type: data.type, value: data.value });
            alert(`Discount applied! You save ${formatPrice(data.discountAmount)}`);
        } catch (err) { alert(err.message); }
    };

    const handlePlaceOrder = async () => {
        if (!user) { router.push('/login'); return; }
        if (!form.shippingAddress || !form.county || !form.phone) { alert('Please fill all shipping details'); return; }
        setProcessing(true);
        try {
            if (form.paymentMethod === 'mpesa') {
                await api.mpesaStkPush({ phone: form.phone, amount: total, orderId: 'temp' });
            }
            const order = await api.createOrder({
                items: items.map(i => ({ product: i._id, qty: i.qty })),
                paymentMethod: form.paymentMethod,
                shippingAddress: form.shippingAddress,
                county: form.county,
                phone: form.phone,
                discountCode: discountCode || '',
                discountAmount: discountAmount,
            });
            clearCart();
            router.push(`/orders/${order._id}`);
        } catch (err) { alert(err.message); }
        finally { setProcessing(false); }
    };

    if (items.length === 0) {
        return (<><Navbar /><main className="max-w-3xl mx-auto px-4 py-20 text-center"><p className="text-5xl mb-4">🛒</p><h2 className="text-xl font-semibold mb-2">Your cart is empty</h2><a href="/products" className="btn-primary mt-4 inline-block">Shop Now</a></main><Footer /></>);
    }

    return (
        <>
            <Navbar />
            <main className="max-w-5xl mx-auto px-4 py-8 animate-fadeIn">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                {/* Steps indicator */}
                <div className="flex items-center justify-center gap-2 mb-10">
                    {[{ num: 1, label: 'Shipping' }, { num: 2, label: 'Payment' }, { num: 3, label: 'Confirm' }].map(s => (
                        <div key={s.num} className="flex items-center gap-2">
                            <button onClick={() => setStep(s.num)}
                                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s.num ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                {step > s.num ? <FiCheck size={16} /> : s.num}
                            </button>
                            <span className={`text-sm font-medium hidden sm:block ${step >= s.num ? 'text-gray-800' : 'text-gray-400'}`}>{s.label}</span>
                            {s.num < 3 && <div className={`w-12 h-0.5 ${step > s.num ? 'bg-primary-600' : 'bg-gray-200'}`} />}
                        </div>
                    ))}
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        {step === 1 && (
                            <div className="card p-6 space-y-4">
                                <h2 className="text-lg font-bold mb-2">Shipping Details</h2>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="0712345678" className="input-field" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">County</label>
                                    <select value={form.county} onChange={e => setForm(f => ({ ...f, county: e.target.value }))} className="input-field">
                                        {KENYAN_COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                                    <textarea value={form.shippingAddress} onChange={e => setForm(f => ({ ...f, shippingAddress: e.target.value }))} placeholder="Building, street, area..." className="input-field" rows={3} />
                                </div>
                                <button onClick={() => setStep(2)} className="btn-primary w-full mt-2">Continue to Payment</button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="card p-6 space-y-4">
                                <h2 className="text-lg font-bold mb-2">Payment Method</h2>
                                {[
                                    { id: 'mpesa', icon: <FiSmartphone />, label: 'M-Pesa', desc: 'Pay via M-Pesa STK Push' },
                                    { id: 'card', icon: <FiCreditCard />, label: 'Card Payment', desc: 'Visa / Mastercard' },
                                    { id: 'cod', icon: <FiDollarSign />, label: 'Cash on Delivery', desc: 'Pay when you receive' },
                                ].map(pm => (
                                    <label key={pm.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.paymentMethod === pm.id ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <input type="radio" name="payment" checked={form.paymentMethod === pm.id} onChange={() => setForm(f => ({ ...f, paymentMethod: pm.id }))} className="accent-primary-600" />
                                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-lg text-gray-600">{pm.icon}</div>
                                        <div>
                                            <p className="font-semibold text-sm">{pm.label}</p>
                                            <p className="text-xs text-gray-400">{pm.desc}</p>
                                        </div>
                                    </label>
                                ))}
                                <div className="flex gap-3 mt-4">
                                    <button onClick={() => setStep(1)} className="btn-outline flex-1">Back</button>
                                    <button onClick={() => setStep(3)} className="btn-primary flex-1">Review Order</button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="card p-6 space-y-4">
                                <h2 className="text-lg font-bold mb-2">Review Your Order</h2>
                                <div className="text-sm space-y-2 bg-gray-50 p-4 rounded-xl">
                                    <p><span className="text-gray-500">Ship to:</span> {form.shippingAddress}, {form.county}</p>
                                    <p><span className="text-gray-500">Phone:</span> {form.phone}</p>
                                    <p><span className="text-gray-500">Payment:</span> {form.paymentMethod === 'mpesa' ? 'M-Pesa' : form.paymentMethod === 'card' ? 'Card' : 'Cash on Delivery'}</p>
                                </div>
                                <div className="space-y-3">
                                    {items.map(item => (
                                        <div key={item._id} className="flex items-center justify-between text-sm">
                                            <span className="truncate flex-1">{item.name} × {item.qty}</span>
                                            <span className="font-semibold ml-4">{formatPrice(item.price * item.qty)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-3 mt-4">
                                    <button onClick={() => setStep(2)} className="btn-outline flex-1">Back</button>
                                    <button onClick={handlePlaceOrder} disabled={processing}
                                        className="btn-primary flex-1 disabled:opacity-50">
                                        {processing ? 'Processing...' : 'Place Order'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary sidebar */}
                    <div className="card p-6 h-fit sticky top-24">
                        <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                        <div className="space-y-2 text-sm mb-4">
                            {items.map(item => (
                                <div key={item._id} className="flex justify-between">
                                    <span className="text-gray-500 truncate mr-2">{item.name} ×{item.qty}</span>
                                    <span className="font-medium shrink-0">{formatPrice(item.price * item.qty)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                            {discountAmount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(discountAmount)}</span></div>}
                            <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span className="text-green-600">{subtotal >= 5000 ? 'Free' : formatPrice(300)}</span></div>
                            <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-lg"><span>Total</span><span>{formatPrice(total + (subtotal < 5000 ? 300 : 0))}</span></div>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <input type="text" value={discountCode} onChange={e => setDiscountCode(e.target.value)} placeholder="Discount code" className="input-field !py-2 text-sm flex-1" />
                            <button onClick={handleApplyDiscount} className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">Apply</button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
