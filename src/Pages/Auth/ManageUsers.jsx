import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useNotifications } from '../../context/NotificationContext'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { userAPI } from '../../api/api'
import { PageLoader } from '../../components/PageLoader'
import shieldIcon from '../../assets/icon/3dicons-shield-dynamic-color.png'
import settingIcon from '../../assets/icon/3dicons-setting-dynamic-color.png'
import './ManageUsers.css'

// Role definitions with badges and explanations
export const ROLES = {
  ADMIN: {
    color: '#a855f7',
    bg: 'bg-purple-500/15',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
    ring: 'ring-purple-400/40',
    label: { en: 'ADMIN', kh: 'អ្នកគ្រប់គ្រង' },
    desc: {
      en: 'Full access — can manage settings, catalog, users, financial books and system configuration',
      kh: 'សិទ្ធិពេញលេញ — អាចគ្រប់គ្រងការកំណត់ ស្តុកទំនិញ អ្នកប្រើប្រាស់ សៀវភៅហិរញ្ញវត្ថុ និងប្រព័ន្ធទាំងមូល',
    },
  },
  STORE: {
    color: '#10b981',
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    ring: 'ring-emerald-400/40',
    label: { en: 'STORE', kh: 'បុគ្គលិកហាង' },
    desc: {
      en: 'Store Operations — manages products, inventory receiving, promotions and partner relations',
      kh: 'ប្រតិបត្តិការហាង — គ្រប់គ្រងផលិតផល ការទទួលស្តុក ការផ្សព្វផ្សាយ និងដៃគូអាជីវកម្ម',
    },
  },
  USER: {
    color: '#64748b',
    bg: 'bg-slate-500/15',
    text: 'text-slate-400',
    border: 'border-slate-500/30',
    ring: 'ring-slate-400/40',
    label: { en: 'USER', kh: 'អតិថិជន' },
    desc: {
      en: 'Regular customer account — browse products, create carts, and track delivery orders',
      kh: 'គណនីធម្មតា — មើលទំនិញ បញ្ជាទិញ និងតាមដានការដឹកជញ្ជូន',
    },
  },
}

export const normalizeRole = (role) => {
  if (!role) return 'USER'
  const r = String(role).replace(/^ROLE_/, '').toUpperCase()
  if (r === 'SUPERADMIN' || r === 'ADMIN') return 'ADMIN'
  if (r === 'STORE' || r === 'MANAGER') return 'STORE'
  return 'USER'
}

