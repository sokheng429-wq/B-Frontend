import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useNotifications } from '../../context/NotificationContext'

const ROLES = {
  Admin: {
    color: '#a855f7', bg: 'bg-purple-500/15', text: 'text-purple-300', ring: 'ring-purple-400/40',
    permissions: ['Products', 'Jobs', 'Members', 'Users', 'Promotions', 'Applications'],
    desc: { en: 'Full access to everything', kh: 'សិទ្ធិពេញលេញលើប្រព័ន្ធទាំងមូល' },
  },
  Merchant: {
    color: '#f59e0b', bg: 'bg-amber-500/15', text: 'text-amber-300', ring: 'ring-amber-400/40',
    permissions: ['Products'],
    desc: { en: 'Can manage products only', kh: 'អាចគ្រប់គ្រងតែផលិតផលប៉ុណ្ណោះ' },
  },
  HR: {
    color: '#3b82f6', bg: 'bg-blue-500/15', text: 'text-blue-300', ring: 'ring-blue-400/40',
    permissions: ['Jobs', 'Members', 'Applications'],
    desc: { en: 'Can manage jobs, members, and applications', kh: 'អាចគ្រប់គ្រងការងារ សមាជិក និងពាក្យសុំ' },
  },
  Customer: {
    color: '#94a3b8', bg: 'bg-slate-500/15', text: 'text-slate-300', ring: 'ring-slate-400/40',
    permissions: [],
    desc: { en: 'Browse-only access — no admin permissions', kh: 'សិទ្ធិត្រឹមតែមើល — គ្មានសិទ្ធិគ្រប់គ្រងឡើយ' },
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
  Products: '#22c55e',
  Jobs: '#f59e0b',
  Members: '#3b82f6',
  Users: '#a855f7',
  Promotions: '#ec4899',
  Applications: '#06b6d4',
}

const TEXTS = {
  back: { en: 'Dashboard', kh: 'ផ្ទាំងគ្រប់គ្រង' },
  heroEy: { en: 'Team & access', kh: 'ក្រុម និងសិទ្ធិ' },
  title: { en: 'Manage Users', kh: 'គ្រប់គ្រងអ្នកប្រើប្រាស់' },
  subtitle: { en: 'Control who can access what. Assign roles to manage permissions across the platform.', kh: 'គ្រប់គ្រងសិទ្ធិចូលប្រើប្រាស់។ កំណត់តួនាទីដើម្បីគ្រប់គ្រងសិទ្ធិនៅលើប្រព័ន្ធ។' },
  addUser: { en: 'Add user', kh: 'បន្ថែមអ្នកប្រើប្រាស់' },
  editUser: { en: 'Edit User', kh: 'កែប្រែអ្នកប្រើប្រាស់' },
  newUser: { en: 'Add New User', kh: 'បន្ថែមអ្នកប្រើប្រាស់ថ្មី' },
  updateUser: { en: 'Save changes', kh: 'រក្សាទុកការផ្លាស់ប្តូរ' },
  thUser: { en: 'User', kh: 'អ្នកប្រើប្រាស់' },
  thRole: { en: 'Role', kh: 'តួនាទី' },
  thPerms: { en: 'Permissions', kh: 'សិទ្ធិ' },
  thJoined: { en: 'Joined', kh: 'កាលបរិច្ឆេទចូល' },
  thActions: { en: 'Actions', kh: 'សកម្មភាព' },
  fullName: { en: 'Full Name', kh: 'ឈ្មោះពេញ' },
  namePlaceholder: { en: 'e.g. Jane Smith', kh: 'ឧ. ជេន ស្មីត' },
  email: { en: 'Email', kh: 'អ៊ីមែល' },
  emailPlaceholder: { en: 'e.g. jane@groceries.com', kh: 'ឧ. jane@groceries.com' },
  role: { en: 'Role', kh: 'តួនាទី' },
  permsGranted: { en: 'Permissions granted', kh: 'សិទ្ធិដែលទទួលបាន' },
  noneBrowse: { en: 'None — browse only', kh: 'គ្មាន — ត្រឹមតែមើល' },
  errName: { en: 'Name is required', kh: 'ត្រូវការឈ្មោះ' },
  errEmail: { en: 'Valid email is required', kh: 'ត្រូវការអ៊ីមែលត្រឹមត្រូវ' },
  required: { en: 'Required', kh: 'ត្រូវការ' },
  legendTitle: { en: 'Roles at a glance', kh: 'តួនាទីសង្ខេប' },
  tableTitle: { en: 'Team members', kh: 'សមាជិកក្រុម' },
  empty: { en: 'No users yet. Add your first team member with the form.', kh: 'មិនទាន់មានអ្នកប្រើប្រាស់នៅឡើយ។ បន្ថែមសមាជិកដំបូង។' },
  totalUsers: { en: 'Total users', kh: 'អ្នកប្រើប្រាស់សរុប' },
  admins: { en: 'Admins', kh: 'អ្នកគ្រប់គ្រង' },
  merchants: { en: 'Merchants', kh: 'អ្នកលក់' },
  hr: { en: 'HR staff', kh: 'បុគ្គលិក HR' },
}

export function ManageUsers() {
  const { lang } = useLanguage()
  const { addNotification } = useNotifications()
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
    if (!form.name.trim()) e.name = TEXTS.errName[lang]
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = TEXTS.errEmail[lang]
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
      const newUser = { id: Date.now(), ...form, joined: new Date().toISOString().slice(0, 10) }
      setUsers((prev) => [...prev, newUser])
      addNotification({
        type: 'user',
        action: 'add',
        title: lang === 'en' ? 'New user added' : 'បានបន្ថែមអ្នកប្រើប្រាស់ថ្មី',
        detail: form.name,
      })
    }
    resetForm()
  }

  const deleteUser = (id) => {
    if (editingId === id) resetForm()
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }

  const adminCount = users.filter((u) => u.role === 'Admin').length
  const merchantCount = users.filter((u) => u.role === 'Merchant').length
  const hrCount = users.filter((u) => u.role === 'HR').length

  const inputBase = 'w-full rounded-xl border border-slate-700/70 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-purple-400 focus:bg-slate-950 focus:ring-4 focus:ring-purple-500/10'
  const errorInput = 'border-red-500/80 bg-red-500/10 focus:border-red-400 focus:ring-red-500/10'

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-6 shadow-2xl shadow-purple-500/10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-px w-2/3 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link to="/admin" className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-950/50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-purple-300 transition hover:border-purple-400 hover:text-purple-200">
              <ChevronLeftIcon /> {TEXTS.back[lang]}
            </Link>
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/15 text-3xl ring-1 ring-purple-400/30">👥</span>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-purple-300">{TEXTS.heroEy[lang]}</p>
                <h1 className="mt-1 text-3xl font-black tracking-tight text-white md:text-4xl">{TEXTS.title[lang]}</h1>
              </div>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">{TEXTS.subtitle[lang]}</p>
          </div>

          <div className="flex flex-col items-stretch gap-3 sm:items-end">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat value={users.length} label={TEXTS.totalUsers[lang]} />
              <Stat value={adminCount} label={TEXTS.admins[lang]} />
              <Stat value={merchantCount} label={TEXTS.merchants[lang]} />
              <Stat value={hrCount} label={TEXTS.hr[lang]} />
            </div>
            <button onClick={() => { resetForm(); setShowForm(true) }} className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-500 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-purple-500/20 transition hover:-translate-y-0.5 hover:bg-purple-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-300">
              <PlusIcon /> {TEXTS.addUser[lang]}
            </button>
          </div>
        </div>
      </section>

      {/* Role legend */}
      <section>
        <h2 className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-slate-400">{TEXTS.legendTitle[lang]}</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(ROLES).map(([name, info]) => (
            <div key={name} className={`rounded-2xl border border-slate-700/70 bg-slate-900/80 p-4 ring-1 ring-transparent transition hover:${info.ring}`}>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ background: info.color }} />
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-black ${info.bg} ${info.text}`}>{name}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{info.desc[lang]}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {info.permissions.length > 0 ? info.permissions.map((p) => (
                  <span key={p} className="rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-white" style={{ background: PERM_COLORS[p] || '#64748b' }}>{p}</span>
                )) : <span className="text-xs italic text-slate-500">{TEXTS.noneBrowse[lang]}</span>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* User table */}
      <section className="overflow-hidden rounded-3xl border border-slate-700/60 bg-slate-900/80 shadow-xl shadow-black/20">
        <div className="flex items-center justify-between border-b border-slate-700/60 px-6 py-5">
          <div>
            <h2 className="text-lg font-black text-white">{TEXTS.tableTitle[lang]}</h2>
            <p className="mt-0.5 text-sm text-slate-400">{users.length} {lang === 'en' ? 'people on the team' : 'នាក់ក្នុងក្រុម'}</p>
          </div>
          <span className="flex h-9 min-w-9 items-center justify-center rounded-full bg-purple-500 px-3 text-sm font-black text-slate-950">{users.length}</span>
        </div>

        {users.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-5xl">👥</span>
            <p className="mt-4 text-sm leading-6 text-slate-400">{TEXTS.empty[lang]}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-700/60 bg-slate-950/50 text-xs font-black uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">{TEXTS.thUser[lang]}</th>
                  <th className="px-6 py-4">{TEXTS.thRole[lang]}</th>
                  <th className="px-6 py-4">{TEXTS.thPerms[lang]}</th>
                  <th className="px-6 py-4">{TEXTS.thJoined[lang]}</th>
                  <th className="px-6 py-4 text-right">{TEXTS.thActions[lang]}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map((user) => {
                  const roleInfo = ROLES[user.role]
                  return (
                    <tr key={user.id} className="transition hover:bg-slate-950/40">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-black text-slate-950" style={{ background: roleInfo.color }}>{user.name.charAt(0)}</span>
                          <div>
                            <p className="font-bold text-white">{user.name}</p>
                            <p className="text-xs text-slate-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-black ${roleInfo.bg} ${roleInfo.text}`}>
                          <span className="h-2 w-2 rounded-full" style={{ background: roleInfo.color }} />
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {roleInfo.permissions.length > 0 ? roleInfo.permissions.map((p) => (
                            <span key={p} className="rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wide" style={{ background: (PERM_COLORS[p] || '#64748b') + '22', color: PERM_COLORS[p] || '#94a3b8' }}>{p}</span>
                          )) : <span className="text-xs italic text-slate-500">—</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">{user.joined}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => startEdit(user)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 text-slate-400 transition hover:border-blue-400 hover:bg-blue-500/10 hover:text-blue-300" aria-label="Edit">
                            <EditIcon />
                          </button>
                          <button onClick={() => deleteUser(user.id)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 text-slate-400 transition hover:border-red-400 hover:bg-red-500/10 hover:text-red-300" aria-label="Delete">
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
      </section>

      {/* Slide-over form panel */}
      {showForm && <div className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm" onClick={resetForm} />}
      <aside className={`fixed inset-y-0 right-0 z-50 w-full max-w-md transform border-l border-slate-700 bg-slate-900 shadow-2xl shadow-black/50 transition-transform duration-300 ${showForm ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between border-b border-slate-700/70 bg-slate-950/40 px-6 py-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-purple-300">{TEXTS.heroEy[lang]}</p>
            <h2 className="mt-1 text-xl font-black text-white">{editingId ? TEXTS.editUser[lang] : TEXTS.newUser[lang]}</h2>
          </div>
          <button onClick={resetForm} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 text-slate-400 transition hover:border-slate-500 hover:bg-slate-800 hover:text-white">
            <XIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6" noValidate>
          <label className="block space-y-2">
            <span className="flex items-center justify-between text-sm font-bold text-slate-200">
              <span>{TEXTS.fullName[lang]}</span>
              <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-purple-300">{TEXTS.required[lang]}</span>
            </span>
            <input name="name" type="text" placeholder={TEXTS.namePlaceholder[lang]} value={form.name} onChange={handleChange} className={`${inputBase} ${errors.name ? errorInput : ''}`} />
            {errors.name && <span className="block text-xs font-semibold text-red-300">{errors.name}</span>}
          </label>

          <label className="block space-y-2">
            <span className="flex items-center justify-between text-sm font-bold text-slate-200">
              <span>{TEXTS.email[lang]}</span>
              <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-purple-300">{TEXTS.required[lang]}</span>
            </span>
            <input name="email" type="email" placeholder={TEXTS.emailPlaceholder[lang]} value={form.email} onChange={handleChange} className={`${inputBase} ${errors.email ? errorInput : ''}`} />
            {errors.email && <span className="block text-xs font-semibold text-red-300">{errors.email}</span>}
          </label>

          <div className="space-y-2">
            <span className="flex items-center justify-between text-sm font-bold text-slate-200">
              <span>{TEXTS.role[lang]}</span>
              <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-purple-300">{TEXTS.required[lang]}</span>
            </span>
            <div className="space-y-2">
              {Object.entries(ROLES).map(([role, info]) => (
                <label key={role} className={`flex cursor-pointer items-start gap-3 rounded-xl border bg-slate-950/60 p-3 transition ${form.role === role ? 'border-purple-400 bg-purple-500/10 ring-2 ring-purple-500/20' : 'border-slate-700/70 hover:border-slate-600'}`}>
                  <input type="radio" name="role" value={role} checked={form.role === role} onChange={handleChange} className="mt-1 h-4 w-4 cursor-pointer accent-purple-500" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: info.color }} />
                      <span className="font-black text-white">{role}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-400">{info.desc[lang]}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-purple-300">{TEXTS.permsGranted[lang]}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {ROLES[form.role].permissions.length > 0 ? ROLES[form.role].permissions.map((p) => (
                <span key={p} className="rounded-md px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-white" style={{ background: PERM_COLORS[p] || '#64748b' }}>{p}</span>
              )) : <span className="text-sm italic text-slate-400">{TEXTS.noneBrowse[lang]}</span>}
            </div>
          </div>

          <div className="flex gap-3 border-t border-slate-700/60 pt-5">
            <button type="submit" className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-purple-500 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-purple-500/20 transition hover:-translate-y-0.5 hover:bg-purple-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-300">
              {editingId ? <CheckIcon /> : <PlusIcon />} {editingId ? TEXTS.updateUser[lang] : TEXTS.addUser[lang]}
            </button>
            <button type="button" onClick={resetForm} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-sm font-bold text-slate-300 transition hover:border-slate-500 hover:bg-slate-800 hover:text-white">
              <XIcon />
            </button>
          </div>
        </form>
      </aside>
    </div>
  )
}

const Stat = ({ value, label }) => (
  <div className="min-w-[86px] rounded-xl bg-slate-900/70 px-4 py-3 text-center ring-1 ring-slate-700/60">
    <p className="text-2xl font-black text-white">{value}</p>
    <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</p>
  </div>
)

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