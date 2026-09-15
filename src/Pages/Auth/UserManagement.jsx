import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { useTheme } from '../../context/ThemeContext'
import { userAPI, outletAPI, roleAPI } from '../../api/api'

// Fallback initial users if backend is booting or offline
const FALLBACK_USERS = [
  {
    id: 1,
    username: 'Badmin',
    firstName: 'Badmin',
    lastName: 'Administrator',
    fullName: 'Badmin Administrator',
    role: 'ADMIN',
    email: 'admin@bgroceries.com',
    phoneNumber: '+855 (0) 12 793 921',
    outlet: 'All Outlets',
    gender: 'Male',
    sessionTimeout: '15 min',
    salesperson: 'No',
    discountLimit: '50%',
    passcode: '8888',
    useAdditionalPrivilege: true,
    enabled: true,
    imageUrl: '',
  },
  {
    id: 2,
    username: 'piseth.c',
    firstName: 'Piseth',
    lastName: 'Chan',
    fullName: 'Piseth Chan',
    role: 'MANAGER',
    email: 'piseth.chan@bgroceries.com',
    phoneNumber: '+855 (0) 12 888 902',
    outlet: 'BKK1 Flagship Store',
    gender: 'Male',
    sessionTimeout: '10 min',
    salesperson: 'Yes',
    discountLimit: '25%',
    passcode: '1234',
    useAdditionalPrivilege: true,
    enabled: true,
    imageUrl: '',
  },
  {
    id: 3,
    username: 'sreynoch.h',
    firstName: 'Sreynoch',
    lastName: 'Heng',
    fullName: 'Sreynoch Heng',
    role: 'CASHIER',
    email: 'sreynoch.h@bgroceries.com',
    phoneNumber: '+855 (0) 23 888 901',
    outlet: 'Main Mart Toul Kork',
    gender: 'Female',
    sessionTimeout: '5 min',
    salesperson: 'No',
    discountLimit: '5%',
    passcode: '9012',
    useAdditionalPrivilege: false,
    enabled: true,
    imageUrl: '',
  },
]

const INITIAL_FORM = {
  id: null,
  firstName: '',
  lastName: '',
  outlet: '',
  gender: 'Male',
  email: '',
  sessionTimeout: '15 min',
  phoneNumber: '',
  salesperson: 'No',
  enabled: true,
  imageUrl: '',
  discountLimit: '',
  username: '',
  role: 'CASHIER',
  password: '',
  reEnterPassword: '',
  passcode: '',
  useAdditionalPrivilege: false,
}

// Normalize session timeout string into standard format ('1 min', '2 min', '3 min', '4 min', '5 min', '15 min', '20 min')
export const normalizeSessionTimeout = (val) => {
  if (!val) return '15 min'
  const s = String(val).trim().toLowerCase()
  if (s === '1 min' || s === '1' || s.startsWith('1 m') || s === '1min') return '1 min'
  if (s === '2 min' || s === '2' || s.startsWith('2 m') || s === '2min') return '2 min'
  if (s === '3 min' || s === '3' || s.startsWith('3 m') || s === '3min') return '3 min'
  if (s === '4 min' || s === '4' || s.startsWith('4 m') || s === '4min') return '4 min'
  if (s === '5 min' || s === '5' || s.startsWith('5 m') || s === '5min') return '5 min'
  if (s === '15 min' || s === '15' || s.startsWith('15 m') || s === '15min') return '15 min'
  if (s === '20 min' || s === '20' || s.startsWith('20 m') || s === '20min') return '20 min'
  return s
}

