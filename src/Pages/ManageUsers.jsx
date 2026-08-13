import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ThemeToggle } from '../components/ThemeToggle'
import './ManageUsers.css'

const ROLES = {
  Admin: {
    color: '#4caf50', bg: '#e8f5e9',
    permissions: ['Products', 'Jobs', 'Members', 'Users', 'Promotions', 'Applications'],
    desc: 'Full access to everything',
  },
  Merchant: {
    color: '#ff9800', bg: '#fff3e0',
    permissions: ['Products'],
    desc: 'Can manage products only',
  },
  HR: {
    color: '#2196f3', bg: '#e3f2fd',
    permissions: ['Jobs', 'Members', 'Applications'],
    desc: 'Can manage jobs, members, and applications',
  },
  Customer: {
    color: '#9e9e9e', bg: '#f5f5f5',
    permissions: [],
    desc: 'Browse-only access — no admin permissions',
  },
}

const INITIAL_USERS = [
  { id: 1, name: 'John Admin', email: 'john@groceries.com', role: 'Admin', joined: '2025-01-10' },
  { id: 2, name: 'Sarah Merchant', email: 'sarah@groceries.com', role: 'Merchant', joined: '2025-03-22' },
  { id: 3, name: 'Mike HR', email: 'mike@groceries.com', role: 'HR', joined: '2025-06-15' },
  { id: 4, name: 'Lisa HR', email: 'lisa@groceries.com', role: 'HR', joined: '2025-08-01' },
  { id: 5, name: 'Tom Customer', email: 'tom@gmail.com', role: 'Customer', joined: '2025-05-10' },
]

const PERM_COLORS = {
  Products: '#4caf50',
  Jobs: '#ff9800',
  Members: '#2196f3',
  Users: '#9c27b0',
  Promotions: '#e91e63',
  Applications: '#00bcd4',
}

export function ManageUsers() {
  const [users, setUsers] = useState(INITIAL_USERS)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', role: 'Admin' })
  const [errors, setErrors] = useState({})

  const resetForm = () => {
    setForm({ name: '', email: '', role: 'Admin' })
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const startEdit = (user) => {
    setForm({ name: user.name, email: user.email, role: user.role })
    setEditingId(user.id)
    setShowForm(true)
    setErrors({})
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length > 0) return

    if (editingId) {
      setUsers((prev) => prev.map((u) => (u.id === editingId ? { ...u, ...form } : u)))
    } else {
      setUsers((prev) => [...prev, { id: Date.now(), ...form, joined: new Date().toISOString().slice(0, 10) }])
    }
    resetForm()
  }

  const deleteUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }

  return (
    <div className="mu-page">
      <div className="mu-topbar">
        <Link to="/admin" className="mu-back-link">
          <ChevronLeftIcon /> Back to Dashboard
        </Link>
        <ThemeToggle />
      </div>

      <div className="mu-content">
        <div className="mu-header">
          <div>
            <h1 className="mu-title">Manage Users</h1>
            <p className="mu-subtitle">Control who can access what. Assign roles to manage permissions across the platform.</p>
          </div>
          <button className="mu-add-btn" onClick={() => { resetForm(); setShowForm(true) }}>
            <PlusIcon /> Add User
          </button>
        </div>

        {/* Role legend */}
        <div className="mu-role-legend">
          {Object.entries(ROLES).map(([name, info]) => (
            <div className="mu-role-badge" key={name} style={{ borderColor: info.color }}>
              <span className="mu-role-dot" style={{ background: info.color }} />
              <span className="mu-role-name">{name}</span>
              <span className="mu-role-desc">{info.desc}</span>
              <div className="mu-role-perms">
                {info.permissions.length > 0 ? info.permissions.map((p) => (
                  <span key={p} className="mu-perm-tag" style={{ background: PERM_COLORS[p] || '#999' }}>{p}</span>
                )) : <span className="mu-perm-none">None — browse only</span>}
              </div>
            </div>
          ))}
        </div>

        {/* User table */}
        <div className="mu-table-card">
          <table className="mu-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Permissions</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const roleInfo = ROLES[user.role]
                return (
                  <tr key={user.id}>
                    <td>
                      <div className="mu-user-cell">
                        <span className="mu-user-avatar" style={{ background: roleInfo.color }}>{user.name.charAt(0)}</span>
                        <div>
                          <p className="mu-user-name">{user.name}</p>
                          <p className="mu-user-email">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="mu-role-tag" style={{ background: roleInfo.bg, color: roleInfo.color }}>{user.role}</span>
                    </td>
                    <td>
                      <div className="mu-perms-list">
                        {roleInfo.permissions.length > 0 ? roleInfo.permissions.map((p) => (
                          <span key={p} className="mu-perm-tag-sm" style={{ background: PERM_COLORS[p] + '22', color: PERM_COLORS[p] }}>{p}</span>
                        )) : <span className="mu-perm-none">—</span>}
                      </div>
                    </td>
                    <td className="mu-date">{user.joined}</td>
                    <td>
                      <div className="mu-actions">
                        <button className="mu-edit-btn" onClick={() => startEdit(user)}><EditIcon /></button>
                        <button className="mu-del-btn" onClick={() => deleteUser(user.id)}><TrashIcon /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Slide-over form panel */}
        {showForm && (
          <div className="mu-overlay" onClick={resetForm} />
        )}
        <div className={`mu-form-panel ${showForm ? 'mu-form-panel--open' : ''}`}>
          <div className="mu-form-panel-header">
            <h2>{editingId ? 'Edit User' : 'Add New User'}</h2>
            <button className="mu-form-close" onClick={resetForm}><XIcon /></button>
          </div>
          <form onSubmit={handleSubmit} className="mu-form" noValidate>
            <div className="mu-field">
              <label>Full Name <span className="mu-req">*</span></label>
              <input name="name" type="text" placeholder="e.g. Jane Smith" value={form.name} onChange={handleChange} className={errors.name ? 'mu-input-err' : ''} />
              {errors.name && <span className="mu-err">{errors.name}</span>}
            </div>
            <div className="mu-field">
              <label>Email <span className="mu-req">*</span></label>
              <input name="email" type="email" placeholder="e.g. jane@groceries.com" value={form.email} onChange={handleChange} className={errors.email ? 'mu-input-err' : ''} />
              {errors.email && <span className="mu-err">{errors.email}</span>}
            </div>
            <div className="mu-field">
              <label>Role <span className="mu-req">*</span></label>
              <div className="mu-role-selector">
                {Object.keys(ROLES).map((role) => (
                  <label key={role} className={`mu-role-option ${form.role === role ? 'mu-role-option--active' : ''}`} style={{ '--role-color': ROLES[role].color }}>
                    <input type="radio" name="role" value={role} checked={form.role === role} onChange={handleChange} />
                    <span className="mu-radio-label">
                      <span className="mu-role-name">{role}</span>
                      <span className="mu-role-hint">{ROLES[role].desc}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mu-form-preview">
              <span className="mu-preview-label">Permissions granted:</span>
              <div className="mu-perms-list">
                {ROLES[form.role].permissions.length > 0 ? ROLES[form.role].permissions.map((p) => (
                  <span key={p} className="mu-perm-tag" style={{ background: PERM_COLORS[p] || '#999' }}>{p}</span>
                )) : <span className="mu-perm-none">None — browse only</span>}
              </div>
            </div>
            <button type="submit" className="mu-submit-btn">
              {editingId ? <CheckIcon /> : <PlusIcon />} {editingId ? 'Update User' : 'Add User'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
)

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

export default ManageUsers