const TEXTS = {
  back: { en: 'Setting', kh: 'ការកំណត់' },
  backToSettings: { en: 'Back to Settings', kh: 'ត្រឡប់ទៅការកំណត់' },
  dashboard: { en: 'Dashboard', kh: 'ផ្ទាំងគ្រប់គ្រង' },
  heroEy: { en: 'Team & Access Control', kh: 'ក្រុម និងការគ្រប់គ្រងសិទ្ធិ' },
  title: { en: 'Manage Users', kh: 'គ្រប់គ្រងអ្នកប្រើប្រាស់' },
  subtitle: {
    en: 'Manage staff accounts, assign operational roles, and safeguard security across your stores.',
    kh: 'គ្រប់គ្រងគណនីបុគ្គលិក កំណត់សិទ្ធិប្រតិបត្តិការ និងការពារសុវត្ថិភាពទិន្នន័យហាង។',
  },
  addUser: { en: 'Add User', kh: 'បន្ថែមអ្នកប្រើប្រាស់' },
  editUser: { en: 'Edit User', kh: 'កែប្រែអ្នកប្រើប្រាស់' },
  viewUser: { en: 'Account Profile', kh: 'ព័ត៌មានលម្អិតគណនី' },
  viewUserSub: { en: 'Full account credentials and role assignments', kh: 'ព័ត៌មានគណនី និងកម្រិតសិទ្ធិ' },
  newUser: { en: 'Add New User', kh: 'បន្ថែមអ្នកប្រើប្រាស់ថ្មី' },
  saveChanges: { en: 'Save Changes', kh: 'រក្សាទុកការផ្លាស់ប្តូរ' },
  thUser: { en: 'User', kh: 'អ្នកប្រើប្រាស់' },
  thContact: { en: 'Contact Info', kh: 'ទំនាក់ទំនង' },
  thRole: { en: 'Role', kh: 'តួនាទី' },
  thStatus: { en: 'Status', kh: 'ស្ថានភាព' },
  thProvider: { en: 'Provider', kh: 'ការចូល' },
  thJoined: { en: 'Joined', kh: 'កាលបរិច្ឆេទ' },
  thActions: { en: 'Actions', kh: 'សកម្មភាព' },
  fullName: { en: 'Full Name', kh: 'ឈ្មោះពេញ' },
  namePlaceholder: { en: 'e.g. Sokheng Dev', kh: 'ឧ. សុខហេង' },
  username: { en: 'Username', kh: 'ឈ្មោះអ្នកប្រើ' },
  usernamePlaceholder: { en: 'e.g. sokheng429', kh: 'ឧ. sokheng429' },
  usernameReadOnly: { en: 'Username is permanent and cannot be changed', kh: 'ឈ្មោះអ្នកប្រើមិនអាចផ្លាស់ប្តូរបានទេ' },
  email: { en: 'Email Address', kh: 'អាសយដ្ឋានអ៊ីមែល' },
  emailPlaceholder: { en: 'e.g. user@bgroceries.com', kh: 'ឧ. user@bgroceries.com' },
  phone: { en: 'Phone Number (optional)', kh: 'លេខទូរស័ព្ទ (មិនទាមទារ)' },
  phonePlaceholder: { en: 'e.g. 012 345 678', kh: 'ឧ. 012 345 678' },
  password: { en: 'Password', kh: 'ពាក្យសម្ងាត់' },
  passwordNew: { en: 'New Password (leave blank to keep current)', kh: 'ពាក្យសម្ងាត់ថ្មី (ទុកនៅទទេបើមិនចង់ផ្លាស់ប្តូរ)' },
  passwordPlaceholder: { en: 'Min 6 characters', kh: 'យ៉ាងតិច ៦ តួអក្សរ' },
  role: { en: 'System Role', kh: 'តួនាទី' },
  enabled: { en: 'Account is Active', kh: 'គណនីសកម្ម' },
  enabledDesc: { en: 'Disabled accounts cannot sign in to the platform.', kh: 'គណនីដែលបានបិទ នឹងមិនអាចចូលប្រើប្រព័ន្ធបានទេ។' },
  legendTitle: { en: 'Role Permissions', kh: 'កម្រិតសិទ្ធិតាមតួនាទី' },
  tableTitle: { en: 'Registered Users', kh: 'អ្នកប្រើប្រាស់ដែលបានចុះឈ្មោះ' },
  totalUsers: { en: 'Total Users', kh: 'អ្នកប្រើប្រាស់សរុប' },
  admins: { en: 'Admins', kh: 'អ្នកគ្រប់គ្រង' },
  storeStaff: { en: 'Store Staff', kh: 'បុគ្គលិកហាង' },
  active: { en: 'Active', kh: 'សកម្ម' },
  disabled: { en: 'Disabled', kh: 'បិទ' },
  all: { en: 'All', kh: 'ទាំងអស់' },
  filterByRole: { en: 'Role', kh: 'តួនាទី' },
  filterByStatus: { en: 'Status', kh: 'ស្ថានភាព' },
  providerPassword: { en: 'Password', kh: 'ពាក្យសម្ងាត់' },
  fieldId: { en: 'ID', kh: 'លេខសម្គាល់' },
  fieldFullName: { en: 'Full Name', kh: 'ឈ្មោះពេញ' },
  fieldUsername: { en: 'Username', kh: 'ឈ្មោះអ្នកប្រើ' },
  fieldEmail: { en: 'Email', kh: 'អ៊ីមែល' },
  fieldPhone: { en: 'Phone Number', kh: 'លេខទូរស័ព្ទ' },
  fieldRole: { en: 'Role', kh: 'តួនាទី' },
  fieldStatus: { en: 'Status', kh: 'ស្ថានភាព' },
  fieldProvider: { en: 'Login Provider', kh: 'ការចូល' },
  fieldJoined: { en: 'Joined Date', kh: 'កាលបរិច្ឆេទចូល' },
  fieldPassword: { en: 'Password', kh: 'ពាក្យសម្ងាត់' },
  passwordHidden: { en: '•••••••••••• (Encrypted)', kh: '•••••••••••• (បានការពារ)' },
  close: { en: 'Close', kh: 'បិទ' },
  editThis: { en: 'Edit', kh: 'កែប្រែ' },
  loading: { en: 'Loading users...', kh: 'កំពុងផ្ទុកអ្នកប្រើប្រាស់...' },
  search: { en: 'Search by name, email, username or phone...', kh: 'ស្វែងរកតាមឈ្មោះ អ៊ីមែល ឈ្មោះអ្នកប្រើ ឬទូរស័ព្ទ...' },
  noSearchResults: { en: 'No users match your criteria.', kh: 'មិនមានអ្នកប្រើប្រាស់ដែលត្រូវនឹងការស្វែងរកទេ។' },
  error: { en: 'Could not load users.', kh: 'មិនអាចផ្ទុកអ្នកប្រើប្រាស់បានទេ។' },
  retry: { en: 'Try again', kh: 'ព្យាយាមម្តងទៀត' },
  empty: { en: 'No users found.', kh: 'មិនមានអ្នកប្រើប្រាស់ទេ។' },
  required: { en: 'Required', kh: 'ត្រូវការ' },
  errName: { en: 'Name is required', kh: 'ត្រូវការឈ្មោះ' },
  errUsername: { en: 'Username is required', kh: 'ត្រូវការឈ្មោះអ្នកប្រើ' },
  errEmail: { en: 'Valid email is required', kh: 'ត្រូវការអ៊ីមែលត្រឹមត្រូវ' },
  errPassword: { en: 'Password is required (min 6 characters)', kh: 'ត្រូវការពាក្យសម្ងាត់ (យ៉ាងតិច ៦ តួអក្សរ)' },
  confirmDelete: { en: 'Delete this user? This cannot be undone.', kh: 'លុបអ្នកប្រើប្រាស់នេះ? មិនអាចត្រឡប់វិញបានទេ។' },
  added: { en: 'User added successfully', kh: 'បានបន្ថែមអ្នកប្រើប្រាស់' },
  updated: { en: 'User updated successfully', kh: 'បានធ្វើបច្ចុប្បន្នភាពអ្នកប្រើប្រាស់' },
  deleted: { en: 'User deleted successfully', kh: 'បានលុបអ្នកប្រើប្រាស់' },
  saving: { en: 'Saving...', kh: 'កំពុងរក្សាទុក...' },
  dash: { en: '—', kh: '—' },
  youBadge: { en: 'You', kh: 'អ្នក' },
  cannotDeleteSelf: { en: 'You cannot delete your own logged-in account.', kh: 'អ្នកមិនអាចលុបគណនីផ្ទាល់ខ្លួនរបស់អ្នកបានទេ។' },
  prev: { en: 'Previous', kh: 'មុន' },
  next: { en: 'Next', kh: 'បន្ទាប់' },
  showing: { en: 'Showing', kh: 'បង្ហាញ' },
  to: { en: 'to', kh: 'ដល់' },
  of: { en: 'of', kh: 'នៃ' },
  usersLabel: { en: 'users', kh: 'នាក់' },
}

const EMPTY_FORM = {
  fullName: '',
  username: '',
  email: '',
  phoneNumber: '',
  password: '',
  role: 'USER',
  enabled: true,
}

const PAGE_SIZE = 10

