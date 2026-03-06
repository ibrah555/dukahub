'use client';
import { useState, useEffect } from 'react';
import { api, formatPrice } from '@/lib/api';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');

    const loadOrders = () => {
        setLoading(true);
        const params = statusFilter ? `status=${statusFilter}` : '';
        api.getOrders(params).then(d => setOrders(d.orders || [])).catch(() => { }).finally(() => setLoading(false));
    };

    useEffect(() => { loadOrders(); }, [statusFilter]);

    const updateStatus = async (id, status) => {
        try { await api.updateOrderStatus(id, { status }); loadOrders(); } catch (err) { alert(err.message); }
    };

    const statusColor = { Pending: 'badge-pending', Processing: 'badge-processing', Delivered: 'badge-delivered', Cancelled: 'badge-cancelled' };

    return (
        <div className="animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                <div className="flex gap-2">
                    {['', 'Pending', 'Processing', 'Delivered', 'Cancelled'].map(s => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${statusFilter === s ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                            {s || 'All'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead><tr className="text-left text-gray-400 bg-gray-50 border-b border-gray-100">
                            <th className="p-4 font-medium">Order ID</th><th className="p-4 font-medium">Customer</th>
                            <th className="p-4 font-medium">Items</th><th className="p-4 font-medium">Amount</th>
                            <th className="p-4 font-medium">Payment</th><th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium">Date</th><th className="p-4 font-medium">Actions</th>
                        </tr></thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                    <td className="p-4 font-mono text-xs">#{order._id.slice(-8).toUpperCase()}</td>
                                    <td className="p-4"><div><p className="font-medium">{order.user?.name || 'N/A'}</p><p className="text-xs text-gray-400">{order.user?.email}</p></div></td>
                                    <td className="p-4">{order.items?.length || 0}</td>
                                    <td className="p-4 font-semibold">{formatPrice(order.totalAmount)}</td>
                                    <td className="p-4 capitalize text-xs">{order.paymentMethod}</td>
                                    <td className="p-4"><span className={statusColor[order.status] || 'badge-pending'}>{order.status}</span></td>
                                    <td className="p-4 text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <select value={order.status} onChange={e => updateStatus(order._id, e.target.value)}
                                            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-primary-500">
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
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
