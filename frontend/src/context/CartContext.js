'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [items, setItems] = useState([]);
    const [discount, setDiscount] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('dukahub_cart');
        if (saved) setItems(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem('dukahub_cart', JSON.stringify(items));
    }, [items]);

    const addItem = (product, qty = 1, size = '', color = '') => {
        setItems(prev => {
            const existing = prev.find(i => i._id === product._id && i.size === size && i.color === color);
            if (existing) {
                return prev.map(i => (i._id === product._id && i.size === size && i.color === color) ? { ...i, qty: i.qty + qty } : i);
            }
            return [...prev, {
                _id: product._id,
                name: product.name,
                price: product.price,
                image: product.images?.[0] || '',
                slug: product.slug,
                qty,
                size,
                color
            }];
        });
    };

    const removeItem = (id, size = '', color = '') => {
        setItems(prev => prev.filter(i => !(i._id === id && i.size === size && i.color === color)));
    };

    const updateQty = (id, qty, size = '', color = '') => {
        if (qty < 1) return removeItem(id, size, color);
        setItems(prev => prev.map(i => (i._id === id && i.size === size && i.color === color) ? { ...i, qty } : i));
    };

    const clearCart = () => { setItems([]); setDiscount(null); };

    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const discountAmount = discount ? (discount.type === 'percent' ? Math.round(subtotal * discount.value / 100) : discount.value) : 0;
    const total = Math.max(0, subtotal - discountAmount);
    const itemCount = items.reduce((sum, i) => sum + i.qty, 0);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, subtotal, discountAmount, total, itemCount, discount, setDiscount }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
