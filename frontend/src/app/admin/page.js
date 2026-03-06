'use client';
import { useState, useEffect } from 'react';
import { api, formatPrice } from '@/lib/api';
import { FiDollarSign, FiShoppingBag, FiUsers, FiPackage, FiTrendingUp } from 'react-icons/fi';
import dynamic from 'next/dynamic';

const RechartsComponents = dynamic(() => import('@/components/DashboardCharts'), { ssr: false });

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getDashboard().then(setStats).catch(console.error).finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}</div>
            <div className="grid lg:grid-cols-2 gap-4"><div className="skeleton h-80 rounded-2xl" /><div className="skeleton h-80 rounded-2xl" /></div>
        </div>
    );

    if (!stats) return <p className="text-gray-500">Failed to load dashboard data.</p>;

    const cards = [
        { label: 'Total Revenue', value: formatPrice(stats.totalRevenue), icon: <FiDollarSign />, color: 'from-green-500 to-emerald-600', change: '+12.5%' },
        { label: 'Total Orders', value: stats.totalOrders, icon: <FiPackage />, color: 'from-blue-500 to-indigo-600', change: '+8.2%' },
        { label: 'Total Products', value: stats.totalProducts, icon: <FiShoppingBag />, color: 'from-purple-500 to-violet-600', change: '+3' },
        { label: 'Customers', value: stats.totalCustomers, icon: <FiUsers />, color: 'from-accent-500 to-orange-600', change: '+15.3%' },
    ];

    return (
        <div className="animate-fadeIn space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-400 text-sm">Welcome back, Admin</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((card, i) => (
                    <div key={i} className="card p-5 relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${card.color} opacity-10 rounded-bl-[40px]`} />
                        <div className={`w-10 h-10 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center text-white mb-3`}>
                            {card.icon}
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                        <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-gray-400">{card.label}</p>
                            <span className="text-xs font-semibold text-green-600 flex items-center gap-0.5"><FiTrendingUp size={10} />{card.change}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <RechartsComponents stats={stats} />

            {/* Recent orders */}
            <div className="card p-6">
                <h2 className="font-bold text-lg mb-4">Recent Orders</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead><tr className="text-left text-gray-400 border-b border-gray-100">
                            <th className="pb-3 font-medium">Order ID</th><th className="pb-3 font-medium">Customer</th>
                            <th className="pb-3 font-medium">Amount</th><th className="pb-3 font-medium">Status</th>
                        </tr></thead>
                        <tbody>
                            {(stats.recentOrders || []).map(order => (
                                <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50">
                                    <td className="py-3 font-mono text-xs">#{order._id.slice(-8).toUpperCase()}</td>
                                    <td className="py-3">{order.user?.name || 'N/A'}</td>
                                    <td className="py-3 font-semibold">{formatPrice(order.totalAmount)}</td>
                                    <td className="py-3">
                                        <span className={order.status === 'Delivered' ? 'badge-delivered' : order.status === 'Cancelled' ? 'badge-cancelled' : order.status === 'Processing' ? 'badge-processing' : 'badge-pending'}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
