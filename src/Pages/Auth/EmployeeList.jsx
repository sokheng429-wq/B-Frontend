import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useNotifications } from '../../context/NotificationContext'
import { exportStyledExcel } from '../../utils/excelExport'
import boyIcon from '../../assets/icon/3dicons-boy-dynamic-color.png'
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

const SAMPLE_EMPLOYEES = [
  {
    id: 'EMP-001',
    code: 'EMP-001',
    name: 'Sokheng Chea',
    gender: 'Male',
    phone: '012 998 877',
    email: 'sokheng.c@bgroceries.com',
    office: 'Headquarters Corporate Office',
    department: 'Operations',
    section: 'Store Operations',
    position: 'Store General Manager',
    status: 'ACTIVE',
    joinDate: '2024-01-15',
  },
  {
    id: 'EMP-002',
    code: 'EMP-002',
    name: 'Vanna Touch',
    gender: 'Male',
    phone: '011 223 344',
    email: 'vanna.touch@bgroceries.com',
    office: 'Main Store Warehouse',
    department: 'Procurement',
    section: 'Inventory & Cold Storage',
    position: 'Supply Chain Manager',
    status: 'ACTIVE',
    joinDate: '2024-02-01',
  },
  {
    id: 'EMP-003',
    code: 'EMP-003',
    name: 'CashierDara Heng',
    gender: 'Male',
    phone: '016 789 012',
    email: 'dara.h@bgroceries.com',
    office: 'Express Mart BKK1',
    department: 'Operations',
    section: 'Cashier Squad',
    position: 'Senior Cashier',
    status: 'ACTIVE',
    joinDate: '2024-06-10',
  },
  {
    id: 'EMP-004',
    code: 'EMP-004',
    name: 'CashierChann Sreymom',
    gender: 'Female',
    phone: '015 992 113',
    email: 'sreymom.c@bgroceries.com',
    office: 'Toul Kork Branch',
    department: 'Operations',
    section: 'Cashier Squad',
    position: 'Shift Cashier',
    status: 'ACTIVE',
    joinDate: '2024-07-20',
  },
  {
    id: 'EMP-005',
    code: 'EMP-005',
    name: 'Sophea Kim',
    gender: 'Female',
    phone: '070 556 677',
    email: 'sophea.kim@bgroceries.com',
    office: 'Headquarters Corporate Office',
    department: 'Finance',
    section: 'Accounting & Payroll',
    position: 'Senior Accountant',
    status: 'ACTIVE',
    joinDate: '2023-11-05',
  },
  {
    id: 'EMP-006',
    code: 'EMP-006',
    name: 'Badmin Super',
    gender: 'Male',
    phone: '098 776 554',
    email: 'admin@bgroceries.com',
    office: 'Headquarters Corporate Office',
    department: 'IT & Digital Systems',
    section: 'Infrastructure & POS',
    position: 'System Administrator',
    status: 'ACTIVE',
    joinDate: '2023-08-01',
  },
  {
    id: 'EMP-007',
    code: 'EMP-007',
    name: 'Phalla Sok',
    gender: 'Male',
    phone: '089 334 556',
    email: 'phalla.s@bgroceries.com',
    office: 'Main Store Warehouse',
    department: 'Logistics',
    section: 'Fleet Delivery Dispatch',
    position: 'Delivery Van Driver',
    status: 'ON_LEAVE',
    joinDate: '2024-03-12',
  },
]

