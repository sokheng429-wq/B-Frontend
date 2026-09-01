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

    // Handle inactivity session timeout from the backend
    if (res.status === 401 && err.error === 'SESSION_TIMEOUT') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.setItem('isLoggedIn', 'false')
      localStorage.setItem('sessionExpired', 'true')
      window.location.href = '/login'
      throw new Error('Your session expired due to inactivity. Please log in again.')
    }

    const error = new Error(err.message || `Request failed with status ${res.status}`)
    // Backend errors put the payload in `data` (e.g. validation failures carry
    // { fieldName: message }) — attach it so forms can show exact reasons.
    error.data = err.data ?? null
    if (err.data && typeof err.data === 'object' && !Array.isArray(err.data)) {
      error.fields = err.data
    }
    // Validation failures carry { fieldName: message } details in `data` —
    // attach them so forms can highlight exactly which inputs are wrong.
    if (err.data && typeof err.data === 'object' && !Array.isArray(err.data)) {
      error.fields = err.data
    }
    throw error
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

  // Logout: evict the token from the backend activity store
  logout: (token) =>
    fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {}),
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

// ===== ADMIN PRODUCTS (Stocks → Products) =====
// Full product CRUD against /api/admin/products (ROLE_ADMIN). ProductDto is the
// API contract: { id, code, barCode, name, nameKh, description, productGroup,
//   category, onHand, uom, basePrice, averageCost, standardCost, createDate,
//   country, supplier, partNumber, brand, onPo, onSo, availableStock, active,
//   serial, expiryDate, allowDiscount, tax, outOfStock, favorite, imageUrl,
//   createdAt, updatedAt }. Dates are ISO strings (yyyy-MM-dd), numbers may be
// null. Do not rename fields — the admin Add/Edit Products page depends on them.
export const adminProductAPI = {
  getAll: () => request('/admin/products'),

  getById: (id) => request(`/admin/products/${id}`),

  create: (data) =>
    request('/admin/products', { method: 'POST', body: JSON.stringify(data) }),

  update: (id, data) =>
    request(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id) =>
    request(`/admin/products/${id}`, { method: 'DELETE' }),
}

// ===== ADMIN PRODUCT GROUPS (Stocks → Groups) =====
// Full product-group CRUD against /api/admin/product-groups (ROLE_ADMIN).
// ProductGroupDto is the API contract: { id, code, name, nameKh, active,
//   favorite, createdAt, updatedAt }. `code` may be sent blank/undefined on
// create — the backend auto-generates PG-0001, PG-0002… Do not rename fields.
export const adminProductGroupAPI = {
  getAll: () => request('/admin/product-groups'),

  getById: (id) => request(`/admin/product-groups/${id}`),

  create: (data) =>
    request('/admin/product-groups', { method: 'POST', body: JSON.stringify(data) }),

  update: (id, data) =>
    request(`/admin/product-groups/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id) =>
    request(`/admin/product-groups/${id}`, { method: 'DELETE' }),
}

// ===== ADMIN CATEGORIES (Stocks → Categories) =====
// Full category CRUD against /api/admin/categories (ROLE_ADMIN).
// CategoryDto is the API contract: { id, code, description, nameKh, active,
//   createdAt, updatedAt }. `code` may be sent blank/undefined on create —
// the backend auto-generates CT-0001, CT-0002… Do not rename fields.
export const adminCategoryAPI = {
  getAll: () => request('/admin/categories'),

  getById: (id) => request(`/admin/categories/${id}`),

  create: (data) =>
    request('/admin/categories', { method: 'POST', body: JSON.stringify(data) }),

  update: (id, data) =>
    request(`/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id) =>
    request(`/admin/categories/${id}`, { method: 'DELETE' }),
}

