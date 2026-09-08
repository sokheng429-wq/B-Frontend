import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useNotifications } from '../../context/NotificationContext'
import { exportStyledExcel } from '../../utils/excelExport'
import bookmarkIcon from '../../assets/icon/3dicons-bookmark-fav-dynamic-color.png'
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

const SAMPLE_DEPARTMENTS = [
  {
    id: 'DEP-01',
    code: 'DEP-01',
    name: 'Store Operations',
    head: 'Sokheng Chea',
    office: 'All Branches & Stores',
    staffCount: 84,
    status: 'ACTIVE',
  },
  {
    id: 'DEP-02',
    code: 'DEP-02',
    name: 'Procurement & Supply Chain',
    head: 'Vanna Touch',
    office: 'Main Store Warehouse',
    staffCount: 32,
    status: 'ACTIVE',
  },
  {
    id: 'DEP-03',
    code: 'DEP-03',
    name: 'Finance & Accounting',
    head: 'Sophea Kim',
    office: 'Headquarters Corporate Office',
    staffCount: 16,
    status: 'ACTIVE',
  },
  {
    id: 'DEP-04',
    code: 'DEP-04',
    name: 'Logistics & Fleet Transport',
    head: 'Phalla Sok',
    office: 'Central Warehouse & Hubs',
    staffCount: 28,
    status: 'ACTIVE',
  },
  {
    id: 'DEP-05',
    code: 'DEP-05',
    name: 'IT, Digital & POS Systems',
    head: 'Badmin Super',
    office: 'Headquarters Corporate Office',
    staffCount: 12,
    status: 'ACTIVE',
  },
  {
    id: 'DEP-06',
    code: 'DEP-06',
    name: 'Human Resources & Administration',
    head: 'Kalyan Meng',
    office: 'Headquarters Corporate Office',
    staffCount: 9,
    status: 'ACTIVE',
  },
]

