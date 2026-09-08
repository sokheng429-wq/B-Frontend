import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useNotifications } from '../../context/NotificationContext'
import folderIcon from '../../assets/icon/3dicons-folder-dynamic-color.png'
import { CASH_BOOK_CATEGORIES } from './CashInOutList'
import './ProductsHub.css'

function SearchIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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

function XMarkIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

const INITIAL_CATEGORIES = [
  { id: 1, code: 'CC-001', nameEn: 'Operating Expense', nameKh: 'ចំណាយប្រតិបត្តិការ', type: 'CASH_OUT', active: true, descEn: 'Day-to-day operational store costs and recurring disbursements.' },
  { id: 2, code: 'CC-002', nameEn: 'Petty Cash', nameKh: 'ប្រាក់ចំណាយរាយ', type: 'BOTH', active: true, descEn: 'Cash counter till disbursements for minor sundries and urgent supplies.' },
  { id: 3, code: 'CC-003', nameEn: 'Owner Drawings', nameKh: 'ការដកប្រាក់ផ្ទាល់ខ្លួន', type: 'CASH_OUT', active: true, descEn: 'Direct proprietor disbursements and equity drawings.' },
  { id: 4, code: 'CC-004', nameEn: 'POS Sales Receipt', nameKh: 'ចំណូលលក់ប្រចាំថ្ងៃ', type: 'CASH_IN', active: true, descEn: 'Cash collected directly from customer store till sales.' },
  { id: 5, code: 'CC-005', nameEn: 'Supplier Cash Settlement', nameKh: 'ទូទាត់អ្នកផ្គត់ផ្គង់', type: 'CASH_OUT', active: true, descEn: 'Cash vouchers paid directly to local farm produce suppliers.' },
  { id: 6, code: 'CC-006', nameEn: 'Customer Advance Deposit', nameKh: 'ប្រាក់កក់អតិថិជន', type: 'CASH_IN', active: true, descEn: 'Advance cash deposits for future wholesale and bulk groceries.' },
  { id: 7, code: 'CC-007', nameEn: 'Utilities & Power', nameKh: 'ថ្លៃទឹក ភ្លើង និងអ៊ីនធឺណិត', type: 'CASH_OUT', active: true, descEn: 'Electricity, water, refrigeration cooling and telecommunications.' },
  { id: 8, code: 'CC-008', nameEn: 'Transportation & Logistics', nameKh: 'ដឹកជញ្ជូន និងដឹកទំនិញ', type: 'CASH_OUT', active: true, descEn: 'Freight charges, truck diesel allowance and port discharge tips.' },
]

