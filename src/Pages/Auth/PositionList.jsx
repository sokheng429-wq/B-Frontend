import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useNotifications } from '../../context/NotificationContext'
import { exportStyledExcel } from '../../utils/excelExport'
import crownIcon from '../../assets/icon/3dicons-crown-dynamic-color.png'
import { EMPLOYEE_MODULES } from './Employee'
import './ProductsHub.css'

function SearchIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

function DownloadIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  )
}

function PlusIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}

function ChevronLeftIcon({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const SAMPLE_POSITIONS = [
  {
    id: 'POS-01',
    code: 'POS-01',
    title: 'Store General Manager',
    department: 'Store Operations',
    level: 'Executive / Management',
    headcount: 3,
    status: 'ACTIVE',
  },
  {
    id: 'POS-02',
    code: 'POS-02',
    title: 'Supply Chain & Procurement Manager',
    department: 'Procurement & Supply Chain',
    level: 'Executive / Management',
    headcount: 2,
    status: 'ACTIVE',
  },
  {
    id: 'POS-03',
    code: 'POS-03',
    title: 'Shift Supervisor',
    department: 'Store Operations',
    level: 'Supervisory',
    headcount: 8,
    status: 'ACTIVE',
  },
  {
    id: 'POS-04',
    code: 'POS-04',
    title: 'Senior Cashier & Till Controller',
    department: 'Store Operations',
    level: 'Senior Staff',
    headcount: 12,
    status: 'ACTIVE',
  },
  {
    id: 'POS-05',
    code: 'POS-05',
    title: 'Customer Checkout Cashier',
    department: 'Store Operations',
    level: 'Operational Staff',
    headcount: 26,
    status: 'ACTIVE',
  },
  {
    id: 'POS-06',
    code: 'POS-06',
    title: 'Fresh Produce Quality Inspector',
    department: 'Store Operations',
    level: 'Operational Staff',
    headcount: 6,
    status: 'ACTIVE',
  },
  {
    id: 'POS-07',
    code: 'POS-07',
    title: 'Senior Accountant',
    department: 'Finance & Accounting',
    level: 'Senior Staff',
    headcount: 4,
    status: 'ACTIVE',
  },
  {
    id: 'POS-08',
    code: 'POS-08',
    title: 'Delivery Van Driver',
    department: 'Logistics & Fleet Transport',
    level: 'Operational Staff',
    headcount: 15,
    status: 'ACTIVE',
  },
]

export default function PositionList() {
  const { lang } = useLanguage()
  const { showNotification } = useNotifications()

  const [positions, setPositions] = useState(() => {
    try {
      const stored = localStorage.getItem('bg_positions')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          const ids = new Set(parsed.map((p) => p.id || p.code))
          const remain = SAMPLE_POSITIONS.filter((s) => !ids.has(s.id) && !ids.has(s.code))
          return [...parsed, ...remain]
        }
      }
    } catch {}
    return SAMPLE_POSITIONS
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [levelFilter, setLevelFilter] = useState('ALL')
  const [showModal, setShowModal] = useState(false)

  // Form State
  const [newCode, setNewCode] = useState(() => `POS-0${Math.floor(Math.random() * 9) + 9}`)
  const [newTitle, setNewTitle] = useState('')
  const [newDepartment, setNewDepartment] = useState('Store Operations')
  const [newLevel, setNewLevel] = useState('Operational Staff')
  const [newHeadcount, setNewHeadcount] = useState(1)

  const filtered = useMemo(() => {
    return positions.filter((pos) => {
      if (levelFilter !== 'ALL' && pos.level !== levelFilter) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const inCode = (pos.code || '').toLowerCase().includes(q)
        const inTitle = (pos.title || '').toLowerCase().includes(q)
        const inDept = (pos.department || '').toLowerCase().includes(q)
        const inLvl = (pos.level || '').toLowerCase().includes(q)
        if (!inCode && !inTitle && !inDept && !inLvl) return false
      }
      return true
    })
  }, [positions, searchQuery, levelFilter])

  const handleCreatePosition = (e) => {
    e.preventDefault()
    if (!newTitle.trim()) {
      showNotification?.({ type: 'warning', title: 'Validation', message: 'Position title is required.' })
      return
    }

    const created = {
      id: newCode,
      code: newCode,
      title: newTitle.trim(),
      department: newDepartment,
      level: newLevel,
      headcount: Number(newHeadcount) || 1,
      status: 'ACTIVE',
    }

    const updated = [created, ...positions]
    setPositions(updated)
    try {
      localStorage.setItem('bg_positions', JSON.stringify(updated))
    } catch {}

    showNotification?.({
      type: 'success',
      title: 'Success',
      message: `Position title ${created.title} added successfully.`,
    })

    setNewCode(`POS-0${Math.floor(Math.random() * 9) + 9}`)
    setNewTitle('')
    setShowModal(false)
  }

  const handleExport = () => {
    const headers = ['Code', 'Position Title', 'Department', 'Grade / Level', 'Active Headcount', 'Status']
    const dataRows = filtered.map((p) => [
      p.code,
      p.title,
      p.department,
      p.level,
      p.headcount,
      p.status,
    ])
    exportStyledExcel({
      sheetName: 'Positions',
      title: "B'Groceries - Job Positions & Hierarchy",
      subtitle: `Exported on: ${new Date().toLocaleString()}`,
      headers,
      dataRows,
      fileName: `Positions_${new Date().toISOString().slice(0, 10)}.xlsx`,
    })
    showNotification?.({ type: 'success', title: 'Export', message: 'Positions list exported to Excel.' })
  }

  return (
    <div className="space-y-6 text-slate-100 font-['Montserrat']">
      {/* 1. HERO BREADCRUMB & BANNER */}
      <section className="relative overflow-hidden rounded-3xl border border-pink-500/20 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#0b0f17] p-5 sm:p-7 shadow-2xl shadow-pink-500/10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-pink-500/15 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <Link
              to="/admin/employee"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-950/60 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-pink-300 transition hover:border-pink-400 hover:text-white active:scale-95"
            >
              <ChevronLeftIcon /> {lang === 'en' ? 'Employee Hub' : 'មជ្ឈមណ្ឌលបុគ្គលិក'}
            </Link>

            <div className="flex items-center gap-3.5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-pink-500/15 p-2 ring-1 ring-pink-500/30 shadow-lg shadow-pink-500/20">
                <img src={crownIcon} alt="" className="h-9 w-9 object-contain drop-shadow-md" />
              </span>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-pink-400">
                  {lang === 'en' ? 'Job Roles & Hierarchy' : 'មុខតំណែង និងកម្រិត'}
                </p>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {lang === 'en' ? 'Position' : 'មុខតំណែង'}
                </h1>
              </div>
            </div>

            <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-300">
              {lang === 'en' ? 'View of position information' : 'មើលព័ត៌មានមុខតំណែង'}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-center">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 px-5 py-3 text-xs font-black text-white shadow-lg shadow-pink-500/25 hover:from-pink-400 hover:to-rose-500 active:scale-95 transition"
            >
              <PlusIcon />
              <span>{lang === 'en' ? 'Add Position' : 'បន្ថែមមុខតំណែង'}</span>
            </button>
          </div>
        </div>

        {/* 5 EMPLOYEE MODULE PILLS BAR */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            {lang === 'en' ? 'Employee Modules (5):' : 'ម៉ូឌុលបុគ្គលិក (៥)៖'}
          </p>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {EMPLOYEE_MODULES.map((cat) => {
              const isActive = cat.key === 'position'
              return (
                <Link
                  key={cat.key}
                  to={cat.route}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-pink-500 text-white font-black shadow-md shadow-pink-500/25 scale-[1.02]'
                      : 'bg-slate-950/60 text-slate-300 border border-slate-800 hover:border-pink-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span>{lang === 'kh' ? cat.kh : cat.en}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* 2. SEARCH & LIST */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl shadow-black/20 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
              <SearchIcon />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'en' ? 'Search by title, code, department, level...' : 'ស្វែងរកតាមមុខតំណែង, កូដ, ដេប៉ាតឺម៉ង់...'}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2 pl-10 pr-4 text-xs font-semibold text-white placeholder-slate-500 outline-none focus:border-pink-400"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="rounded-xl border border-slate-700/80 bg-slate-950 py-2 px-3 text-xs font-semibold text-white outline-none focus:border-pink-400"
            >
              <option value="ALL">{lang === 'en' ? 'All Grades' : 'កម្រិតទាំងអស់'}</option>
              <option value="Executive / Management">Executive / Management</option>
              <option value="Supervisory">Supervisory</option>
              <option value="Senior Staff">Senior Staff</option>
              <option value="Operational Staff">Operational Staff</option>
            </select>

            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 rounded-xl bg-pink-600 px-3.5 py-2 text-xs font-black text-white hover:bg-pink-500 active:scale-95 transition"
            >
              <DownloadIcon />
              <span>{lang === 'en' ? 'Export' : 'នាំចេញ'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 px-3.5 py-2 text-xs font-black text-white shadow-md shadow-pink-500/20 hover:from-pink-400 hover:to-rose-500 active:scale-95 transition"
            >
              <PlusIcon />
              <span>{lang === 'en' ? 'Add' : 'បន្ថែម'}</span>
            </button>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-slate-950/90 text-[11px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">{lang === 'kh' ? 'កូដ' : 'Code'}</th>
                <th className="py-3.5 px-4">{lang === 'kh' ? 'មុខតំណែង' : 'Position Title'}</th>
                <th className="py-3.5 px-4">{lang === 'kh' ? 'ដេប៉ាតឺម៉ង់' : 'Department'}</th>
                <th className="py-3.5 px-4">{lang === 'kh' ? 'កម្រិត' : 'Grade / Level'}</th>
                <th className="py-3.5 px-4 text-center">{lang === 'kh' ? 'ចំនួនបុគ្គលិក' : 'Active Headcount'}</th>
                <th className="py-3.5 px-4">{lang === 'kh' ? 'ស្ថានភាព' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {filtered.map((pos) => (
                <tr key={pos.id} className="transition hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-pink-400">{pos.code}</td>
                  <td className="py-3 px-4 font-bold text-white">{pos.title}</td>
                  <td className="py-3 px-4 text-slate-300">{pos.department}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex rounded-lg bg-pink-500/15 border border-pink-500/30 px-2 py-0.5 text-[11px] font-semibold text-pink-300">
                      {pos.level}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-emerald-400">{pos.headcount}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                      ● ACTIVE
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. ADD POSITION MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">
                {lang === 'en' ? 'Add New Position' : 'បន្ថែមមុខតំណែងថ្មី'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePosition} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Position Code</label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 font-mono font-bold text-pink-400 outline-none focus:border-pink-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Grade / Level</label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-pink-400"
                  >
                    <option value="Executive / Management">Executive / Management</option>
                    <option value="Supervisory">Supervisory</option>
                    <option value="Senior Staff">Senior Staff</option>
                    <option value="Operational Staff">Operational Staff</option>
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="font-bold text-slate-300">
                    Position Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Lead Bakery Chef"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-pink-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Department</label>
                  <select
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-pink-400"
                  >
                    <option value="Store Operations">Store Operations</option>
                    <option value="Procurement & Supply Chain">Procurement & Supply Chain</option>
                    <option value="Finance & Accounting">Finance & Accounting</option>
                    <option value="Logistics & Fleet Transport">Logistics & Fleet Transport</option>
                    <option value="IT & Digital Systems">IT & Digital Systems</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Headcount</label>
                  <input
                    type="number"
                    min="1"
                    value={newHeadcount}
                    onChange={(e) => setNewHeadcount(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-pink-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 px-5 py-2 text-xs font-black text-white shadow-lg shadow-pink-500/25 hover:from-pink-400 hover:to-rose-500 active:scale-95 transition"
                >
                  Save Position
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