export default function ManageUsers() {
  const { lang } = useLanguage()
  const { isDark } = useTheme()
  const { user: currentUser } = useAuth()
  const { addNotification } = useNotifications()

  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL') // 'ALL' | 'ADMIN' | 'STORE' | 'USER'
  const [statusFilter, setStatusFilter] = useState('ALL') // 'ALL' | 'ACTIVE' | 'DISABLED'
  const [currentPage, setCurrentPage] = useState(1)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  // Drawer states
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [viewing, setViewing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Load users from backend
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        setLoading(true)
        setError('')
        const res = await userAPI.getAll()
        if (cancelled) return
        const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []
        setUsers(list)
      } catch (err) {
        if (!cancelled) setError(err.message || TEXTS.error[lang])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [refreshKey, lang])

  // Close drawers on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (viewing) setViewing(null)
        if (showForm) resetForm()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [viewing, showForm])

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setShowForm(false)
    setErrors({})
    setSubmitError('')
  }

  const startEdit = (targetUser) => {
    setForm({
      fullName: targetUser.fullName || '',
      username: targetUser.username || '',
      email: targetUser.email || '',
      phoneNumber: targetUser.phoneNumber || '',
      password: '',
      role: normalizeRole(targetUser.role),
      enabled: targetUser.enabled !== false,
    })
    setEditingId(targetUser.id)
    setShowForm(true)
    setErrors({})
    setSubmitError('')
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.fullName.trim()) e.fullName = TEXTS.errName[lang]
    if (!editingId && !form.username.trim()) e.username = TEXTS.errUsername[lang]
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = TEXTS.errEmail[lang]
    if (!editingId && (!form.password || form.password.length < 6)) e.password = TEXTS.errPassword[lang]
    if (editingId && form.password && form.password.length < 6) e.password = TEXTS.errPassword[lang]
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length > 0) return

    setSaving(true)
    setSubmitError('')
    setActionError('')

    try {
      // Normalize role and clean empty strings to null so PhoneUtil won't create "+855" collision
      const role = normalizeRole(form.role)
      const cleanPhone = form.phoneNumber?.trim() ? form.phoneNumber.trim() : null
      const cleanEmail = form.email?.trim() ? form.email.trim() : null

      if (editingId) {
        const updatePayload = {
          fullName: form.fullName.trim(),
          email: cleanEmail,
          phoneNumber: cleanPhone,
          role,
          enabled: Boolean(form.enabled),
        }
        if (form.password && form.password.trim()) {
          updatePayload.password = form.password.trim()
        }

        await userAPI.update(editingId, updatePayload)
        addNotification({ type: 'user', action: 'update', title: TEXTS.updated[lang], detail: form.fullName })
      } else {
        await userAPI.create({
          fullName: form.fullName.trim(),
          username: form.username.trim(),
          email: cleanEmail,
          phoneNumber: cleanPhone,
          password: form.password,
          role,
          enabled: Boolean(form.enabled),
        })
        addNotification({ type: 'user', action: 'add', title: TEXTS.added[lang], detail: form.fullName })
      }

      resetForm()
      setRefreshKey((k) => k + 1)
    } catch (err) {
      if (err?.fields && typeof err.fields === 'object') {
        setErrors(err.fields)
      }
      setSubmitError(err.message || TEXTS.error[lang])
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (targetUser) => {
    // Guard against deleting current logged-in account
    if (
      currentUser &&
      (String(currentUser.id) === String(targetUser.id) ||
        (currentUser.username && targetUser.username && currentUser.username === targetUser.username))
    ) {
      setActionError(TEXTS.cannotDeleteSelf[lang])
      return
    }

    if (!window.confirm(TEXTS.confirmDelete[lang])) return

    setActionError('')
    try {
      await userAPI.delete(targetUser.id)
      addNotification({ type: 'user', action: 'delete', title: TEXTS.deleted[lang], detail: targetUser.fullName })
      setRefreshKey((k) => k + 1)
    } catch (err) {
      // Keep table intact! Display isolated error banner and notification
      const msg = err.message || TEXTS.error[lang]
      setActionError(msg)
      addNotification({ type: 'error', action: 'delete', title: 'Delete Failed', detail: msg })
    }
  }

  // Summary counts
  const adminCount = useMemo(() => users.filter((u) => normalizeRole(u.role) === 'ADMIN').length, [users])
  const storeCount = useMemo(() => users.filter((u) => normalizeRole(u.role) === 'STORE').length, [users])
  const activeCount = useMemo(() => users.filter((u) => u.enabled !== false).length, [users])
  const disabledCount = useMemo(() => users.filter((u) => u.enabled === false).length, [users])

  // Filtering
  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    return users.filter((u) => {
      // Search text
      if (term) {
        const matchesName = String(u.fullName || '').toLowerCase().includes(term)
        const matchesEmail = String(u.email || '').toLowerCase().includes(term)
        const matchesUsername = String(u.username || '').toLowerCase().includes(term)
        const matchesPhone = String(u.phoneNumber || '').toLowerCase().includes(term)
        if (!matchesName && !matchesEmail && !matchesUsername && !matchesPhone) return false
      }

      // Role filter
      if (roleFilter !== 'ALL') {
        if (normalizeRole(u.role) !== roleFilter) return false
      }

      // Status filter
      if (statusFilter === 'ACTIVE' && u.enabled === false) return false
      if (statusFilter === 'DISABLED' && u.enabled !== false) return false

      return true
    })
  }, [users, searchTerm, roleFilter, statusFilter])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, roleFilter, statusFilter])

  // Pagination calculation
  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE) || 1
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredUsers.slice(start, start + PAGE_SIZE)
  }, [filteredUsers, currentPage])

  // Reusable theme class constants
  const inputBase = isDark
    ? 'w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-[#77BC1F] focus:ring-2 focus:ring-[#77BC1F]/20'
    : 'w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#77BC1F] focus:bg-white focus:ring-2 focus:ring-[#77BC1F]/20'

  const errorInput = 'border-red-500/80 bg-red-500/10 focus:border-red-400 focus:ring-red-500/20'

  return (
    <PageLoader loading={loading && users.length === 0} message={TEXTS.loading[lang]}>
      <div className="space-y-6 pb-12 font-['Montserrat']">
        {/* Top Header / Breadcrumb Card */}
        <section
          className={`relative overflow-hidden rounded-3xl border p-6 shadow-xl transition-all ${
            isDark
              ? 'border-emerald-500/20 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 shadow-black/30'
              : 'border-slate-200 bg-gradient-to-br from-white via-slate-50 to-emerald-50/40 shadow-slate-200/60'
          }`}
        >
          {/* Ambient Glows */}
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#77BC1F]/15 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-px w-2/3 bg-gradient-to-r from-transparent via-[#77BC1F]/40 to-transparent" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              {/* Breadcrumb Navigation */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-400">
                <Link to="/admin" className={`transition ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}>
                  {TEXTS.dashboard[lang]}
                </Link>
                <span>/</span>
                <Link to="/admin/settings" className={`transition ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}>
                  {TEXTS.back[lang]}
                </Link>
                <span>/</span>
                <span className="font-bold text-[#77BC1F]">{TEXTS.title[lang]}</span>
              </div>

              {/* Title & 3D Shield Icon */}
              <div className="flex items-center gap-4">
                <span
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl p-2.5 shadow-lg ring-1 ${
                    isDark ? 'bg-[#77BC1F]/15 ring-[#77BC1F]/30 shadow-green-500/10' : 'bg-white ring-slate-200 shadow-md'
                  }`}
                >
                  <img src={shieldIcon} alt="" className="h-9 w-9 object-contain drop-shadow-md" />
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-[#77BC1F]">{TEXTS.heroEy[lang]}</p>
                  <h1 className={`mt-0.5 text-2xl font-black tracking-tight sm:text-3xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {TEXTS.title[lang]}
                  </h1>
                </div>
              </div>

              <p className={`max-w-2xl text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {TEXTS.subtitle[lang]}
              </p>
            </div>

            {/* Quick Action Buttons & Stats */}
            <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center lg:flex-col lg:items-end">
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-4">
                <StatCard value={users.length} label={TEXTS.totalUsers[lang]} color="#3B82F6" isDark={isDark} />
                <StatCard value={adminCount} label={TEXTS.admins[lang]} color="#A855F7" isDark={isDark} />
                <StatCard value={storeCount} label={TEXTS.storeStaff[lang]} color="#10B981" isDark={isDark} />
                <StatCard value={activeCount} label={TEXTS.active[lang]} color="#77BC1F" isDark={isDark} />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setRefreshKey((k) => k + 1)}
                  disabled={loading}
                  title="Refresh users"
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border transition ${
                    isDark
                      ? 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500 hover:text-white'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:text-slate-900 shadow-xs'
                  }`}
                >
                  <RefreshIcon spinning={loading} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    resetForm()
                    setShowForm(true)
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#77BC1F] to-[#5ea113] px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-green-500/20 transition hover:-translate-y-0.5 hover:brightness-105 active:scale-98"
                >
                  <PlusIcon /> {TEXTS.addUser[lang]}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Global Action Error Banner */}
        {actionError && (
          <div className="flex items-center justify-between rounded-2xl border border-red-500/40 bg-red-500/10 px-5 py-3.5 text-sm text-red-400 shadow-sm animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">⚠️</span>
              <span className="font-semibold">{actionError}</span>
            </div>
            <button
              type="button"
              onClick={() => setActionError('')}
              className="rounded-lg p-1 text-red-400 hover:bg-red-500/20 hover:text-red-200 transition"
            >
              <XIcon />
            </button>
          </div>
        )}

        {/* Role Permissions Legend */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">{TEXTS.legendTitle[lang]}</h2>
            <Link
              to="/admin/settings"
              className={`inline-flex items-center gap-1.5 text-xs font-bold text-[#77BC1F] hover:underline`}
            >
              <img src={settingIcon} alt="" className="w-3.5 h-3.5 object-contain" />
              <span>{TEXTS.backToSettings[lang]}</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {Object.entries(ROLES).map(([roleKey, info]) => (
              <div
                key={roleKey}
                className={`rounded-2xl border p-4 transition-all ${
                  isDark ? 'border-slate-800 bg-slate-900/70' : 'border-slate-200 bg-white shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: info.color }} />
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-black ${info.bg} ${info.text}`}>
                      {info.label[lang] || roleKey}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">
                    {users.filter((u) => normalizeRole(u.role) === roleKey).length} {lang === 'en' ? 'assigned' : 'នាក់'}
                  </span>
                </div>
                <p className={`mt-2.5 text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {info.desc[lang]}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Main Users Table Section */}
        <section
          className={`overflow-hidden rounded-3xl border shadow-xl transition-all ${
            isDark ? 'border-slate-800 bg-slate-900/80 shadow-black/20' : 'border-slate-200 bg-white shadow-slate-200/50'
          }`}
        >
          {/* Table Header Controls (Search + Filters) */}
          <div
            className={`flex flex-col gap-4 border-b p-5 lg:flex-row lg:items-center lg:justify-between ${
              isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50/60'
            }`}
          >
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{TEXTS.tableTitle[lang]}</h2>
                <span className="rounded-full bg-[#77BC1F]/20 px-2.5 py-0.5 text-xs font-black text-[#77BC1F]">
                  {filteredUsers.length}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-400">
                {TEXTS.showing[lang]} {filteredUsers.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} {TEXTS.to[lang]}{' '}
                {Math.min(currentPage * PAGE_SIZE, filteredUsers.length)} {TEXTS.of[lang]} {filteredUsers.length}{' '}
                {TEXTS.usersLabel[lang]}
              </p>
            </div>

            {/* Filter Tabs & Search Box */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Role filter pills */}
              <div
                className={`flex items-center rounded-xl border p-1 text-xs font-bold ${
                  isDark ? 'border-slate-800 bg-slate-950/60 text-slate-400' : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                {['ALL', 'ADMIN', 'STORE', 'USER'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRoleFilter(r)}
                    className={`rounded-lg px-2.5 py-1 transition ${
                      roleFilter === r
                        ? isDark
                          ? 'bg-[#77BC1F] text-slate-950 font-black'
                          : 'bg-[#77BC1F] text-slate-950 font-black'
                        : 'hover:text-[#77BC1F]'
                    }`}
                  >
                    {r === 'ALL' ? TEXTS.all[lang] : r}
                  </button>
                ))}
              </div>

              {/* Status filter pills */}
              <div
                className={`flex items-center rounded-xl border p-1 text-xs font-bold ${
                  isDark ? 'border-slate-800 bg-slate-950/60 text-slate-400' : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setStatusFilter('ALL')}
                  className={`rounded-lg px-2.5 py-1 transition ${
                    statusFilter === 'ALL' ? 'bg-slate-700 text-white font-black' : 'hover:text-slate-300'
                  }`}
                >
                  {TEXTS.all[lang]}
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('ACTIVE')}
                  className={`rounded-lg px-2.5 py-1 transition ${
                    statusFilter === 'ACTIVE' ? 'bg-emerald-500 text-slate-950 font-black' : 'hover:text-emerald-400'
                  }`}
                >
                  {TEXTS.active[lang]}
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('DISABLED')}
                  className={`rounded-lg px-2.5 py-1 transition ${
                    statusFilter === 'DISABLED' ? 'bg-red-500 text-white font-black' : 'hover:text-red-400'
                  }`}
                >
                  {TEXTS.disabled[lang]}
                </button>
              </div>

              {/* Search input */}
              <div className="relative min-w-[240px] flex-1 sm:flex-none">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <SearchIcon />
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={TEXTS.search[lang]}
                  className={`w-full rounded-xl border py-2 pl-9 pr-3 text-xs outline-none transition placeholder:text-slate-400 ${
                    isDark
                      ? 'border-slate-800 bg-slate-950/70 text-white focus:border-[#77BC1F]'
                      : 'border-slate-300 bg-white text-slate-900 focus:border-[#77BC1F]'
                  }`}
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Table Content */}
          {loading && users.length === 0 ? (
            <div className="flex flex-col items-center gap-3 p-16 text-center">
              <span className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-[#77BC1F]" />
              <p className="text-sm font-semibold text-slate-400">{TEXTS.loading[lang]}</p>
            </div>
          ) : error && users.length === 0 ? (
            <div className="flex flex-col items-center gap-4 p-16 text-center">
              <span className="text-4xl">⚠️</span>
              <p className="text-sm font-semibold text-red-400">{error}</p>
              <button
                type="button"
                onClick={() => {
                  setError('')
                  setRefreshKey((k) => k + 1)
                }}
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-bold text-slate-200 hover:border-[#77BC1F] hover:text-[#77BC1F] transition"
              >
                {TEXTS.retry[lang]}
              </button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-16 text-center">
              <span className="text-5xl opacity-40">👥</span>
              <p className="mt-4 text-sm font-semibold text-slate-400">
                {searchTerm.trim() || roleFilter !== 'ALL' || statusFilter !== 'ALL'
                  ? TEXTS.noSearchResults[lang]
                  : TEXTS.empty[lang]}
              </p>
              {(searchTerm || roleFilter !== 'ALL' || statusFilter !== 'ALL') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('')
                    setRoleFilter('ALL')
                    setStatusFilter('ALL')
                  }}
                  className="mt-3 inline-flex text-xs font-bold text-[#77BC1F] hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr
                    className={`border-b text-[11px] font-black uppercase tracking-wider ${
                      isDark
                        ? 'border-slate-800 bg-slate-950/60 text-slate-400'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <th className="px-6 py-4">{TEXTS.thUser[lang]}</th>
                    <th className="px-6 py-4">{TEXTS.thContact[lang]}</th>
                    <th className="px-6 py-4">{TEXTS.thRole[lang]}</th>
                    <th className="px-6 py-4">{TEXTS.thStatus[lang]}</th>
                    <th className="px-6 py-4">{TEXTS.thProvider[lang]}</th>
                    <th className="px-6 py-4">{TEXTS.thJoined[lang]}</th>
                    <th className="px-6 py-4 text-right">{TEXTS.thActions[lang]}</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800/70' : 'divide-slate-200'}`}>
                  {paginatedUsers.map((targetUser) => {
                    const cleanRole = normalizeRole(targetUser.role)
                    const roleInfo = ROLES[cleanRole] || ROLES.USER
                    const isSelf =
                      currentUser &&
                      (String(currentUser.id) === String(targetUser.id) ||
                        (currentUser.username && targetUser.username && currentUser.username === targetUser.username))

                    return (
                      <tr
                        key={targetUser.id}
                        className={`transition-colors ${
                          isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                        }`}
                      >
                        {/* User Identity Column */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black text-slate-950 shadow-sm ring-1 ring-white/20"
                              style={{ background: roleInfo.color }}
                            >
                              {(targetUser.fullName || targetUser.username || '?').charAt(0).toUpperCase()}
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className={`truncate font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                  {targetUser.fullName || TEXTS.dash[lang]}
                                </p>
                                {isSelf && (
                                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-400">
                                    {TEXTS.youBadge[lang]}
                                  </span>
                                )}
                              </div>
                              <p className="truncate text-xs font-mono text-slate-400">@{targetUser.username || '—'}</p>
                            </div>
                          </div>
                        </td>

                        {/* Contact Info (Email & Phone) */}
                        <td className="px-6 py-4">
                          <div className="space-y-0.5 text-xs">
                            <p className={`${isDark ? 'text-slate-300' : 'text-slate-700'} truncate`}>
                              {targetUser.email || TEXTS.dash[lang]}
                            </p>
                            <p className="font-mono text-slate-400">
                              {targetUser.phoneNumber ? `📞 ${targetUser.phoneNumber}` : TEXTS.dash[lang]}
                            </p>
                          </div>
                        </td>

                        {/* Role Badge */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-black border ${roleInfo.bg} ${roleInfo.text} ${roleInfo.border}`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full" style={{ background: roleInfo.color }} />
                            {roleInfo.label[lang] || cleanRole}
                          </span>
                        </td>

                        {/* Status (Active / Disabled) */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                              targetUser.enabled === false
                                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                targetUser.enabled === false ? 'bg-red-400' : 'bg-emerald-400'
                              }`}
                            />
                            {targetUser.enabled === false ? TEXTS.disabled[lang] : TEXTS.active[lang]}
                          </span>
                        </td>

                        {/* Auth Provider */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 text-xs ${
                              isDark ? 'text-slate-400' : 'text-slate-600'
                            }`}
                          >
                            {targetUser.loginProvider && targetUser.loginProvider !== 'LOCAL' ? (
                              <span className="font-medium text-blue-400">🌐 {targetUser.loginProvider}</span>
                            ) : (
                              <span>🔑 {TEXTS.providerPassword[lang]}</span>
                            )}
                          </span>
                        </td>

                        {/* Joined Date */}
                        <td className="px-6 py-4 font-mono text-xs text-slate-400">
                          {targetUser.createdAt ? targetUser.createdAt.slice(0, 10) : TEXTS.dash[lang]}
                        </td>

                        {/* Row Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setViewing(targetUser)}
                              className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                                isDark
                                  ? 'border-slate-700/80 text-slate-400 hover:border-blue-400 hover:bg-blue-500/10 hover:text-blue-300'
                                  : 'border-slate-300 text-slate-600 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600'
                              }`}
                              title={TEXTS.viewUser[lang]}
                              aria-label={TEXTS.viewUser[lang]}
                            >
                              <EyeIcon />
                            </button>
                            <button
                              type="button"
                              onClick={() => startEdit(targetUser)}
                              className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                                isDark
                                  ? 'border-slate-700/80 text-slate-400 hover:border-[#77BC1F] hover:bg-[#77BC1F]/10 hover:text-[#77BC1F]'
                                  : 'border-slate-300 text-slate-600 hover:border-[#77BC1F] hover:bg-emerald-50 hover:text-[#77BC1F]'
                              }`}
                              title={TEXTS.editUser[lang]}
                              aria-label={TEXTS.editUser[lang]}
                            >
                              <EditIcon />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(targetUser)}
                              disabled={isSelf}
                              className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                                isSelf
                                  ? 'opacity-30 cursor-not-allowed border-slate-700 text-slate-500'
                                  : isDark
                                  ? 'border-slate-700/80 text-slate-400 hover:border-red-400 hover:bg-red-500/10 hover:text-red-300'
                                  : 'border-slate-300 text-slate-600 hover:border-red-500 hover:bg-red-50 hover:text-red-600'
                              }`}
                              title={isSelf ? TEXTS.cannotDeleteSelf[lang] : 'Delete user'}
                              aria-label="Delete user"
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Table Pagination Footer */}
          {filteredUsers.length > PAGE_SIZE && (
            <div
              className={`flex flex-col items-center justify-between gap-3 border-t px-6 py-4 sm:flex-row ${
                isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50/50'
              }`}
            >
              <p className="text-xs text-slate-400">
                {TEXTS.page[lang]} <span className="font-bold text-white">{currentPage}</span> {TEXTS.of[lang]}{' '}
                <span className="font-bold text-white">{totalPages}</span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition disabled:opacity-40 disabled:cursor-not-allowed ${
                    isDark
                      ? 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500 hover:text-white'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                  }`}
                >
                  {TEXTS.prev[lang]}
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .map((p, idx, arr) => {
                    const prevP = arr[idx - 1]
                    const showEllipsis = prevP && p - prevP > 1
                    return (
                      <span key={p} className="flex items-center gap-1">
                        {showEllipsis && <span className="px-1 text-slate-500">…</span>}
                        <button
                          type="button"
                          onClick={() => setCurrentPage(p)}
                          className={`h-7 min-w-[28px] rounded-lg px-2 text-xs font-bold transition ${
                            currentPage === p
                              ? 'bg-[#77BC1F] text-slate-950 font-black shadow-sm'
                              : isDark
                              ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          {p}
                        </button>
                      </span>
                    )
                  })}

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition disabled:opacity-40 disabled:cursor-not-allowed ${
                    isDark
                      ? 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500 hover:text-white'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                  }`}
                >
                  {TEXTS.next[lang]}
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Slide-over User Form Panel (Create / Edit) */}
        {showForm && typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-0 z-[9999] flex justify-end">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm animate-fadeIn"
              onClick={resetForm}
            />

            {/* Aside Drawer */}
            <aside
              className={`relative z-10 flex h-full w-full max-w-md flex-col border-l shadow-2xl animate-slideLeft ${
                isDark ? 'border-slate-800 bg-slate-900 shadow-black/80' : 'border-slate-200 bg-white shadow-slate-400/50'
              }`}
            >
              {/* Drawer Header (Fixed at top) */}
              <div
                className={`flex shrink-0 items-center justify-between border-b px-6 py-5 ${
                  isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50/80'
                }`}
              >
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#77BC1F]">{TEXTS.heroEy[lang]}</p>
                  <h2 className={`mt-0.5 text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {editingId ? TEXTS.editUser[lang] : TEXTS.newUser[lang]}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={resetForm}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
                    isDark
                      ? 'border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-slate-800 hover:text-white'
                      : 'border-slate-300 text-slate-600 hover:border-slate-400 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  aria-label="Close"
                >
                  <XIcon />
                </button>
              </div>

              {/* Drawer Scrollable Body */}
              <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-thin">
                {submitError && (
                  <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs font-semibold text-red-400">
                    {submitError}
                  </div>
                )}

                <form id="user-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
                  {/* Full Name */}
                  <label className="block space-y-1.5">
                    <span className="flex items-center justify-between text-xs font-bold">
                      <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>{TEXTS.fullName[lang]}</span>
                      <span className="rounded-full bg-[#77BC1F]/15 px-2 py-0.5 text-[10px] font-black uppercase text-[#77BC1F]">
                        {TEXTS.required[lang]}
                      </span>
                    </span>
                    <input
                      name="fullName"
                      type="text"
                      placeholder={TEXTS.namePlaceholder[lang]}
                      value={form.fullName}
                      onChange={handleChange}
                      className={`${inputBase} ${errors.fullName ? errorInput : ''}`}
                    />
                    {errors.fullName && <span className="block text-xs font-semibold text-red-400">{errors.fullName}</span>}
                  </label>

                  {/* Username (Locked on edit) */}
                  <label className="block space-y-1.5">
                    <span className="flex items-center justify-between text-xs font-bold">
                      <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>{TEXTS.username[lang]}</span>
                      {!editingId ? (
                        <span className="rounded-full bg-[#77BC1F]/15 px-2 py-0.5 text-[10px] font-black uppercase text-[#77BC1F]">
                          {TEXTS.required[lang]}
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-400">{TEXTS.usernameReadOnly[lang]}</span>
                      )}
                    </span>
                    <input
                      name="username"
                      type="text"
                      disabled={Boolean(editingId)}
                      placeholder={TEXTS.usernamePlaceholder[lang]}
                      value={form.username}
                      onChange={handleChange}
                      className={`${inputBase} ${editingId ? 'opacity-60 cursor-not-allowed bg-slate-900/50' : ''} ${
                        errors.username ? errorInput : ''
                      }`}
                    />
                    {errors.username && <span className="block text-xs font-semibold text-red-400">{errors.username}</span>}
                  </label>

                  {/* Email */}
                  <label className="block space-y-1.5">
                    <span className="flex items-center justify-between text-xs font-bold">
                      <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>{TEXTS.email[lang]}</span>
                      <span className="rounded-full bg-[#77BC1F]/15 px-2 py-0.5 text-[10px] font-black uppercase text-[#77BC1F]">
                        {TEXTS.required[lang]}
                      </span>
                    </span>
                    <input
                      name="email"
                      type="email"
                      placeholder={TEXTS.emailPlaceholder[lang]}
                      value={form.email}
                      onChange={handleChange}
                      className={`${inputBase} ${errors.email ? errorInput : ''}`}
                    />
                    {errors.email && <span className="block text-xs font-semibold text-red-400">{errors.email}</span>}
                  </label>

                  {/* Phone Number */}
                  <label className="block space-y-1.5">
                    <span className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {TEXTS.phone[lang]}
                    </span>
                    <input
                      name="phoneNumber"
                      type="tel"
                      placeholder={TEXTS.phonePlaceholder[lang]}
                      value={form.phoneNumber}
                      onChange={handleChange}
                      className={`${inputBase} ${errors.phoneNumber ? errorInput : ''}`}
                    />
                    {errors.phoneNumber && (
                      <span className="block text-xs font-semibold text-red-400">{errors.phoneNumber}</span>
                    )}
                  </label>

                  {/* Password */}
                  <label className="block space-y-1.5">
                    <span className="flex items-center justify-between text-xs font-bold">
                      <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>
                        {editingId ? TEXTS.passwordNew[lang] : TEXTS.password[lang]}
                      </span>
                      {!editingId && (
                        <span className="rounded-full bg-[#77BC1F]/15 px-2 py-0.5 text-[10px] font-black uppercase text-[#77BC1F]">
                          {TEXTS.required[lang]}
                        </span>
                      )}
                    </span>
                    <input
                      name="password"
                      type="password"
                      placeholder={TEXTS.passwordPlaceholder[lang]}
                      value={form.password}
                      onChange={handleChange}
                      className={`${inputBase} ${errors.password ? errorInput : ''}`}
                    />
                    {errors.password && <span className="block text-xs font-semibold text-red-400">{errors.password}</span>}
                  </label>

                  {/* Role Radio Selection */}
                  <div className="space-y-2 pt-2">
                    <span className="flex items-center justify-between text-xs font-bold">
                      <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>{TEXTS.role[lang]}</span>
                      <span className="rounded-full bg-[#77BC1F]/15 px-2 py-0.5 text-[10px] font-black uppercase text-[#77BC1F]">
                        {TEXTS.required[lang]}
                      </span>
                    </span>
                    <div className="space-y-2">
                      {Object.entries(ROLES).map(([rKey, info]) => {
                        const isSelected = form.role === rKey
                        return (
                          <label
                            key={rKey}
                            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                              isSelected
                                ? isDark
                                  ? 'border-[#77BC1F] bg-[#77BC1F]/10 ring-2 ring-[#77BC1F]/20'
                                  : 'border-[#77BC1F] bg-emerald-50 ring-2 ring-[#77BC1F]/20'
                                : isDark
                                ? 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                                : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="role"
                              value={rKey}
                              checked={isSelected}
                              onChange={handleChange}
                              className="mt-1 h-4 w-4 cursor-pointer accent-[#77BC1F]"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full" style={{ background: info.color }} />
                                <span className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                  {info.label[lang] || rKey}
                                </span>
                              </div>
                              <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{info.desc[lang]}</p>
                            </div>
                          </label>
                        )
                      })}
                    </div>
                  </div>

                  {/* Enabled Checkbox */}
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                      isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      name="enabled"
                      checked={form.enabled}
                      onChange={handleChange}
                      className="h-4 w-4 cursor-pointer accent-[#77BC1F]"
                    />
                    <div>
                      <span className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                        {TEXTS.enabled[lang]}
                      </span>
                      <p className="text-[10px] text-slate-400">{TEXTS.enabledDesc[lang]}</p>
                    </div>
                  </label>
                </form>
              </div>

              {/* Drawer Footer (Fixed at bottom) */}
              <div
                className={`shrink-0 border-t p-5 ${
                  isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex gap-3">
                  <button
                    type="submit"
                    form="user-form"
                    disabled={saving}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#77BC1F] to-[#5ea113] px-5 py-2.5 text-sm font-black text-slate-950 shadow-lg shadow-green-500/20 transition hover:brightness-105 active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <RefreshIcon spinning={true} />
                    ) : editingId ? (
                      <CheckIcon />
                    ) : (
                      <PlusIcon />
                    )}
                    <span>{saving ? TEXTS.saving[lang] : editingId ? TEXTS.saveChanges[lang] : TEXTS.addUser[lang]}</span>
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className={`rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
                      isDark
                        ? 'border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800 hover:text-white'
                        : 'border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {TEXTS.close[lang]}
                  </button>
                </div>
              </div>
            </aside>
          </div>,
          document.body
        )}

        {/* View User Profile Slide-over */}
        {viewing && typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-0 z-[9999] flex justify-end">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm animate-fadeIn"
              onClick={() => setViewing(null)}
            />

            {/* Aside Drawer */}
            <aside
              className={`relative z-10 flex h-full w-full max-w-md flex-col border-l shadow-2xl animate-slideLeft ${
                isDark ? 'border-slate-800 bg-slate-900 shadow-black/80' : 'border-slate-200 bg-white shadow-slate-400/50'
              }`}
            >
              <div
                className={`flex shrink-0 items-center justify-between border-b px-6 py-5 ${
                  isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50/80'
                }`}
              >
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#77BC1F]">{TEXTS.heroEy[lang]}</p>
                  <h2 className={`mt-0.5 text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {TEXTS.viewUser[lang]}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setViewing(null)}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
                    isDark
                      ? 'border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-slate-800 hover:text-white'
                      : 'border-slate-300 text-slate-600 hover:border-slate-400 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  aria-label="Close"
                >
                  <XIcon />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin space-y-6">
                {/* Profile Card Header */}
                <div
                  className={`flex items-center gap-4 rounded-2xl border p-4 ${
                    isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <span
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-black text-slate-950 shadow-md"
                    style={{ background: (ROLES[normalizeRole(viewing.role)] || ROLES.USER).color }}
                  >
                    {(viewing.fullName || viewing.username || '?').charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`truncate text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {viewing.fullName}
                      </p>
                    </div>
                    <p className="font-mono text-xs text-slate-400">@{viewing.username}</p>
                  </div>
                </div>

                {/* Data Rows */}
                <dl className={`divide-y rounded-2xl border p-4 ${isDark ? 'divide-slate-800 border-slate-800 bg-slate-950/30' : 'divide-slate-200 border-slate-200 bg-white'}`}>
                  <InfoRow label={TEXTS.fieldId[lang]} value={String(viewing.id ?? '—')} mono isDark={isDark} />
                  <InfoRow label={TEXTS.fieldFullName[lang]} value={viewing.fullName || '—'} isDark={isDark} />
                  <InfoRow label={TEXTS.fieldUsername[lang]} value={viewing.username || '—'} mono isDark={isDark} />
                  <InfoRow label={TEXTS.fieldEmail[lang]} value={viewing.email || '—'} isDark={isDark} />
                  <InfoRow label={TEXTS.fieldPhone[lang]} value={viewing.phoneNumber || '—'} mono isDark={isDark} />
                  <InfoRow
                    label={TEXTS.fieldRole[lang]}
                    value={
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-black ${
                          (ROLES[normalizeRole(viewing.role)] || ROLES.USER).bg
                        } ${(ROLES[normalizeRole(viewing.role)] || ROLES.USER).text}`}
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ background: (ROLES[normalizeRole(viewing.role)] || ROLES.USER).color }}
                        />
                        {normalizeRole(viewing.role)}
                      </span>
                    }
                    isDark={isDark}
                  />
                  <InfoRow
                    label={TEXTS.fieldStatus[lang]}
                    value={
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          viewing.enabled === false ? 'text-red-400' : 'text-emerald-400'
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${viewing.enabled === false ? 'bg-red-400' : 'bg-emerald-400'}`} />
                        {viewing.enabled === false ? TEXTS.disabled[lang] : TEXTS.active[lang]}
                      </span>
                    }
                    isDark={isDark}
                  />
                  <InfoRow
                    label={TEXTS.fieldProvider[lang]}
                    value={viewing.loginProvider || TEXTS.providerPassword[lang]}
                    isDark={isDark}
                  />
                  <InfoRow
                    label={TEXTS.fieldJoined[lang]}
                    value={viewing.createdAt ? viewing.createdAt.slice(0, 10) : '—'}
                    mono
                    isDark={isDark}
                  />
                  <InfoRow label={TEXTS.fieldPassword[lang]} value={TEXTS.passwordHidden[lang]} isDark={isDark} muted />
                </dl>
              </div>

              {/* View Drawer Footer */}
              <div
                className={`shrink-0 border-t p-5 ${
                  isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const v = viewing
                      setViewing(null)
                      startEdit(v)
                    }}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#77BC1F] to-[#5ea113] px-5 py-2.5 text-sm font-black text-slate-950 shadow-lg shadow-green-500/20 transition hover:brightness-105 active:scale-98"
                  >
                    <EditIcon /> <span>{TEXTS.editThis[lang]}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewing(null)}
                    className={`rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
                      isDark
                        ? 'border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800 hover:text-white'
                        : 'border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {TEXTS.close[lang]}
                  </button>
                </div>
              </div>
            </aside>
          </div>,
          document.body
        )}
      </div>
    </PageLoader>
  )
}

// Reusable Stat Mini Card
const StatCard = ({ value, label, color, isDark }) => (
  <div
    className={`rounded-2xl border p-3 text-center transition-all ${
      isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white shadow-xs'
    }`}
  >
    <p className="text-xl font-black" style={{ color }}>
      {value}
    </p>
    <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">{label}</p>
  </div>
)

// Reusable Info Row in Details Modal
const InfoRow = ({ label, value, mono = false, muted = false, isDark }) => (
  <div className="flex items-center justify-between gap-4 py-2.5 text-xs">
    <dt className="font-bold text-slate-400">{label}</dt>
    <dd
      className={`text-right ${mono ? 'font-mono' : 'font-semibold'} ${
        muted ? 'text-slate-500 italic' : isDark ? 'text-white' : 'text-slate-900'
      }`}
    >
      {value}
    </dd>
  </div>
)

// Icons
const RefreshIcon = ({ spinning = false }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={spinning ? 'animate-spin' : ''}
  >
    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
  </svg>
)

const PlusIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
)

const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)