export default function CashCategoryList() {
  const { lang } = useLanguage()
  const { showNotification } = useNotifications()

  const [categories, setCategories] = useState(INITIAL_CATEGORIES)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalForm, setModalForm] = useState({ id: null, code: '', nameEn: '', nameKh: '', type: 'BOTH', descEn: '', active: true })

  const filtered = useMemo(() => {
    return categories.filter((cat) => {
      if (typeFilter !== 'ALL' && cat.type !== typeFilter) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const inCode = cat.code.toLowerCase().includes(q)
        const inEn = cat.nameEn.toLowerCase().includes(q)
        const inKh = cat.nameKh.toLowerCase().includes(q)
        if (!inCode && !inEn && !inKh) return false
      }
      return true
    })
  }, [categories, searchQuery, typeFilter])

  const handleOpenCreate = () => {
    const nextNum = categories.length + 1
    const nextCode = `CC-${String(nextNum).padStart(3, '0')}`
    setModalForm({ id: null, code: nextCode, nameEn: '', nameKh: '', type: 'BOTH', descEn: '', active: true })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (cat) => {
    setModalForm({ ...cat })
    setIsModalOpen(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (!modalForm.nameEn.trim()) {
      showNotification?.({ type: 'warning', title: 'Validation', message: 'English name is required.' })
      return
    }

    if (modalForm.id) {
      setCategories((prev) => prev.map((c) => (c.id === modalForm.id ? { ...modalForm } : c)))
      showNotification?.({ type: 'success', title: 'Updated', message: 'Cash category updated successfully.' })
    } else {
      const newCat = { ...modalForm, id: Date.now() }
      setCategories((prev) => [...prev, newCat])
      showNotification?.({ type: 'success', title: 'Created', message: 'Cash category created successfully.' })
    }
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6 text-slate-100 font-['Montserrat']">
      {/* 1. HERO BREADCRUMB & BANNER */}
      <section className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#0b0f17] p-5 sm:p-7 shadow-2xl shadow-blue-500/10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <Link
              to="/admin/cash-book"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-950/60 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-blue-300 transition hover:border-blue-400 hover:text-white active:scale-95"
            >
              <ChevronLeftIcon /> {lang === 'en' ? 'Cash Book Hub' : 'សៀវភៅលុយ'}
            </Link>

            <div className="flex items-center gap-3.5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-500/15 p-2 ring-1 ring-blue-500/30 shadow-lg shadow-blue-500/20">
                <img src={folderIcon} alt="" className="h-9 w-9 object-contain drop-shadow-md" />
              </span>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-blue-400">
                  {lang === 'en' ? 'Cash Book Configuration' : 'ការកំណត់សៀវភៅលុយ'}
                </p>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {lang === 'en' ? 'Cash Categories' : 'ក្រុមលុយសាច់'}
                </h1>
              </div>
            </div>

            <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-300">
              {lang === 'en'
                ? 'Manage classification categories for cash voucher receipts, petty cash, and counter disbursements.'
                : 'គ្រប់គ្រងប្រភេទចំណាយ និងចំណូលសាច់ប្រាក់សម្រាប់ការចេញប័ណ្ណទូទាត់ប្រាក់រាយ។'}
            </p>
          </div>

          <div className="shrink-0">
            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-xs font-black text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 active:scale-95"
            >
              <PlusIcon />
              <span>{lang === 'en' ? 'Add Cash Category' : 'បន្ថែមក្រុមលុយសាច់'}</span>
            </button>
          </div>
        </div>

        {/* 8 CASH BOOK CATEGORY PILLS BAR */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            {lang === 'en' ? 'Cash Book Categories:' : 'ប្រភេទសៀវភៅលុយ៖'}
          </p>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {CASH_BOOK_CATEGORIES.map((cat) => {
              const isActive = cat.key === 'cash-category'
              return (
                <Link
                  key={cat.key}
                  to={cat.route}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-blue-500 text-slate-950 font-bold shadow-md shadow-blue-500/25 scale-[1.02]'
                      : 'bg-slate-950/60 text-slate-300 border border-slate-800 hover:border-slate-600 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span>{lang === 'kh' ? cat.labelKh : cat.labelEn}</span>
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
              placeholder={lang === 'en' ? 'Search categories by code, name...' : 'ស្វែងរកតាមលេខកូដ, ឈ្មោះ...'}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2 pl-10 pr-4 text-xs font-semibold text-white placeholder-slate-500 outline-none focus:border-blue-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-xl border border-slate-700/80 bg-slate-950 py-2 px-3 text-xs font-semibold text-white outline-none focus:border-blue-400"
            >
              <option value="ALL">{lang === 'en' ? 'All Types' : 'ប្រភេទទាំងអស់'}</option>
              <option value="CASH_IN">{lang === 'en' ? 'Cash In Only' : 'លុយចូល'}</option>
              <option value="CASH_OUT">{lang === 'en' ? 'Cash Out Only' : 'លុយចេញ'}</option>
              <option value="BOTH">{lang === 'en' ? 'Both (In/Out)' : 'ទាំងពីរ'}</option>
            </select>
          </div>
        </div>

        {/* Categories Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-slate-950/90 text-[11px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">{lang === 'kh' ? 'លេខកូដ' : 'Code'}</th>
                <th className="py-3.5 px-4">{lang === 'kh' ? 'ឈ្មោះប្រភេទ' : 'Category Name'}</th>
                <th className="py-3.5 px-4">{lang === 'kh' ? 'ភាសាខ្មែរ' : 'Khmer Name'}</th>
                <th className="py-3.5 px-4">{lang === 'kh' ? 'អនុវត្តលើ' : 'Applied To'}</th>
                <th className="py-3.5 px-4">{lang === 'kh' ? 'ស្ថានភាព' : 'Status'}</th>
                <th className="py-3.5 px-4 text-center">{lang === 'kh' ? 'សកម្មភាព' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {filtered.map((cat) => (
                <tr key={cat.id} className="transition hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-blue-400">{cat.code}</td>
                  <td className="py-3 px-4 font-semibold text-white">{cat.nameEn}</td>
                  <td className="py-3 px-4 text-slate-300">{cat.nameKh}</td>
                  <td className="py-3 px-4">
                    {cat.type === 'CASH_IN' && (
                      <span className="inline-flex rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-black text-emerald-400">
                        ▲ Cash In
                      </span>
                    )}
                    {cat.type === 'CASH_OUT' && (
                      <span className="inline-flex rounded-full bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 text-[10px] font-black text-rose-400">
                        ▼ Cash Out
                      </span>
                    )}
                    {cat.type === 'BOTH' && (
                      <span className="inline-flex rounded-full bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 text-[10px] font-black text-blue-400">
                        ● Both (In/Out)
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {cat.active ? (
                      <span className="inline-flex rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                        ● Active
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-slate-700 px-2 py-0.5 text-[10px] font-bold text-slate-400">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(cat)}
                      className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-bold text-slate-300 hover:border-blue-400 hover:text-blue-300"
                    >
                      {lang === 'en' ? 'Edit' : 'កែ'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. MODAL FOR CREATE / EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <form onSubmit={handleSave} className="relative w-full max-w-md rounded-3xl border border-slate-800 bg-[#141922] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white">
                {modalForm.id ? (lang === 'en' ? 'Edit Cash Category' : 'កែប្រែក្រុមលុយសាច់') : (lang === 'en' ? 'Create Cash Category' : 'បង្កើតក្រុមលុយសាច់')}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="h-8 w-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <XMarkIcon />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold">{lang === 'en' ? 'Category Code' : 'លេខកូដ'}</label>
                <input
                  type="text"
                  value={modalForm.code}
                  onChange={(e) => setModalForm({ ...modalForm, code: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 font-mono font-bold text-white outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold">{lang === 'en' ? 'Category Name (English)' : 'ឈ្មោះជាភាសាអង់គ្លេស'}</label>
                <input
                  type="text"
                  required
                  value={modalForm.nameEn}
                  onChange={(e) => setModalForm({ ...modalForm, nameEn: e.target.value })}
                  placeholder="e.g. Operating Expense"
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold">{lang === 'en' ? 'Category Name (Khmer)' : 'ឈ្មោះជាភាសាខ្មែរ'}</label>
                <input
                  type="text"
                  value={modalForm.nameKh}
                  onChange={(e) => setModalForm({ ...modalForm, nameKh: e.target.value })}
                  placeholder="ឧ. ចំណាយប្រតិបត្តិការ"
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold">{lang === 'en' ? 'Applied To' : 'អនុវត្តលើ'}</label>
                <select
                  value={modalForm.type}
                  onChange={(e) => setModalForm({ ...modalForm, type: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-blue-400"
                >
                  <option value="BOTH">{lang === 'en' ? 'Both (Cash In & Out)' : 'ទាំងពីរ (ចូល និងចេញ)'}</option>
                  <option value="CASH_IN">{lang === 'en' ? 'Cash In Only' : 'លុយចូលប៉ុណ្ណោះ'}</option>
                  <option value="CASH_OUT">{lang === 'en' ? 'Cash Out Only' : 'លុយចេញប៉ុណ្ណោះ'}</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold">{lang === 'en' ? 'Description' : 'ការពិពណ៌នា'}</label>
                <textarea
                  rows={2}
                  value={modalForm.descEn}
                  onChange={(e) => setModalForm({ ...modalForm, descEn: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-blue-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800"
              >
                {lang === 'en' ? 'Cancel' : 'បោះបង់'}
              </button>
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-black text-white hover:bg-blue-500 active:scale-95"
              >
                {lang === 'en' ? 'Save Category' : 'រក្សាទុក'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