// ===== ADMIN BRANDS (Stocks → Brands) =====
// Full brand CRUD against /api/admin/brands (ROLE_ADMIN).
// BrandDto is the API contract: { id, code, description, nameKh, active,
//   createdAt, updatedAt }. `code` may be sent blank/undefined on create —
// the backend auto-generates BR-0001, BR-0002… Do not rename fields.
export const adminBrandAPI = {
  getAll: () => request('/admin/brands'),

  getById: (id) => request(`/admin/brands/${id}`),

  create: (data) =>
    request('/admin/brands', { method: 'POST', body: JSON.stringify(data) }),

  update: (id, data) =>
    request(`/admin/brands/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id) =>
    request(`/admin/brands/${id}`, { method: 'DELETE' }),
}

// ===== ADMIN UNITS OF MEASURE (Stocks → Unit of Measure) =====
// Full unit CRUD against /api/admin/unit-of-measures (ROLE_ADMIN).
// UnitOfMeasureDto is the API contract: { id, code, description, nameKh,
//   factor, active, createdAt, updatedAt }. `code` may be sent
// blank/undefined on create — the backend auto-generates UN-0001, UN-0002…
// `factor` is the optional conversion factor relative to the base unit
// (e.g. kg = 1000). Do not rename fields.
export const adminUnitAPI = {
  getAll: () => request('/admin/unit-of-measures'),

  getById: (id) => request(`/admin/unit-of-measures/${id}`),

  create: (data) =>
    request('/admin/unit-of-measures', { method: 'POST', body: JSON.stringify(data) }),

  update: (id, data) =>
    request(`/admin/unit-of-measures/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id) =>
    request(`/admin/unit-of-measures/${id}`, { method: 'DELETE' }),
}

// ===== ADMIN ATTRIBUTES (Stocks → Attribute) =====
// Full attribute CRUD against /api/admin/attributes (ROLE_ADMIN).
// AttributeDto is the API contract: { id, code, description, nameKh, type,
//   values, active, createdAt, updatedAt }. `code` may be sent
// blank/undefined on create — the backend auto-generates AT-0001, AT-0002…
// `description` is the required attribute name (e.g. "Color"); `values`
// holds the comma-separated allowed values ("Small, Medium, Large").
// Do not rename fields.
export const adminAttributeAPI = {
  getAll: () => request('/admin/attributes'),

  getById: (id) => request(`/admin/attributes/${id}`),

  create: (data) =>
    request('/admin/attributes', { method: 'POST', body: JSON.stringify(data) }),

  update: (id, data) =>
    request(`/admin/attributes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id) =>
    request(`/admin/attributes/${id}`, { method: 'DELETE' }),
}

// ===== ADMIN SUPPLIER GROUPS (Stocks → Suppliers Group) =====
// Full supplier-group CRUD against /api/admin/supplier-groups (ROLE_ADMIN).
// SupplierGroupDto is the API contract: { id, code, description, nameKh,
//   active, createdAt, updatedAt }. `code` may be sent blank/undefined on
// create — the backend auto-generates SG-0001, SG-0002… Do not rename fields.
export const adminSupplierGroupAPI = {
  getAll: () => request('/admin/supplier-groups'),

  getById: (id) => request(`/admin/supplier-groups/${id}`),

  create: (data) =>
    request('/admin/supplier-groups', { method: 'POST', body: JSON.stringify(data) }),

  update: (id, data) =>
    request(`/admin/supplier-groups/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id) =>
    request(`/admin/supplier-groups/${id}`, { method: 'DELETE' }),
}

