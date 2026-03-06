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
    const [form, setForm] = useState({ name: '', description: '', price: '', comparePrice: '', category: '', stock: '', brand: '', featured: 'false', sizes: '', colors: '' });
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
            setForm({
                name: product.name,
                description: product.description,
                price: product.price,
                comparePrice: product.comparePrice || '',
                category: product.category?._id || '',
                stock: product.stock,
                brand: product.brand || '',
                featured: product.featured ? 'true' : 'false',
                sizes: product.sizes?.join(', ') || '',
                colors: product.colors?.join(', ') || ''
            });
        } else {
            setEditing(null);
            setForm({ name: '', description: '', price: '', comparePrice: '', category: categories[0]?._id || '', stock: '', brand: '', featured: 'false', sizes: '', colors: '' });
        }
        setFiles(null);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        Object.keys(form).forEach(k => {
            if (k === 'sizes' || k === 'colors') {
                const arr = form[k].split(',').map(s => s.trim()).filter(s => s !== '');
                arr.forEach(val => fd.append(k, val));
            } else {
                fd.append(k, form[k]);
            }
        });
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
                                        <div>
                                            <p className="font-medium truncate max-w-[200px]">{p.name}</p>
                                            <div className="flex gap-1 mt-0.5">
                                                {p.colors?.length > 0 && <span className="text-[9px] bg-gray-100 text-gray-500 px-1 rounded">Colors: {p.colors.length}</span>}
                                                {p.sizes?.length > 0 && <span className="text-[9px] bg-gray-100 text-gray-500 px-1 rounded">Sizes: {p.sizes.length}</span>}
                                            </div>
                                        </div>
                                    </div></td>
                                    <td className="p-4 text-gray-500">{p.category?.name || '-'}</td>
                                    <td className="p-4 font-semibold">{formatPrice(p.price)}</td>
                                    <td className="p-4"><span className={`font-medium ${p.stock < 5 ? 'text-red-500' : 'text-green-600'}`}>{p.stock}</span></td>
                                    <td className="p-4">{p.featured ? <span className="bg-accent-100 text-accent-700 px-2 py-0.5 rounded text-xs font-semibold">Yes</span> : '-'}</td>
                                    <td className="p-4"><div className="flex gap-1">
                                        <button onClick={() => openModal(p)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg" title="Edit"><FiEdit2 size={14} /></button>
                                        <button onClick={() => handleDelete(p._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="Delete"><FiTrash2 size={14} /></button>
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
                    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 scrollbar-hide">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold">{editing ? 'Edit Product' : 'Add Product'}</h2>
                            <button onClick={() => setShowModal(false)}><FiX size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" placeholder="Product name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field shadow-sm" required />
                            <textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input-field shadow-sm" rows={3} required />
                            <div className="grid grid-cols-2 gap-3">
                                <input type="number" placeholder="Price (KES)" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="input-field shadow-sm" required />
                                <input type="number" placeholder="Compare Price" value={form.comparePrice} onChange={e => setForm(f => ({ ...f, comparePrice: e.target.value }))} className="input-field shadow-sm" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input-field shadow-sm" required>
                                    <option value="">Select category</option>
                                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                                <input type="number" placeholder="Stock" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} className="input-field shadow-sm" required />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <input type="text" placeholder="Colors (comma separated)" value={form.colors} onChange={e => setForm(f => ({ ...f, colors: e.target.value }))} className="input-field shadow-sm" />
                                <input type="text" placeholder="Sizes (comma separated)" value={form.sizes} onChange={e => setForm(f => ({ ...f, sizes: e.target.value }))} className="input-field shadow-sm" />
                            </div>
                            <input type="text" placeholder="Brand" value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} className="input-field shadow-sm" />
                            <label className="flex items-center gap-2 text-sm select-none"><input type="checkbox" checked={form.featured === 'true'} onChange={e => setForm(f => ({ ...f, featured: e.target.checked ? 'true' : 'false' }))} className="w-4 h-4 rounded accent-primary-600" /> Featured product</label>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400">Product Images</label>
                                <input type="file" multiple accept="image/*" onChange={e => setFiles(e.target.files)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 transition-all border border-gray-100 p-2 rounded-xl" />
                            </div>
                            <button type="submit" className="btn-primary w-full h-12 shadow-lg shadow-primary-500/20">{editing ? 'Update' : 'Create'} Product</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
