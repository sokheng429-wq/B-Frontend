import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useNotifications } from '../../context/NotificationContext'
import { exportStyledExcel } from '../../utils/excelExport'
import folderFavIcon from '../../assets/icon/3dicons-folder-fav-dynamic-color.png'
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

const SAMPLE_OFFICES = [
  {
    id: 'OFF-01',
    code: 'OFF-01',
    name: 'Headquarters Corporate Office',
    type: 'Headquarters',
    phone: '023 889 001',
    address: 'Level 12, Vattanac Tower, Monivong Blvd, Phnom Penh',
    manager: 'Badmin Super',
    staffCount: 35,
    status: 'ACTIVE',
  },
  {
    id: 'OFF-02',
    code: 'OFF-02',
    name: 'Main Store Warehouse',
    type: 'Central Warehouse',
    phone: '023 991 224',
    address: 'National Road 4, Chaom Chau, Phnom Penh',
    manager: 'Vanna Touch',
    staffCount: 68,
    status: 'ACTIVE',
  },
  {
    id: 'OFF-03',
    code: 'OFF-03',
    name: 'Express Mart BKK1',
    type: 'Retail Branch',
    phone: '012 882 110',
    address: 'Street 57, BKK1, Chamkarmon, Phnom Penh',
    manager: 'CashierDara Heng',
    staffCount: 22,
    status: 'ACTIVE',
  },
  {
    id: 'OFF-04',
    code: 'OFF-04',
    name: 'Toul Kork Branch Store',
    type: 'Retail Branch',
    phone: '015 771 992',
    address: 'Street 315, Toul Kork, Phnom Penh',
    manager: 'CashierChann Sreymom',
    staffCount: 26,
    status: 'ACTIVE',
  },
  {
    id: 'OFF-05',
    code: 'OFF-05',
    name: 'Siem Reap Cold Storage Depot',
    type: 'Regional Hub',
    phone: '063 761 882',
    address: 'Airport Road, Svay Dangkum, Siem Reap',
    manager: 'Sophea Kim',
    staffCount: 18,
    status: 'ACTIVE',
  },
]

