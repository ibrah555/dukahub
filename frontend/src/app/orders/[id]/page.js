'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { api, formatPrice } from '@/lib/api';
import { FiCheckCircle, FiClock, FiTruck, FiPackage, FiXCircle } from 'react-icons/fi';

export default function OrderDetailPage({ params }) {
    const { id } = params;
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) { router.push('/login'); return; }
        if (user) {
            api.getOrder(id).then(setOrder).catch(() => router.push('/account')).finally(() => setLoading(false));
        }
    }, [user, authLoading, id]);

    if (loading || !order) return (<><Navbar /><div className="max-w-3xl mx-auto px-4 py-12"><div className="skeleton h-96 rounded-2xl" /></div><Footer /></>);

    const steps = ['Pending', 'Processing', 'Delivered'];
    const currentStep = order.status === 'Cancelled' ? -1 : steps.indexOf(order.status);

    return (
        <>
            <Navbar />
            <main className="max-w-3xl mx-auto px-4 py-8 animate-fadeIn">
                <div className="card p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <p className="text-sm text-gray-400">Order</p>
                            <h1 className="text-xl font-bold text-gray-900">#{order._id.slice(-8).toUpperCase()}</h1>
                        </div>
                        <span className={order.status === 'Delivered' ? 'badge-delivered' : order.status === 'Cancelled' ? 'badge-cancelled' : order.status === 'Processing' ? 'badge-processing' : 'badge-pending'}>
                            {order.status}
                        </span>
                    </div>

                    {/* Tracking timeline */}
                    {order.status !== 'Cancelled' && (
                        <div className="flex items-center justify-between mb-8 relative">
                            {steps.map((step, i) => (
                                <div key={step} className="flex flex-col items-center z-10">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${i <= currentStep ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                                        {i === 0 && <FiClock size={18} />}
                                        {i === 1 && <FiTruck size={18} />}
                                        {i === 2 && <FiCheckCircle size={18} />}
                                    </div>
                                    <span className={`text-xs font-medium ${i <= currentStep ? 'text-green-600' : 'text-gray-400'}`}>{step}</span>
                                </div>
                            ))}
                            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-0">
                                <div className="h-full bg-green-500 transition-all" style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Items */}
                <div className="card p-6 mb-6">
                    <h2 className="font-bold mb-4">Items</h2>
                    <div className="space-y-3">
                        {order.items.map((item, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center"><FiPackage /></div>
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                                    </div>
                                </div>
                                <span className="font-semibold">{formatPrice(item.price * item.qty)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between font-bold">
                        <span>Total</span><span>{formatPrice(order.totalAmount)}</span>
                    </div>
                </div>

                {/* Shipping & Payment */}
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="card p-5">
                        <h3 className="font-bold text-sm mb-3">Shipping</h3>
                        <p className="text-sm text-gray-600">{order.shippingAddress}</p>
                        <p className="text-sm text-gray-600">{order.county}</p>
                        <p className="text-sm text-gray-600">{order.phone}</p>
                    </div>
                    <div className="card p-5">
                        <h3 className="font-bold text-sm mb-3">Payment</h3>
                        <p className="text-sm text-gray-600 capitalize">{order.paymentMethod === 'mpesa' ? 'M-Pesa' : order.paymentMethod}</p>
                        <p className="text-sm text-gray-600 capitalize">Status: {order.paymentStatus}</p>
                        {order.mpesaCode && <p className="text-sm text-gray-600">Code: {order.mpesaCode}</p>}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
