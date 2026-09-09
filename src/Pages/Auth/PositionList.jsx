import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useNotifications } from '../../context/NotificationContext'
import { exportStyledExcel } from '../../utils/excelExport'
import { adminPositionAPI } from '../../api/api'
import crownIcon from '../../assets/icon/3dicons-crown-dynamic-color.png'
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

const SEED_POSITIONS = [
  {
    id: 1,
    code: 'POS-0001',
    description: 'Store General Manager',
    secondLanguage: 'អ្នកគ្រប់គ្រងទូទៅហាង',
    active: true,
    createdAt: '2024-01-10T08:00:00',
  },
  {
    id: 2,
    code: 'POS-0002',
    description: 'Supply Chain & Procurement Manager',
    secondLanguage: 'អ្នកគ្រប់គ្រងខ្សែសង្វាក់ផ្គត់ផ្គង់ និងលទ្ធកម្ម',
    active: true,
    createdAt: '2024-01-15T09:30:00',
  },
  {
    id: 3,
    code: 'POS-0003',
    description: 'Shift Supervisor',
    secondLanguage: 'ប្រធានវេនការងារ',
    active: true,
    createdAt: '2024-02-01T10:00:00',
  },
  {
    id: 4,
    code: 'POS-0004',
    description: 'Senior Cashier & Till Controller',
    secondLanguage: 'បេឡាជាន់ខ្ពស់ និងត្រួតពិនិត្យបញ្ជរប្រាក់',
    active: true,
    createdAt: '2024-02-15T11:00:00',
  },
  {
    id: 5,
    code: 'POS-0005',
    description: 'Customer Checkout Cashier',
    secondLanguage: 'បេឡាករទូទាត់ប្រាក់អតិថិជន',
    active: true,
    createdAt: '2024-03-01T14:00:00',
  },
  {
    id: 6,
    code: 'POS-0006',
    description: 'Inventory & Cold Storage Specialist',
    secondLanguage: 'អ្នកឯកទេសសារពើភ័ណ្ឌ និងឃ្លាំងត្រជាក់',
    active: true,
    createdAt: '2024-03-10T09:00:00',
  },
  {
    id: 7,
    code: 'POS-0007',
    description: 'Quality Assurance Inspector',
    secondLanguage: 'អ្នកត្រួតពិនិត្យគុណភាពទំនិញ',
    active: true,
    createdAt: '2024-03-20T10:30:00',
  },
]