export default function UserManagement() {
  const { lang } = useLanguage()
  const { isDark } = useTheme()
  const { user: currentUser, updateSessionTimeout } = useAuth()

  // Search & Filter State
  const [searchText, setSearchText] = useState('')
  const [searchBy, setSearchBy] = useState('Any') // Any, Username, Full name, Email, Mobile, Role
  const [filterStatus, setFilterStatus] = useState('All') // Active, Inactive, All

  // Data State
  const [users, setUsers] = useState([])
  const [outletsList, setOutletsList] = useState([])
  const [rolesList, setRolesList] = useState([])
  const [loading, setLoading] = useState(true)
  const [feedbackMsg, setFeedbackMsg] = useState(null) // { type: 'success' | 'error', text: '' }

  // Modal State for Create / Edit
  const [modalOpen, setModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [formError, setFormError] = useState('')
  const [imageError, setImageError] = useState('')
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef(null)

  // Password Visibility Toggles
  const [showPassword, setShowPassword] = useState(false)
  const [showRePassword, setShowRePassword] = useState(false)
  const [showPasscode, setShowPasscode] = useState(false)

  // Delete Confirmation Modal
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)

  // Fetch real live outlets from backend
  const fetchOutlets = async () => {
    try {
      const res = await outletAPI.getAll({})
      if (res?.data && Array.isArray(res.data)) {
        setOutletsList(res.data)
        return res.data
      }
    } catch (err) {
      console.warn('Failed to fetch live outlets, using fallback:', err)
    }
    const defaultOutlets = [
      { id: 1, code: 'OUT-001', description: 'Main Mart Toul Kork' },
      { id: 2, code: 'OUT-002', description: 'BKK1 Flagship Store' },
      { id: 3, code: 'OUT-003', description: 'Koh Norea' },
    ]
    setOutletsList(defaultOutlets)
    return defaultOutlets
  }

  // Fetch real live roles from backend
  const fetchRoles = async () => {
    try {
      const res = await roleAPI.getAll({})
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        setRolesList(res.data)
        return res.data
      }
    } catch (err) {
      console.warn('Failed to fetch live roles, using defaults:', err)
    }
    const defaultRoles = [
      { id: 1, code: 'ROL-001', description: 'Super Administrator' },
      { id: 2, code: 'ROL-002', description: 'Store Manager' },
      { id: 3, code: 'ROL-003', description: 'Cashier' },
      { id: 4, code: 'ROL-004', description: 'Inventory Auditor' },
      { id: 5, code: 'ROL-005', description: 'Purchasing Officer' },
    ]
    setRolesList(defaultRoles)
    return defaultRoles
  }

  // Fetch users from backend API
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = {
        search: searchText.trim(),
        searchBy: searchBy === 'Any' ? '' : searchBy.toLowerCase().replace(/\s+/g, ''),
        status: filterStatus === 'All' ? '' : filterStatus.toLowerCase(),
      }
      const res = await userAPI.getAll(params)
      if (res && res.data) {
        setUsers(res.data)
      } else {
        applyClientFilter()
      }
    } catch (err) {
      console.warn('Backend API request failed, applying local filter:', err)
      applyClientFilter()
    } finally {
      setLoading(false)
    }
  }

  // Fallback client filter
  const applyClientFilter = () => {
    let list = [...FALLBACK_USERS]
    if (filterStatus === 'Active') list = list.filter((u) => u.enabled)
    if (filterStatus === 'Inactive') list = list.filter((u) => !u.enabled)

    if (searchText.trim()) {
      const q = searchText.trim().toLowerCase()
      list = list.filter((u) => {
        const username = (u.username || '').toLowerCase()
        const fullName = (u.fullName || `${u.firstName || ''} ${u.lastName || ''}`).toLowerCase()
        const email = (u.email || '').toLowerCase()
        const mobile = (u.phoneNumber || '').toLowerCase()
        const role = (u.role || '').toLowerCase()

        if (searchBy === 'Username') return username.includes(q)
        if (searchBy === 'Full name') return fullName.includes(q)
        if (searchBy === 'Email') return email.includes(q)
        if (searchBy === 'Mobile') return mobile.includes(q)
        if (searchBy === 'Role') return role.includes(q)
        return (
          username.includes(q) ||
          fullName.includes(q) ||
          email.includes(q) ||
          mobile.includes(q) ||
          role.includes(q)
        )
      })
    }
    setUsers(list)
  }

  // Initial load
  useEffect(() => {
    let active = true
    const init = async () => {
      await Promise.all([fetchOutlets(), fetchRoles()])
      if (!active) return
      try {
        const res = await userAPI.getAll({})
        if (active && res?.data) {
          setUsers(res.data)
        } else if (active) {
          setUsers(FALLBACK_USERS)
        }
      } catch (err) {
        if (active) {
          console.warn('Initial load users failed:', err)
          setUsers(FALLBACK_USERS)
        }
      } finally {
        if (active) setLoading(false)
      }
    }
    init()
    return () => {
      active = false
    }
  }, [])

  const showFeedback = (text, type = 'success') => {
    setFeedbackMsg({ type, text })
    setTimeout(() => setFeedbackMsg(null), 3500)
  }

  const handleSearch = (e) => {
    if (e) e.preventDefault()
    fetchUsers()
  }

  const handleResetSearch = () => {
    setSearchText('')
    setSearchBy('Any')
    setFilterStatus('All')
    setTimeout(() => {
      userAPI
        .getAll({})
        .then((res) => {
          if (res?.data) setUsers(res.data)
          else setUsers(FALLBACK_USERS)
        })
        .catch(() => setUsers(FALLBACK_USERS))
    }, 50)
  }

  // Open Create Modal
  const handleOpenCreate = () => {
    setIsEditing(false)
    setFormError('')
    setImageError('')
    setShowPassword(false)
    setShowRePassword(false)
    setShowPasscode(false)

    const defaultOutlet = outletsList.length > 0 ? outletsList[0].description : 'All Outlets'

    setFormData({
      ...INITIAL_FORM,
      outlet: defaultOutlet,
    })
    setModalOpen(true)
  }

  // Open Edit Modal
  const handleOpenEdit = (user) => {
    setIsEditing(true)
    setFormError('')
    setImageError('')
    setShowPassword(false)
    setShowRePassword(false)
    setShowPasscode(false)

    // Separate firstName / lastName if not present
    let fName = user.firstName || ''
    let lName = user.lastName || ''
    if (!fName && !lName && user.fullName) {
      const parts = user.fullName.trim().split(' ')
      fName = parts[0] || ''
      lName = parts.slice(1).join(' ') || ''
    }

    setFormData({
      ...INITIAL_FORM,
      ...user,
      firstName: fName,
      lastName: lName,
      sessionTimeout: normalizeSessionTimeout(user.sessionTimeout || '15 min'),
      password: '',
      reEnterPassword: '',
    })
    setModalOpen(true)
  }

  // Image Upload handler with format (.jpg, .jpeg, .png) and size (<= 1MB) validation
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    setImageError('')
    if (!file) return

    // Validate format (.jpg, .jpeg, .png)
    const validExtensions = ['image/jpeg', 'image/jpg', 'image/png']
    const hasValidExt = validExtensions.includes(file.type) || /\.(jpe?g|png)$/i.test(file.name)
    if (!hasValidExt) {
      setImageError(
        lang === 'en'
          ? 'Invalid format. Only .jpg, .jpeg, and .png are allowed.'
          : 'ទម្រង់ឯកសារមិនត្រឹមត្រូវ។ អនុញ្ញាតតែ .jpg, .jpeg និង .png ប៉ុណ្ណោះ។'
      )
      return
    }

    // Size limit: 1 MB (1,048,576 bytes)
    const MAX_SIZE = 1 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      setImageError(
        lang === 'en'
          ? `Size is over 1 MB (${(file.size / (1024 * 1024)).toFixed(2)} MB). Must not be over 1 MB.`
          : `ទំហំឯកសារលើស 1 MB (${(file.size / (1024 * 1024)).toFixed(2)} MB)។ ត្រូវតែមិនលើសពី 1 MB។`
      )
      return
    }

    // Convert to Base64 for instant preview and upload
    const reader = new FileReader()
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, imageUrl: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  // Handle Form Submit (Create / Update)
  const handleSubmitForm = async (e) => {
    e.preventDefault()
    setFormError('')

    // Required fields validation
    if (!formData.firstName || !formData.firstName.trim()) {
      setFormError(lang === 'en' ? 'First Name is required (*).' : 'នាមខ្លួនត្រូវតែបំពេញ (*)')
      return
    }
    if (!formData.lastName || !formData.lastName.trim()) {
      setFormError(lang === 'en' ? 'Last Name is required (*).' : 'គោត្តនាមត្រូវតែបំពេញ (*)')
      return
    }
    if (!formData.phoneNumber || !formData.phoneNumber.trim()) {
      setFormError(lang === 'en' ? 'Mobile is required (*).' : 'លេខទូរស័ព្ទត្រូវតែបំពេញ (*)')
      return
    }
    if (!formData.username || !formData.username.trim()) {
      setFormError(lang === 'en' ? 'Login Username is required (*).' : 'ឈ្មោះគណនីត្រូវតែបំពេញ (*)')
      return
    }
    if (!isEditing && (!formData.password || !formData.password.trim())) {
      setFormError(lang === 'en' ? 'Password is required (*).' : 'ពាក្យសម្ងាត់ត្រូវតែបំពេញ (*)')
      return
    }
    if (!isEditing && formData.password !== formData.reEnterPassword) {
      setFormError(
        lang === 'en'
          ? 'Password and Re-Enter Password do not match.'
          : 'ពាក្យសម្ងាត់ និងការបញ្ជាក់ពាក្យសម្ងាត់មិនត្រូវគ្នាទេ។'
      )
      return
    }
    if (isEditing && formData.password && formData.password !== formData.reEnterPassword) {
      setFormError(
        lang === 'en'
          ? 'Password and Re-Enter Password do not match.'
          : 'ពាក្យសម្ងាត់ និងការបញ្ជាក់ពាក្យសម្ងាត់មិនត្រូវគ្នាទេ។'
      )
      return
    }

    setSaving(true)
    try {
      const normalizedTimeout = normalizeSessionTimeout(formData.sessionTimeout)
      const payload = {
        ...formData,
        sessionTimeout: normalizedTimeout,
        fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
      }

      if (isEditing && formData.id) {
        const res = await userAPI.update(formData.id, payload)
        const updated = res?.data || payload
        setUsers((prev) => prev.map((u) => (u.id === formData.id ? updated : u)))
        if (updateSessionTimeout) {
          updateSessionTimeout(normalizedTimeout)
        }
        if (currentUser && (currentUser.id === formData.id || currentUser.username === formData.username)) {
          try {
            const stored = localStorage.getItem('user')
            const parsed = stored ? JSON.parse(stored) : {}
            const newCurrent = { ...parsed, ...updated }
            localStorage.setItem('user', JSON.stringify(newCurrent))
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('auth_user_updated', { detail: newCurrent }))
            }
          } catch (e) {
            console.error('Failed to sync auth user update:', e)
          }
        }
        showFeedback(
          lang === 'en'
            ? `User ${updated.username} updated successfully.`
            : `គណនី ${updated.username} ត្រូវបានកែប្រែដោយជោគជ័យ។`,
          'success'
        )
      } else {
        const res = await userAPI.create(payload)
        const created = res?.data || { ...payload, id: Date.now() }
        setUsers((prev) => [created, ...prev])
        if (updateSessionTimeout) {
          updateSessionTimeout(normalizedTimeout)
        }
        showFeedback(
          lang === 'en'
            ? `User ${created.username} created successfully.`
            : `គណនី ${created.username} ត្រូវបានបង្កើតដោយជោគជ័យ។`,
          'success'
        )
      }
      setModalOpen(false)
    } catch (err) {
      console.error('Error saving user:', err)
      setFormError(err.message || 'Failed to save user.')
    } finally {
      setSaving(false)
    }
  }

  // Toggle Active Status
  const handleToggleActive = async (user) => {
    const nextStatus = !user.enabled
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, enabled: nextStatus } : u))
    )

    try {
      await userAPI.toggleStatus(user.id, nextStatus)
      showFeedback(
        lang === 'en'
          ? `User ${user.username} status set to ${nextStatus ? 'Active' : 'Inactive'}.`
          : `ស្ថានភាពអ្នកប្រើប្រាស់ ${user.username} ត្រូវបានប្តូរទៅ ${nextStatus ? 'សកម្ម' : 'អសកម្ម'}។`,
        'success'
      )
    } catch (err) {
      console.error('Toggle status failed, reverting:', err)
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, enabled: user.enabled } : u))
      )
      showFeedback(
        lang === 'en' ? 'Failed to update user status.' : 'មិនអាចប្តូរស្ថានភាពអ្នកប្រើប្រាស់បានទេ។',
        'error'
      )
    }
  }

  // Delete Prompt & Confirmation
  const handlePromptDelete = (user) => {
    setUserToDelete(user)
    setDeleteConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!userToDelete) return
    try {
      await userAPI.delete(userToDelete.id)
    } catch (err) {
      console.warn('Backend delete error (or local simulation):', err)
    }
    setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id))
    showFeedback(
      lang === 'en'
        ? `User ${userToDelete.username} deleted successfully.`
        : `គណនី ${userToDelete.username} ត្រូវបានលុប។`,
      'success'
    )
    setDeleteConfirmOpen(false)
    setUserToDelete(null)
  }

  // Helper badge color for roles
  const getRoleBadgeStyle = (role) => {
    const r = (role || '').toUpperCase()
    if (r === 'ADMIN') return 'bg-purple-500/15 text-purple-400 border-purple-500/30'
    if (r === 'MANAGER') return 'bg-blue-500/15 text-blue-400 border-blue-500/30'
    if (r === 'CASHIER') return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
    if (r === 'SALES') return 'bg-amber-500/15 text-amber-400 border-amber-500/30'
    if (r === 'STORE') return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
    return 'bg-slate-500/15 text-slate-400 border-slate-500/30'
  }

  return (
    <div className="space-y-6">
      {/* Toast Feedback Notification */}
      {feedbackMsg && (
        <div
          className={`flex items-center gap-3 rounded-2xl border p-4 text-xs font-bold shadow-lg animate-in fade-in duration-200 ${
            feedbackMsg.type === 'success'
              ? 'border-emerald-500/40 bg-emerald-950/80 text-emerald-300'
              : 'border-rose-500/40 bg-rose-950/80 text-rose-300'
          }`}
        >
          <span className="text-base">{feedbackMsg.type === 'success' ? '✅' : '⚠️'}</span>
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 1: SEARCH USER                                   */}
      {/* ======================================================== */}
      <section
        className={`rounded-3xl border p-5 sm:p-6 shadow-xl space-y-4 transition-colors ${
          isDark
            ? 'border-slate-800 bg-[#0f172a]/90 shadow-black/40 text-white'
            : 'border-slate-200 bg-white shadow-slate-200/50 text-slate-900'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-4 border-slate-700/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 text-sm font-bold">
                👥
              </span>
              <h2 className="text-base sm:text-lg font-black tracking-tight font-['Montserrat']">
                {lang === 'en' ? 'Search User' : 'ស្វែងរកអ្នកប្រើប្រាស់ (Search User)'}
              </h2>
            </div>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {lang === 'en'
                ? 'Search user by any condition. Ex(Any, User Name, Full Name...)'
                : 'ស្វែងរកអ្នកប្រើប្រាស់តាមលក្ខខណ្ឌណាមួយ ឧទាហរណ៍ (ទាំងអស់ ឈ្មោះគណនី ឈ្មោះពេញ...)'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center shrink-0">
            <Link
              to="/admin/settings"
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition active:scale-95 shadow-sm ${
                isDark
                  ? 'border-slate-700 bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-600'
                  : 'border-slate-300 bg-slate-100 text-slate-700 hover:text-slate-950 hover:bg-slate-200 hover:border-slate-400'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>{lang === 'en' ? 'Back to Settings' : 'ត្រឡប់ទៅការកំណត់'}</span>
            </Link>

            {/* "+ Create" Action Button */}
            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-4 py-2 text-xs font-black text-white shadow-lg shadow-emerald-600/25 transition active:scale-95 cursor-pointer"
            >
              <span className="text-base leading-none">+</span>
              <span>{lang === 'en' ? 'Create User' : 'បង្កើតអ្នកប្រើប្រាស់ថ្មី'}</span>
            </button>
          </div>
        </div>

        {/* Search Filter Controls */}
        <form onSubmit={handleSearch} className="grid grid-cols-1 gap-3 sm:grid-cols-12 items-end">
          {/* Search - Textbox */}
          <div className="sm:col-span-5 space-y-1">
            <label
              className={`text-[11px] font-bold uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {lang === 'en' ? 'Search' : 'ស្វែងរក (Search)'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={
                  lang === 'en' ? 'Search by condition...' : 'បញ្ចូលពាក្យគន្លឹះស្វែងរក...'
                }
                className={`w-full rounded-xl border px-3.5 py-2 text-xs font-semibold outline-none transition ${
                  isDark
                    ? 'border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20'
                    : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-xs'
                }`}
              />
              {searchText && (
                <button
                  type="button"
                  onClick={() => setSearchText('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Search by - Dropdown (Any, Username, Full name, Email, Mobile, Role) */}
          <div className="sm:col-span-3 space-y-1">
            <label
              className={`text-[11px] font-bold uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {lang === 'en' ? 'Search by' : 'ស្វែងរកតាម (Search by)'}
            </label>
            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
              className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold outline-none transition cursor-pointer ${
                isDark
                  ? 'border-slate-700 bg-slate-950 text-white focus:border-emerald-400'
                  : 'border-slate-300 bg-white text-slate-900 focus:border-emerald-500 shadow-xs'
              }`}
            >
              <option value="Any">{lang === 'en' ? 'Any Condition' : 'គ្រប់លក្ខខណ្ឌ (Any)'}</option>
              <option value="Username">{lang === 'en' ? 'Username' : 'ឈ្មោះគណនី (Username)'}</option>
              <option value="Full name">{lang === 'en' ? 'Full Name' : 'ឈ្មោះពេញ (Full name)'}</option>
              <option value="Email">{lang === 'en' ? 'Email' : 'អ៊ីមែល (Email)'}</option>
              <option value="Mobile">{lang === 'en' ? 'Mobile' : 'ទូរស័ព្ទ (Mobile)'}</option>
              <option value="Role">{lang === 'en' ? 'Role' : 'តួនាទី (Role)'}</option>
            </select>
          </div>

          {/* Status - Dropdown (Active, Inactive, All) */}
          <div className="sm:col-span-2 space-y-1">
            <label
              className={`text-[11px] font-bold uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {lang === 'en' ? 'Status' : 'ស្ថានភាព (Status)'}
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold outline-none transition cursor-pointer ${
                isDark
                  ? 'border-slate-700 bg-slate-950 text-white focus:border-emerald-400'
                  : 'border-slate-300 bg-white text-slate-900 focus:border-emerald-500 shadow-xs'
              }`}
            >
              <option value="All">{lang === 'en' ? 'All' : 'ទាំងអស់ (All)'}</option>
              <option value="Active">{lang === 'en' ? 'Active' : 'សកម្ម (Active)'}</option>
              <option value="Inactive">{lang === 'en' ? 'Inactive' : 'អសកម្ម (Inactive)'}</option>
            </select>
          </div>

          {/* Search Button & Reset */}
          <div className="sm:col-span-2 flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition active:scale-95 cursor-pointer"
            >
              <span>🔍</span>
              <span>{lang === 'en' ? 'Search' : 'ស្វែងរក'}</span>
            </button>
            <button
              type="button"
              onClick={handleResetSearch}
              title={lang === 'en' ? 'Reset search' : 'កំណត់ឡើងវិញ'}
              className={`rounded-xl border px-2.5 py-2 text-xs font-bold transition active:scale-95 cursor-pointer ${
                isDark
                  ? 'border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
                  : 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🔄
            </button>
          </div>
        </form>
      </section>

      {/* ======================================================== */}
      {/* SECTION 2: USER LIST TABLE                               */}
      {/* ======================================================== */}
      <section
        className={`rounded-3xl border p-5 sm:p-6 shadow-xl space-y-4 transition-colors ${
          isDark
            ? 'border-slate-800 bg-[#0f172a]/90 shadow-black/40 text-white'
            : 'border-slate-200 bg-white shadow-slate-200/50 text-slate-900'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-4 border-slate-700/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500/15 text-teal-400 text-sm font-bold">
                📋
              </span>
              <h2 className="text-base sm:text-lg font-black tracking-tight font-['Montserrat']">
                {lang === 'en' ? 'User List' : 'បញ្ជីអ្នកប្រើប្រាស់ (User List)'}
              </h2>
            </div>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {lang === 'en'
                ? 'Show information of User. Ex(User Name, Full Name, Role, Email, Mobile, Active...)'
                : 'បង្ហាញព័ត៌មានលម្អិតរបស់អ្នកប្រើប្រាស់ ឧទាហរណ៍ (ឈ្មោះគណនី ឈ្មោះពេញ តួនាទី អ៊ីមែល ទូរស័ព្ទ...)'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 font-mono text-xs font-bold ${
                isDark
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'bg-slate-100 text-emerald-700 border border-slate-200'
              }`}
            >
              {users.length} {lang === 'en' ? 'Users' : 'គណនី'}
            </span>
          </div>
        </div>

        {/* Table Container */}
        <div
          className={`overflow-x-auto rounded-2xl border ${
            isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-white'
          }`}
        >
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr
                className={`border-b text-[10px] font-black uppercase tracking-wider ${
                  isDark
                    ? 'border-slate-800 bg-slate-900/80 text-slate-400'
                    : 'border-slate-200 bg-slate-50 text-slate-600'
                }`}
              >
                <th className="py-3.5 px-4">{lang === 'en' ? 'User Name' : 'ឈ្មោះគណនី'}</th>
                <th className="py-3.5 px-4">{lang === 'en' ? 'Full Name' : 'ឈ្មោះពេញ'}</th>
                <th className="py-3.5 px-4">{lang === 'en' ? 'Role' : 'តួនាទី'}</th>
                <th className="py-3.5 px-4">{lang === 'en' ? 'Email' : 'អ៊ីមែល'}</th>
                <th className="py-3.5 px-4">{lang === 'en' ? 'Mobile' : 'ទូរស័ព្ទដៃ'}</th>
                <th className="py-3.5 px-4 text-center">{lang === 'en' ? 'Active' : 'សកម្ម'}</th>
                <th className="py-3.5 px-4 text-right">{lang === 'en' ? 'Actions' : 'សកម្មភាព'}</th>
              </tr>
            </thead>
            <tbody className={`divide-y font-medium ${isDark ? 'divide-slate-800/70' : 'divide-slate-200'}`}>
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-xs text-slate-400">
                    <span className="inline-block animate-spin mr-2">⏳</span>
                    {lang === 'en' ? 'Loading users from database...' : 'កំពុងផ្ទុកទិន្នន័យអ្នកប្រើប្រាស់...'}
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center space-y-2">
                    <div className="text-3xl">👥</div>
                    <p className="text-xs font-bold text-slate-400">
                      {lang === 'en'
                        ? 'No user found matching your search condition.'
                        : 'រកមិនឃើញអ្នកប្រើប្រាស់ដែលត្រូវនឹងលក្ខខណ្ឌស្វែងរកទេ។'}
                    </p>
                    <button
                      type="button"
                      onClick={handleResetSearch}
                      className="text-xs font-bold text-emerald-400 hover:underline cursor-pointer"
                    >
                      {lang === 'en' ? 'Reset search filters' : 'សម្អាតលក្ខខណ្ឌស្វែងរក'}
                    </button>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id || user.username}
                    className={`transition-colors ${isDark ? 'hover:bg-slate-900/50' : 'hover:bg-slate-50'}`}
                  >
                    {/* User Name */}
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                      <div className="flex items-center gap-2.5">
                        {user.imageUrl ? (
                          <img
                            src={user.imageUrl}
                            alt=""
                            className="h-8 w-8 rounded-xl object-cover border border-slate-700 shrink-0"
                          />
                        ) : (
                          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-xs shrink-0 shadow-xs">
                            {(user.username || 'U')[0].toUpperCase()}
                          </span>
                        )}
                        <span className="bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          {user.username}
                        </span>
                      </div>
                    </td>

                    {/* Full Name */}
                    <td className="py-3 px-4 font-bold max-w-xs truncate">
                      <span className={isDark ? 'text-white' : 'text-slate-950'}>
                        {user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || '—'}
                      </span>
                      {user.outlet && (
                        <span className="block text-[10px] text-cyan-400 font-medium truncate">
                          🏬 {user.outlet}
                        </span>
                      )}
                    </td>

                    {/* Role */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getRoleBadgeStyle(
                          user.role
                        )}`}
                      >
                        {user.role || 'USER'}
                      </span>
                    </td>

                    {/* Email */}
                    <td className="py-3 px-4 text-slate-400 text-[11px] truncate max-w-[180px]">
                      {user.email || '—'}
                    </td>

                    {/* Mobile */}
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-300">
                      {user.phoneNumber || '—'}
                    </td>

                    {/* Active */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(user)}
                        title={lang === 'en' ? 'Click to toggle status' : 'ចុចដើម្បីប្តូរស្ថានភាព'}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition active:scale-95 ${
                          user.enabled
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            user.enabled ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                          }`}
                        />
                        <span>
                          {user.enabled
                            ? lang === 'en'
                              ? 'Active'
                              : 'សកម្ម'
                            : lang === 'en'
                            ? 'Inactive'
                            : 'អសកម្ម'}
                        </span>
                      </button>
                    </td>

                    {/* Actions: Edit button */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(user)}
                          title={lang === 'en' ? 'Edit User' : 'កែប្រែអ្នកប្រើប្រាស់'}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition border border-blue-500/20 active:scale-95 cursor-pointer"
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePromptDelete(user)}
                          title={lang === 'en' ? 'Delete User' : 'លុបអ្នកប្រើប្រាស់'}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition border border-rose-500/20 active:scale-95 cursor-pointer"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 3: CREATE / EDIT USER MODAL DIALOG               */}
      {/* ======================================================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
          <div
            className={`w-full max-w-3xl rounded-3xl border shadow-2xl transition-all my-8 overflow-hidden ${
              isDark
                ? 'border-slate-700 bg-slate-900 text-white shadow-black/80'
                : 'border-slate-200 bg-white text-slate-900 shadow-slate-300'
            }`}
          >
            {/* Modal Header */}
            <div
              className={`flex items-center justify-between p-5 sm:p-6 border-b ${
                isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-100 bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 text-lg font-bold">
                  👥
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight font-['Montserrat']">
                    {isEditing
                      ? lang === 'en'
                        ? 'Edit User'
                        : 'កែប្រែអ្នកប្រើប្រាស់ (Edit User)'
                      : lang === 'en'
                      ? 'Create User'
                      : 'បង្កើតអ្នកប្រើប្រាស់ថ្មី (Create User)'}
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {lang === 'en'
                      ? 'Configure user profile, outlet permissions, discount rules and security credentials'
                      : 'កំណត់ព័ត៌មានអ្នកប្រើប្រាស់ សិទ្ធិច្រកលក់ ការបញ្ចុះតម្លៃ និងសុវត្ថិភាព'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitForm} className="p-5 sm:p-6 space-y-6 max-h-[78vh] overflow-y-auto scrollbar-thin">
              {/* Form Validation Error Banner */}
              {formError && (
                <div className="flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-950/60 p-3 text-xs font-bold text-rose-300">
                  <span>⚠️</span>
                  <span>{formError}</span>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* PART 1: GENERAL INFORMATION                          */}
              {/* ---------------------------------------------------- */}
              <div className="space-y-4">
                <div className="border-b pb-2 border-slate-700/50">
                  <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400">
                    {lang === 'en' ? 'General Information' : 'ព័ត៌មានទូទៅ (General Information)'}
                  </h4>
                  <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {lang === 'en'
                      ? 'Input the general user information and image with format (.jpg, .jpeg, .png) Size: Must not be over 1 MB'
                      : 'បញ្ចូលព័ត៌មានទូទៅរបស់អ្នកប្រើប្រាស់ និងរូបភាព (ទម្រង់ .jpg, .jpeg, .png ទំហំមិនលើស 1 MB)'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  {/* First Name * - textbox */}
                  <div className="sm:col-span-6 space-y-1">
                    <label
                      className={`text-[11px] font-bold uppercase tracking-wider ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {lang === 'en' ? 'First Name *' : 'នាមខ្លួន * (First Name)'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="e.g. Piseth, Dara..."
                      className={`w-full rounded-xl border px-3.5 py-2 text-xs font-semibold outline-none transition ${
                        isDark
                          ? 'border-slate-700 bg-slate-950 text-white placeholder-slate-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20'
                          : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-xs'
                      }`}
                    />
                  </div>

                  {/* Last Name * - textbox */}
                  <div className="sm:col-span-6 space-y-1">
                    <label
                      className={`text-[11px] font-bold uppercase tracking-wider ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {lang === 'en' ? 'Last Name *' : 'គោត្តនាម * (Last Name)'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="e.g. Chan, Heng..."
                      className={`w-full rounded-xl border px-3.5 py-2 text-xs font-semibold outline-none transition ${
                        isDark
                          ? 'border-slate-700 bg-slate-950 text-white placeholder-slate-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20'
                          : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-xs'
                      }`}
                    />
                  </div>

                  {/* Outlet - Dropdown (loaded with real live data) */}
                  <div className="sm:col-span-6 space-y-1">
                    <label
                      className={`text-[11px] font-bold uppercase tracking-wider ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {lang === 'en' ? 'Outlet' : 'ច្រកលក់ (Outlet)'}
                    </label>
                    <select
                      value={formData.outlet}
                      onChange={(e) => setFormData({ ...formData, outlet: e.target.value })}
                      className={`w-full rounded-xl border px-3.5 py-2 text-xs font-semibold outline-none transition cursor-pointer ${
                        isDark
                          ? 'border-slate-700 bg-slate-950 text-white focus:border-emerald-400'
                          : 'border-slate-300 bg-white text-slate-900 focus:border-emerald-500 shadow-xs'
                      }`}
                    >
                      <option value="All Outlets">{lang === 'en' ? 'All Outlets' : 'គ្រប់ច្រកលក់ទាំងអស់'}</option>
                      {outletsList.map((outlet) => (
                        <option key={outlet.id || outlet.code} value={outlet.description}>
                          {outlet.code ? `[${outlet.code}] ` : ''}
                          {outlet.description}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Gender - Dropdown */}
                  <div className="sm:col-span-6 space-y-1">
                    <label
                      className={`text-[11px] font-bold uppercase tracking-wider ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {lang === 'en' ? 'Gender' : 'ភេទ (Gender)'}
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className={`w-full rounded-xl border px-3.5 py-2 text-xs font-semibold outline-none transition cursor-pointer ${
                        isDark
                          ? 'border-slate-700 bg-slate-950 text-white focus:border-emerald-400'
                          : 'border-slate-300 bg-white text-slate-900 focus:border-emerald-500 shadow-xs'
                      }`}
                    >
                      <option value="Male">{lang === 'en' ? 'Male' : 'ប្រុស'}</option>
                      <option value="Female">{lang === 'en' ? 'Female' : 'ស្រី'}</option>
                      <option value="Other">{lang === 'en' ? 'Other' : 'ផ្សេងទៀត'}</option>
                    </select>
                  </div>

                  {/* Email - textbox */}
                  <div className="sm:col-span-6 space-y-1">
                    <label
                      className={`text-[11px] font-bold uppercase tracking-wider ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {lang === 'en' ? 'Email' : 'អ៊ីមែល (Email)'}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="user@bgroceries.com"
                      className={`w-full rounded-xl border px-3.5 py-2 text-xs font-semibold outline-none transition ${
                        isDark
                          ? 'border-slate-700 bg-slate-950 text-white placeholder-slate-600 focus:border-emerald-400'
                          : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-emerald-500 shadow-xs'
                      }`}
                    />
                  </div>

                  {/* Session Timeout - dropdown: 1 Min, 2 min, 3 min, 4 min, 5 min, 15 min, 20 min */}
                  <div className="sm:col-span-6 space-y-1">
                    <label
                      className={`text-[11px] font-bold uppercase tracking-wider ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {lang === 'en' ? 'Session Timeout' : 'ពេលវេលាកំណត់ (Session Timeout)'}
                    </label>
                    <select
                      value={normalizeSessionTimeout(formData.sessionTimeout)}
                      onChange={(e) => {
                        const val = e.target.value
                        setFormData({ ...formData, sessionTimeout: val })
                        if (updateSessionTimeout) {
                          updateSessionTimeout(val)
                        }
                      }}
                      className={`w-full rounded-xl border px-3.5 py-2 text-xs font-semibold outline-none transition cursor-pointer ${
                        isDark
                          ? 'border-slate-700 bg-slate-950 text-white focus:border-emerald-400'
                          : 'border-slate-300 bg-white text-slate-900 focus:border-emerald-500 shadow-xs'
                      }`}
                    >
                      <option value="1 min">1 min</option>
                      <option value="2 min">2 min</option>
                      <option value="3 min">3 min</option>
                      <option value="4 min">4 min</option>
                      <option value="5 min">5 min</option>
                      <option value="15 min">15 min</option>
                      <option value="20 min">20 min</option>
                    </select>
                  </div>

                  {/* Mobile * - textbox */}
                  <div className="sm:col-span-6 space-y-1">
                    <label
                      className={`text-[11px] font-bold uppercase tracking-wider ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {lang === 'en' ? 'Mobile *' : 'ទូរស័ព្ទដៃ * (Mobile)'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      placeholder="+855 12 888 999"
                      className={`w-full rounded-xl border px-3.5 py-2 text-xs font-semibold outline-none transition ${
                        isDark
                          ? 'border-slate-700 bg-slate-950 text-white placeholder-slate-600 focus:border-emerald-400'
                          : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-emerald-500 shadow-xs'
                      }`}
                    />
                  </div>

                  {/* Salesperson - Dropdown */}
                  <div className="sm:col-span-4 space-y-1">
                    <label
                      className={`text-[11px] font-bold uppercase tracking-wider ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {lang === 'en' ? 'Salesperson' : 'បុគ្គលិកលក់ (Salesperson)'}
                    </label>
                    <select
                      value={formData.salesperson}
                      onChange={(e) => setFormData({ ...formData, salesperson: e.target.value })}
                      className={`w-full rounded-xl border px-3.5 py-2 text-xs font-semibold outline-none transition cursor-pointer ${
                        isDark
                          ? 'border-slate-700 bg-slate-950 text-white focus:border-emerald-400'
                          : 'border-slate-300 bg-white text-slate-900 focus:border-emerald-500 shadow-xs'
                      }`}
                    >
                      <option value="No">{lang === 'en' ? 'No' : 'ទេ (No)'}</option>
                      <option value="Yes">{lang === 'en' ? 'Yes' : 'បាទ/ចាស (Yes)'}</option>
                    </select>
                  </div>

                  {/* Active - Tickbox */}
                  <div className="sm:col-span-2 flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={Boolean(formData.enabled)}
                        onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                        className="h-4 w-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-400 cursor-pointer accent-emerald-500"
                      />
                      <span className="text-xs font-bold">
                        {lang === 'en' ? 'Active' : 'សកម្ម'}
                      </span>
                    </label>
                  </div>

                  {/* Frame of picture for upload and box that shows picture */}
                  <div className="sm:col-span-12 space-y-2 pt-2">
                    <label
                      className={`text-[11px] font-bold uppercase tracking-wider block ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {lang === 'en' ? 'Profile Picture (.jpg, .jpeg, .png <= 1MB)' : 'រូបថតគណនី (.jpg, .jpeg, .png <= 1MB)'}
                    </label>

                    {imageError && (
                      <p className="text-xs text-rose-400 font-bold bg-rose-950/50 p-2.5 rounded-xl border border-rose-500/30 animate-in fade-in">
                        ⚠️ {imageError}
                      </p>
                    )}

                    <div
                      className={`p-4 rounded-2xl border grid grid-cols-1 sm:grid-cols-12 gap-5 items-center ${
                        isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50/60'
                      }`}
                    >
                      {/* Box that shows picture that has been uploaded (BIGGER) */}
                      <div className="sm:col-span-5 flex flex-col items-center justify-center gap-2.5">
                        <div className="flex items-center gap-1.5 self-center">
                          <span className="text-xs">👁️</span>
                          <span
                            className={`text-[11px] font-bold uppercase tracking-wider ${
                              isDark ? 'text-slate-400' : 'text-slate-600'
                            }`}
                          >
                            {lang === 'en' ? 'Picture Preview' : 'ទិដ្ឋភាពរូបភាព'}
                          </span>
                        </div>

                        <div
                          className={`relative h-36 w-36 sm:h-40 sm:w-40 rounded-2xl border-2 flex items-center justify-center overflow-hidden shrink-0 shadow-xl transition-all ${
                            formData.imageUrl
                              ? isDark
                                ? 'border-emerald-500/60 bg-slate-950 ring-4 ring-emerald-500/10'
                                : 'border-emerald-500 bg-white ring-4 ring-emerald-500/20 shadow-emerald-500/10'
                              : isDark
                              ? 'border-slate-700 bg-slate-950/80 border-dashed'
                              : 'border-slate-300 bg-white border-dashed'
                          }`}
                        >
                          {formData.imageUrl ? (
                            <img
                              src={formData.imageUrl}
                              alt="Uploaded Preview"
                              className="h-full w-full object-cover transition-transform hover:scale-105 duration-200"
                            />
                          ) : (
                            <div className="text-center p-3 space-y-1">
                              <span className="text-3xl opacity-30 block">👤</span>
                              <span
                                className={`block text-[11px] font-bold ${
                                  isDark ? 'text-slate-500' : 'text-slate-400'
                                }`}
                              >
                                {lang === 'en' ? 'No Picture Uploaded' : 'មិនទាន់មានរូបភាព'}
                              </span>
                              <span
                                className={`block text-[9px] ${
                                  isDark ? 'text-slate-600' : 'text-slate-400'
                                }`}
                              >
                                {lang === 'en' ? 'Preview appears here' : 'រូបភាពនឹងបង្ហាញនៅទីនេះ'}
                              </span>
                            </div>
                          )}
                        </div>

                        {formData.imageUrl && (
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, imageUrl: '' })}
                            className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 hover:text-rose-300 hover:underline cursor-pointer"
                          >
                            <span>✕</span>
                            <span>{lang === 'en' ? 'Remove Picture' : 'លុបរូបថត'}</span>
                          </button>
                        )}
                      </div>

                      {/* Upload Box Frame (balanced and sleek) */}
                      <div className="sm:col-span-7 flex flex-col justify-center">
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className={`flex flex-col items-center justify-center p-5 border-2 border-dashed rounded-2xl cursor-pointer transition text-center group ${
                            isDark
                              ? 'border-slate-700 bg-slate-950/60 hover:border-emerald-400 hover:bg-slate-900/80'
                              : 'border-slate-300 bg-white hover:border-emerald-500 hover:bg-emerald-50/50 shadow-xs'
                          }`}
                        >
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 text-xl mb-2 group-hover:scale-110 transition-transform">
                            🖼️
                          </div>
                          <p className="text-xs font-black text-emerald-400 group-hover:underline">
                            {formData.imageUrl
                              ? lang === 'en'
                                ? 'Click to Change Picture'
                                : 'ចុចដើម្បីប្តូររូបភាពថ្មី'
                              : lang === 'en'
                              ? 'Click to Upload Picture'
                              : 'ចុចដើម្បីបញ្ចូលរូបថត'}
                          </p>
                          <p
                            className={`text-[11px] mt-1 font-medium ${
                              isDark ? 'text-slate-400' : 'text-slate-500'
                            }`}
                          >
                            {lang === 'en'
                              ? 'Supports: .jpg, .jpeg, .png'
                              : 'គាំទ្រទម្រង់៖ .jpg, .jpeg, .png'}
                          </p>
                          <span
                            className={`inline-block mt-2 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold border ${
                              isDark
                                ? 'bg-slate-900 text-slate-400 border-slate-700'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {lang === 'en' ? 'Max file size: 1 MB' : 'ទំហំអតិបរមា៖ 1 MB'}
                          </span>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* PART 2: DISCOUNT LIMIT                               */}
              {/* ---------------------------------------------------- */}
              <div className="space-y-4 pt-2">
                <div className="border-b pb-2 border-slate-700/50">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
                    {lang === 'en' ? 'Discount Limit' : 'ដែនកំណត់ការបញ្ចុះតម្លៃ (Discount Limit)'}
                  </h4>
                  <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {lang === 'en' ? 'Setup limited discount' : 'កំណត់ការបញ្ចុះតម្លៃអតិបរមា'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  {/* Discount - textbox */}
                  <div className="sm:col-span-6 space-y-1">
                    <label
                      className={`text-[11px] font-bold uppercase tracking-wider ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {lang === 'en' ? 'Discount' : 'ការបញ្ចុះតម្លៃ (Discount)'}
                    </label>
                    <input
                      type="text"
                      value={formData.discountLimit}
                      onChange={(e) => setFormData({ ...formData, discountLimit: e.target.value })}
                      placeholder="e.g. 10%, 20%, $50"
                      className={`w-full rounded-xl border px-3.5 py-2 text-xs font-semibold outline-none transition ${
                        isDark
                          ? 'border-slate-700 bg-slate-950 text-white placeholder-slate-600 focus:border-amber-400'
                          : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-amber-500 shadow-xs'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* PART 3: SECURITY                                     */}
              {/* ---------------------------------------------------- */}
              <div className="space-y-4 pt-2">
                <div className="border-b pb-2 border-slate-700/50">
                  <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400">
                    {lang === 'en' ? 'Security' : 'សុវត្ថិភាព (Security)'}
                  </h4>
                  <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {lang === 'en'
                      ? 'Determine privilege and security for user to access in your system'
                      : 'កំណត់សិទ្ធិ និងសុវត្ថិភាពសម្រាប់អ្នកប្រើប្រាស់ដើម្បីចូលប្រើប្រាស់ប្រព័ន្ធ'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  {/* Login Username * - textbox */}
                  <div className="sm:col-span-6 space-y-1">
                    <label
                      className={`text-[11px] font-bold uppercase tracking-wider ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {lang === 'en' ? 'Login Username *' : 'ឈ្មោះចូលគណនី * (Login Username)'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="e.g. john.doe"
                      className={`w-full rounded-xl border px-3.5 py-2 text-xs font-mono font-bold outline-none transition ${
                        isDark
                          ? 'border-slate-700 bg-slate-950 text-cyan-300 placeholder-slate-600 focus:border-cyan-400'
                          : 'border-slate-300 bg-white text-cyan-700 placeholder-slate-400 focus:border-cyan-500 shadow-xs'
                      }`}
                    />
                  </div>

                  {/* Role * - Dropdown */}
                  <div className="sm:col-span-6 space-y-1">
                    <label
                      className={`text-[11px] font-bold uppercase tracking-wider ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {lang === 'en' ? 'Role *' : 'តួនាទី * (Role)'}
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className={`w-full rounded-xl border px-3.5 py-2 text-xs font-semibold outline-none transition cursor-pointer ${
                        isDark
                          ? 'border-slate-700 bg-slate-950 text-white focus:border-cyan-400'
                          : 'border-slate-300 bg-white text-slate-900 focus:border-cyan-500 shadow-xs'
                      }`}
                    >
                      {rolesList.length > 0 ? (
                        rolesList.map((r) => (
                          <option key={r.id || r.code} value={r.description || r.code}>
                            {r.code ? `[${r.code}] ` : ''}{r.description}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="ADMIN">ADMIN</option>
                          <option value="MANAGER">MANAGER</option>
                          <option value="CASHIER">CASHIER</option>
                          <option value="SALES">SALES</option>
                          <option value="STORE">STORE</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* Password * - textbox with button can hide and show password */}
                  <div className="sm:col-span-6 space-y-1">
                    <label
                      className={`text-[11px] font-bold uppercase tracking-wider ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {isEditing
                        ? lang === 'en'
                          ? 'Password (Leave blank to keep current)'
                          : 'ពាក្យសម្ងាត់ (ទុកទទេបើមិនចង់ប្តូរ)'
                        : lang === 'en'
                        ? 'Password *'
                        : 'ពាក្យសម្ងាត់ *'}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••••"
                        className={`w-full rounded-xl border px-3.5 py-2 pr-10 text-xs font-semibold outline-none transition ${
                          isDark
                            ? 'border-slate-700 bg-slate-950 text-white placeholder-slate-600 focus:border-cyan-400'
                            : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-cyan-500 shadow-xs'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer select-none"
                      >
                        {showPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>

                  {/* Re-Enter Password * - textbox with button can hide and show password */}
                  <div className="sm:col-span-6 space-y-1">
                    <label
                      className={`text-[11px] font-bold uppercase tracking-wider ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {isEditing
                        ? lang === 'en'
                          ? 'Re-Enter Password'
                          : 'បញ្ជាក់ពាក្យសម្ងាត់'
                        : lang === 'en'
                        ? 'Re-Enter Password *'
                        : 'បញ្ជាក់ពាក្យសម្ងាត់ *'}
                    </label>
                    <div className="relative">
                      <input
                        type={showRePassword ? 'text' : 'password'}
                        value={formData.reEnterPassword}
                        onChange={(e) => setFormData({ ...formData, reEnterPassword: e.target.value })}
                        placeholder="••••••••"
                        className={`w-full rounded-xl border px-3.5 py-2 pr-10 text-xs font-semibold outline-none transition ${
                          isDark
                            ? 'border-slate-700 bg-slate-950 text-white placeholder-slate-600 focus:border-cyan-400'
                            : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-cyan-500 shadow-xs'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowRePassword(!showRePassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer select-none"
                      >
                        {showRePassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>

                  {/* Passcode - textbox and button can hide and show password */}
                  <div className="sm:col-span-6 space-y-1">
                    <label
                      className={`text-[11px] font-bold uppercase tracking-wider ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {lang === 'en' ? 'Passcode (POS PIN)' : 'លេខកូដសម្ងាត់ (Passcode)'}
                    </label>
                    <div className="relative">
                      <input
                        type={showPasscode ? 'text' : 'password'}
                        value={formData.passcode}
                        onChange={(e) => setFormData({ ...formData, passcode: e.target.value })}
                        placeholder="e.g. 1234"
                        className={`w-full rounded-xl border px-3.5 py-2 pr-10 text-xs font-mono outline-none transition ${
                          isDark
                            ? 'border-slate-700 bg-slate-950 text-white placeholder-slate-600 focus:border-cyan-400'
                            : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-cyan-500 shadow-xs'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasscode(!showPasscode)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer select-none"
                      >
                        {showPasscode ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>

                  {/* Use Additional Privilege - tickbox */}
                  <div className="sm:col-span-6 flex items-center pt-5">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={Boolean(formData.useAdditionalPrivilege)}
                        onChange={(e) =>
                          setFormData({ ...formData, useAdditionalPrivilege: e.target.checked })
                        }
                        className="h-4 w-4 rounded border-slate-700 text-cyan-500 focus:ring-cyan-400 cursor-pointer accent-cyan-500"
                      />
                      <span className="text-xs font-bold">
                        🛡️ {lang === 'en' ? 'Use Additional Privilege' : 'ប្រើប្រាស់សិទ្ធិបន្ថែម (Additional Privilege)'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div
                className={`flex items-center justify-end gap-2.5 pt-4 border-t ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition active:scale-95 cursor-pointer"
                >
                  {lang === 'en' ? 'Cancel' : 'បោះបង់'}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-5 py-2 text-xs font-black text-white shadow-lg shadow-emerald-600/25 transition active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {saving && <span className="inline-block animate-spin">⏳</span>}
                  <span>
                    {isEditing
                      ? lang === 'en'
                        ? 'Update User'
                        : 'ធ្វើបច្ចុប្បន្នភាព'
                      : lang === 'en'
                      ? 'Save User'
                      : 'រក្សាទុកអ្នកប្រើប្រាស់'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 4: DELETE CONFIRMATION DIALOG                    */}
      {/* ======================================================== */}
      {deleteConfirmOpen && userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className={`w-full max-w-md rounded-3xl border p-6 shadow-2xl space-y-4 ${
              isDark
                ? 'border-slate-700 bg-slate-900 text-white shadow-black/80'
                : 'border-slate-200 bg-white text-slate-900 shadow-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-400 text-xl font-bold">
                ⚠️
              </span>
              <div>
                <h3 className="text-base font-black tracking-tight">
                  {lang === 'en' ? 'Confirm User Deletion' : 'បញ្ជាក់ការលុបគណនី'}
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {lang === 'en'
                    ? 'This action cannot be undone.'
                    : 'សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។'}
                </p>
              </div>
            </div>

            <p className="text-xs leading-relaxed">
              {lang === 'en' ? (
                <>
                  Are you sure you want to delete user{' '}
                  <span className="font-mono font-bold text-rose-400">
                    {userToDelete.username}
                  </span>{' '}
                  ({userToDelete.fullName || userToDelete.firstName})?
                </>
              ) : (
                <>
                  តើអ្នកប្រាកដជាចង់លុបគណនី{' '}
                  <span className="font-mono font-bold text-rose-400">
                    {userToDelete.username}
                  </span>{' '}
                  ({userToDelete.fullName || userToDelete.firstName}) នេះមែនទេ?
                </>
              )}
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setDeleteConfirmOpen(false)
                  setUserToDelete(null)
                }}
                className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition active:scale-95 cursor-pointer"
              >
                {lang === 'en' ? 'Cancel' : 'បោះបង់'}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2 text-xs font-black text-white shadow-lg shadow-rose-600/25 transition active:scale-95 cursor-pointer"
              >
                {lang === 'en' ? 'Delete Permanently' : 'លុបជាអចិន្ត្រៃយ៍'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
