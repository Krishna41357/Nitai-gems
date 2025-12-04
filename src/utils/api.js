// api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_ADMIN || 'http://localhost:8787';

// Get token from localStorage
const getAuthToken = () => localStorage.getItem('adminToken');

// Handle response
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  return response.json();
}

// Auth fetch for admin only
async function authFetch(url, options = {}) {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No authentication token found. Please login.');
  }

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    'Authorization': `Bearer ${token}`,
  };

  const response = await fetch(url, { ...options, headers });
  return handleResponse(response);
}

// Public fetch (no token)
async function publicFetch(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  return handleResponse(response);
}

// ---------------------------
// Helper to wrap API call safely
// ---------------------------
function safeAdminCall(fn) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (err) {
      console.error('Admin API error:', err.message);
      throw err;
    }
  };
}

export const api = {
  admin: {
    categories: {
      getAll: safeAdminCall(() => authFetch(`${API_BASE_URL}/admin/categories`)),
      getById: safeAdminCall((id) => authFetch(`${API_BASE_URL}/admin/category/${id}`)),
      create: safeAdminCall((data) => authFetch(`${API_BASE_URL}/admin/category`, { method: 'POST', body: JSON.stringify(data) })),
      update: safeAdminCall((id, data) => authFetch(`${API_BASE_URL}/admin/category/${id}`, { method: 'PUT', body: JSON.stringify(data) })),
      delete: safeAdminCall((id) => authFetch(`${API_BASE_URL}/admin/category/${id}`, { method: 'DELETE' })),
    },
    subcategories: {
      getAll: safeAdminCall(() => authFetch(`${API_BASE_URL}/admin/subcategories`)),
      getById: safeAdminCall((id) => authFetch(`${API_BASE_URL}/admin/subcategory/${id}`)),
      create: safeAdminCall((data) => authFetch(`${API_BASE_URL}/admin/subcategory`, { method: 'POST', body: JSON.stringify(data) })),
      update: safeAdminCall((id, data) => authFetch(`${API_BASE_URL}/admin/subcategory/${id}`, { method: 'PUT', body: JSON.stringify(data) })),
      delete: safeAdminCall((id) => authFetch(`${API_BASE_URL}/admin/subcategory/${id}`, { method: 'DELETE' })),
    },
    products: {
      getAll: safeAdminCall(() => authFetch(`${API_BASE_URL}/admin/products`)),
      getById: safeAdminCall((id) => authFetch(`${API_BASE_URL}/admin/products/${id}`)),
      create: safeAdminCall((data) => authFetch(`${API_BASE_URL}/admin/products`, { method: 'POST', body: JSON.stringify(data) })),
      update: safeAdminCall((id, data) => authFetch(`${API_BASE_URL}/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(data) })),
      delete: safeAdminCall((id) => authFetch(`${API_BASE_URL}/admin/products/${id}`, { method: 'DELETE' })),
    },
  },
  public: {
    products: {
      getAll: () => publicFetch(`${API_BASE_URL}/products`),
      getById: (id) => publicFetch(`${API_BASE_URL}/products/${id}`),
    },
    categories: {
      getAll: () => publicFetch(`${API_BASE_URL}/categories`),
    },
  },
};

export default api;