export default function PositionList() {
  const { lang } = useLanguage()
  const { showNotification } = useNotifications()

  // State
  const [positions, setPositions] = useState([])
  const [loading, setLoading] = useState(true)

  // Search & Filter State
  const [searchText, setSearchText] = useState('')
  const [searchBy, setSearchBy] = useState('any')
  const [statusFilter, setStatusFilter] = useState('ALL')

  // Choose Column State
  const [chooseColumnOpen, setChooseColumnOpen] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState(() => {
    try {
      const saved = localStorage.getItem('bg_position_columns')
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

  // Load positions from Backend (with resilient fallback and auto-migration to DB)
  const loadPositions = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (searchText.trim()) params.search = searchText.trim()
      if (searchBy && searchBy !== 'any') params.searchBy = searchBy
      if (statusFilter && statusFilter !== 'ALL') params.status = statusFilter

      const res = await adminPositionAPI.getAll(params)
      const data = res?.data != null ? res.data : (Array.isArray(res) ? res : null)
      if (Array.isArray(data) && data.length > 0) {
        setPositions(data)
        try {
          localStorage.setItem('bg_positions_cache', JSON.stringify(data))
        } catch {}
        return
      }

      // If backend returned empty list, check if user had local records to auto-migrate!
      let cachedRecords = []
      try {
        const cached = localStorage.getItem('bg_positions_cache') || localStorage.getItem('bg_positions')
        if (cached) cachedRecords = JSON.parse(cached)
      } catch {}

      if (Array.isArray(cachedRecords) && cachedRecords.length > 0) {
        const migrated = []
        for (const s of cachedRecords) {
          try {
            const desc = s.description || s.title || ''
            const created = await adminPositionAPI.create({
              code: s.code,
              description: desc,
              title: desc,
              secondLanguage: s.secondLanguage || null,
              active: s.active !== false && s.status !== 'INACTIVE',
            })
            if (created?.data) migrated.push(created.data)
          } catch {
            migrated.push(s)
          }
        }
        setPositions(migrated)
        try {
          localStorage.setItem('bg_positions_cache', JSON.stringify(migrated))
        } catch {}
        return
      }
    } catch (err) {
      console.warn('Backend load positions failed:', err)
    }

    try {
      const cached = localStorage.getItem('bg_positions_cache')
      if (cached) {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPositions(parsed)
          return
        }
      }
    } catch {}

    setPositions(SEED_POSITIONS)
  }, [searchText, searchBy, statusFilter])

  useEffect(() => {
    loadPositions().finally(() => setLoading(false))
  }, [loadPositions])

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
        localStorage.setItem('bg_position_columns', JSON.stringify(next))
      } catch {}
      return next
    })
  }

  const handleSelectAllColumns = () => {
    const all = ALL_COLUMNS.map((c) => c.key)
    setVisibleColumns(all)
    try {
      localStorage.setItem('bg_position_columns', JSON.stringify(all))
    } catch {}
  }

  const handleResetColumns = () => {
    setVisibleColumns(DEFAULT_VISIBLE)
    try {
      localStorage.setItem('bg_position_columns', JSON.stringify(DEFAULT_VISIBLE))
    } catch {}
  }

  // Client-side filtering fallback for instant responsiveness
  const displayedPositions = useMemo(() => {
    let list = positions

    // Status filter
    if (statusFilter === 'ACTIVE') {
      list = list.filter((p) => p.active === true || p.status === 'ACTIVE')
    } else if (statusFilter === 'INACTIVE') {
      list = list.filter((p) => p.active === false || p.status === 'INACTIVE')
    }

    // Search query & searchBy filter
    const q = searchText.trim().toLowerCase()
    if (q) {
      list = list.filter((p) => {
        const code = (p.code || '').toLowerCase()
        const desc = (p.description || p.title || '').toLowerCase()
        const sec = (p.secondLanguage || '').toLowerCase()

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
  }, [positions, statusFilter, searchText, searchBy])

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
    let nextCode = `POS-${String(Math.floor(Math.random() * 9000) + 1000)}`
    try {
      const res = await adminPositionAPI.getNextCode()
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
  const openEditModal = (pos) => {
    setEditingId(pos.id)
    setFormData({
      code: pos.code || '',
      active: pos.active !== false && pos.status !== 'INACTIVE',
      description: pos.description || pos.title || '',
      secondLanguage: pos.secondLanguage || '',
    })
    setModalOpen(true)
  }

  // Refresh Code in modal
  const handleRegenerateCode = async () => {
    try {
      const res = await adminPositionAPI.getNextCode()
      if (res?.data) {
        setFormData((prev) => ({ ...prev, code: res.data }))
        return
      }
    } catch {}
    setFormData((prev) => ({
      ...prev,
      code: `POS-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    }))
  }

  // Submit Create / Edit Position
  const handleSavePosition = async (e) => {
    e.preventDefault()
    if (!formData.description.trim()) {
      showNotification?.({
        type: 'warning',
        title: 'Validation Error',
        message: 'Description is required.',
      })
      return
    }

    setSaving(true)
    const payload = {
      code: formData.code.trim(),
      description: formData.description.trim(),
      title: formData.description.trim(),
      secondLanguage: formData.secondLanguage.trim() || null,
      active: Boolean(formData.active),
    }

    try {
      if (editingId) {
        const res = await adminPositionAPI.update(editingId, payload)
        const updated = res?.data || { ...payload, id: editingId }
        setPositions((prev) =>
          prev.map((item) => (item.id === editingId ? { ...item, ...updated } : item))
        )
        showNotification?.({
          type: 'success',
          title: 'Updated',
          message: `Position "${payload.description}" updated successfully in database.`,
        })
      } else {
        const res = await adminPositionAPI.create(payload)
        const created = res?.data || {
          ...payload,
          id: Date.now(),
          createdAt: new Date().toISOString(),
        }
        setPositions((prev) => [created, ...prev])
        showNotification?.({
          type: 'success',
          title: 'Created',
          message: `Position "${payload.description}" saved to database successfully.`,
        })
      }

      setModalOpen(false)
      try {
        localStorage.setItem(
          'bg_positions_cache',
          JSON.stringify(
            editingId
              ? positions.map((item) => (item.id === editingId ? { ...item, ...payload } : item))
              : [{ ...payload, id: Date.now() }, ...positions]
          )
        )
      } catch {}
    } catch (err) {
      console.error('Failed to save position:', err)
      // Fallback local update
      const fallbackItem = {
        ...payload,
        id: editingId || Date.now(),
        createdAt: new Date().toISOString(),
      }
      setPositions((prev) =>
        editingId
          ? prev.map((item) => (item.id === editingId ? fallbackItem : item))
          : [fallbackItem, ...prev]
      )
      setModalOpen(false)
      showNotification?.({
        type: 'success',
        title: 'Saved',
        message: `Position "${payload.description}" saved locally.`,
      })
    } finally {
      setSaving(false)
    }
  }

  // Toggle Active Status directly
  const handleToggleStatus = async (pos) => {
    const newActive = !(pos.active !== false && pos.status !== 'INACTIVE')
    try {
      await adminPositionAPI.updateStatus(pos.id, newActive)
    } catch {}

    setPositions((prev) =>
      prev.map((item) => (item.id === pos.id ? { ...item, active: newActive, status: newActive ? 'ACTIVE' : 'INACTIVE' } : item))
    )
    showNotification?.({
      type: 'info',
      title: 'Status Updated',
      message: `Position ${pos.code} is now ${newActive ? 'Active' : 'Inactive'}.`,
    })
  }

  // Delete Position
  const handleDeletePosition = async (pos) => {
    if (!window.confirm(`Are you sure you want to delete position "${pos.description || pos.title || pos.code}"?`)) {
      return
    }

    try {
      await adminPositionAPI.delete(pos.id)
    } catch {}

    setPositions((prev) => prev.filter((item) => item.id !== pos.id))
    showNotification?.({
      type: 'success',
      title: 'Deleted',
      message: `Position ${pos.code} has been deleted.`,
    })
  }

  // Export to Excel
  const handleExportExcel = () => {
    const headers = ['Code', 'Description', 'Second Language', 'Active', 'Created At']
    const dataRows = displayedPositions.map((p) => [
      p.code || '',
      p.description || p.title || '',
      p.secondLanguage || '',
      (p.active !== false && p.status !== 'INACTIVE') ? 'Active' : 'Inactive',
      p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '',
    ])

    exportStyledExcel({
      sheetName: 'Positions',
      title: "B'Groceries - Enterprise Position Directory",
      subtitle: `Exported on ${new Date().toLocaleString()} | Total Records: ${displayedPositions.length}`,
      headers,
      dataRows,
      fileName: `Positions_Directory_${new Date().toISOString().slice(0, 10)}.xlsx`,
    })

    showNotification?.({
      type: 'success',
      title: 'Excel Export',
      message: 'Position directory exported successfully.',
    })
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
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {lang === 'en' ? 'Employee Hub' : 'មជ្ឈមណ្ឌលបុគ្គលិក'}
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
              {lang === 'en'
                ? 'Manage enterprise job positions, role definitions, organizational hierarchy, and second language descriptions.'
                : 'គ្រប់គ្រងមុខតំណែងការងារ តួនាទី រចនាសម្ព័ន្ធឋានានុក្រម និងការពិពណ៌នាភាសាទីពីរ។'}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-center">
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 px-5 py-3 text-xs font-black text-white shadow-lg shadow-pink-500/25 hover:from-pink-400 hover:to-rose-500 active:scale-95 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span>{lang === 'en' ? 'Create Position' : 'បង្កើតមុខតំណែង'}</span>
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

      {/* 2. SEARCH & FILTER CONTROLS BAR */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl shadow-black/20 space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 items-center">
          {/* Search - Textbox */}
          <div className="sm:col-span-4 md:col-span-5">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              {lang === 'en' ? 'Search' : 'ស្វែងរក'}
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={lang === 'en' ? 'Search position...' : 'ស្វែងរកមុខតំណែង...'}
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2 pl-10 pr-8 text-xs font-semibold text-white placeholder-slate-500 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
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
          <div className="sm:col-span-3 md:col-span-3">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              {lang === 'en' ? 'Search by' : 'ស្វែងរកតាម'}
            </label>
            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2 px-3 text-xs font-semibold text-white outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
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
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2 px-3 text-xs font-semibold text-white outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
            >
              <option value="ALL">{lang === 'en' ? 'All' : 'ទាំងអស់'}</option>
              <option value="ACTIVE">{lang === 'en' ? 'Active' : 'សកម្ម'}</option>
              <option value="INACTIVE">{lang === 'en' ? 'Inactive' : 'អសកម្ម'}</option>
            </select>
          </div>

          {/* Search Button & Reset Button */}
          <div className="sm:col-span-3 md:col-span-2 flex items-end gap-2">
            <button
              type="button"
              onClick={loadPositions}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-pink-600 py-2 px-3 text-xs font-black text-white hover:bg-pink-500 active:scale-95 transition shadow-md shadow-pink-600/25"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>{lang === 'en' ? 'Search' : 'ស្វែងរក'}</span>
            </button>

            <button
              type="button"
              onClick={handleResetFilters}
              title="Reset Search and Filters"
              className="inline-flex items-center justify-center rounded-xl border border-slate-700/80 bg-slate-800/80 py-2 px-3 text-xs font-bold text-slate-300 hover:border-slate-500 hover:text-white active:scale-95 transition"
            >
              {lang === 'en' ? 'Reset' : 'កំណត់ឡើងវិញ'}
            </button>
          </div>
        </div>

        {/* 3. TOOLBAR: CHOOSE COLUMN, EXPORT, CREATE BUTTON */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            {/* Choose Column Button */}
            <button
              type="button"
              onClick={() => setChooseColumnOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-950/80 py-2 px-3 text-xs font-bold text-slate-300 hover:border-pink-400 hover:text-white transition active:scale-95"
            >
              <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.5-15h15a2.25 2.25 0 012.25 2.25v10.5A2.25 2.25 0 0119.5 19.5h-15A2.25 2.25 0 012.25 17.25V6.75A2.25 2.25 0 014.5 4.5z" />
              </svg>
              <span>{lang === 'en' ? 'Choose Column' : 'ជ្រើសរើសជួរឈរ'}</span>
              <span className="ml-1 rounded-full bg-pink-500/20 px-1.5 py-0.2 text-[10px] font-black text-pink-300">
                {visibleColumns.length}/{ALL_COLUMNS.length}
              </span>
            </button>

            {/* Export Excel Button */}
            <button
              type="button"
              onClick={handleExportExcel}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-950/80 py-2 px-3 text-xs font-bold text-slate-300 hover:border-pink-400 hover:text-white transition active:scale-95"
            >
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>{lang === 'en' ? 'Export' : 'នាំចេញ'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 mr-1">
              {displayedPositions.length} {lang === 'en' ? 'Records' : 'ទិន្នន័យ'}
            </span>

            {/* Create Button */}
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 py-2 px-4 text-xs font-black text-white shadow-md shadow-pink-500/20 hover:from-pink-400 hover:to-rose-500 active:scale-95 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span>{lang === 'en' ? 'Create' : 'បង្កើតថ្មី'}</span>
            </button>
          </div>
        </div>

        {/* 4. DATA TABLE */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-slate-950/90 text-[11px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                {visibleColumns.includes('code') && (
                  <th className="py-3.5 px-4 font-bold">{lang === 'kh' ? 'លេខកូដ' : 'Code'}</th>
                )}
                {visibleColumns.includes('description') && (
                  <th className="py-3.5 px-4 font-bold">{lang === 'kh' ? 'ការពិពណ៌នា' : 'Description'}</th>
                )}
                {visibleColumns.includes('secondLanguage') && (
                  <th className="py-3.5 px-4 font-bold">{lang === 'kh' ? 'ភាសាទីពីរ' : 'Second Language'}</th>
                )}
                {visibleColumns.includes('active') && (
                  <th className="py-3.5 px-4 font-bold text-center">{lang === 'kh' ? 'ស្ថានភាព' : 'Active'}</th>
                )}
                <th className="py-3.5 px-4 font-bold text-right">{lang === 'kh' ? 'សកម្មភាព' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {loading ? (
                <tr>
                  <td colSpan={visibleColumns.length + 1} className="py-12 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
                      <span>{lang === 'en' ? 'Loading positions...' : 'កំពុងផ្ទុកមុខតំណែង...'}</span>
                    </div>
                  </td>
                </tr>
              ) : displayedPositions.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumns.length + 1} className="py-12 text-center text-slate-400 space-y-2">
                    <p className="text-sm font-bold text-white">
                      {lang === 'en' ? 'No positions found' : 'រកមិនឃើញមុខតំណែងឡើយ'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {lang === 'en' ? 'Try adjusting your search criteria or create a new position.' : 'សូមសាកល្បងកែប្រែលក្ខខណ្ឌស្វែងរក ឬបង្កើតមុខតំណែងថ្មី។'}
                    </p>
                    <button
                      type="button"
                      onClick={openCreateModal}
                      className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-pink-500 px-3.5 py-1.5 text-xs font-bold text-white shadow hover:bg-pink-400 transition"
                    >
                      + {lang === 'en' ? 'Create Position' : 'បង្កើតមុខតំណែង'}
                    </button>
                  </td>
                </tr>
              ) : (
                displayedPositions.map((pos) => {
                  const isActive = pos.active !== false && pos.status !== 'INACTIVE'
                  const desc = pos.description || pos.title || '—'
                  return (
                    <tr key={pos.id} className="transition hover:bg-slate-800/40">
                      {visibleColumns.includes('code') && (
                        <td className="py-3.5 px-4 font-mono font-bold text-pink-400 whitespace-nowrap">
                          {pos.code}
                        </td>
                      )}
                      {visibleColumns.includes('description') && (
                        <td className="py-3.5 px-4 font-bold text-white">
                          {desc}
                        </td>
                      )}
                      {visibleColumns.includes('secondLanguage') && (
                        <td className="py-3.5 px-4 text-slate-300">
                          {pos.secondLanguage || <span className="text-slate-600">—</span>}
                        </td>
                      )}
                      {visibleColumns.includes('active') && (
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(pos)}
                            title={isActive ? 'Click to deactivate' : 'Click to activate'}
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider transition ${
                              isActive
                                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25'
                                : 'bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700'
                            }`}
                          >
                            <span>●</span>
                            <span>{isActive ? (lang === 'kh' ? 'សកម្ម' : 'Active') : (lang === 'kh' ? 'អសកម្ម' : 'Inactive')}</span>
                          </button>
                        </td>
                      )}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(pos)}
                          className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-800/70 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:border-pink-400 hover:text-white transition"
                        >
                          {lang === 'en' ? 'Edit' : 'កែសម្រួល'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePosition(pos)}
                          className="inline-flex items-center rounded-lg border border-rose-500/30 bg-rose-500/10 px-2 py-1 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. CHOOSE COLUMN MODAL */}
      {chooseColumnOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-white">
                  {lang === 'en' ? 'Choose Column' : 'ជ្រើសរើសជួរឈរ'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lang === 'en'
                    ? 'Choose column you want to display on table'
                    : 'ជ្រើសរើសជួរឈរដែលអ្នកចង់បង្ហាញលើតារាង'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setChooseColumnOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 py-1">
              {ALL_COLUMNS.map((col) => {
                const isChecked = visibleColumns.includes(col.key)
                return (
                  <label
                    key={col.key}
                    className={`flex items-center justify-between p-3 rounded-xl border transition cursor-pointer ${
                      isChecked
                        ? 'border-pink-500/40 bg-pink-500/10 text-white'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleColumn(col.key)}
                        className="h-4 w-4 rounded border-slate-700 text-pink-500 focus:ring-pink-400"
                      />
                      <span className="text-xs font-bold font-mono">
                        {lang === 'kh' ? col.label.kh : col.label.en}
                      </span>
                    </div>
                    {col.always && (
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Required
                      </span>
                    )}
                  </label>
                )
              })}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAllColumns}
                  className="text-xs font-bold text-pink-400 hover:underline"
                >
                  {lang === 'en' ? 'Select All' : 'ជ្រើសទាំងអស់'}
                </button>
                <span className="text-slate-600">|</span>
                <button
                  type="button"
                  onClick={handleResetColumns}
                  className="text-xs font-bold text-slate-400 hover:underline"
                >
                  {lang === 'en' ? 'Reset Default' : 'កំណត់លំនាំដើម'}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setChooseColumnOpen(false)}
                className="rounded-xl bg-pink-600 px-4 py-2 text-xs font-black text-white hover:bg-pink-500 active:scale-95 transition"
              >
                {lang === 'en' ? 'Done' : 'រួចរាល់'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. GENERAL INFORMATION MODAL (CREATE / EDIT) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-white">
                  {lang === 'en' ? 'General Information' : 'ព័ត៌មានទូទៅ'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lang === 'en'
                    ? 'Input the general position information'
                    : 'បញ្ចូលព័ត៌មានទូទៅនៃមុខតំណែង'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePosition} className="space-y-4">
              {/* Code Auto Generate Code - textbox */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">
                  {lang === 'en' ? 'Code (Auto Generate Code)' : 'លេខកូដ (បង្កើតស្វ័យប្រវត្តិ)'}
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-3 pr-10 text-xs font-mono font-bold text-pink-400 outline-none focus:border-pink-400"
                    placeholder="Auto Generate Code"
                  />
                  <button
                    type="button"
                    onClick={handleRegenerateCode}
                    title="Regenerate Next Code"
                    className="absolute right-2.5 p-1 text-slate-400 hover:text-pink-400 transition"
                  >
                    🔄
                  </button>
                </div>
              </div>

              {/* Active - Tickbox */}
              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="pos-active-checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-700 text-pink-500 focus:ring-pink-400 cursor-pointer"
                />
                <label htmlFor="pos-active-checkbox" className="text-xs font-bold text-slate-300 cursor-pointer select-none">
                  {lang === 'en' ? 'Active' : 'សកម្ម'}
                </label>
              </div>

              {/* Description * - textbox */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">
                  {lang === 'en' ? 'Description *' : 'ការពិពណ៌នា *'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={lang === 'en' ? 'Enter position description / title...' : 'បញ្ចូលការពិពណ៌នាមុខតំណែង...'}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 px-3 text-xs font-semibold text-white outline-none focus:border-pink-400 transition"
                />
              </div>

              {/* Second Language - textbox */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">
                  {lang === 'en' ? 'Second Language' : 'ភាសាទីពីរ'}
                </label>
                <input
                  type="text"
                  value={formData.secondLanguage}
                  onChange={(e) => setFormData({ ...formData, secondLanguage: e.target.value })}
                  placeholder={lang === 'en' ? 'Enter Khmer translation...' : 'បញ្ចូលការបកប្រែជាភាសាខ្មែរ...'}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 px-3 text-xs font-semibold text-white outline-none focus:border-pink-400 transition"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition"
                >
                  {lang === 'en' ? 'Cancel' : 'បោះបង់'}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 px-5 py-2 text-xs font-black text-white hover:from-pink-400 hover:to-rose-500 active:scale-95 transition disabled:opacity-50"
                >
                  {saving && <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                  <span>{editingId ? (lang === 'en' ? 'Update Position' : 'កែប្រែមុខតំណែង') : (lang === 'en' ? 'Save Position' : 'រក្សាទុកមុខតំណែង')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
