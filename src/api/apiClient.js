// Centralized API client for Dream Bubbles
// In development: uses relative /api to route through Vite proxy
// In production (Cloudflare): calls live Render backend directly
const PROD_API = 'https://dream-bubbles-restaurant-b.onrender.com/api';
const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : PROD_API);

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const res = await fetch(url, { credentials: 'omit', ...options, headers });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `API request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'}] ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Outlets
  getOutlets: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/outlets${qs ? `?${qs}` : ''}`);
  },
  getNearbyOutlets: (lat, lng, maxDistance) => {
    const params = new URLSearchParams({ lat, lng });
    if (maxDistance) params.append('maxDistance', maxDistance);
    return request(`/outlets/nearby?${params.toString()}`);
  },
  getOutlet: (id) => request(`/outlets/${id}`),
  createOutlet: (data) => request('/outlets', { method: 'POST', body: JSON.stringify(data) }),
  updateOutlet: (id, data) => request(`/outlets/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteOutlet: (id) => request(`/outlets/${id}`, { method: 'DELETE' }),

  // Categories
  getCategories: () => request('/categories'),
  createCategory: (data) => request('/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id, data) => request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id) => request(`/categories/${id}`, { method: 'DELETE' }),

  // Products
  getProducts: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/products${qs ? `?${qs}` : ''}`);
  },
  getProduct: (id) => request(`/products/${id}`),
  createProduct: (data) => request('/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id, data) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),

  // Inventory
  getInventory: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/inventory${qs ? `?${qs}` : ''}`);
  },
  updateInventoryItem: (id, data) => request(`/inventory/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  batchUpdateInventory: (updates) => request('/inventory/batch-update', { method: 'POST', body: JSON.stringify({ updates }) }),
  syncInventory: () => request('/inventory/sync', { method: 'POST' }),

  // Orders
  getOrders: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/orders${qs ? `?${qs}` : ''}`);
  },
  getOrder: (id) => request(`/orders/${id}`),
  createOrder: (data) => request('/orders', { method: 'POST', body: JSON.stringify(data) }),
  updateOrderStatus: (id, status) => request(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  deleteOrder: (id) => request(`/orders/${id}`, { method: 'DELETE' }),

  // Analytics
  getDashboardStats: () => request('/analytics/dashboard'),
};

export default api;