export default function EmployeeList() {
  const { lang } = useLanguage()
  const { showNotification } = useNotifications()

  const [employees, setEmployees] = useState(() => {
    try {
      const stored = localStorage.getItem('bg_employees')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          const ids = new Set(parsed.map((p) => p.id || p.code))
          const remain = SAMPLE_EMPLOYEES.filter((s) => !ids.has(s.id) && !ids.has(s.code))
          return [...parsed, ...remain]
        }
      }
    } catch {}
    return SAMPLE_EMPLOYEES
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [showModal, setShowModal] = useState(false)

  // New Employee Form State
  const [newCode, setNewCode] = useState(() => `EMP-${String(Math.floor(Math.random() * 900) + 100)}`)
  const [newName, setNewName] = useState('')
  const [newGender, setNewGender] = useState('Male')
  const [newPhone, setNewPhone] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newOffice, setNewOffice] = useState('Main Store Warehouse')
  const [newDepartment, setNewDepartment] = useState('Operations')
  const [newSection, setNewSection] = useState('Store Operations')
  const [newPosition, setNewPosition] = useState('Associate Staff')

  const filtered = useMemo(() => {
    return employees.filter((emp) => {
      if (departmentFilter !== 'ALL' && emp.department !== departmentFilter) return false
      if (statusFilter !== 'ALL' && emp.status !== statusFilter) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const inCode = (emp.code || '').toLowerCase().includes(q)
        const inName = (emp.name || '').toLowerCase().includes(q)
        const inPhone = (emp.phone || '').toLowerCase().includes(q)
        const inPos = (emp.position || '').toLowerCase().includes(q)
        const inSec = (emp.section || '').toLowerCase().includes(q)
        if (!inCode && !inName && !inPhone && !inPos && !inSec) return false
      }
      return true
    })
  }, [employees, searchQuery, departmentFilter, statusFilter])

  const handleCreateEmployee = (e) => {
    e.preventDefault()
    if (!newName.trim()) {
      showNotification?.({ type: 'warning', title: 'Validation', message: 'Employee name is required.' })
      return
    }

    const created = {
      id: newCode,
      code: newCode,
      name: newName.trim(),
      gender: newGender,
      phone: newPhone.trim() || 'N/A',
      email: newEmail.trim() || `${newName.toLowerCase().replace(/\s+/g, '.')}@bgroceries.com`,
      office: newOffice,
      department: newDepartment,
      section: newSection,
      position: newPosition,
      status: 'ACTIVE',
      joinDate: new Date().toISOString().slice(0, 10),
    }

    const updated = [created, ...employees]
    setEmployees(updated)
    try {
      localStorage.setItem('bg_employees', JSON.stringify(updated))
    } catch {}

    showNotification?.({
      type: 'success',
      title: 'Success',
      message: `Employee ${created.name} (${created.code}) created successfully.`,
    })

    // Reset & close
    setNewCode(`EMP-${String(Math.floor(Math.random() * 900) + 100)}`)
    setNewName('')
    setNewPhone('')
    setNewEmail('')
    setShowModal(false)
  }

  const handleExport = () => {
    const headers = ['Code', 'Name', 'Gender', 'Phone', 'Email', 'Office', 'Department', 'Section', 'Position', 'Status']
    const dataRows = filtered.map((e) => [
      e.code,
      e.name,
      e.gender,
      e.phone,
      e.email,
      e.office,
      e.department,
      e.section,
      e.position,
      e.status,
    ])
    exportStyledExcel({
      sheetName: 'Employees',
      title: "B'Groceries - Employee Directory",
      subtitle: `Exported on: ${new Date().toLocaleString()}`,
      headers,
      dataRows,
      fileName: `Employees_${new Date().toISOString().slice(0, 10)}.xlsx`,
    })
    showNotification?.({ type: 'success', title: 'Export', message: 'Employee list exported to Excel.' })
  }

  return (
    <div className="space-y-6 text-slate-100 font-['Montserrat']">
      {/* 1. HERO BREADCRUMB & BANNER */}
      <section className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#0b0f17] p-5 sm:p-7 shadow-2xl shadow-blue-500/10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <Link
              to="/admin/employee"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-950/60 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-blue-300 transition hover:border-blue-400 hover:text-white active:scale-95"
            >
              <ChevronLeftIcon /> {lang === 'en' ? 'Employee Hub' : 'មជ្ឈមណ្ឌលបុគ្គលិក'}
            </Link>

            <div className="flex items-center gap-3.5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-500/15 p-2 ring-1 ring-blue-500/30 shadow-lg shadow-blue-500/20">
                <img src={boyIcon} alt="" className="h-9 w-9 object-contain drop-shadow-md" />
              </span>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-blue-400">
                  {lang === 'en' ? 'Employee Directory' : 'ព័ត៌មានបុគ្គលិក'}
                </p>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {lang === 'en' ? 'Employee' : 'និយោជក'}
                </h1>
              </div>
            </div>

            <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-300">
              {lang === 'en' ? 'View of employee information' : 'មើលព័ត៌មានបុគ្គលិក'}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-center">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-3 text-xs font-black text-white shadow-lg shadow-blue-500/25 hover:from-blue-400 hover:to-indigo-500 active:scale-95 transition"
            >
              <PlusIcon />
              <span>{lang === 'en' ? 'Add Employee' : 'បន្ថែមបុគ្គលិក'}</span>
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
              const isActive = cat.key === 'employee'
              return (
                <Link
                  key={cat.key}
                  to={cat.route}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-blue-500 text-white font-black shadow-md shadow-blue-500/25 scale-[1.02]'
                      : 'bg-slate-950/60 text-slate-300 border border-slate-800 hover:border-slate-600 hover:text-white hover:bg-slate-800/50'
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

      {/* 2. SEARCH & FILTERS */}
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
              placeholder={lang === 'en' ? 'Search by code, name, phone, position...' : 'ស្វែងរកតាមកូដ, ឈ្មោះ, ទូរស័ព្ទ...'}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2 pl-10 pr-4 text-xs font-semibold text-white placeholder-slate-500 outline-none focus:border-blue-400"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="rounded-xl border border-slate-700/80 bg-slate-950 py-2 px-3 text-xs font-semibold text-white outline-none focus:border-blue-400"
            >
              <option value="ALL">{lang === 'en' ? 'All Departments' : 'ដេប៉ាតឺម៉ង់ទាំងអស់'}</option>
              <option value="Operations">Operations</option>
              <option value="Procurement">Procurement</option>
              <option value="Finance">Finance</option>
              <option value="Logistics">Logistics</option>
              <option value="IT & Digital Systems">IT & Digital Systems</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-700/80 bg-slate-950 py-2 px-3 text-xs font-semibold text-white outline-none focus:border-blue-400"
            >
              <option value="ALL">{lang === 'en' ? 'All Status' : 'ស្ថានភាពទាំងអស់'}</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="ON_LEAVE">ON LEAVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>

            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-black text-white hover:bg-blue-500 active:scale-95 transition"
            >
              <DownloadIcon />
              <span>{lang === 'en' ? 'Export' : 'នាំចេញ'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-3.5 py-2 text-xs font-black text-white shadow-md shadow-blue-500/20 hover:from-blue-400 hover:to-indigo-500 active:scale-95 transition"
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
                <th className="py-3.5 px-4">{lang === 'kh' ? 'ឈ្មោះបុគ្គលិក' : 'Employee Name'}</th>
                <th className="py-3.5 px-4">{lang === 'kh' ? 'ភេទ' : 'Gender'}</th>
                <th className="py-3.5 px-4">{lang === 'kh' ? 'ទូរស័ព្ទ' : 'Phone'}</th>
                <th className="py-3.5 px-4">{lang === 'kh' ? 'ការិយាល័យ / សាខា' : 'Office / Branch'}</th>
                <th className="py-3.5 px-4">{lang === 'kh' ? 'ដេប៉ាតឺម៉ង់' : 'Department'}</th>
                <th className="py-3.5 px-4">{lang === 'kh' ? 'ផ្នែក' : 'Section'}</th>
                <th className="py-3.5 px-4">{lang === 'kh' ? 'មុខតំណែង' : 'Position'}</th>
                <th className="py-3.5 px-4">{lang === 'kh' ? 'ស្ថានភាព' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {filtered.map((emp) => (
                <tr key={emp.id} className="transition hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-blue-400">{emp.code}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-300">
                        {emp.name.charAt(0)}
                      </span>
                      <div>
                        <p className="font-bold text-white">{emp.name}</p>
                        <p className="text-[10px] text-slate-400">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{emp.gender}</td>
                  <td className="py-3 px-4 font-mono text-slate-300">{emp.phone}</td>
                  <td className="py-3 px-4 text-slate-300">{emp.office}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex rounded-lg bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 text-[11px] font-semibold text-indigo-300">
                      {emp.department}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{emp.section}</td>
                  <td className="py-3 px-4 font-semibold text-emerald-300">{emp.position}</td>
                  <td className="py-3 px-4">
                    {emp.status === 'ACTIVE' ? (
                      <span className="inline-flex rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                        ● ACTIVE
                      </span>
                    ) : emp.status === 'ON_LEAVE' ? (
                      <span className="inline-flex rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold text-amber-400">
                        ● ON LEAVE
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-slate-500/15 border border-slate-500/30 px-2.5 py-0.5 text-[10px] font-bold text-slate-400">
                        ● INACTIVE
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. ADD EMPLOYEE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">
                {lang === 'en' ? 'Add New Employee' : 'បន្ថែមបុគ្គលិកថ្មី'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Code</label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 font-mono font-bold text-blue-400 outline-none focus:border-blue-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">
                    Employee Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Dara Heng"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-blue-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Gender</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-blue-400"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Phone</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="e.g. 012 345 678"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-blue-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Office / Branch</label>
                  <select
                    value={newOffice}
                    onChange={(e) => setNewOffice(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-blue-400"
                  >
                    <option value="Headquarters Corporate Office">Headquarters Corporate Office</option>
                    <option value="Main Store Warehouse">Main Store Warehouse</option>
                    <option value="Express Mart BKK1">Express Mart BKK1</option>
                    <option value="Toul Kork Branch">Toul Kork Branch</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Department</label>
                  <select
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-blue-400"
                  >
                    <option value="Operations">Operations</option>
                    <option value="Procurement">Procurement</option>
                    <option value="Finance">Finance</option>
                    <option value="Logistics">Logistics</option>
                    <option value="IT & Digital Systems">IT & Digital Systems</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Section</label>
                  <input
                    type="text"
                    value={newSection}
                    onChange={(e) => setNewSection(e.target.value)}
                    placeholder="e.g. Cashier Squad"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-blue-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Position</label>
                  <input
                    type="text"
                    value={newPosition}
                    onChange={(e) => setNewPosition(e.target.value)}
                    placeholder="e.g. Senior Cashier"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-blue-400"
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
                  className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-2 text-xs font-black text-white shadow-lg shadow-blue-500/25 hover:from-blue-400 hover:to-indigo-500 active:scale-95 transition"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