// ===== ADMIN SUPPLIERS (Stocks → Suppliers) =====
// Full supplier CRUD against /api/admin/suppliers (ROLE_ADMIN).
// SupplierDto is the API contract: { id, code, name, nameKh, supplierGroup,
//   taxNumber, paymentTerm, poTemplateName, shipmentMethod, purchasePerson,
//   termCondition, billTemplateName, currentBalance, debitDepositPaymentTerm,
//   contactFirstName, contactLastName, contactGender, contactDob,
//   contactPhone, contactMobile, contactEmail, contactWebsite,
//   addressDescription, addressNameKh, addressLine1, addressLine2,
//   addressCity, addressState, addressCountry, addressPhone,
//   addressPhoneExt, addressFax, addressFaxExt, addressEmail, addressWebsite,
//   active, createdAt, updatedAt }.
// `code` may be sent blank/undefined on create — the backend auto-generates
// SP-0001, SP-0002… `name` is the required field (not description). The
// dropdown-backed fields are free-text until dedicated tables exist; the
// contact*/address* columns hold the default Contact/Location row of the
// create form. Do not rename fields.
export const adminSupplierAPI = {
  getAll: () => request('/admin/suppliers'),

  getById: (id) => request(`/admin/suppliers/${id}`),

  create: (data) =>
    request('/admin/suppliers', { method: 'POST', body: JSON.stringify(data) }),

  update: (id, data) =>
    request(`/admin/suppliers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id) =>
    request(`/admin/suppliers/${id}`, { method: 'DELETE' }),
}

// ===== ADMIN CUSTOMERS (Sale Dashboard → Customers) =====
// Full customer CRUD against /api/admin/customers (ROLE_ADMIN).
// CustomerDto is the API contract: { id, code, customerName, secondLanguage,
//   customerGroup, saleEmployee, taxNo, paymentTerm, termsAndCondition,
//   priceBook, quoteTemplate, soTemplate, invoiceTemplate, doTemplate,
//   allowCredit, creditLimit, currentBalance, creditDeposit, balance,
//   contactFirstName, contactLastName, contactGender, contactDob,
//   contactPhone, contactMobile, contactEmail, contactWebsite,
//   addressDescription, addressSecondLanguage, addressLine1, addressLine2,
//   addressCity, addressState, addressCountry, addressPhone, addressPhoneExt,
//   addressFax, addressFaxExt, addressEmail, addressWebsite,
//   active, createdAt, updatedAt }.
// `code` may be sent blank/undefined on create — the backend auto-generates
// CU-0001, CU-0002… Do not rename fields.
export const adminCustomerAPI = {
  getAll: () => request('/admin/customers'),

  getById: (id) => request(`/admin/customers/${id}`),

  create: (data) =>
    request('/admin/customers', { method: 'POST', body: JSON.stringify(data) }),

  update: (id, data) =>
    request(`/admin/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id) =>
    request(`/admin/customers/${id}`, { method: 'DELETE' }),
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
  applyJob: (data) =>
    request(`/public/jobs/${data.jobId}/apply`, { method: 'POST', body: JSON.stringify(data) }),
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

// ===== ADMIN RECEIVE DOCUMENTS (Stocks → Receive Products) =====
export const adminReceiveDocAPI = {
  getAll: () => request('/admin/receive-documents'),
  getById: (id) => request(`/admin/receive-documents/${id}`),
  create: (data) => request('/admin/receive-documents', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id) => request(`/admin/receive-documents/${id}`, { method: 'DELETE' }),
}

// ===== ADMIN ISSUE DOCUMENTS (Stocks → Issue Products) =====
export const adminIssueDocAPI = {
  getAll: () => request('/admin/issue-documents'),
  getById: (id) => request(`/admin/issue-documents/${id}`),
  create: (data) => request('/admin/issue-documents', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id) => request(`/admin/issue-documents/${id}`, { method: 'DELETE' }),
}

// ===== ADMIN ADJUSTMENT DOCUMENTS (Stocks → Adjustment Products) =====
export const adminAdjustmentDocAPI = {
  getAll: () => request('/admin/adjustment-documents'),
  getById: (id) => request(`/admin/adjustment-documents/${id}`),
  create: (data) => request('/admin/adjustment-documents', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id) => request(`/admin/adjustment-documents/${id}`, { method: 'DELETE' }),
}

// ===== ADMIN STOCK DOCUMENTS (Unified / Fallback) =====
export const adminStockDocAPI = {
  getAll: (docType) => {
    if (docType === 'RECEIVE') return adminReceiveDocAPI.getAll()
    if (docType === 'ISSUE') return adminIssueDocAPI.getAll()
    if (docType === 'ADJUST') return adminAdjustmentDocAPI.getAll()
    const qs = docType ? `?docType=${encodeURIComponent(docType)}` : ''
    return request(`/admin/stock-documents${qs}`)
  },
  getByProduct: (productId) => request(`/admin/stock-documents/by-product/${productId}`),
  create: (data) => {
    if (data.docType === 'RECEIVE') return adminReceiveDocAPI.create(data)
    if (data.docType === 'ISSUE') return adminIssueDocAPI.create(data)
    if (data.docType === 'ADJUST') return adminAdjustmentDocAPI.create(data)
    return request('/admin/stock-documents', { method: 'POST', body: JSON.stringify(data) })
  },
  delete: (id) => request(`/admin/stock-documents/${id}`, { method: 'DELETE' }),
}

// ===== ADMIN TRANSFERS (Stocks → Request Transfer / Ship / Transfer Products) =====
export const adminTransferAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.docType) params.set('docType', filters.docType)
    if (filters.status) params.set('status', filters.status)
    const qs = params.toString()
    return request(qs ? `/admin/transfers?${qs}` : '/admin/transfers')
  },
  getById: (id) => request(`/admin/transfers/${id}`),
  create: (data) => request('/admin/transfers', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id, data) => request(`/admin/transfers/${id}/status`, { method: 'PUT', body: JSON.stringify(data) }),
  shipBulk: (data = {}) => request('/admin/transfers/ship-bulk', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id) => request(`/admin/transfers/${id}`, { method: 'DELETE' }),
}

