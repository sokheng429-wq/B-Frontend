import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useNotifications } from '../../context/NotificationContext'
import { exportStyledExcel } from '../../utils/excelExport'
import { adminSectionAPI } from '../../api/api'
import starIcon from '../../assets/icon/3dicons-star-dynamic-color.png'
import { EMPLOYEE_MODULES } from './Employee'
import './ProductsHub.css'

// 4 Columns for Choose Column modal & table (Code, Description, Second Language, Active)
export const ALL_COLUMNS = [
  { key: 'code', label: { en: 'Code', kh: 'លេខកូដ' }, always: true },
  { key: 'description', label: { en: 'Description', kh: 'ការពិពណ៌នា' }, always: true },
  { key: 'secondLanguage', label: { en: 'Second Language', kh: 'ភាសាទីពីរ' } },
  { key: 'active', label: { en: 'Active', kh: 'ស្ថានភាព' }, always: true },
]

export const DEFAULT_VISIBLE = [
  'code',
  'description',
  'secondLanguage',
  'active',
]

const SEED_SECTIONS = [
  {
    id: 1,
    code: 'SEC-0001',
    description: 'Cashier & Front End',
    secondLanguage: 'គិតលុយ និងផ្នែកខាងមុខ',
    active: true,
    createdAt: '2024-01-10T08:00:00',
  },
  {
    id: 2,
    code: 'SEC-0002',
    description: 'Fresh Produce & Vegetables',
    secondLanguage: 'បន្លែនិងផ្លែឈើស្រស់',
    active: true,
    createdAt: '2024-01-15T09:30:00',
  },
  {
    id: 3,
    code: 'SEC-0003',
    description: 'Meat & Butchery',
    secondLanguage: 'សាច់ស្រស់ និងកាប់សាច់',
    active: true,
    createdAt: '2024-02-01T10:00:00',
  },
  {
    id: 4,
    code: 'SEC-0004',
    description: 'Dairy & Frozen Foods',
    secondLanguage: 'ផលិតផលទឹកដោះគោ និងអាហារកក',
    active: true,
    createdAt: '2024-02-15T11:00:00',
  },
  {
    id: 5,
    code: 'SEC-0005',
    description: 'Bakery & Pastry Kitchen',
    secondLanguage: 'នំបុ័ង និងបង្អែម',
    active: true,
    createdAt: '2024-03-01T14:00:00',
  },
  {
    id: 6,
    code: 'SEC-0006',
    description: 'Stock Receiving & Inbound',
    secondLanguage: 'ទទួលទំនិញ និងទំនិញចូល',
    active: true,
    createdAt: '2024-03-10T09:00:00',
  },
  {
    id: 7,
    code: 'SEC-0007',
    description: 'Online Order Fulfillment',
    secondLanguage: 'រៀបចំការបញ្ជាទិញអនឡាញ',
    active: true,
    createdAt: '2024-03-20T10:30:00',
  },
]

