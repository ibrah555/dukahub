'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { api, formatPrice } from '@/lib/api';
import { FiPackage, FiUser, FiHeart, FiSettings } from 'react-icons/fi';

export default function AccountPage() {
    const { user, loading: authLoading, logout } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [tab, setTab] = useState('orders');

    useEffect(() => {
        if (!authLoading && !user) router.push('/login');
        if (user) api.getMyOrders().then(setOrders).catch(() => { });
    }, [user, authLoading]);

    if (authLoading || !user) return <><Navbar /><div className="min-h-screen flex items-center justify-center"><div className="skeleton w-16 h-16 rounded-full" /></div></>;

    const statusBadge = (status) => {
        const cls = { Pending: 'badge-pending', Processing: 'badge-processing', Delivered: 'badge-delivered', Cancelled: 'badge-cancelled' };
        return <span className={cls[status] || 'badge-pending'}>{status}</span>;
    };

    return (
        <>
            <Navbar />
            <main className="max-w-5xl mx-auto px-4 py-8 animate-fadeIn">
                {/* Profile header */}
                <div className="card p-6 flex flex-col sm:flex-row items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">{user.name?.charAt(0)}</span>
                    </div>
                    <div className="text-center sm:text-left flex-1">
                        <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
                        <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                    <button onClick={logout} className="btn-outline text-sm !py-2">Logout</button>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-8 overflow-x-auto">
                    {[{ id: 'orders', icon: <FiPackage />, label: 'Orders' }, { id: 'profile', icon: <FiUser />, label: 'Profile' }].map(t => (
                        <button key={t.id} onClick={() => setTab(t.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${tab === t.id ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                            {t.icon} {t.label}
                        </button>
                    ))}
                </div>

                {tab === 'orders' && (
                    <div>
                        <h2 className="text-lg font-bold mb-4">My Orders ({orders.length})</h2>
                        {orders.length === 0 ? (
                            <div className="text-center py-12 card p-8">
                                <FiPackage size={48} className="mx-auto text-gray-300 mb-3" />
                                <p className="text-gray-500">No orders yet</p>
                                <Link href="/products" className="btn-primary mt-4 inline-block text-sm">Start Shopping</Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map(order => (
                                    <Link key={order._id} href={`/orders/${order._id}`} className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-primary-200 border-2 border-transparent transition-all">
                                        <div>
                                            <p className="text-sm font-mono text-gray-400">#{order._id.slice(-8).toUpperCase()}</p>
                                            <p className="font-semibold mt-1">{formatPrice(order.totalAmount)}</p>
                                            <p className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-gray-500">{order.items?.length || 0} items</span>
                                            {statusBadge(order.status)}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {tab === 'profile' && (
                    <div className="card p-6">
                        <h2 className="text-lg font-bold mb-4">Profile Information</h2>
                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                            <div><span className="text-gray-400">Name:</span> <span className="font-medium ml-2">{user.name}</span></div>
                            <div><span className="text-gray-400">Email:</span> <span className="font-medium ml-2">{user.email}</span></div>
                            <div><span className="text-gray-400">Phone:</span> <span className="font-medium ml-2">{user.phone || 'Not set'}</span></div>
                            <div><span className="text-gray-400">County:</span> <span className="font-medium ml-2">{user.county || 'Not set'}</span></div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}
