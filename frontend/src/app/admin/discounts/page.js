'use client';
import { useState, useEffect } from 'react';
import { api, formatPrice } from '@/lib/api';
import { FiPlus, FiTrash2, FiX } from 'react-icons/fi';

export default function AdminDiscountsPage() {
    const [discounts, setDiscounts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ code: '', type: 'percent', value: '', minOrder: '', expiresAt: '' });

    const loadDiscounts = () => api.getDiscounts().then(setDiscounts).catch(() => { });
    useEffect(() => { loadDiscounts(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try { await api.createDiscount({ ...form, value: Number(form.value), minOrder: Number(form.minOrder) || 0 }); setShowModal(false); loadDiscounts(); } catch (err) { alert(err.message); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this discount code?')) return;
        try { await api.deleteDiscount(id); loadDiscounts(); } catch (err) { alert(err.message); }
    };

    return (
        <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Discount Codes ({discounts.length})</h1>
                <button onClick={() => setShowModal(true)} className="btn-primary text-sm flex items-center gap-2"><FiPlus size={16} /> Add Code</button>
            </div>
            <div className="card overflow-hidden">
                <table className="w-full text-sm">
                    <thead><tr className="text-left text-gray-400 bg-gray-50 border-b border-gray-100">
                        <th className="p-4 font-medium">Code</th><th className="p-4 font-medium">Type</th>
                        <th className="p-4 font-medium">Value</th><th className="p-4 font-medium">Min Order</th>
                        <th className="p-4 font-medium">Expires</th><th className="p-4 font-medium">Actions</th>
                    </tr></thead>
                    <tbody>
                        {discounts.map(d => (
                            <tr key={d._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                <td className="p-4 font-mono font-bold">{d.code}</td>
                                <td className="p-4 capitalize">{d.type}</td>
                                <td className="p-4 font-semibold">{d.type === 'percent' ? `${d.value}%` : formatPrice(d.value)}</td>
                                <td className="p-4">{formatPrice(d.minOrder)}</td>
                                <td className="p-4 text-xs text-gray-400">{new Date(d.expiresAt).toLocaleDateString()}</td>
                                <td className="p-4"><button onClick={() => handleDelete(d._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><FiTrash2 size={14} /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6">
                        <div className="flex justify-between mb-4"><h2 className="font-bold text-lg">Add Discount Code</h2><button onClick={() => setShowModal(false)}><FiX size={20} /></button></div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" placeholder="Code (e.g. SAVE20)" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} className="input-field" required />
                            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="input-field">
                                <option value="percent">Percentage</option>
                                <option value="fixed">Fixed Amount (KES)</option>
                            </select>
                            <input type="number" placeholder="Value" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} className="input-field" required />
                            <input type="number" placeholder="Minimum order (KES)" value={form.minOrder} onChange={e => setForm(f => ({ ...f, minOrder: e.target.value }))} className="input-field" />
                            <input type="date" value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))} className="input-field" required />
                            <button type="submit" className="btn-primary w-full">Create Discount</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
