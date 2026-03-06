'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { FiPlus, FiTrash2, FiX, FiGrid } from 'react-icons/fi';

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', description: '', parent: '' });

    const loadCategories = () => api.getCategories().then(setCategories).catch(() => { });
    useEffect(() => { loadCategories(); }, []);

    const openModal = (cat = null) => {
        if (cat) {
            setEditing(cat);
            setForm({ name: cat.name, description: cat.description || '', parent: cat.parent?._id || '' });
        } else {
            setEditing(null);
            setForm({ name: '', description: '', parent: '' });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append('name', form.name);
        fd.append('description', form.description);
        fd.append('parent', form.parent);
        try {
            if (editing) await api.updateCategory(editing._id, fd);
            else await api.createCategory(fd);
            setShowModal(false);
            loadCategories();
        } catch (err) { alert(err.message); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this category?')) return;
        try { await api.deleteCategory(id); loadCategories(); } catch (err) { alert(err.message); }
    };

    return (
        <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Categories ({categories.length})</h1>
                <button onClick={() => openModal()} className="btn-primary text-sm flex items-center gap-2"><FiPlus size={16} /> Add Category</button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map(cat => (
                    <div key={cat._id} className="card p-5 group">
                        <div className="flex items-start justify-between">
                            <div className="min-w-0">
                                <h3 className="font-bold truncate">{cat.name}</h3>
                                {cat.parent && <p className="text-[10px] text-primary-600 font-bold uppercase mt-0.5">Under: {cat.parent.name}</p>}
                                <p className="text-xs text-gray-400 mt-2 line-clamp-2">{cat.description || 'No description'}</p>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openModal(cat)} className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><FiGrid size={13} /></button>
                                <button onClick={() => handleDelete(cat._id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><FiTrash2 size={13} /></button>
                            </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center">
                            <span className="text-[10px] font-mono text-gray-300">/{cat.slug}</span>
                        </div>
                    </div>
                ))}
            </div>
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
                        <div className="flex justify-between mb-4"><h2 className="font-bold text-lg">{editing ? 'Edit Category' : 'Add Category'}</h2><button onClick={() => setShowModal(false)}><FiX size={20} /></button></div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" placeholder="Category name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field shadow-sm" required />
                            <textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input-field shadow-sm" rows={3} />
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400">Parent Category (Optional)</label>
                                <select value={form.parent} onChange={e => setForm(f => ({ ...f, parent: e.target.value }))} className="input-field shadow-sm">
                                    <option value="">None (Main Category)</option>
                                    {categories.filter(c => c._id !== editing?._id).map(c => (
                                        <option key={c._id} value={c._id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="btn-primary w-full h-11 shadow-lg shadow-primary-500/20">{editing ? 'Update' : 'Create'} Category</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
