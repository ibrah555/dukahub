const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function apiFetch(endpoint, options = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('dukahub_token') : null;
    const headers = { ...options.headers };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    let data;
    try {
        data = await res.json();
    } catch {
        throw new Error(`Server error (${res.status})`);
    }
    if (!res.ok) throw new Error(data.message || 'Something went wrong');
    return data;
}


export const api = {
    // Auth
    login: (body) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    register: (body) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    getMe: () => apiFetch('/auth/me'),
    updateProfile: (body) => apiFetch('/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),
    toggleWishlist: (productId) => apiFetch('/auth/wishlist', { method: 'PUT', body: JSON.stringify({ productId }) }),

    // Products
    getProducts: (params = '') => apiFetch(`/products?${params}`),
    getProduct: (slug) => apiFetch(`/products/${slug}`),
    createProduct: (formData) => apiFetch('/products', { method: 'POST', body: formData }),
    updateProduct: (id, formData) => apiFetch(`/products/${id}`, { method: 'PUT', body: formData }),
    deleteProduct: (id) => apiFetch(`/products/${id}`, { method: 'DELETE' }),

    // Categories
    getCategories: () => apiFetch('/categories'),
    createCategory: (formData) => apiFetch('/categories', { method: 'POST', body: formData }),
    updateCategory: (id, formData) => apiFetch(`/categories/${id}`, { method: 'PUT', body: formData }),
    deleteCategory: (id) => apiFetch(`/categories/${id}`, { method: 'DELETE' }),

    // Orders
    createOrder: (body) => apiFetch('/orders', { method: 'POST', body: JSON.stringify(body) }),
    getMyOrders: () => apiFetch('/orders/my'),
    getOrders: (params = '') => apiFetch(`/orders?${params}`),
    getOrder: (id) => apiFetch(`/orders/${id}`),
    updateOrderStatus: (id, body) => apiFetch(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify(body) }),

    // Users (admin)
    getUsers: () => apiFetch('/users'),
    getUser: (id) => apiFetch(`/users/${id}`),

    // Reviews
    getReviews: (productId) => apiFetch(`/reviews/${productId}`),
    createReview: (body) => apiFetch('/reviews', { method: 'POST', body: JSON.stringify(body) }),

    // Payments
    mpesaStkPush: (body) => apiFetch('/payments/mpesa-stk-push', { method: 'POST', body: JSON.stringify(body) }),
    verifyPayment: (body) => apiFetch('/payments/verify', { method: 'POST', body: JSON.stringify(body) }),

    // Discounts
    getDiscounts: () => apiFetch('/discounts'),
    createDiscount: (body) => apiFetch('/discounts', { method: 'POST', body: JSON.stringify(body) }),
    deleteDiscount: (id) => apiFetch(`/discounts/${id}`, { method: 'DELETE' }),
    validateDiscount: (body) => apiFetch('/discounts/validate', { method: 'POST', body: JSON.stringify(body) }),

    // Analytics
    getDashboard: () => apiFetch('/analytics/dashboard'),
};

export const KENYAN_COUNTIES = [
    'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa', 'Homa Bay',
    'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii',
    'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera',
    'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi', 'Nakuru', 'Nandi',
    'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River',
    'Tharaka-Nithi', 'Trans-Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot',
];

export function formatPrice(amount) {
    return `KES ${Number(amount).toLocaleString()}`;
}
