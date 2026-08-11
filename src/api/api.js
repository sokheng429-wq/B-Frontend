// ===== API CONFIG =====
// Change this to your Spring Boot backend URL
const API_BASE = 'http://localhost:8080/api'

async function request(path, options = {}) {
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  // Don't set Content-Type for FormData (file uploads)
  if (options.body instanceof FormData) {
    delete headers['Content-Type']
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err.message || `Request failed with status ${res.status}`)
  }
  return res.json()
}

// ===== AUTH =====
export const authAPI = {
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  register: (data) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  forgotPassword: (email) =>
    request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
}

// ===== PRODUCTS =====
export const productAPI = {
  getAll: () => request('/products'),

  getById: (id) => request(`/products/${id}`),

  create: (formData) =>
    request('/products', { method: 'POST', body: formData }),

  update: (id, formData) =>
    request(`/products/${id}`, { method: 'PUT', body: formData }),

  delete: (id) =>
    request(`/products/${id}`, { method: 'DELETE' }),
}

// ===== JOBS =====
export const jobAPI = {
  getAll: () => request('/jobs'),

  getById: (id) => request(`/jobs/${id}`),

  create: (data) =>
    request('/jobs', { method: 'POST', body: JSON.stringify(data) }),

  update: (id, data) =>
    request(`/jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id) =>
    request(`/jobs/${id}`, { method: 'DELETE' }),
}

// ===== TEAM MEMBERS =====
export const memberAPI = {
  getAll: () => request('/members'),

  getById: (id) => request(`/members/${id}`),

  create: (formData) =>
    request('/members', { method: 'POST', body: formData }),

  update: (id, formData) =>
    request(`/members/${id}`, { method: 'PUT', body: formData }),

  delete: (id) =>
    request(`/members/${id}`, { method: 'DELETE' }),
}

// ===== APPLICATIONS =====
export const applicationAPI = {
  getAll: () => request('/applications'),

  getById: (id) => request(`/applications/${id}`),

  create: (formData) =>
    request('/applications', { method: 'POST', body: formData }),

  updateStatus: (id, status) =>
    request(`/applications/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  delete: (id) =>
    request(`/applications/${id}`, { method: 'DELETE' }),
}

// ===== USERS (System Users) =====
export const userAPI = {
  getAll: () => request('/users'),

  getById: (id) => request(`/users/${id}`),

  create: (data) =>
    request('/users', { method: 'POST', body: JSON.stringify(data) }),

  update: (id, data) =>
    request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id) =>
    request(`/users/${id}`, { method: 'DELETE' }),
}

// ===== ORDERS =====
export const orderAPI = {
  getAll: () => request('/orders'),

  getById: (id) => request(`/orders/${id}`),

  create: (data) =>
    request('/orders', { method: 'POST', body: JSON.stringify(data) }),

  updateStatus: (id, status) =>
    request(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
}

// ===== DASHBOARD STATS =====
export const dashboardAPI = {
  getStats: () => request('/dashboard/stats'),
}
