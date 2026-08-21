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

  // Forgot password (email) — step 1: send code, step 2: verify code, step 3: reset.
  // The email flow has no resetToken; verify just confirms the OTP and reset uses
  // email + newPassword directly (backend PasswordResetController).
  sendForgotPasswordOtp: (email) =>
    request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),

  verifyForgotPasswordOtp: (email, otp) =>
    request('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ email, otp }) }),

  resetPassword: (email, newPassword) =>
    request('/auth/reset-password', { method: 'POST', body: JSON.stringify({ email, newPassword }) }),
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
// Admin job CRUD (ROLE_ADMIN; request() auto-attaches the Bearer token).
// JobDto: { id, title, department, location, type, salary, description,
//           requirements, benefits, createdAt } — field names are the API contract.
export const jobAPI = {
  getAll: () => request('/admin/jobs'),

  getById: (id) => request(`/admin/jobs/${id}`),

  create: (data) =>
    request('/admin/jobs', { method: 'POST', body: JSON.stringify(data) }),

  update: (id, data) =>
    request(`/admin/jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id) =>
    request(`/admin/jobs/${id}`, { method: 'DELETE' }),

  // Public application (permitAll). Resume is sent as base64 TEXT + filename +
  // content type (no multipart): { jobId, fullName, email, phone, linkedinUrl,
  //   coverLetter, resumeName, resumeData, resumeContentType }
  applyJob: (jobId, payload) =>
    request(`/public/jobs/${jobId}/apply`, { method: 'POST', body: JSON.stringify(payload) }),
}

// ===== TEAM MEMBERS =====
// Contract: ApiResponse { success, message, data }. MemberDto is one combined object:
// { id, memberCode, fullName, position, rank, department, category,
//   detail: { phoneNumber, email, address, dateOfBirth, gender,
//             emergencyContact, startDate, note } } — id is present on responses,
// absent when creating. Dates are ISO strings (yyyy-MM-dd).
export const memberAPI = {
  // Optional exact-match filters { department, category } are sent as query params.
  getAll: (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.department) params.set('department', filters.department)
    if (filters.category) params.set('category', filters.category)
    const qs = params.toString()
    return request(qs ? `/members?${qs}` : '/members')
  },

  getById: (id) => request(`/members/${id}`),

  create: (data) =>
    request('/members', { method: 'POST', body: JSON.stringify(data) }),

  update: (id, data) =>
    request(`/members/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id) =>
    request(`/members/${id}`, { method: 'DELETE' }),
}

// ===== PUBLIC (no auth) =====
// Public team directory for the "Meet Our Team" page — display-safe fields only.
export const publicAPI = {
  getMembers: () => request('/public/members'),

  // Public career listings (permitAll). Same JobDto shape as the admin list.
  getJobs: () => request('/public/jobs'),

  getJobById: (id) => request(`/public/jobs/${id}`),
}

// ===== APPLICATIONS =====
// Admin applications report (ROLE_ADMIN). Response item:
// { id, jobId, jobTitle, fullName, email, phone, linkedinUrl, coverLetter,
//   resumeName, resumeContentType, status, createdAt }
export const applicationAPI = {
  getAll: () => request('/admin/applications'),

  getById: (id) => request(`/admin/applications/${id}`),

  // Status workflow: NEW | REVIEWED | ACCEPTED | REJECTED.
  updateStatus: (id, status) =>
    request(`/admin/applications/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  delete: (id) =>
    request(`/admin/applications/${id}`, { method: 'DELETE' }),
}

// ===== USERS =====
// Admin management endpoints live under /api/admin/users (ROLE_ADMIN required).
// updateProfile is the signed-in user's own Account Details page (no admin role).
export const userAPI = {
  getAll: () => request('/admin/users'),

  getById: (id) => request(`/admin/users/${id}`),

  create: (data) =>
    request('/admin/users', { method: 'POST', body: JSON.stringify(data) }),

  update: (id, data) =>
    request(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id) =>
    request(`/admin/users/${id}`, { method: 'DELETE' }),

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
