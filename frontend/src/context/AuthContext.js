'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('dukahub_token');
        if (token) {
            api.getMe()
                .then(data => setUser(data))
                .catch(() => { localStorage.removeItem('dukahub_token'); })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const data = await api.login({ email, password });
        localStorage.setItem('dukahub_token', data.token);
        setUser(data);
        return data;
    };

    const register = async (userData) => {
        const data = await api.register(userData);
        localStorage.setItem('dukahub_token', data.token);
        setUser(data);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('dukahub_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
