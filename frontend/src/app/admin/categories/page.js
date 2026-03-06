'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { FiPlus, FiTrash2, FiX } from 'react-icons/fi';

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name: '', description: '' });

    const loadCategories = () => api.getCategories().then(setCategories).catch(() => { });
    useEffect(() => { loadCategories(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append('name', form.name);
        fd.append('description', form.description);
        try { await api.createCategory(fd); setShowModal(false); setForm({ name: '', description: '' }); loadCategories(); } catch (err) { alert(err.message); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this category?')) return;
        try { await api.deleteCategory(id); loadCategories(); } catch (err) { alert(err.message); }
    };

    return (
        <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Categories ({categories.length})</h1>
                <button onClick={() => setShowModal(true)} className="btn-primary text-sm flex items-center gap-2"><FiPlus size={16} /> Add Category</button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map(cat => (
                    <div key={cat._id} className="card p-5 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold">{cat.name}</h3>
                            <p className="text-xs text-gray-400 mt-1">{cat.description || 'No description'}</p>
                            <p className="text-xs text-gray-300 mt-1">/{cat.slug}</p>
                        </div>
                        <button onClick={() => handleDelete(cat._id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><FiTrash2 size={14} /></button>
                    </div>
                ))}
            </div>
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6">
                        <div className="flex justify-between mb-4"><h2 className="font-bold text-lg">Add Category</h2><button onClick={() => setShowModal(false)}><FiX size={20} /></button></div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" placeholder="Category name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field" required />
                            <textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input-field" rows={3} />
                            <button type="submit" className="btn-primary w-full">Create Category</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