// ===== ACTIVITY & NOTIFICATION AUDIT LOGS =====
export const activityLogAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.keyword) params.set('keyword', filters.keyword)
    if (filters.entityType) params.set('entityType', filters.entityType)
    if (filters.actionType) params.set('actionType', filters.actionType)
    if (filters.userRole) params.set('userRole', filters.userRole)
    const qs = params.toString()
    return request(qs ? `/activity-logs?${qs}` : '/activity-logs')
  },
  getRecent: (limit = 20) => request(`/activity-logs/recent?limit=${limit}`),
  create: (data) => request('/activity-logs', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id) => request(`/activity-logs/${id}`, { method: 'DELETE' }),
  clearAll: () => request('/activity-logs/clear', { method: 'DELETE' }),
}

// ===== STOCKS TOOLS: PRODUCT SCALE / PLU (Stocks → Product Scale) =====
export const adminProductScaleAPI = {
  getAll: (productId) => {
    const qs = productId ? `?productId=${encodeURIComponent(productId)}` : ''
    return request(`/admin/stocks/scales${qs}`)
  },
  create: (data) => request('/admin/stocks/scales', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/admin/stocks/scales/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/admin/stocks/scales/${id}`, { method: 'DELETE' }),
}

// ===== STOCKS TOOLS: PRICE HISTORY (Stocks → Products Prices) =====
export const adminPriceHistoryAPI = {
  getAll: (productId) => {
    const qs = productId ? `?productId=${encodeURIComponent(productId)}` : ''
    return request(`/admin/stocks/price-history${qs}`)
  },
  create: (data) => request('/admin/stocks/price-history', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/admin/stocks/price-history/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/admin/stocks/price-history/${id}`, { method: 'DELETE' }),
}

// ===== STOCKS TOOLS: COST CHANGE LOGS (Stocks → Cost Change) =====
export const adminCostChangeLogAPI = {
  getAll: (productId) => {
    const qs = productId ? `?productId=${encodeURIComponent(productId)}` : ''
    return request(`/admin/stocks/cost-change-logs${qs}`)
  },
  create: (data) => request('/admin/stocks/cost-change-logs', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/admin/stocks/cost-change-logs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/admin/stocks/cost-change-logs/${id}`, { method: 'DELETE' }),
}

// ===== STOCKS TOOLS: ATTRIBUTE CHANGE LOGS (Stocks → Change Attribute) =====
export const adminAttributeChangeLogAPI = {
  getAll: (productId) => {
    const qs = productId ? `?productId=${encodeURIComponent(productId)}` : ''
    return request(`/admin/stocks/attribute-change-logs${qs}`)
  },
  create: (data) => request('/admin/stocks/attribute-change-logs', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/admin/stocks/attribute-change-logs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/admin/stocks/attribute-change-logs/${id}`, { method: 'DELETE' }),
}

// ===== STOCKS TOOLS: PRODUCT SUPPLIER LINKS (Stocks → Products Supplier) =====
export const adminProductSupplierLinkAPI = {
  getAll: (productId) => {
    const qs = productId ? `?productId=${encodeURIComponent(productId)}` : ''
    return request(`/admin/stocks/supplier-links${qs}`)
  },
  create: (data) => request('/admin/stocks/supplier-links', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/admin/stocks/supplier-links/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/admin/stocks/supplier-links/${id}`, { method: 'DELETE' }),
}

// ===== STOCKS TOOLS: SERIAL / BATCH NUMBERS (Stocks → Serial Information) =====
export const adminSerialNumberAPI = {
  getAll: (productId) => {
    const qs = productId ? `?productId=${encodeURIComponent(productId)}` : ''
    return request(`/admin/stocks/serials${qs}`)
  },
  create: (data) => request('/admin/stocks/serials', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/admin/stocks/serials/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/admin/stocks/serials/${id}`, { method: 'DELETE' }),
}

// ===== ADMIN CUSTOMER GROUPS (Sale Dashboard → Customer Groups) =====
export const adminCustomerGroupAPI = {
  getAll: (search) => {
    const qs = search ? `?search=${encodeURIComponent(search)}` : ''
    return request(`/admin/customer-groups${qs}`)
  },
  getById: (id) => request(`/admin/customer-groups/${id}`),
  create: (data) => request('/admin/customer-groups', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/admin/customer-groups/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/admin/customer-groups/${id}`, { method: 'DELETE' }),
}

