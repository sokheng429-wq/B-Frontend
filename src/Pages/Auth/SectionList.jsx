import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useNotifications } from '../../context/NotificationContext'
import { exportStyledExcel } from '../../utils/excelExport'
import starIcon from '../../assets/icon/3dicons-star-dynamic-color.png'
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

const SAMPLE_SECTIONS = [
  {
    id: 'SEC-01',
    code: 'SEC-01',
    name: 'Cashier Squad',
    department: 'Store Operations',
    supervisor: 'CashierDara Heng',
    staffCount: 38,
    status: 'ACTIVE',
  },
  {
    id: 'SEC-02',
    code: 'SEC-02',
    name: 'Butchery & Fresh Meat',
    department: 'Store Operations',
    supervisor: 'Borith Keo',
    staffCount: 14,
    status: 'ACTIVE',
  },
  {
    id: 'SEC-03',
    code: 'SEC-03',
    name: 'Bakery & Fresh Pastry',
    department: 'Store Operations',
    supervisor: 'Sreyleak Noun',
    staffCount: 12,
    status: 'ACTIVE',
  },
  {
    id: 'SEC-04',
    code: 'SEC-04',
    name: 'Fresh Fruits & Organic Produce',
    department: 'Store Operations',
    supervisor: 'Vannak Ouk',
    staffCount: 18,
    status: 'ACTIVE',
  },
  {
    id: 'SEC-05',
    code: 'SEC-05',
    name: 'Inventory Receiving & Cold Storage',
    department: 'Procurement & Supply Chain',
    supervisor: 'Vanna Touch',
    staffCount: 22,
    status: 'ACTIVE',
  },
  {
    id: 'SEC-06',
    code: 'SEC-06',
    name: 'Fleet Delivery Dispatch',
    department: 'Logistics & Fleet Transport',
    supervisor: 'Phalla Sok',
    staffCount: 24,
    status: 'ACTIVE',
  },
  {
    id: 'SEC-07',
    code: 'SEC-07',
    name: 'Accounting, AR & AP',
    department: 'Finance & Accounting',
    supervisor: 'Sophea Kim',
    staffCount: 10,
    status: 'ACTIVE',
  },
]

