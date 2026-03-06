'use client';
import { useState, useEffect } from 'react';
import { api, formatPrice } from '@/lib/api';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState([]);
    const [selected, setSelected] = useState(null);
    const [detail, setDetail] = useState(null);

    useEffect(() => {
        api.getUsers().then(setCustomers).catch(() => { });
    }, []);

    const viewCustomer = async (id) => {
        try {
            const data = await api.getUser(id);
            setDetail(data);
            setSelected(id);
        } catch (err) { alert(err.message); }
    };

    return (
        <div className="animate-fadeIn">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Customers ({customers.length})</h1>
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead><tr className="text-left text-gray-400 bg-gray-50 border-b border-gray-100">
                            <th className="p-4 font-medium">Customer</th><th className="p-4 font-medium">County</th>
                            <th className="p-4 font-medium">Joined</th><th className="p-4 font-medium">Action</th>
                        </tr></thead>
                        <tbody>
                            {customers.map(c => (
                                <tr key={c._id} className={`border-b border-gray-50 cursor-pointer transition-colors ${selected === c._id ? 'bg-primary-50' : 'hover:bg-gray-50/50'}`} onClick={() => viewCustomer(c._id)}>
                                    <td className="p-4"><div><p className="font-medium">{c.name}</p><p className="text-xs text-gray-400">{c.email}</p></div></td>
                                    <td className="p-4 text-gray-500">{c.county || '-'}</td>
                                    <td className="p-4 text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4"><button className="text-primary-600 text-xs font-semibold hover:underline">View</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Detail panel */}
                <div className="card p-6 h-fit sticky top-8">
                    {detail ? (
                        <>
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                    <span className="text-white text-2xl font-bold">{detail.user.name?.charAt(0)}</span>
                                </div>
                                <h3 className="font-bold">{detail.user.name}</h3>
                            </div>
                            <div className="space-y-3 text-sm mb-6">
                                <div className="flex items-center gap-2 text-gray-600"><FiMail size={14} /> {detail.user.email}</div>
                                <div className="flex items-center gap-2 text-gray-600"><FiPhone size={14} /> {detail.user.phone || 'N/A'}</div>
                                <div className="flex items-center gap-2 text-gray-600"><FiMapPin size={14} /> {detail.user.county || 'N/A'}</div>
                            </div>
                            <h4 className="font-semibold text-sm mb-3">Order History ({detail.orders.length})</h4>
                            <div className="space-y-2 max-h-80 overflow-y-auto">
                                {detail.orders.map(o => (
                                    <div key={o._id} className="bg-gray-50 p-3 rounded-xl text-xs">
                                        <div className="flex justify-between mb-1">
                                            <span className="font-mono">#{o._id.slice(-6).toUpperCase()}</span>
                                            <span className={o.status === 'Delivered' ? 'text-green-600' : o.status === 'Cancelled' ? 'text-red-500' : 'text-yellow-600'}>{o.status}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-400">
                                            <span>{formatPrice(o.totalAmount)}</span>
                                            <span>{new Date(o.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-gray-400 py-12">
                            <p className="text-sm">Select a customer to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
