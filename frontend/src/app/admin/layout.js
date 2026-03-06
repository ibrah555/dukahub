'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiTag, FiPercent, FiLogOut, FiArrowLeft } from 'react-icons/fi';

export default function AdminLayout({ children }) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) router.push('/login');
    }, [user, loading]);

    if (loading || !user || user.role !== 'admin') {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="skeleton w-16 h-16 rounded-full" /></div>;
    }

    const links = [
        { href: '/admin', icon: <FiGrid />, label: 'Dashboard' },
        { href: '/admin/products', icon: <FiShoppingBag />, label: 'Products' },
        { href: '/admin/orders', icon: <FiPackage />, label: 'Orders' },
        { href: '/admin/customers', icon: <FiUsers />, label: 'Customers' },
        { href: '/admin/categories', icon: <FiTag />, label: 'Categories' },
        { href: '/admin/discounts', icon: <FiPercent />, label: 'Discounts' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 bg-kenyan-black text-white shrink-0">
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold">D</span>
                        </div>
                        <div>
                            <span className="font-bold">DukaHub</span>
                            <span className="block text-[10px] text-gray-400 uppercase tracking-widest">Admin Panel</span>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {links.map(link => (
                        <Link key={link.href} href={link.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${pathname === link.href ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                            {link.icon} {link.label}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-white/10">
                    <Link href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                        <FiArrowLeft /> Back to Store
                    </Link>
                    <button onClick={logout} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-white/5 transition-all w-full">
                        <FiLogOut /> Logout
                    </button>
                </div>
            </aside>

            {/* Mobile header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 bg-kenyan-black text-white z-50 px-4 py-3 flex items-center justify-between">
                <span className="font-bold">DukaHub Admin</span>
                <div className="flex gap-1 overflow-x-auto">
                    {links.map(link => (
                        <Link key={link.href} href={link.href}
                            className={`p-2 rounded-lg text-xs ${pathname === link.href ? 'bg-primary-600 text-white' : 'text-gray-400'}`} title={link.label}>
                            {link.icon}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Content */}
            <main className="flex-1 lg:p-8 p-4 pt-16 lg:pt-8 overflow-auto">
                {children}
            </main>
        </div>
    );
}