export default function SectionList() {
  const { lang } = useLanguage()
  const { showNotification } = useNotifications()

  const [sections, setSections] = useState(() => {
    try {
      const stored = localStorage.getItem('bg_sections')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          const ids = new Set(parsed.map((p) => p.id || p.code))
          const remain = SAMPLE_SECTIONS.filter((s) => !ids.has(s.id) && !ids.has(s.code))
          return [...parsed, ...remain]
        }
      }
    } catch {}
    return SAMPLE_SECTIONS
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('ALL')
  const [showModal, setShowModal] = useState(false)

  // Form State
  const [newCode, setNewCode] = useState(() => `SEC-0${Math.floor(Math.random() * 9) + 8}`)
  const [newName, setNewName] = useState('')
  const [newDepartment, setNewDepartment] = useState('Store Operations')
  const [newSupervisor, setNewSupervisor] = useState('CashierDara Heng')
  const [newStaffCount, setNewStaffCount] = useState(8)

  const filtered = useMemo(() => {
    return sections.filter((sec) => {
      if (departmentFilter !== 'ALL' && sec.department !== departmentFilter) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const inCode = (sec.code || '').toLowerCase().includes(q)
        const inName = (sec.name || '').toLowerCase().includes(q)
        const inDept = (sec.department || '').toLowerCase().includes(q)
        const inSup = (sec.supervisor || '').toLowerCase().includes(q)
        if (!inCode && !inName && !inDept && !inSup) return false
      }
      return true
    })
  }, [sections, searchQuery, departmentFilter])

  const handleCreateSection = (e) => {
    e.preventDefault()
    if (!newName.trim()) {
      showNotification?.({ type: 'warning', title: 'Validation', message: 'Section name is required.' })
      return
    }

    const created = {
      id: newCode,
      code: newCode,
      name: newName.trim(),
      department: newDepartment,
      supervisor: newSupervisor,
      staffCount: Number(newStaffCount) || 1,
      status: 'ACTIVE',
    }

    const updated = [created, ...sections]
    setSections(updated)
    try {
      localStorage.setItem('bg_sections', JSON.stringify(updated))
    } catch {}

    showNotification?.({
      type: 'success',
      title: 'Success',
      message: `Section ${created.name} added successfully.`,
    })

    setNewCode(`SEC-0${Math.floor(Math.random() * 9) + 8}`)
    setNewName('')
    setShowModal(false)
  }

  const handleExport = () => {
    const headers = ['Code', 'Section Name', 'Department', 'Supervisor / Leader', 'Staff Count', 'Status']
    const dataRows = filtered.map((s) => [
      s.code,
      s.name,
      s.department,
      s.supervisor,
      s.staffCount,
      s.status,
    ])
    exportStyledExcel({
      sheetName: 'Sections',
      title: "B'Groceries - Operational Work Sections",
      subtitle: `Exported on: ${new Date().toLocaleString()}`,
      headers,
      dataRows,
      fileName: `Sections_${new Date().toISOString().slice(0, 10)}.xlsx`,
    })
    showNotification?.({ type: 'success', title: 'Export', message: 'Sections list exported to Excel.' })
  }

  return (
    <div className="space-y-6 text-slate-100 font-['Montserrat']">
      {/* 1. HERO BREADCRUMB & BANNER */}
      <section className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#0b0f17] p-5 sm:p-7 shadow-2xl shadow-emerald-500/10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <Link
              to="/admin/employee"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-950/60 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300 transition hover:border-emerald-400 hover:text-white active:scale-95"
            >
              <ChevronLeftIcon /> {lang === 'en' ? 'Employee Hub' : 'មជ្ឈមណ្ឌលបុគ្គលិក'}
            </Link>

            <div className="flex items-center gap-3.5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 p-2 ring-1 ring-emerald-500/30 shadow-lg shadow-emerald-500/20">
                <img src={starIcon} alt="" className="h-9 w-9 object-contain drop-shadow-md" />
              </span>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-emerald-400">
                  {lang === 'en' ? 'Operational Squads' : 'ផ្នែកការងារ និងក្រុម'}
                </p>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {lang === 'en' ? 'Section' : 'ផ្នែក'}
                </h1>
              </div>
            </div>

            <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-300">
              {lang === 'en' ? 'View of section information' : 'មើលព័ត៌មានផ្នែក'}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-center">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-3 text-xs font-black text-slate-950 shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-500 active:scale-95 transition"
            >
              <PlusIcon />
              <span>{lang === 'en' ? 'Add Section' : 'បន្ថែមផ្នែក'}</span>
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
              const isActive = cat.key === 'section'
              return (
                <Link
                  key={cat.key}
                  to={cat.route}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/25 scale-[1.02]'
                      : 'bg-slate-950/60 text-slate-300 border border-slate-800 hover:border-emerald-400 hover:text-white hover:bg-slate-800/50'
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
              placeholder={lang === 'en' ? 'Search by section, department, leader...' : 'ស្វែងរកតាមផ្នែក, ដេប៉ាតឺម៉ង់, ប្រធានក្រុម...'}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2 pl-10 pr-4 text-xs font-semibold text-white placeholder-slate-500 outline-none focus:border-emerald-400"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="rounded-xl border border-slate-700/80 bg-slate-950 py-2 px-3 text-xs font-semibold text-white outline-none focus:border-emerald-400"
            >
              <option value="ALL">{lang === 'en' ? 'All Departments' : 'ដេប៉ាតឺម៉ង់ទាំងអស់'}</option>
              <option value="Store Operations">Store Operations</option>
              <option value="Procurement & Supply Chain">Procurement & Supply Chain</option>
              <option value="Finance & Accounting">Finance & Accounting</option>
              <option value="Logistics & Fleet Transport">Logistics & Fleet Transport</option>
            </select>

            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-black text-white hover:bg-emerald-500 active:scale-95 transition"
            >
              <DownloadIcon />
              <span>{lang === 'en' ? 'Export' : 'នាំចេញ'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-3.5 py-2 text-xs font-black text-slate-950 shadow-md shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-500 active:scale-95 transition"
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
                <th className="py-3.5 px-4">{lang === 'kh' ? 'ឈ្មោះផ្នែកការងារ' : 'Section Name'}</th>
                <th className="py-3.5 px-4">{lang === 'kh' ? 'ដេប៉ាតឺម៉ង់' : 'Department'}</th>
                <th className="py-3.5 px-4">{lang === 'kh' ? 'ប្រធានផ្នែក / ក្រុម' : 'Supervisor / Leader'}</th>
                <th className="py-3.5 px-4 text-center">{lang === 'kh' ? 'ចំនួនបុគ្គលិក' : 'Staff Count'}</th>
                <th className="py-3.5 px-4">{lang === 'kh' ? 'ស្ថានភាព' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {filtered.map((sec) => (
                <tr key={sec.id} className="transition hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-emerald-400">{sec.code}</td>
                  <td className="py-3 px-4 font-bold text-white">{sec.name}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                      {sec.department}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-cyan-300">{sec.supervisor}</td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-white">{sec.staffCount}</td>
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

      {/* 3. ADD SECTION MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">
                {lang === 'en' ? 'Add New Section' : 'បន្ថែមផ្នែកការងារថ្មី'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSection} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Section Code</label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 font-mono font-bold text-emerald-400 outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Department</label>
                  <select
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-emerald-400"
                  >
                    <option value="Store Operations">Store Operations</option>
                    <option value="Procurement & Supply Chain">Procurement & Supply Chain</option>
                    <option value="Finance & Accounting">Finance & Accounting</option>
                    <option value="Logistics & Fleet Transport">Logistics & Fleet Transport</option>
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="font-bold text-slate-300">
                    Section Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Seafood & Frozen Fish"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Supervisor / Leader</label>
                  <input
                    type="text"
                    value={newSupervisor}
                    onChange={(e) => setNewSupervisor(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Staff Count</label>
                  <input
                    type="number"
                    min="1"
                    value={newStaffCount}
                    onChange={(e) => setNewStaffCount(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-emerald-400"
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
                  className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2 text-xs font-black text-slate-950 shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-500 active:scale-95 transition"
                >
                  Save Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