export default function OfficeList() {
  const { lang } = useLanguage()
  const { showNotification } = useNotifications()

  const [offices, setOffices] = useState(() => {
    try {
      const stored = localStorage.getItem('bg_offices')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          const ids = new Set(parsed.map((p) => p.id || p.code))
          const remain = SAMPLE_OFFICES.filter((s) => !ids.has(s.id) && !ids.has(s.code))
          return [...parsed, ...remain]
        }
      }
    } catch {}
    return SAMPLE_OFFICES
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [showModal, setShowModal] = useState(false)

  // New Office Form State
  const [newCode, setNewCode] = useState(() => `OFF-0${Math.floor(Math.random() * 9) + 6}`)
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState('Retail Branch')
  const [newPhone, setNewPhone] = useState('')
  const [newAddress, setNewAddress] = useState('')
  const [newManager, setNewManager] = useState('Sokheng Chea')
  const [newStaffCount, setNewStaffCount] = useState(10)

  const filtered = useMemo(() => {
    return offices.filter((off) => {
      if (typeFilter !== 'ALL' && off.type !== typeFilter) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const inCode = (off.code || '').toLowerCase().includes(q)
        const inName = (off.name || '').toLowerCase().includes(q)
        const inAddr = (off.address || '').toLowerCase().includes(q)
        const inMgr = (off.manager || '').toLowerCase().includes(q)
        if (!inCode && !inName && !inAddr && !inMgr) return false
      }
      return true
    })
  }, [offices, searchQuery, typeFilter])

  const handleCreateOffice = (e) => {
    e.preventDefault()
    if (!newName.trim()) {
      showNotification?.({ type: 'warning', title: 'Validation', message: 'Office name is required.' })
      return
    }

    const created = {
      id: newCode,
      code: newCode,
      name: newName.trim(),
      type: newType,
      phone: newPhone.trim() || '023 000 000',
      address: newAddress.trim() || 'Phnom Penh, Cambodia',
      manager: newManager,
      staffCount: Number(newStaffCount) || 1,
      status: 'ACTIVE',
    }

    const updated = [created, ...offices]
    setOffices(updated)
    try {
      localStorage.setItem('bg_offices', JSON.stringify(updated))
    } catch {}

    showNotification?.({
      type: 'success',
      title: 'Success',
      message: `Office location ${created.name} added successfully.`,
    })

    setNewCode(`OFF-0${Math.floor(Math.random() * 9) + 6}`)
    setNewName('')
    setNewPhone('')
    setNewAddress('')
    setShowModal(false)
  }

  const handleExport = () => {
    const headers = ['Code', 'Office Name', 'Type', 'Phone', 'Address', 'Manager', 'Staff Count', 'Status']
    const dataRows = filtered.map((o) => [
      o.code,
      o.name,
      o.type,
      o.phone,
      o.address,
      o.manager,
      o.staffCount,
      o.status,
    ])
    exportStyledExcel({
      sheetName: 'Offices',
      title: "B'Groceries - Corporate Office Locations",
      subtitle: `Exported on: ${new Date().toLocaleString()}`,
      headers,
      dataRows,
      fileName: `Offices_${new Date().toISOString().slice(0, 10)}.xlsx`,
    })
    showNotification?.({ type: 'success', title: 'Export', message: 'Offices list exported to Excel.' })
  }

  return (
    <div className="space-y-6 text-slate-100 font-['Montserrat']">
      {/* 1. HERO BREADCRUMB & BANNER */}
      <section className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#0b0f17] p-5 sm:p-7 shadow-2xl shadow-purple-500/10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-purple-500/15 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <Link
              to="/admin/employee"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-950/60 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-purple-300 transition hover:border-purple-400 hover:text-white active:scale-95"
            >
              <ChevronLeftIcon /> {lang === 'en' ? 'Employee Hub' : 'មជ្ឈមណ្ឌលបុគ្គលិក'}
            </Link>

            <div className="flex items-center gap-3.5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-purple-500/15 p-2 ring-1 ring-purple-500/30 shadow-lg shadow-purple-500/20">
                <img src={folderFavIcon} alt="" className="h-9 w-9 object-contain drop-shadow-md" />
              </span>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-purple-400">
                  {lang === 'en' ? 'Branch & Site Directory' : 'ការិយាល័យ និងសាខា'}
                </p>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {lang === 'en' ? 'Office' : 'ការិយាល័យ'}
                </h1>
              </div>
            </div>

            <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-300">
              {lang === 'en' ? 'View of office information' : 'មើលព័ត៌មានការិយាល័យ'}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-center">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 px-5 py-3 text-xs font-black text-white shadow-lg shadow-purple-500/25 hover:from-purple-400 hover:to-indigo-500 active:scale-95 transition"
            >
              <PlusIcon />
              <span>{lang === 'en' ? 'Add Office' : 'បន្ថែមការិយាល័យ'}</span>
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
              const isActive = cat.key === 'office'
              return (
                <Link
                  key={cat.key}
                  to={cat.route}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-purple-500 text-white font-black shadow-md shadow-purple-500/25 scale-[1.02]'
                      : 'bg-slate-950/60 text-slate-300 border border-slate-800 hover:border-purple-400 hover:text-white hover:bg-slate-800/50'
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
              placeholder={lang === 'en' ? 'Search by code, name, city, manager...' : 'ស្វែងរកតាមកូដ, ឈ្មោះ, ទីតាំង...'}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2 pl-10 pr-4 text-xs font-semibold text-white placeholder-slate-500 outline-none focus:border-purple-400"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-xl border border-slate-700/80 bg-slate-950 py-2 px-3 text-xs font-semibold text-white outline-none focus:border-purple-400"
            >
              <option value="ALL">{lang === 'en' ? 'All Types' : 'ប្រភេទទាំងអស់'}</option>
              <option value="Headquarters">Headquarters</option>
              <option value="Retail Branch">Retail Branch</option>
              <option value="Central Warehouse">Central Warehouse</option>
              <option value="Regional Hub">Regional Hub</option>
            </select>

            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-black text-white hover:bg-purple-500 active:scale-95 transition"
            >
              <DownloadIcon />
              <span>{lang === 'en' ? 'Export' : 'នាំចេញ'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 px-3.5 py-2 text-xs font-black text-white shadow-md shadow-purple-500/20 hover:from-purple-400 hover:to-indigo-500 active:scale-95 transition"
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
                <th className="py-3.5 px-4">{lang === 'kh' ? 'ឈ្មោះការិយាល័យ / សាខា' : 'Office Name'}</th>
                <th className="py-3.5 px-4">{lang === 'kh' ? 'ប្រភេទ' : 'Type'}</th>
                <th className="py-3.5 px-4">{lang === 'kh' ? 'ទូរស័ព្ទ' : 'Phone'}</th>
                <th className="py-3.5 px-4">{lang === 'kh' ? 'អាសយដ្ឋាន' : 'Address / City'}</th>
                <th className="py-3.5 px-4">{lang === 'kh' ? 'អ្នកគ្រប់គ្រង' : 'Manager / In Charge'}</th>
                <th className="py-3.5 px-4 text-center">{lang === 'kh' ? 'ចំនួនបុគ្គលិក' : 'Staff Count'}</th>
                <th className="py-3.5 px-4">{lang === 'kh' ? 'ស្ថានភាព' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {filtered.map((off) => (
                <tr key={off.id} className="transition hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-purple-400">{off.code}</td>
                  <td className="py-3 px-4 font-bold text-white">{off.name}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex rounded-lg bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 text-[11px] font-semibold text-purple-300">
                      {off.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">{off.phone}</td>
                  <td className="py-3 px-4 text-slate-300 max-w-xs truncate">{off.address}</td>
                  <td className="py-3 px-4 font-medium text-amber-300">{off.manager}</td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-white">{off.staffCount}</td>
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

      {/* 3. ADD OFFICE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">
                {lang === 'en' ? 'Add New Office Location' : 'បន្ថែមការិយាល័យថ្មី'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOffice} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Office Code</label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 font-mono font-bold text-purple-400 outline-none focus:border-purple-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Office Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-purple-400"
                  >
                    <option value="Retail Branch">Retail Branch</option>
                    <option value="Headquarters">Headquarters</option>
                    <option value="Central Warehouse">Central Warehouse</option>
                    <option value="Regional Hub">Regional Hub</option>
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="font-bold text-slate-300">
                    Office / Branch Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Chbar Ampov Express Mart"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-purple-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Phone</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="e.g. 023 998 112"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-purple-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Manager in Charge</label>
                  <input
                    type="text"
                    value={newManager}
                    onChange={(e) => setNewManager(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-purple-400"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="font-bold text-slate-300">Address / City</label>
                  <input
                    type="text"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="e.g. National Road 1, Chbar Ampov, Phnom Penh"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-purple-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Initial Staff Count</label>
                  <input
                    type="number"
                    min="1"
                    value={newStaffCount}
                    onChange={(e) => setNewStaffCount(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-purple-400"
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
                  className="rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 px-5 py-2 text-xs font-black text-white shadow-lg shadow-purple-500/25 hover:from-purple-400 hover:to-indigo-500 active:scale-95 transition"
                >
                  Save Office
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
