'use client';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatPrice } from '@/lib/api';

const COLORS = ['#4f46e5', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

export default function DashboardCharts({ stats }) {
    const revenueData = (stats.dailyRevenue || []).map(d => ({
        date: d._id.split('-').slice(1).join('/'),
        revenue: d.revenue,
        orders: d.count,
    }));

    const topProductsData = (stats.topProducts || []).map(p => ({
        name: p._id.length > 15 ? p._id.substring(0, 15) + '...' : p._id,
        sold: p.totalSold,
        revenue: p.revenue,
    }));

    const statusData = (stats.ordersByStatus || []).map(s => ({
        name: s._id,
        value: s.count,
    }));

    return (
        <div className="grid lg:grid-cols-2 gap-6">
            {/* Revenue chart */}
            <div className="card p-6">
                <h3 className="font-bold text-sm text-gray-700 mb-4">Revenue (Last 30 Days)</h3>
                {revenueData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                            <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
                            <Tooltip formatter={(value) => formatPrice(value)} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                            <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2.5} dot={{ fill: '#4f46e5', r: 3 }} activeDot={{ r: 5 }} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : <p className="text-gray-400 text-sm text-center py-20">No revenue data yet</p>}
            </div>

            {/* Top products */}
            <div className="card p-6">
                <h3 className="font-bold text-sm text-gray-700 mb-4">Top Products</h3>
                {topProductsData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={topProductsData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis type="number" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                            <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 10 }} stroke="#94a3b8" />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                            <Bar dataKey="sold" fill="#4f46e5" radius={[0, 6, 6, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : <p className="text-gray-400 text-sm text-center py-20">No product data yet</p>}
            </div>

            {/* Orders by status */}
            <div className="card p-6">
                <h3 className="font-bold text-sm text-gray-700 mb-4">Orders by Status</h3>
                {statusData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                        </PieChart>
                    </ResponsiveContainer>
                ) : <p className="text-gray-400 text-sm text-center py-20">No order data yet</p>}
            </div>

            {/* Orders trend */}
            <div className="card p-6">
                <h3 className="font-bold text-sm text-gray-700 mb-4">Daily Orders</h3>
                {revenueData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                            <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                            <Bar dataKey="orders" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : <p className="text-gray-400 text-sm text-center py-20">No order data yet</p>}
            </div>
        </div>
    );
}