export default function DepartmentList() {
  const { lang } = useLanguage()
  const { showNotification } = useNotifications()

  const [departments, setDepartments] = useState(() => {
    try {
      const stored = localStorage.getItem('bg_departments')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          const ids = new Set(parsed.map((p) => p.id || p.code))
          const remain = SAMPLE_DEPARTMENTS.filter((s) => !ids.has(s.id) && !ids.has(s.code))
          return [...parsed, ...remain]
        }
      }
    } catch {}
    return SAMPLE_DEPARTMENTS
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)

  // Form State
  const [newCode, setNewCode] = useState(() => `DEP-0${Math.floor(Math.random() * 9) + 7}`)
  const [newName, setNewName] = useState('')
  const [newHead, setNewHead] = useState('Sokheng Chea')
  const [newOffice, setNewOffice] = useState('Headquarters Corporate Office')
  const [newStaffCount, setNewStaffCount] = useState(10)

  const filtered = useMemo(() => {
    return departments.filter((d) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const inCode = (d.code || '').toLowerCase().includes(q)
        const inName = (d.name || '').toLowerCase().includes(q)
        const inHead = (d.head || '').toLowerCase().includes(q)
        const inOff = (d.office || '').toLowerCase().includes(q)
        if (!inCode && !inName && !inHead && !inOff) return false
      }
      return true
    })
  }, [departments, searchQuery])

  const handleCreateDepartment = (e) => {
    e.preventDefault()
    if (!newName.trim()) {
      showNotification?.({ type: 'warning', title: 'Validation', message: 'Department name is required.' })
      return
    }

    const created = {
      id: newCode,
      code: newCode,
      name: newName.trim(),
      head: newHead,
      office: newOffice,
      staffCount: Number(newStaffCount) || 1,
      status: 'ACTIVE',
    }

    const updated = [created, ...departments]
    setDepartments(updated)
    try {
      localStorage.setItem('bg_departments', JSON.stringify(updated))
    } catch {}

    showNotification?.({
      type: 'success',
      title: 'Success',
      message: `Department ${created.name} added successfully.`,
    })

    setNewCode(`DEP-0${Math.floor(Math.random() * 9) + 7}`)
    setNewName('')
    setShowModal(false)
  }

  const handleExport = () => {
    const headers = ['Code', 'Department Name', 'Department Head', 'Office Location', 'Staff Count', 'Status']
    const dataRows = filtered.map((d) => [
      d.code,
      d.name,
      d.head,
      d.office,
      d.staffCount,
      d.status,
    ])
    exportStyledExcel({
      sheetName: 'Departments',
      title: "B'Groceries - Enterprise Departments",
      subtitle: `Exported on: ${new Date().toLocaleString()}`,
      headers,
      dataRows,
      fileName: `Departments_${new Date().toISOString().slice(0, 10)}.xlsx`,
    })
    showNotification?.({ type: 'success', title: 'Export', message: 'Departments list exported to Excel.' })
  }

  return (
    <div className="space-y-6 text-slate-100 font-['Montserrat']">
      {/* 1. HERO BREADCRUMB & BANNER */}
      <section className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#0b0f17] p-5 sm:p-7 shadow-2xl shadow-cyan-500/10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <Link
              to="/admin/employee"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-950/60 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300 transition hover:border-cyan-400 hover:text-white active:scale-95"
            >
              <ChevronLeftIcon /> {lang === 'en' ? 'Employee Hub' : 'មជ្ឈមណ្ឌលបុគ្គលិក'}
            </Link>

            <div className="flex items-center gap-3.5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/15 p-2 ring-1 ring-cyan-500/30 shadow-lg shadow-cyan-500/20">
                <img src={bookmarkIcon} alt="" className="h-9 w-9 object-contain drop-shadow-md" />
              </span>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-cyan-400">
                  {lang === 'en' ? 'Business Units' : 'ដេប៉ាតឺម៉ង់ / ផ្នែកធំ'}
                </p>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {lang === 'en' ? 'Department' : 'ដេប៉ាតឺម៉ង់'}
                </h1>
              </div>
            </div>

            <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-300">
              {lang === 'en' ? 'View of department information' : 'មើលព័ត៌មានដេប៉ាតឺម៉ង់'}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-center">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-xs font-black text-slate-950 shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-blue-500 active:scale-95 transition"
            >
              <PlusIcon />
              <span>{lang === 'en' ? 'Add Department' : 'បន្ថែមដេប៉ាតឺម៉ង់'}</span>
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
              const isActive = cat.key === 'department'
              return (
                <Link
                  key={cat.key}
                  to={cat.route}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/25 scale-[1.02]'
                      : 'bg-slate-950/60 text-slate-300 border border-slate-800 hover:border-cyan-400 hover:text-white hover:bg-slate-800/50'
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

      {/* 2. SEARCH & TABLE */}
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
              placeholder={lang === 'en' ? 'Search by department, code, head...' : 'ស្វែងរកតាមដេប៉ាតឺម៉ង់, កូដ, ប្រធាន...'}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2 pl-10 pr-4 text-xs font-semibold text-white placeholder-slate-500 outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-600 px-3.5 py-2 text-xs font-black text-white hover:bg-cyan-500 active:scale-95 transition"
            >
              <DownloadIcon />
              <span>{lang === 'en' ? 'Export' : 'នាំចេញ'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-3.5 py-2 text-xs font-black text-slate-950 shadow-md shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 active:scale-95 transition"
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
                <th className="py-3.5 px-4">{lang === 'kh' ? 'ឈ្មោះដេប៉ាតឺម៉ង់' : 'Department Name'}</th>
                <th className="py-3.5 px-4">{lang === 'kh' ? 'ប្រធានដេប៉ាតឺម៉ង់' : 'Head of Department'}</th>
                <th className="py-3.5 px-4">{lang === 'kh' ? 'ទីតាំងការិយាល័យ' : 'Office Location'}</th>
                <th className="py-3.5 px-4 text-center">{lang === 'kh' ? 'ចំនួនបុគ្គលិកសរុប' : 'Staff Count'}</th>
                <th className="py-3.5 px-4">{lang === 'kh' ? 'ស្ថានភាព' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {filtered.map((d) => (
                <tr key={d.id} className="transition hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400">{d.code}</td>
                  <td className="py-3 px-4 font-bold text-white">{d.name}</td>
                  <td className="py-3 px-4 font-medium text-emerald-300">{d.head}</td>
                  <td className="py-3 px-4 text-slate-300">{d.office}</td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-yellow-300">{d.staffCount}</td>
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

      {/* 3. ADD DEPARTMENT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">
                {lang === 'en' ? 'Add New Department' : 'បន្ថែមដេប៉ាតឺម៉ង់ថ្មី'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDepartment} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Code</label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 font-mono font-bold text-cyan-400 outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">
                    Department Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Marketing & E-Commerce"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Department Head</label>
                  <input
                    type="text"
                    value={newHead}
                    onChange={(e) => setNewHead(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Office Location</label>
                  <select
                    value={newOffice}
                    onChange={(e) => setNewOffice(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-cyan-400"
                  >
                    <option value="Headquarters Corporate Office">Headquarters Corporate Office</option>
                    <option value="Main Store Warehouse">Main Store Warehouse</option>
                    <option value="All Branches & Stores">All Branches & Stores</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Initial Staff Count</label>
                  <input
                    type="number"
                    min="1"
                    value={newStaffCount}
                    onChange={(e) => setNewStaffCount(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-cyan-400"
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
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 text-xs font-black text-slate-950 shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-blue-500 active:scale-95 transition"
                >
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
