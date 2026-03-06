'use client';
import { useState, useEffect } from 'react';
import { api, formatPrice } from '@/lib/api';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX } from 'react-icons/fi';

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', description: '', price: '', comparePrice: '', category: '', stock: '', brand: '', featured: 'false' });
    const [files, setFiles] = useState(null);
    const [search, setSearch] = useState('');

    const loadProducts = () => {
        setLoading(true);
        const q = search ? `q=${search}&limit=50` : 'limit=50';
        api.getProducts(q).then(d => setProducts(d.products || [])).catch(() => { }).finally(() => setLoading(false));
    };

    useEffect(() => { loadProducts(); api.getCategories().then(setCategories).catch(() => { }); }, []);

    const openModal = (product = null) => {
        if (product) {
            setEditing(product);
            setForm({ name: product.name, description: product.description, price: product.price, comparePrice: product.comparePrice || '', category: product.category?._id || '', stock: product.stock, brand: product.brand || '', featured: product.featured ? 'true' : 'false' });
        } else {
            setEditing(null);
            setForm({ name: '', description: '', price: '', comparePrice: '', category: categories[0]?._id || '', stock: '', brand: '', featured: 'false' });
        }
        setFiles(null);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        Object.keys(form).forEach(k => fd.append(k, form[k]));
        if (files) Array.from(files).forEach(f => fd.append('images', f));
        try {
            if (editing) await api.updateProduct(editing._id, fd);
            else await api.createProduct(fd);
            setShowModal(false);
            loadProducts();
        } catch (err) { alert(err.message); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this product?')) return;
        try { await api.deleteProduct(id); loadProducts(); } catch (err) { alert(err.message); }
    };

    return (
        <div className="animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Products ({products.length})</h1>
                <div className="flex gap-3">
                    <div className="relative">
                        <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && loadProducts()}
                            className="input-field !py-2 !pl-9 text-sm w-48" />
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    </div>
                    <button onClick={() => openModal()} className="btn-primary text-sm flex items-center gap-2"><FiPlus size={16} /> Add Product</button>
                </div>
            </div>

            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead><tr className="text-left text-gray-400 bg-gray-50 border-b border-gray-100">
                            <th className="p-4 font-medium">Product</th><th className="p-4 font-medium">Category</th>
                            <th className="p-4 font-medium">Price</th><th className="p-4 font-medium">Stock</th>
                            <th className="p-4 font-medium">Featured</th><th className="p-4 font-medium">Actions</th>
                        </tr></thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                    <td className="p-4"><div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                            {p.images?.[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" /> : <span className="flex items-center justify-center h-full text-lg">📦</span>}
                                        </div>
                                        <span className="font-medium truncate max-w-[200px]">{p.name}</span>
                                    </div></td>
                                    <td className="p-4 text-gray-500">{p.category?.name || '-'}</td>
                                    <td className="p-4 font-semibold">{formatPrice(p.price)}</td>
                                    <td className="p-4"><span className={`font-medium ${p.stock < 5 ? 'text-red-500' : 'text-green-600'}`}>{p.stock}</span></td>
                                    <td className="p-4">{p.featured ? <span className="bg-accent-100 text-accent-700 px-2 py-0.5 rounded text-xs font-semibold">Yes</span> : '-'}</td>
                                    <td className="p-4"><div className="flex gap-1">
                                        <button onClick={() => openModal(p)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><FiEdit2 size={14} /></button>
                                        <button onClick={() => handleDelete(p._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><FiTrash2 size={14} /></button>
                                    </div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold">{editing ? 'Edit Product' : 'Add Product'}</h2>
                            <button onClick={() => setShowModal(false)}><FiX size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" placeholder="Product name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field" required />
                            <textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input-field" rows={3} required />
                            <div className="grid grid-cols-2 gap-3">
                                <input type="number" placeholder="Price (KES)" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="input-field" required />
                                <input type="number" placeholder="Compare Price" value={form.comparePrice} onChange={e => setForm(f => ({ ...f, comparePrice: e.target.value }))} className="input-field" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input-field" required>
                                    <option value="">Select category</option>
                                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                                <input type="number" placeholder="Stock" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} className="input-field" required />
                            </div>
                            <input type="text" placeholder="Brand" value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} className="input-field" />
                            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured === 'true'} onChange={e => setForm(f => ({ ...f, featured: e.target.checked ? 'true' : 'false' }))} className="accent-primary-600" /> Featured product</label>
                            <input type="file" multiple accept="image/*" onChange={e => setFiles(e.target.files)} className="input-field !p-2 text-sm" />
                            <button type="submit" className="btn-primary w-full">{editing ? 'Update' : 'Create'} Product</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