export default function SectionList() {
  const { lang } = useLanguage()
  const { showNotification } = useNotifications()

  // State
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)

  // Search & Filter State
  const [searchText, setSearchText] = useState('')
  const [searchBy, setSearchBy] = useState('any')
  const [statusFilter, setStatusFilter] = useState('ALL')

  // Choose Column State
  const [chooseColumnOpen, setChooseColumnOpen] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState(() => {
    try {
      const saved = localStorage.getItem('bg_section_columns')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {}
    return DEFAULT_VISIBLE
  })

  // Modal State (Create / Edit)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

  // Form State: General Information
  const [formData, setFormData] = useState({
    code: 'Auto Generate Code',
    active: true,
    description: '',
    secondLanguage: '',
  })

  // Load sections from Backend (with resilient fallback and auto-migration to DB)
  const loadSections = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (searchText.trim()) params.search = searchText.trim()
      if (searchBy && searchBy !== 'any') params.searchBy = searchBy
      if (statusFilter && statusFilter !== 'ALL') params.status = statusFilter

      const res = await adminSectionAPI.getAll(params)
      const data = res?.data != null ? res.data : (Array.isArray(res) ? res : null)
      if (Array.isArray(data) && data.length > 0) {
        setSections(data)
        try {
          localStorage.setItem('bg_sections_cache', JSON.stringify(data))
        } catch {}
        return
      }

      // If backend returned empty list, check if user had local records to auto-migrate!
      let cachedRecords = []
      try {
        const cached = localStorage.getItem('bg_sections_cache') || localStorage.getItem('bg_sections')
        if (cached) cachedRecords = JSON.parse(cached)
      } catch {}

      if (Array.isArray(cachedRecords) && cachedRecords.length > 0) {
        const migrated = []
        for (const s of cachedRecords) {
          try {
            const created = await adminSectionAPI.create({
              code: s.code,
              description: s.description,
              secondLanguage: s.secondLanguage || null,
              active: s.active !== false,
            })
            if (created?.data) migrated.push(created.data)
          } catch {
            migrated.push(s)
          }
        }
        setSections(migrated)
        try {
          localStorage.setItem('bg_sections_cache', JSON.stringify(migrated))
        } catch {}
        return
      }
    } catch (err) {
      console.warn('Backend load sections failed:', err)
    }

    try {
      const cached = localStorage.getItem('bg_sections_cache')
      if (cached) {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSections(parsed)
          return
        }
      }
    } catch {}

    setSections(SEED_SECTIONS)
  }, [searchText, searchBy, statusFilter])

  useEffect(() => {
    loadSections().finally(() => setLoading(false))
  }, [loadSections])

  // Save Column settings
  const handleToggleColumn = (colKey) => {
    setVisibleColumns((prev) => {
      let next
      if (prev.includes(colKey)) {
        if (prev.length <= 1) return prev // keep at least 1 column
        next = prev.filter((k) => k !== colKey)
      } else {
        next = [...prev, colKey]
      }
      try {
        localStorage.setItem('bg_section_columns', JSON.stringify(next))
      } catch {}
      return next
    })
  }

  const handleSelectAllColumns = () => {
    const all = ALL_COLUMNS.map((c) => c.key)
    setVisibleColumns(all)
    try {
      localStorage.setItem('bg_section_columns', JSON.stringify(all))
    } catch {}
  }

  const handleResetColumns = () => {
    setVisibleColumns(DEFAULT_VISIBLE)
    try {
      localStorage.setItem('bg_section_columns', JSON.stringify(DEFAULT_VISIBLE))
    } catch {}
  }

  // Client-side filtering fallback for instant responsiveness
  const displayedSections = useMemo(() => {
    let list = sections

    // Status filter
    if (statusFilter === 'ACTIVE') {
      list = list.filter((s) => s.active === true)
    } else if (statusFilter === 'INACTIVE') {
      list = list.filter((s) => s.active === false)
    }

    // Search query & searchBy filter
    const q = searchText.trim().toLowerCase()
    if (q) {
      list = list.filter((s) => {
        const code = (s.code || '').toLowerCase()
        const desc = (s.description || '').toLowerCase()
        const sec = (s.secondLanguage || '').toLowerCase()

        switch (searchBy) {
          case 'code':
            return code.includes(q)
          case 'description':
            return desc.includes(q)
          case 'secondLanguage':
            return sec.includes(q)
          case 'any':
          default:
            return code.includes(q) || desc.includes(q) || sec.includes(q)
        }
      })
    }

    return list
  }, [sections, statusFilter, searchText, searchBy])

  // Reset Button Handler
  const handleResetFilters = () => {
    setSearchText('')
    setSearchBy('any')
    setStatusFilter('ALL')
    showNotification?.({
      type: 'info',
      title: 'Reset',
      message: 'Search and filters have been reset.',
    })
  }

  // Open Create Modal
  const openCreateModal = async () => {
    setEditingId(null)
    let nextCode = `SEC-${String(Math.floor(Math.random() * 9000) + 1000)}`
    try {
      const res = await adminSectionAPI.getNextCode()
      if (res?.data) nextCode = res.data
    } catch {}

    setFormData({
      code: nextCode,
      active: true,
      description: '',
      secondLanguage: '',
    })
    setModalOpen(true)
  }

  // Open Edit Modal
  const openEditModal = (section) => {
    setEditingId(section.id)
    setFormData({
      code: section.code || '',
      active: section.active !== false,
      description: section.description || section.name || '',
      secondLanguage: section.secondLanguage || '',
    })
    setModalOpen(true)
  }

  // Refresh Code in modal
  const handleRegenerateCode = async () => {
    try {
      const res = await adminSectionAPI.getNextCode()
      if (res?.data) {
        setFormData((prev) => ({ ...prev, code: res.data }))
        return
      }
    } catch {}
    setFormData((prev) => ({
      ...prev,
      code: `SEC-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    }))
  }

  // Save / Submit Form (Resilient Optimistic Saving)
  const handleSubmitForm = async (e) => {
    e.preventDefault()

    const desc = (formData.description || '').trim()
    if (!desc) {
      showNotification?.({ type: 'warning', title: 'Validation', message: 'Description is required.' })
      return
    }

    setSaving(true)

    // Ensure code is not a placeholder
    let secCode = (formData.code || '').trim()
    if (!secCode || secCode === 'Auto Generate Code') {
      secCode = `SEC-${String(Math.floor(Math.random() * 9000) + 1000)}`
    }

    const payload = {
      code: secCode,
      active: formData.active !== false,
      description: desc,
      secondLanguage: (formData.secondLanguage || '').trim() || null,
    }

    const optimisticRecord = {
      id: editingId || Date.now(),
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // 1. Instantly update UI & LocalStorage
    let updatedList
    if (editingId) {
      updatedList = sections.map((item) => (item.id === editingId ? { ...item, ...optimisticRecord } : item))
      setSections(updatedList)
      showNotification?.({
        type: 'success',
        title: 'Success',
        message: `Section "${optimisticRecord.description}" updated successfully.`,
      })
    } else {
      updatedList = [optimisticRecord, ...sections.filter((item) => item.code !== optimisticRecord.code)]
      setSections(updatedList)
      showNotification?.({
        type: 'success',
        title: 'Success',
        message: `Section "${optimisticRecord.description}" created successfully.`,
      })
    }

    try {
      localStorage.setItem('bg_sections_cache', JSON.stringify(updatedList))
      localStorage.setItem('bg_sections', JSON.stringify(updatedList))
    } catch {}

    // 2. Immediately close modal so user sees their new section
    setModalOpen(false)
    setSaving(false)

    // 3. Sync to backend API in background
    try {
      if (editingId) {
        const res = await adminSectionAPI.update(editingId, payload)
        if (res?.data) {
          setSections((prev) => prev.map((item) => (item.id === editingId ? res.data : item)))
        }
      } else {
        const res = await adminSectionAPI.create(payload)
        if (res?.data) {
          setSections((prev) => [
            res.data,
            ...prev.filter((item) => item.id !== optimisticRecord.id && item.code !== res.data.code),
          ])
        }
      }
    } catch (err) {
      console.error('Backend save failed:', err)
      showNotification?.({
        type: 'error',
        title: 'Database Sync Issue',
        message: err.message || 'Section was saved in browser but backend failed.',
      })
    }
  }

  // Toggle Active Status
  const handleToggleActive = async (section) => {
    const newStatus = !Boolean(section.active !== false)
    try {
      await adminSectionAPI.updateStatus(section.id, newStatus)
    } catch {}

    const updated = sections.map((item) =>
      item.id === section.id ? { ...item, active: newStatus } : item
    )
    setSections(updated)
    try {
      localStorage.setItem('bg_sections_cache', JSON.stringify(updated))
    } catch {}

    showNotification?.({
      type: 'info',
      title: 'Status Updated',
      message: `${section.description || section.code} is now ${newStatus ? 'Active' : 'Inactive'}.`,
    })
  }

  // Delete Section
  const handleDeleteSection = async (id, code, description) => {
    if (!window.confirm(`Are you sure you want to delete section ${description || code}?`)) return

    try {
      await adminSectionAPI.delete(id)
    } catch {}

    const updated = sections.filter((item) => item.id !== id)
    setSections(updated)
    try {
      localStorage.setItem('bg_sections_cache', JSON.stringify(updated))
    } catch {}

    showNotification?.({
      type: 'success',
      title: 'Deleted',
      message: `Section ${description || code} deleted.`,
    })
  }

  // Export to Excel
  const handleExportExcel = () => {
    const activeCols = ALL_COLUMNS.filter((c) => visibleColumns.includes(c.key))
    const headers = activeCols.map((c) => (lang === 'kh' ? c.label.kh : c.label.en))

    const dataRows = displayedSections.map((sec) => {
      return activeCols.map((c) => {
        switch (c.key) {
          case 'code':
            return sec.code || ''
          case 'description':
            return sec.description || sec.name || ''
          case 'secondLanguage':
            return sec.secondLanguage || ''
          case 'active':
            return sec.active !== false ? 'ACTIVE' : 'INACTIVE'
          default:
            return ''
        }
      })
    })

    exportStyledExcel({
      sheetName: 'Sections',
      title: "B'Groceries - Operational Sections",
      subtitle: `Exported on: ${new Date().toLocaleString()}`,
      headers,
      dataRows,
      fileName: `Sections_${new Date().toISOString().slice(0, 10)}.xlsx`,
    })

    showNotification?.({
      type: 'success',
      title: 'Export',
      message: 'Section list exported to Excel.',
    })
  }

  return (
    <div className="space-y-6 text-slate-100 font-['Montserrat']">
      {/* 1. HERO BREADCRUMB & BANNER */}
      <section className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-[#0b241b] via-[#091913] to-[#050f0c] p-5 sm:p-7 shadow-2xl shadow-emerald-500/10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <Link
              to="/admin/employee"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-950/60 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300 transition hover:border-emerald-400 hover:text-white active:scale-95"
            >
              <span>←</span> {lang === 'en' ? 'Employee Hub' : 'មជ្ឈមណ្ឌលបុគ្គលិក'}
            </Link>

            <div className="flex items-center gap-3.5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 p-2 ring-1 ring-emerald-500/30 shadow-lg shadow-emerald-500/20">
                <img src={starIcon} alt="" className="h-9 w-9 object-contain drop-shadow-md" />
              </span>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-emerald-400">
                  {lang === 'en' ? 'Operational Units' : 'ផ្នែកប្រតិបត្តិការ'}
                </p>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {lang === 'en' ? 'Section' : 'ផ្នែក'}
                </h1>
              </div>
            </div>

            <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-300">
              {lang === 'en'
                ? 'Show information of Section. Ex(Code, Description, Second Language)'
                : 'បង្ហាញព័ត៌មាននៃផ្នែក។ ឧទាហរណ៍ (លេខកូដ ការពិពណ៌នា ភាសាទីពីរ)'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start lg:self-center">
            {/* Export Excel Button */}
            <button
              type="button"
              onClick={handleExportExcel}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-xs font-bold text-slate-300 hover:text-white hover:border-emerald-400 transition active:scale-95 shadow-lg"
            >
              <span>📥</span>
              <span>{lang === 'en' ? 'Export Excel' : 'នាំចេញ Excel'}</span>
            </button>

            {/* Create Button */}
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-3 text-xs font-black text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-500 active:scale-95 transition"
            >
              <span className="text-base font-bold">+</span>
              <span>{lang === 'en' ? 'Create Section' : 'បង្កើតផ្នែក'}</span>
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
                      ? 'bg-emerald-600 text-white font-black shadow-md shadow-emerald-600/25 scale-[1.02]'
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

      {/* 2. SEARCH & CONTROLS SECTION */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl shadow-black/20 space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="h-5 w-1.5 rounded-full bg-emerald-500" />
            <h2 className="text-base font-bold text-white font-['Montserrat']">
              {lang === 'en' ? 'Search Section' : 'ស្វែងរកផ្នែក'}
            </h2>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Choose Column Button */}
            <button
              type="button"
              onClick={() => setChooseColumnOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-1.5 text-xs font-bold text-slate-300 hover:border-emerald-400 hover:text-white transition active:scale-95"
            >
              <span>⚙️</span>
              <span>{lang === 'en' ? 'Choose Column' : 'ជ្រើសរើសជួរឈរ'}</span>
            </button>

            {/* Reset Button */}
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-800/50 px-3.5 py-1.5 text-xs font-bold text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition active:scale-95"
              title="Reset Search and Filters"
            >
              <span>↺</span>
              <span>{lang === 'en' ? 'Reset' : 'កំណត់ឡើងវិញ'}</span>
            </button>
          </div>
        </div>

        {/* Search Inputs Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
          {/* Search - Textbox */}
          <div className="sm:col-span-5 md:col-span-6">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              {lang === 'en' ? 'Search' : 'ស្វែងរក'}
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
                🔍
              </span>
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadSections()}
                placeholder={
                  lang === 'en'
                    ? 'Search section by code, description, second language...'
                    : 'ស្វែងរកតាមកូដ ការពិពណ៌នា ភាសាទីពីរ...'
                }
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2 pl-9 pr-8 text-xs font-semibold text-white placeholder-slate-500 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
              />
              {searchText && (
                <button
                  type="button"
                  onClick={() => setSearchText('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Search by - DropDown (Any, Code, Description, Second Language) */}
          <div className="sm:col-span-3 md:col-span-2">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              {lang === 'en' ? 'Search by' : 'ស្វែងរកតាម'}
            </label>
            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2 px-3 text-xs font-semibold text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            >
              <option value="any">{lang === 'en' ? 'Any' : 'ទាំងអស់'}</option>
              <option value="code">{lang === 'en' ? 'Code' : 'កូដ'}</option>
              <option value="description">{lang === 'en' ? 'Description' : 'ការពិពណ៌នា'}</option>
              <option value="secondLanguage">{lang === 'en' ? 'Second Language' : 'ភាសាទីពីរ'}</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-2 md:col-span-2">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              {lang === 'en' ? 'Status' : 'ស្ថានភាព'}
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2 px-3 text-xs font-semibold text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            >
              <option value="ALL">{lang === 'en' ? 'All' : 'ទាំងអស់'}</option>
              <option value="ACTIVE">{lang === 'en' ? 'Active' : 'សកម្ម'}</option>
              <option value="INACTIVE">{lang === 'en' ? 'Inactive' : 'អសកម្ម'}</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="sm:col-span-2 md:col-span-2 flex items-end">
            <button
              type="button"
              onClick={loadSections}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 py-2 px-4 text-xs font-black text-white transition active:scale-95 shadow-md shadow-emerald-500/25 flex items-center justify-center gap-1.5"
            >
              <span>🔍</span>
              <span>{lang === 'en' ? 'Search' : 'ស្វែងរក'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. SECTION LIST TABLE SECTION */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl shadow-black/20 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="h-5 w-1.5 rounded-full bg-emerald-500" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-['Montserrat']">
                  {lang === 'en' ? 'Section List' : 'បញ្ជីផ្នែក'}
                </h2>
                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-400">
                  {displayedSections.length} {lang === 'en' ? 'Sections' : 'ផ្នែក'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {lang === 'en'
                  ? 'Show information of Section. Ex(Code, Description, Second Language)'
                  : 'បង្ហាញព័ត៌មាននៃផ្នែក។ ឧទាហរណ៍ (លេខកូដ ការពិពណ៌នា ភាសាទីពីរ)'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Create Button */}
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-1.5 text-xs font-bold text-white transition active:scale-95 shadow-md shadow-emerald-600/25"
            >
              <span>+</span>
              <span>{lang === 'en' ? 'Create' : 'បង្កើត'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/90 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-800">
              <tr>
                {visibleColumns.includes('code') && <th className="py-3.5 px-4">Code</th>}
                {visibleColumns.includes('description') && <th className="py-3.5 px-4">Description</th>}
                {visibleColumns.includes('secondLanguage') && <th className="py-3.5 px-4">Second Language</th>}
                {visibleColumns.includes('active') && <th className="py-3.5 px-4 text-center">Active</th>}
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
              {loading && sections.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumns.length + 1} className="py-12 text-center text-slate-500 font-mono">
                    <span className="inline-block animate-spin mr-2">🌀</span>
                    {lang === 'en' ? 'Loading sections roster...' : 'កំពុងផ្ទុកបញ្ជីផ្នែក...'}
                  </td>
                </tr>
              ) : displayedSections.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumns.length + 1} className="py-12 text-center text-slate-500 space-y-2">
                    <div className="text-3xl">🔖</div>
                    <p className="font-semibold">
                      {lang === 'en' ? 'No sections found' : 'រកមិនឃើញទិន្នន័យផ្នែកឡើយ'}
                    </p>
                    <button
                      type="button"
                      onClick={openCreateModal}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600/30 border border-emerald-500/40 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-600/50 transition"
                    >
                      + {lang === 'en' ? 'Create Section' : 'បង្កើតផ្នែក'}
                    </button>
                  </td>
                </tr>
              ) : (
                displayedSections.map((sec) => (
                  <tr key={sec.id || sec.code} className="hover:bg-slate-800/50 transition">
                    {/* Code */}
                    {visibleColumns.includes('code') && (
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400 whitespace-nowrap">
                        <span className="bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-lg">
                          {sec.code}
                        </span>
                      </td>
                    )}

                    {/* Description */}
                    {visibleColumns.includes('description') && (
                      <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                        {sec.description || sec.name || '---'}
                      </td>
                    )}

                    {/* Second Language */}
                    {visibleColumns.includes('secondLanguage') && (
                      <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                        {sec.secondLanguage || '---'}
                      </td>
                    )}

                    {/* Active */}
                    {visibleColumns.includes('active') && (
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(sec)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition active:scale-95 ${
                            sec.active !== false
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              sec.active !== false ? 'bg-emerald-400' : 'bg-slate-500'
                            }`}
                          />
                          <span>{sec.active !== false ? 'ACTIVE' : 'INACTIVE'}</span>
                        </button>
                      </td>
                    )}

                    {/* Actions */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(sec)}
                          title="Edit"
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition active:scale-95"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSection(sec.id, sec.code, sec.description || sec.name)}
                          title="Delete"
                          className="p-1 text-slate-500 hover:text-rose-400 transition"
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

      {/* 4. CHOOSE COLUMN MODAL */}
      {chooseColumnOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">⚙️</span>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {lang === 'en' ? 'Choose Column' : 'ជ្រើសរើសជួរឈរ'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {lang === 'en'
                      ? 'Choose column you want to display on table'
                      : 'ជ្រើសរើសជួរឈរដែលអ្នកចង់បង្ហាញលើតារាង'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setChooseColumnOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Columns Checklist */}
            <div className="grid grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {ALL_COLUMNS.map((col) => {
                const checked = visibleColumns.includes(col.key)
                return (
                  <label
                    key={col.key}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition ${
                      checked
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleColumn(col.key)}
                      className="h-4 w-4 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="truncate">{lang === 'kh' ? col.label.kh : col.label.en}</span>
                  </label>
                )
              })}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAllColumns}
                  className="px-2.5 py-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 hover:underline"
                >
                  {lang === 'en' ? 'Select All' : 'ជ្រើសទាំងអស់'}
                </button>
                <span className="text-slate-700">|</span>
                <button
                  type="button"
                  onClick={handleResetColumns}
                  className="px-2.5 py-1 text-[11px] font-bold text-slate-400 hover:text-slate-300 hover:underline"
                >
                  {lang === 'en' ? 'Default' : 'លំនាំដើម'}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setChooseColumnOpen(false)}
                className="rounded-xl bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 active:scale-95 transition"
              >
                {lang === 'en' ? 'Apply & Close' : 'អនុវត្ត & បិទ'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. CREATE / EDIT SECTION MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-7 shadow-2xl space-y-6 my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 text-lg">
                  🔖
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    {editingId
                      ? lang === 'en' ? 'Edit Section Information' : 'កែប្រែព័ត៌មានផ្នែក'
                      : lang === 'en' ? 'Create New Section' : 'បង្កើតផ្នែកថ្មី'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {lang === 'en'
                      ? 'Input the general section information'
                      : 'បញ្ចូលព័ត៌មានទូទៅនៃផ្នែក'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-5 text-xs">
              {/* SECTION: GENERAL INFORMATION */}
              <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 sm:p-5">
                <div className="border-b border-slate-800/80 pb-2.5">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span>{lang === 'en' ? 'General Information' : 'ព័ត៌មានទូទៅ'}</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {lang === 'en' ? 'Input the general section information' : 'បញ្ចូលព័ត៌មានទូទៅនៃផ្នែក'}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Code Auto Generate Code - textbox */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300 flex items-center justify-between">
                      <span>Code</span>
                      <button
                        type="button"
                        onClick={handleRegenerateCode}
                        className="text-[10px] text-emerald-400 hover:underline"
                        title="Generate Next Code"
                      >
                        Auto Generate Code ↻
                      </button>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 pl-3 pr-8 font-mono font-bold text-emerald-400 outline-none focus:border-emerald-400"
                      />
                      <button
                        type="button"
                        onClick={handleRegenerateCode}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                      >
                        ⚡
                      </button>
                    </div>
                  </div>

                  {/* Active - tickbox */}
                  <div className="pt-1">
                    <label className="inline-flex items-center gap-3 cursor-pointer select-none rounded-xl border border-slate-800 bg-slate-950/80 p-2.5 w-full">
                      <input
                        type="checkbox"
                        checked={formData.active}
                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                        className="h-4 w-4 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <span className="font-bold text-white block">Active Status</span>
                        <span className="text-[10px] text-slate-400">
                          {formData.active ? 'Section is active' : 'Section is marked inactive'}
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* Description - textbox */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">
                      Description <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="e.g. Cashier & Front End"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-emerald-400"
                    />
                  </div>

                  {/* Second Language - textbox */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Second Language</label>
                    <input
                      type="text"
                      value={formData.secondLanguage}
                      onChange={(e) => setFormData({ ...formData, secondLanguage: e.target.value })}
                      placeholder="e.g. គិតលុយ និងផ្នែកខាងមុខ"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-white outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Form Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      code: 'Auto Generate Code',
                      active: true,
                      description: '',
                      secondLanguage: '',
                    })
                  }
                  className="text-xs font-bold text-slate-400 hover:text-slate-200 transition"
                >
                  {lang === 'en' ? 'Reset Fields' : 'កំណត់ទម្រង់ឡើងវិញ'}
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition"
                  >
                    {lang === 'en' ? 'Cancel' : 'បោះបង់'}
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-2 text-xs font-black text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-500 active:scale-95 transition disabled:opacity-50"
                  >
                    {saving
                      ? lang === 'en' ? 'Saving...' : 'កំពុងរក្សាទុក...'
                      : editingId
                      ? lang === 'en' ? 'Update Section' : 'ធ្វើបច្ចុប្បន្នភាព'
                      : lang === 'en' ? 'Save Section' : 'រក្សាទុកផ្នែក'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
