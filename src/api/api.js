// ===== API CONFIG =====
// Backend runs on port 8081 (see B-backend/src/main/resources/application.yml).
// CORS is already open on the backend, so a full URL is fine.
const API_BASE = 'http://localhost:8081/api'

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
// Backend contract (B-backend AuthController): login by username / full name / email /
// telegram / facebook (identifier + password); OTP login and forgot-password are phone-based
// 3-step flows. Register requires phoneNumber (for contact) and username. All return
// ApiResponse { success, message, data }.
export const authAPI = {
  login: (identifier, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ identifier, password }) }),

  // Social login / signup. With a token (provider-issued credential: Google ID token,
  // FB access token, Telegram auth JSON) the backend verifies it and links the real
  // account; without one it falls back to the legacy one-click demo account.
  socialLogin: (provider, token) =>
    request('/auth/social', {
      method: 'POST',
      body: JSON.stringify(token ? { provider, token } : { provider }),
    }),

  register: (data) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  // Login with OTP — step 1: send code, step 2: verify code
  sendLoginOtp: (phoneNumber) =>
    request('/auth/login/otp/send', { method: 'POST', body: JSON.stringify({ phoneNumber }) }),

  verifyLoginOtp: (phoneNumber, otp) =>
    request('/auth/login/otp/verify', { method: 'POST', body: JSON.stringify({ phoneNumber, otp }) }),

  // Forgot password — step 1: send code, step 2: verify code -> resetToken, step 3: reset
  sendForgotPasswordOtp: (phoneNumber) =>
    request('/auth/forgot-password/send-otp', { method: 'POST', body: JSON.stringify({ phoneNumber }) }),

  verifyForgotPasswordOtp: (phoneNumber, otp) =>
    request('/auth/forgot-password/verify-otp', { method: 'POST', body: JSON.stringify({ phoneNumber, otp }) }),

  resetPassword: (resetToken, newPassword, confirmPassword) =>
    request('/auth/forgot-password/reset', {
      method: 'POST',
      body: JSON.stringify({ resetToken, newPassword, confirmPassword }),
    }),
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

  // Update the signed-in user's own profile (Account Details page). Returns
  // AuthResponse { token, tokenType, user } — token re-issued in case the phone changed.
  updateProfile: (data) =>
    request('/users/me', { method: 'PUT', body: JSON.stringify(data) }),
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
