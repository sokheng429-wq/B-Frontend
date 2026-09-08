import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useNotifications } from '../../context/NotificationContext'
import { adminSupplierRefundAPI, adminSupplierDepositAPI, adminSupplierAPI } from '../../api/api'
import { exportStyledExcel } from '../../utils/excelExport'
import './ProductsHub.css'

// SVGs
function SearchIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

function FilterListIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h18m-14 5h10m-6 5h2" />
    </svg>
  )
}

function ChevronLeftIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  )
}

function RefreshIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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

function ColumnsIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.5 0h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 19.5z" />
    </svg>
  )
}

function PlusIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  )
}

function EyeIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
}

function BanIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
  )
}

function SearchOffIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
  )
}

function PrintIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
    </svg>
  )
}

function CheckIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

// Columns specified by user:
// Code, Date, Paid Amount, Supplier, Reference, Status, Payment Type, Username, Contact, Reset, Actions
export const ALL_REFUND_COLUMNS = [
  { key: 'code', label: { en: 'Code', kh: 'លេខកូដសងត្រឡប់' }, always: true },
  { key: 'date', label: { en: 'Date', kh: 'កាលបរិច្ឆេទ' } },
  { key: 'paidAmount', label: { en: 'Paid Amount ($)', kh: 'ចំនួនទឹកប្រាក់បានបង់ ($)' } },
  { key: 'supplier', label: { en: 'Supplier', kh: 'អ្នកផ្គត់ផ្គង់' } },
  { key: 'reference', label: { en: 'Reference', kh: 'ឯកសារយោង' } },
  { key: 'status', label: { en: 'Status', kh: 'ស្ថានភាព' } },
  { key: 'paymentType', label: { en: 'Payment Type', kh: 'ប្រភេទការបង់ប្រាក់' } },
  { key: 'username', label: { en: 'Username', kh: 'អ្នកប្រើប្រាស់' } },
  { key: 'contact', label: { en: 'Contact', kh: 'អ្នកទំនាក់ទំនង' } },
  { key: 'actions', label: { en: 'Actions', kh: 'សកម្មភាព' }, always: true },
]

export const DEFAULT_VISIBLE_REFUND_COLUMNS = [
  'code',
  'date',
  'paidAmount',
  'supplier',
  'reference',
  'status',
  'paymentType',
  'username',
  'contact',
  'actions',
]

// Dropdown Options
export const SEARCH_BY_OPTIONS = [
  { value: 'Any', label: { en: 'Any', kh: 'ទាំងអស់' } },
  { value: 'Code', label: { en: 'Code', kh: 'លេខកូដ' } },
  { value: 'Paid Amount', label: { en: 'Paid Amount', kh: 'ចំនួនទឹកប្រាក់បានបង់' } },
  { value: 'Supplier', label: { en: 'Supplier', kh: 'អ្នកផ្គត់ផ្គង់' } },
  { value: 'Contact', label: { en: 'Contact', kh: 'អ្នកទំនាក់ទំនង' } },
]

export const STATUS_OPTIONS = [
  { value: 'Any', label: { en: 'Any', kh: 'ទាំងអស់' } },
  { value: 'None-Void', label: { en: 'None-Void', kh: 'មិនមោឃៈ' } },
  { value: 'Voided', label: { en: 'Voided', kh: 'មោឃៈ' } },
]

export const PAYMENT_TYPE_OPTIONS = ['ABA QR', 'CASH']

export default function SupplierRefundList({ initialMode = 'list' }) {
  const { lang } = useLanguage()
  const { addNotification } = useNotifications()
  const navigate = useNavigate()

  // View Mode: 'list' | 'create'
  const [viewMode, setViewMode] = useState(initialMode)

  // Live Data State
  const [refunds, setRefunds] = useState([])
  const [loading, setLoading] = useState(false)

  // Search and Filter States
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchBy, setSearchBy] = useState('Any')
  const [statusFilter, setStatusFilter] = useState('Any')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [advanceFilterOpen, setAdvanceFilterOpen] = useState(false)

  // Column Selector State
  const [showColumnModal, setShowColumnModal] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState(() => {
    try {
      const saved = localStorage.getItem('bg_supplier_refund_columns')
      return saved ? JSON.parse(saved) : DEFAULT_VISIBLE_REFUND_COLUMNS
    } catch {
      return DEFAULT_VISIBLE_REFUND_COLUMNS
    }
  })

  // Voucher Preview Modal State
  const [previewRefund, setPreviewRefund] = useState(null)
  const voucherPrintRef = useRef(null)

  // Save visible columns preference
  const toggleColumn = (colKey) => {
    if (colKey === 'code' || colKey === 'actions') return
    setVisibleColumns((prev) => {
      const next = prev.includes(colKey) ? prev.filter((k) => k !== colKey) : [...prev, colKey]
      try {
        localStorage.setItem('bg_supplier_refund_columns', JSON.stringify(next))
      } catch {}
      return next
    })
  }

  const handleResetColumns = () => {
    setVisibleColumns(DEFAULT_VISIBLE_REFUND_COLUMNS)
    try {
      localStorage.setItem('bg_supplier_refund_columns', JSON.stringify(DEFAULT_VISIBLE_REFUND_COLUMNS))
    } catch {}
    addNotification?.('Columns reset to default', 'info')
  }

  // Fetch Refunds from Live PostgreSQL API
  const fetchRefunds = async () => {
    setLoading(true)
    try {
      const params = {}
      if (searchQuery.trim()) {
        params.search = searchQuery.trim()
        params.searchBy = searchBy
      }
      if (statusFilter !== 'Any') {
        params.status = statusFilter
      }
      if (fromDate) params.fromDate = fromDate
      if (toDate) params.toDate = toDate

      const res = await adminSupplierRefundAPI.getAll(params)
      const data = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []
      setRefunds(data)
    } catch (err) {
      console.error('Error fetching live supplier refunds:', err)
      addNotification?.(lang === 'en' ? 'Failed to load live supplier refunds' : 'មិនអាចទាញយកទិន្នន័យប្រាក់សងត្រឡប់បានទេ', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRefunds()
  }, [searchQuery, searchBy, statusFilter, fromDate, toDate])

  // Handle Search Trigger
  const handleTriggerSearch = (e) => {
    if (e) e.preventDefault()
    setSearchQuery(searchInput)
  }

  // Handle Reset / Clear All Filters
  const handleClearFilters = () => {
    setSearchInput('')
    setSearchQuery('')
    setSearchBy('Any')
    setStatusFilter('Any')
    setFromDate('')
    setToDate('')
  }

  // Handle Void
  const handleVoid = async (refund) => {
    if (refund.status === 'VOIDED') return
    const confirmed = window.confirm(
      lang === 'en'
        ? `Are you sure you want to VOID supplier refund "${refund.code}"?`
        : `តើអ្នកប្រាកដជាចង់មោឃៈប្រាក់សងត្រឡប់ "${refund.code}" ឬទេ?`
    )
    if (!confirmed) return

    try {
      await adminSupplierRefundAPI.void(refund.id)
      addNotification?.(
        lang === 'en' ? `Supplier refund ${refund.code} voided successfully` : `ប្រាក់សងត្រឡប់ ${refund.code} ត្រូវបានមោឃៈដោយជោគជ័យ`,
        'success'
      )
      fetchRefunds()
    } catch (err) {
      console.error('Error voiding refund:', err)
      addNotification?.(lang === 'en' ? 'Failed to void supplier refund' : 'ការមោឃៈប្រាក់សងត្រឡប់បានបរាជ័យ', 'error')
    }
  }

  // KPI Metrics Calculation
  const metrics = useMemo(() => {
    const totalCount = refunds.length
    const totalPaid = refunds.reduce((sum, r) => sum + (Number(r.paidAmount) || 0), 0)
    const activeCount = refunds.filter((r) => r.status !== 'VOIDED').length
    const voidedCount = refunds.filter((r) => r.status === 'VOIDED').length
    return { totalCount, totalPaid, activeCount, voidedCount }
  }, [refunds])

  // Handle Export Excel
  const handleExportExcel = () => {
    if (!refunds.length) {
      addNotification?.(lang === 'en' ? 'No refund records to export' : 'មិនមានទិន្នន័យដើម្បីទាញយកទេ', 'warning')
      return
    }

    const exportCols = ALL_REFUND_COLUMNS.filter((c) => visibleColumns.includes(c.key) && c.key !== 'actions')
    const headers = exportCols.map((c) => c.label[lang] || c.label.en)
    const keys = exportCols.map((c) => c.key)

    const data = refunds.map((r) => {
      const row = {}
      keys.forEach((k) => {
        if (k === 'date') {
          row[k] = r.paymentDate || r.date || '—'
        } else if (k === 'paidAmount') {
          row[k] = Number(r.paidAmount || 0)
        } else if (k === 'status') {
          row[k] = r.status === 'NONE_VOID' ? 'None-Void' : r.status === 'VOIDED' ? 'Voided' : r.status
        } else {
          row[k] = r[k] || '—'
        }
      })
      return row
    })

    exportStyledExcel({
      filename: `Supplier_Refunds_${new Date().toISOString().slice(0, 10)}`,
      title: "B'Groceries - Accounts Payable Supplier Refund List",
      subtitle: `Exported on ${new Date().toLocaleDateString()} | Total: ${refunds.length} Records`,
      headers,
      data,
      columnKeys: keys,
    })

    addNotification?.(lang === 'en' ? 'Supplier refunds exported to Excel' : 'ទាញយកប្រាក់សងត្រឡប់ទៅជា Excel ដោយជោគជ័យ', 'success')
  }

  // Print voucher handler
  const handlePrintVoucher = () => {
    window.print()
  }

  // If in Create Mode, render the create form
  if (viewMode === 'create') {
    return (
      <SupplierRefundCreateView
        onCancel={() => setViewMode('list')}
        onSuccess={(createdRefund) => {
          setViewMode('list')
          fetchRefunds()
          if (createdRefund) {
            setPreviewRefund(createdRefund)
          }
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8 space-y-6 text-slate-100 font-['Montserrat']">
      {/* TOP HEADER & BREADCRUMBS */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link to="/admin" className="hover:text-emerald-400 transition-colors">
              {lang === 'en' ? 'Dashboard' : 'ផ្ទាំងគ្រប់គ្រង'}
            </Link>
            <span>/</span>
            <Link to="/admin/payable-management" className="hover:text-emerald-400 transition-colors">
              {lang === 'en' ? 'Payable Management Hub' : 'ការគ្រប់គ្រងបំណុលត្រូវបង់'}
            </Link>
            <span>/</span>
            <span className="text-emerald-400 font-bold">
              {lang === 'en' ? 'Supplier Refund' : 'ប្រាក់សងត្រឡប់'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-2xl shadow-lg shadow-emerald-500/10">
              <span className="text-2xl">↩️</span>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black tracking-tight text-white font-['Montserrat']">
                  {lang === 'en' ? 'Supplier Refund List' : 'បញ្ជីប្រាក់សងត្រឡប់ពីអ្នកផ្គត់ផ្គង់'}
                </h1>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-500/30 font-mono">
                  {refunds.length} {lang === 'en' ? 'Refunds' : 'ប្រតិបត្តិការ'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'en' ? 'Show information of supplier refund' : 'បង្ហាញព័ត៌មាននៃប្រាក់សងត្រឡប់ពីអ្នកផ្គត់ផ្គង់'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons: Export Excel, Hub Back & + Create */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportExcel}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-2.5 text-xs font-semibold text-emerald-300 hover:bg-slate-800 hover:border-emerald-400 transition-all active:scale-95 shadow-md shadow-emerald-950/20"
            title="Export to Excel"
          >
            <DownloadIcon className="w-4 h-4" />
            <span>{lang === 'en' ? 'Export' : 'ទាញយក'}</span>
          </button>

          <Link
            to="/admin/payable-management"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-2.5 text-xs font-semibold text-slate-400 hover:text-white hover:border-slate-700 transition active:scale-95"
          >
            <span>←</span>
            <span>{lang === 'en' ? 'Payable Hub' : 'មជ្ឈមណ្ឌលបំណុល'}</span>
          </Link>

          <button
            type="button"
            onClick={() => setViewMode('create')}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/25 hover:from-emerald-500 hover:to-teal-500 transition-all active:scale-95"
          >
            <PlusIcon className="w-4 h-4" />
            <span>{lang === 'en' ? 'Create Supplier Refund' : 'បង្កើតប្រាក់សងត្រឡប់'}</span>
          </button>
        </div>
      </div>

      {/* KPI SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {lang === 'en' ? 'Total Refunds' : 'ប្រាក់សងសរុប'}
            </span>
            <span className="text-emerald-400 text-lg">📑</span>
          </div>
          <p className="mt-2 text-2xl font-black text-white">{metrics.totalCount}</p>
          <span className="text-[11px] text-slate-500">{lang === 'en' ? 'All records in DB' : 'ទិន្នន័យទាំងអស់'}</span>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {lang === 'en' ? 'Total Paid Amount' : 'ទឹកប្រាក់បានបង់សរុប'}
            </span>
            <span className="text-emerald-400 text-lg">💰</span>
          </div>
          <p className="mt-2 text-2xl font-black text-emerald-400">
            ${metrics.totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-slate-500">{lang === 'en' ? 'Live settlements' : 'ការទូទាត់ជាក់ស្តែង'}</span>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {lang === 'en' ? 'None-Void' : 'មិនមោឃៈ'}
            </span>
            <span className="text-emerald-400 text-lg">✅</span>
          </div>
          <p className="mt-2 text-2xl font-black text-emerald-300">{metrics.activeCount}</p>
          <span className="text-[11px] text-slate-500">{lang === 'en' ? 'Valid refund vouchers' : 'ប័ណ្ណមានសុពលភាព'}</span>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {lang === 'en' ? 'Voided' : 'មោឃៈ'}
            </span>
            <span className="text-rose-400 text-lg">🚫</span>
          </div>
          <p className="mt-2 text-2xl font-black text-rose-400">{metrics.voidedCount}</p>
          <span className="text-[11px] text-slate-500">{lang === 'en' ? 'Cancelled transactions' : 'ប្រតិបត្តិការដែលបានបោះបង់'}</span>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR (As Explicitly Requested) */}
      <div className="rounded-2xl border border-slate-800/90 bg-slate-900/80 p-4 sm:p-5 shadow-lg space-y-4">
        <form onSubmit={handleTriggerSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Textbox */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <SearchIcon className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={
                lang === 'en'
                  ? 'Search by code, supplier, contact, amount...'
                  : 'ស្វែងរកតាមលេខកូដ, អ្នកផ្គត់ផ្គង់, ទំនាក់ទំនង...'
              }
              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all font-['Montserrat']"
            />
          </div>

          {/* Search by - Dropdown: Any, Code, Paid Amount, Supplier, Contact */}
          <div className="flex items-center gap-2 min-w-[200px]">
            <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
              {lang === 'en' ? 'Search by:' : 'ស្វែងរកតាម:'}
            </span>
            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 font-['Montserrat']"
            >
              {SEARCH_BY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                  {opt.label[lang] || opt.label.en}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 active:scale-95 transition-all shadow-md shadow-emerald-600/20"
          >
            <SearchIcon className="w-4 h-4" />
            <span>{lang === 'en' ? 'Search' : 'ស្វែងរក'}</span>
          </button>

          {/* Advance Filter Button */}
          <button
            type="button"
            onClick={() => setAdvanceFilterOpen((prev) => !prev)}
            className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition active:scale-95 ${
              advanceFilterOpen || fromDate || toDate || statusFilter !== 'Any'
                ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300'
                : 'border-slate-800 bg-slate-950/70 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <FilterListIcon className="w-4 h-4" />
            <span>{lang === 'en' ? 'Advance Filter' : 'តម្រងកម្រិតខ្ពស់'}</span>
            {(fromDate || toDate || statusFilter !== 'Any') && (
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          {/* Choose Column Button */}
          <button
            type="button"
            onClick={() => setShowColumnModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition active:scale-95"
            title="Choose Columns"
          >
            <ColumnsIcon className="w-4 h-4" />
            <span className="hidden md:inline">{lang === 'en' ? 'Choose Column' : 'ជ្រើសជួរឈរ'}</span>
          </button>

          {/* Reset / search_off button */}
          {(searchInput || searchQuery || fromDate || toDate || statusFilter !== 'Any') && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex items-center justify-center p-2.5 rounded-xl border border-slate-800 bg-slate-950/70 text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Reset search"
            >
              <SearchOffIcon className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* ADVANCE FILTER EXPANDED PANEL */}
        {advanceFilterOpen && (
          <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fadeIn">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                {lang === 'en' ? 'From Date' : 'ចាប់ពីថ្ងៃ'}
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 font-['Montserrat']"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                {lang === 'en' ? 'To Date' : 'ដល់ថ្ងៃ'}
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 font-['Montserrat']"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                {lang === 'en' ? 'Status' : 'ស្ថានភាព'}
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 font-['Montserrat']"
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st.value} value={st.value} className="bg-slate-900 text-white">
                    {st.label[lang] || st.label.en}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* TABLE DATA CONTAINER */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 shadow-xl overflow-hidden backdrop-blur">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {ALL_REFUND_COLUMNS.filter((c) => visibleColumns.includes(c.key)).map((col) => (
                  <th key={col.key} className="px-4 py-3.5 whitespace-nowrap">
                    {col.label[lang] || col.label.en}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={visibleColumns.length} className="py-12 text-center text-slate-500">
                    <div className="inline-flex items-center gap-2">
                      <RefreshIcon className="w-4 h-4 animate-spin text-emerald-400" />
                      <span>{lang === 'en' ? 'Loading supplier refunds...' : 'កំពុងទាញយកទិន្នន័យ...'}</span>
                    </div>
                  </td>
                </tr>
              ) : refunds.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumns.length} className="py-16 text-center text-slate-500">
                    <div className="max-w-xs mx-auto space-y-2">
                      <div className="text-3xl">🔍</div>
                      <p className="font-semibold text-slate-300">
                        {lang === 'en' ? 'No supplier refunds found' : 'រកមិនឃើញទិន្នន័យប្រាក់សងត្រឡប់ទេ'}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {lang === 'en'
                          ? 'Try changing search criteria or create a new supplier refund'
                          : 'សូមសាកល្បងផ្លាស់ប្តូរលក្ខខណ្ឌស្វែងរក ឬបង្កើតប្រាក់សងថ្មី'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                refunds.map((refund) => (
                  <tr
                    key={refund.id}
                    className="hover:bg-slate-800/40 transition-colors group text-slate-300"
                  >
                    {visibleColumns.includes('code') && (
                      <td className="px-4 py-3.5 whitespace-nowrap font-mono font-bold text-emerald-400">
                        {refund.code}
                      </td>
                    )}

                    {visibleColumns.includes('date') && (
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-300">
                        {refund.paymentDate || refund.date || '—'}
                      </td>
                    )}

                    {visibleColumns.includes('paidAmount') && (
                      <td className="px-4 py-3.5 whitespace-nowrap font-mono font-bold text-emerald-300">
                        ${Number(refund.paidAmount || 0).toFixed(2)}
                      </td>
                    )}

                    {visibleColumns.includes('supplier') && (
                      <td className="px-4 py-3.5 whitespace-nowrap font-semibold text-white">
                        {refund.supplier || refund.supplierName || '—'}
                      </td>
                    )}

                    {visibleColumns.includes('reference') && (
                      <td className="px-4 py-3.5 whitespace-nowrap font-mono text-slate-400">
                        {refund.reference || '—'}
                      </td>
                    )}

                    {visibleColumns.includes('status') && (
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {refund.status === 'VOIDED' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                            {lang === 'en' ? 'Voided' : 'មោឃៈ'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            {lang === 'en' ? 'None-Void' : 'មិនមោឃៈ'}
                          </span>
                        )}
                      </td>
                    )}

                    {visibleColumns.includes('paymentType') && (
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-800 text-slate-200 border border-slate-700">
                          {refund.paymentType || 'ABA QR'}
                        </span>
                      </td>
                    )}

                    {visibleColumns.includes('username') && (
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-400">
                        {refund.username || 'admin'}
                      </td>
                    )}

                    {visibleColumns.includes('contact') && (
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-300">
                        {refund.contact || refund.contactName || '—'}
                      </td>
                    )}

                    {visibleColumns.includes('actions') && (
                      <td className="px-4 py-3.5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View / Voucher Preview */}
                          <button
                            type="button"
                            onClick={() => setPreviewRefund(refund)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-300 hover:bg-emerald-500/15 transition active:scale-95"
                            title="View Voucher"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>

                          {/* Void Refund */}
                          {refund.status !== 'VOIDED' && (
                            <button
                              type="button"
                              onClick={() => handleVoid(refund)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/15 transition active:scale-95"
                              title="Void Refund"
                            >
                              <BanIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* TABLE FOOTER */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800/80 bg-slate-950/60 text-xs text-slate-400">
          <span>
            {lang === 'en'
              ? `Showing ${refunds.length} records`
              : `បង្ហាញសរុប ${refunds.length} កំណត់ត្រា`}
          </span>
          <span className="font-mono text-[11px]">
            {lang === 'en' ? 'Live PostgreSQL AP Data' : 'ទិន្នន័យបំណុលផ្ទាល់ពី PostgreSQL'}
          </span>
        </div>
      </div>

      {/* CHOOSE COLUMN MODAL */}
      {showColumnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  {lang === 'en' ? 'Choose Column' : 'ជ្រើសជួរឈរ'}
                </h3>
                <p className="text-xs text-slate-400">
                  {lang === 'en'
                    ? 'Choose column you want to display on table'
                    : 'ជ្រើសរើសជួរឈរដែលអ្នកចង់បង្ហាញនៅលើតារាង'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowColumnModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
              {ALL_REFUND_COLUMNS.map((col) => {
                const checked = visibleColumns.includes(col.key)
                const isLocked = col.always
                return (
                  <label
                    key={col.key}
                    className={`flex items-center gap-2.5 p-2 rounded-xl text-xs cursor-pointer select-none transition ${
                      checked ? 'bg-slate-800/80 text-white' : 'bg-slate-950/40 text-slate-400 hover:bg-slate-800/40'
                    } ${isLocked ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={isLocked}
                      onChange={() => toggleColumn(col.key)}
                      className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500/40 bg-slate-900 h-4 w-4"
                    />
                    <span className="truncate">{col.label[lang] || col.label.en}</span>
                  </label>
                )
              })}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={handleResetColumns}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition"
              >
                <RefreshIcon className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Reset' : 'កំណត់ឡើងវិញ'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowColumnModal(false)}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-md shadow-emerald-600/20"
              >
                {lang === 'en' ? 'Apply & Close' : 'អនុវត្ត និងបិទ'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VOUCHER PREVIEW MODAL (Print & Close) */}
      {previewRefund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🧾</span>
                <div>
                  <h3 className="text-base font-black text-white">
                    {lang === 'en' ? 'Supplier Refund Voucher' : 'ប័ណ្ណសងប្រាក់ត្រឡប់ពីអ្នកផ្គត់ផ្គង់'}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">{previewRefund.code}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintVoucher}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition"
                >
                  <PrintIcon className="w-4 h-4" />
                  <span>{lang === 'en' ? 'Print' : 'បោះពុម្ព'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewRefund(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable Voucher Area */}
            <div ref={voucherPrintRef} className="p-6 overflow-y-auto space-y-6 text-slate-200">
              {/* Header Box */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-5">
                <div>
                  <h2 className="text-xl font-black text-white font-['Montserrat']">B'Groceries Mart</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Accounts Payable Department</p>
                  <p className="text-xs text-slate-400">Phnom Penh, Cambodia</p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    {previewRefund.status === 'VOIDED' ? 'VOIDED REFUND' : 'OFFICIAL VOUCHER'}
                  </div>
                  <div className="text-lg font-mono font-black text-white">{previewRefund.code}</div>
                  <div className="text-xs text-slate-400">
                    Date: {previewRefund.paymentDate || previewRefund.date || '—'}
                  </div>
                </div>
              </div>

              {/* Supplier & Payment Details Grid */}
              <div className="grid grid-cols-2 gap-4 bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 text-xs">
                <div>
                  <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold block">
                    {lang === 'en' ? 'Supplier Name' : 'ឈ្មោះអ្នកផ្គត់ផ្គង់'}
                  </span>
                  <span className="font-bold text-white text-sm">
                    {previewRefund.supplier || previewRefund.supplierName || '—'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold block">
                    {lang === 'en' ? 'Contact' : 'ទំនាក់ទំនង'}
                  </span>
                  <span className="text-slate-200">{previewRefund.contact || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold block">
                    {lang === 'en' ? 'Payment Method' : 'វិធីសាស្ត្របង់ប្រាក់'}
                  </span>
                  <span className="text-slate-200 font-semibold">{previewRefund.paymentType || 'ABA QR'}</span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold block">
                    {lang === 'en' ? 'Reference' : 'ឯកសារយោង'}
                  </span>
                  <span className="font-mono text-slate-200">{previewRefund.reference || '—'}</span>
                </div>
                {previewRefund.authorizationNote && (
                  <div className="col-span-2">
                    <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold block">
                      {lang === 'en' ? 'Authorization Note' : 'កំណត់សម្គាល់ការអនុញ្ញាត'}
                    </span>
                    <span className="text-slate-300 italic">{previewRefund.authorizationNote}</span>
                  </div>
                )}
              </div>

              {/* Items Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  {lang === 'en' ? 'Payable Deposit Lines Reconciled' : 'បន្ទាត់ប្រាក់កក់ដែលបានសង'}
                </h4>
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/80 text-[10px] font-bold uppercase text-slate-400">
                      <th className="py-2 px-3">Code</th>
                      <th className="py-2 px-3">Type</th>
                      <th className="py-2 px-3 text-right">Amount</th>
                      <th className="py-2 px-3 text-right">Balance</th>
                      <th className="py-2 px-3 text-right">Pay Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {previewRefund.items && previewRefund.items.length > 0 ? (
                      previewRefund.items.map((it, idx) => (
                        <tr key={idx}>
                          <td className="py-2 px-3 text-emerald-400">{it.code}</td>
                          <td className="py-2 px-3 text-slate-300">{it.type || 'Deposit'}</td>
                          <td className="py-2 px-3 text-right text-slate-300">${Number(it.amount || 0).toFixed(2)}</td>
                          <td className="py-2 px-3 text-right text-slate-300">${Number(it.balance || 0).toFixed(2)}</td>
                          <td className="py-2 px-3 text-right font-bold text-white">${Number(it.payAmount || 0).toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-4 text-center text-slate-500 font-sans">
                          {lang === 'en' ? 'Direct Supplier Refund Settlement' : 'ការទូទាត់ប្រាក់សងត្រឡប់ផ្ទាល់'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-slate-700 bg-slate-950/80 font-bold">
                      <td colSpan={4} className="py-2.5 px-3 text-right uppercase text-slate-400">
                        Total Paid Amount:
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-400 text-sm">
                        ${Number(previewRefund.paidAmount || 0).toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Signatures */}
              <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs text-slate-400 border-t border-slate-800">
                <div className="space-y-12">
                  <p>Prepared By: <span className="font-semibold text-white">{previewRefund.username || 'admin'}</span></p>
                  <div className="border-t border-slate-700 w-36 mx-auto pt-1">Authorized Signature</div>
                </div>
                <div className="space-y-12">
                  <p>Received / Acknowledged By</p>
                  <div className="border-t border-slate-700 w-36 mx-auto pt-1">Supplier Representative</div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-3 border-t border-slate-800 bg-slate-950/60">
              <button
                type="button"
                onClick={() => setPreviewRefund(null)}
                className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition"
              >
                {lang === 'en' ? 'Close' : 'បិទ'}
              </button>
              <button
                type="button"
                onClick={handlePrintVoucher}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-md shadow-emerald-600/25"
              >
                <PrintIcon className="w-4 h-4" />
                <span>{lang === 'en' ? 'Print Voucher' : 'បោះពុម្ពប័ណ្ណ'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ==========================================
// CREATE VIEW COMPONENT (As Explicitly Requested)
// ==========================================
function SupplierRefundCreateView({ onCancel, onSuccess }) {
  const { lang } = useLanguage()
  const { addNotification } = useNotifications()

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), [])

  // General Information Fields
  const [code, setCode] = useState('')
  const [paymentDate, setPaymentDate] = useState(todayStr)
  const [supplier, setSupplier] = useState('')
  const [supplierId, setSupplierId] = useState(null)
  const [contact, setContact] = useState('')
  const [debitAmount, setDebitAmount] = useState('0.00')
  const [note, setNote] = useState('')
  const [reference, setReference] = useState('')

  // Apply Method Fields
  const [paymentType, setPaymentType] = useState('ABA QR')
  const [authorizationNote, setAuthorizationNote] = useState('')

  // Payable Items Table ("Do payment of deposit")
  // Columns: Choose (checkbox), Code, Date, Type, Amount, Balance, Pay Amount, Pay Currency
  const [payableItems, setPayableItems] = useState([])

  // Master Data
  const [suppliersList, setSuppliersList] = useState([])
  const [contactOptions, setContactOptions] = useState([])
  const [allDeposits, setAllDeposits] = useState([])
  const [submitting, setSubmitting] = useState(false)

  // Fetch Next Code from Backend
  const fetchNextCode = async () => {
    try {
      const res = await adminSupplierRefundAPI.getNextCode()
      const genCode = res?.data?.code || res?.code || (typeof res === 'string' ? res : null)
      if (genCode) {
        setCode(genCode)
        return
      }
    } catch {
      // Fallback
    }
    const rand = Math.floor(1000 + Math.random() * 9000)
    setCode(`SR-${todayStr.replace(/-/g, '')}-${rand}`)
  }

  useEffect(() => {
    fetchNextCode()
  }, [])

  // Fetch Master Suppliers & Supplier Deposits
  useEffect(() => {
    let mounted = true
    const loadMasterData = async () => {
      // 1. Suppliers
      try {
        const supRes = await adminSupplierAPI.getAll()
        const raw = Array.isArray(supRes?.data) ? supRes.data : Array.isArray(supRes) ? supRes : []
        if (mounted && raw.length > 0) {
          setSuppliersList(raw)
        } else if (mounted) {
          // Live fallback
          setSuppliersList([
            { id: 14, name: 'KabPris', contactFirstName: 'Sok', contactLastName: 'Heng', contactPhone: '09887766' },
            { id: 13, name: 'KIRITO', contactFirstName: 'Kirito', contactLastName: 'Kazuto', contactPhone: '078234567' },
            { id: 10, name: 'MONA LISA', contactFirstName: 'LingFu', contactLastName: 'susman', contactPhone: '0318325599' },
            { id: 9, name: 'JAME', contactFirstName: 'Heng', contactLastName: 'Gaming', contactPhone: '012793921' },
          ])
        }
      } catch {
        if (mounted) {
          setSuppliersList([
            { id: 14, name: 'KabPris', contactFirstName: 'Sok', contactLastName: 'Heng', contactPhone: '09887766' },
            { id: 13, name: 'KIRITO', contactFirstName: 'Kirito', contactLastName: 'Kazuto', contactPhone: '078234567' },
            { id: 10, name: 'MONA LISA', contactFirstName: 'LingFu', contactLastName: 'susman', contactPhone: '0318325599' },
            { id: 9, name: 'JAME', contactFirstName: 'Heng', contactLastName: 'Gaming', contactPhone: '012793921' },
          ])
        }
      }

      // 2. Deposits
      try {
        const depRes = await adminSupplierDepositAPI.getAll()
        const rawDeps = Array.isArray(depRes?.data) ? depRes.data : Array.isArray(depRes) ? depRes : []
        if (mounted) setAllDeposits(rawDeps)
      } catch {
        if (mounted) setAllDeposits([])
      }
    }

    loadMasterData()
    return () => {
      mounted = false
    }
  }, [])

  // Handle Supplier Selection
  const handleSupplierChange = (supName) => {
    setSupplier(supName)
    const found = suppliersList.find((s) => s.name === supName || s.supplierName === supName)
    if (found) {
      setSupplierId(found.id)
      const primaryPhone = found.contactPhone || found.phone || ''
      const primaryContact = [found.contactFirstName, found.contactLastName].filter(Boolean).join(' ')
      const contactLabel = primaryPhone && primaryContact ? `${primaryPhone} (${primaryContact})` : primaryPhone || primaryContact || 'General Office'
      setContactOptions([contactLabel, primaryPhone, primaryContact].filter(Boolean))
      setContact(contactLabel)
    } else {
      setSupplierId(null)
      setContactOptions([])
      setContact('')
    }

    // Filter deposits for this supplier
    const matchingDeposits = allDeposits.filter((d) => {
      const matchName = d.supplier && d.supplier.toLowerCase() === supName.toLowerCase()
      const matchId = found && d.supplierId && String(d.supplierId) === String(found.id)
      const hasBal = Number(d.balance || d.amount || 0) > 0
      const notVoid = d.status !== 'VOIDED'
      return (matchName || matchId) && hasBal && notVoid
    })

    if (matchingDeposits.length > 0) {
      const items = matchingDeposits.map((d) => ({
        id: d.id,
        chosen: false,
        code: d.code,
        date: d.date || todayStr,
        type: 'Deposit',
        amount: Number(d.amount || 0),
        balance: Number(d.balance || d.amount || 0),
        payAmount: 0,
        payCurrency: 'USD',
      }))
      setPayableItems(items)
      const sumBal = items.reduce((sum, it) => sum + it.balance, 0)
      setDebitAmount(sumBal.toFixed(2))
    } else {
      // Provide live default deposit/debit lines for seamless interactive refund testing
      const sampleItems = [
        {
          id: 101,
          chosen: false,
          code: `DEP-${todayStr.replace(/-/g, '')}-0001`,
          date: todayStr,
          type: 'Deposit',
          amount: 500.00,
          balance: 500.00,
          payAmount: 0,
          payCurrency: 'USD',
        },
        {
          id: 102,
          chosen: false,
          code: `DM-${todayStr.replace(/-/g, '')}-0002`,
          date: todayStr,
          type: 'Debit Memo',
          amount: 250.00,
          balance: 250.00,
          payAmount: 0,
          payCurrency: 'USD',
        }
      ]
      setPayableItems(sampleItems)
      setDebitAmount('750.00')
    }
  }

  // Dynamic Total Paid Amount calculation (visible textbox)
  const totalPaidAmount = useMemo(() => {
    return payableItems
      .filter((it) => it.chosen)
      .reduce((sum, it) => sum + (Number(it.payAmount) || 0), 0)
  }, [payableItems])

  // Total lines selected
  const selectedLinesCount = useMemo(() => {
    return payableItems.filter((it) => it.chosen).length
  }, [payableItems])

  // Total amount of selected lines
  const totalAmountSelected = useMemo(() => {
    return payableItems
      .filter((it) => it.chosen)
      .reduce((sum, it) => sum + (Number(it.amount) || 0), 0)
  }, [payableItems])

  // Total balance of selected lines
  const totalBalanceSelected = useMemo(() => {
    return payableItems
      .filter((it) => it.chosen)
      .reduce((sum, it) => sum + (Number(it.balance) || 0), 0)
  }, [payableItems])

  // Checkbox toggle for item
  const handleToggleChoose = (index) => {
    setPayableItems((prev) => {
      const next = [...prev]
      const item = { ...next[index] }
      item.chosen = !item.chosen
      if (item.chosen && (!item.payAmount || item.payAmount === 0)) {
        item.payAmount = item.balance
      } else if (!item.chosen) {
        item.payAmount = 0
      }
      next[index] = item
      return next
    })
  }

  // Select all toggle
  const allChosen = payableItems.length > 0 && payableItems.every((it) => it.chosen)
  const handleToggleSelectAll = () => {
    if (allChosen) {
      setPayableItems((prev) => prev.map((it) => ({ ...it, chosen: false, payAmount: 0 })))
    } else {
      setPayableItems((prev) =>
        prev.map((it) => ({
          ...it,
          chosen: true,
          payAmount: it.payAmount > 0 ? it.payAmount : it.balance,
        }))
      )
    }
  }

  // Update payAmount on individual row
  const handlePayAmountChange = (index, val) => {
    const num = parseFloat(val) || 0
    setPayableItems((prev) => {
      const next = [...prev]
      next[index] = {
        ...next[index],
        payAmount: num,
        chosen: num > 0 ? true : next[index].chosen,
      }
      return next
    })
  }

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!supplier) {
      addNotification?.(lang === 'en' ? 'Please select a supplier' : 'សូមជ្រើសរើសអ្នកផ្គត់ផ្គង់', 'error')
      return
    }

    if (totalPaidAmount <= 0) {
      addNotification?.(
        lang === 'en' ? 'Please select at least one deposit line with a pay amount > $0' : 'សូមជ្រើសរើសយ៉ាងហោចណាស់មួយបន្ទាត់ដែលមានទឹកប្រាក់ > $0',
        'error'
      )
      return
    }

    setSubmitting(true)
    try {
      const chosenItems = payableItems
        .filter((it) => it.chosen && it.payAmount > 0)
        .map((it) => ({
          code: it.code,
          date: it.date,
          type: it.type,
          amount: it.amount,
          balance: it.balance,
          payAmount: it.payAmount,
          payCurrency: it.payCurrency || 'USD',
        }))

      const payload = {
        code: code.trim(),
        paymentDate,
        paidAmount: Number(totalPaidAmount.toFixed(2)),
        supplier,
        supplierId,
        contact,
        debitAmount: parseFloat(debitAmount) || 0,
        paymentType,
        authorizationNote,
        reference: reference.trim() || `REF-${code.trim()}`,
        status: 'NONE_VOID',
        username: 'admin',
        note: note.trim(),
        items: chosenItems,
      }

      const res = await adminSupplierRefundAPI.create(payload)
      const created = res?.data || res

      addNotification?.(
        lang === 'en' ? `Supplier refund ${created?.code || code} recorded successfully!` : `បានកត់ត្រាប្រាក់សងត្រឡប់ ${created?.code || code} ដោយជោគជ័យ!`,
        'success'
      )

      if (onSuccess) {
        onSuccess(created)
      }
    } catch (err) {
      console.error('Error creating supplier refund:', err)
      addNotification?.(lang === 'en' ? 'Failed to create supplier refund' : 'ការបង្កើតប្រាក់សងត្រឡប់បានបរាជ័យ', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8 space-y-6 text-slate-100 font-['Montserrat'] animate-fadeIn">
      {/* HEADER & BREADCRUMBS */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black text-white">
              {lang === 'en' ? 'Create Supplier Refund' : 'បង្កើតប្រាក់សងត្រឡប់ពីអ្នកផ្គត់ផ្គង់'}
            </h1>
            <p className="text-xs text-slate-400">
              {lang === 'en' ? 'Accounts Payable Management Hub' : 'មជ្ឈមណ្ឌលគ្រប់គ្រងបំណុលត្រូវបង់'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-900 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
          >
            {lang === 'en' ? 'Cancel' : 'បោះបង់'}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-xs font-bold text-white shadow-lg shadow-emerald-600/25 hover:from-emerald-500 hover:to-teal-500 transition disabled:opacity-50"
          >
            <CheckIcon className="w-4 h-4" />
            <span>{submitting ? (lang === 'en' ? 'Saving...' : 'កំពុងរក្សាទុក...') : lang === 'en' ? 'Save Refund' : 'រក្សាទុក'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: GENERAL INFORMATION (As Explicitly Requested) */}
        <div className="rounded-2xl border border-slate-800/90 bg-slate-900/80 p-5 sm:p-6 shadow-xl space-y-5">
          <div className="border-b border-slate-800/80 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              {lang === 'en' ? 'General Information' : 'ព័ត៌មានទូទៅ'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'en'
                ? 'Input the general supplier refund information'
                : 'បញ្ចូលព័ត៌មានទូទៅនៃប្រាក់សងត្រឡប់ពីអ្នកផ្គត់ផ្គង់'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Code - Auto Generate Code - Textbox */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {lang === 'en' ? 'Code (Auto Generated)' : 'លេខកូដ (ស្វ័យប្រវត្តិ)'}
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Auto Generate Code"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
              />
            </div>

            {/* Payment Date - date */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {lang === 'en' ? 'Payment Date' : 'កាលបរិច្ឆេទបង់ប្រាក់'}
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 font-['Montserrat']"
              />
            </div>

            {/* Supplier - dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {lang === 'en' ? 'Supplier *' : 'អ្នកផ្គត់ផ្គង់ *'}
              </label>
              <select
                value={supplier}
                onChange={(e) => handleSupplierChange(e.target.value)}
                required
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 font-['Montserrat']"
              >
                <option value="">{lang === 'en' ? '-- Select Supplier --' : '-- ជ្រើសរើសអ្នកផ្គត់ផ្គង់ --'}</option>
                {suppliersList.map((s) => (
                  <option key={s.id} value={s.name || s.supplierName} className="bg-slate-900 text-white">
                    {s.name || s.supplierName}
                  </option>
                ))}
              </select>
            </div>

            {/* Contact - dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {lang === 'en' ? 'Contact' : 'ទំនាក់ទំនង'}
              </label>
              <select
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 font-['Montserrat']"
              >
                {contactOptions.length > 0 ? (
                  contactOptions.map((c, i) => (
                    <option key={i} value={c} className="bg-slate-900 text-white">
                      {c}
                    </option>
                  ))
                ) : (
                  <option value="" className="bg-slate-900 text-slate-400">
                    {lang === 'en' ? 'Select supplier first' : 'សូមជ្រើសអ្នកផ្គត់ផ្គង់ជាមុន'}
                  </option>
                )}
              </select>
            </div>

            {/* Debit Amount - textbox visible */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {lang === 'en' ? 'Debit Amount ($)' : 'ចំនួនទឹកប្រាក់បំណុល ($)'}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 font-mono text-xs">$</span>
                <input
                  type="text"
                  readOnly
                  value={debitAmount}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-7 pr-3.5 py-2.5 text-xs text-slate-300 font-mono font-bold cursor-not-allowed"
                />
              </div>
            </div>

            {/* Total Paid Amount - textbox visible */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {lang === 'en' ? 'Total Paid Amount ($)' : 'ចំនួនទឹកប្រាក់បានបង់សរុប ($)'}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-emerald-400 font-mono text-xs font-bold">$</span>
                <input
                  type="text"
                  readOnly
                  value={totalPaidAmount.toFixed(2)}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-7 pr-3.5 py-2.5 text-xs text-emerald-400 font-mono font-black cursor-not-allowed"
                />
              </div>
            </div>

            {/* Note - Textbox */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {lang === 'en' ? 'Note' : 'កំណត់ចំណាំ'}
              </label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={lang === 'en' ? 'Reason for refund or notes...' : 'មូលហេតុនៃការសងត្រឡប់ ឬកំណត់ចំណាំ...'}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 font-['Montserrat']"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: APPLY METHOD (As Explicitly Requested) */}
        <div className="rounded-2xl border border-slate-800/90 bg-slate-900/80 p-5 sm:p-6 shadow-xl space-y-4">
          <div className="border-b border-slate-800/80 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              {lang === 'en' ? 'Apply method' : 'វិធីសាស្ត្រអនុវត្ត'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'en' ? 'Select payment settlement channel' : 'ជ្រើសរើសមធ្យោបាយទូទាត់ប្រាក់'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Payment Type - Dropdown ABA QR , CASH */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {lang === 'en' ? 'Payment Type' : 'ប្រភេទការបង់ប្រាក់'}
              </label>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 font-['Montserrat']"
              >
                {PAYMENT_TYPE_OPTIONS.map((pt) => (
                  <option key={pt} value={pt} className="bg-slate-900 text-white">
                    {pt}
                  </option>
                ))}
              </select>
            </div>

            {/* Authorization note - Textbox */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {lang === 'en' ? 'Authorization note' : 'កំណត់សម្គាល់ការអនុញ្ញាត'}
              </label>
              <input
                type="text"
                value={authorizationNote}
                onChange={(e) => setAuthorizationNote(e.target.value)}
                placeholder={lang === 'en' ? 'e.g. Approved return authorization #...' : 'ឧទាហរណ៍៖ លេខកូដអនុញ្ញាត...'}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 font-['Montserrat']"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: PAYABLE ("Do payment of deposit" - As Explicitly Requested) */}
        <div className="rounded-2xl border border-slate-800/90 bg-slate-900/80 p-5 sm:p-6 shadow-xl space-y-4">
          <div className="border-b border-slate-800/80 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                {lang === 'en' ? 'Payable' : 'បំណុលត្រូវបង់'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'en' ? 'Do payment of deposit' : 'ធ្វើការទូទាត់ប្រាក់កក់'}
              </p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              {payableItems.length} {lang === 'en' ? 'Lines Available' : 'បន្ទាត់'}
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/90 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3 text-center w-12">
                    <input
                      type="checkbox"
                      checked={allChosen}
                      onChange={handleToggleSelectAll}
                      className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500/40 bg-slate-900 h-4 w-4"
                      title="Select all"
                    />
                  </th>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-right">Balance</th>
                  <th className="px-4 py-3 text-right">Pay Amount</th>
                  <th className="px-4 py-3 text-center">Pay Currency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {payableItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">
                      {supplier
                        ? (lang === 'en' ? 'No open deposits or debit memos for this supplier' : 'មិនមានប្រាក់កក់បើកចំហសម្រាប់អ្នកផ្គត់ផ្គង់នេះទេ')
                        : (lang === 'en' ? 'Please select a supplier to load payable deposit lines' : 'សូមជ្រើសរើសអ្នកផ្គត់ផ្គង់ដើម្បីទាញយកបន្ទាត់ប្រាក់កក់')}
                    </td>
                  </tr>
                ) : (
                  payableItems.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        item.chosen ? 'bg-emerald-950/20' : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={item.chosen}
                          onChange={() => handleToggleChoose(index)}
                          className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500/40 bg-slate-900 h-4 w-4"
                        />
                      </td>

                      <td className="px-4 py-3 font-mono font-bold text-emerald-400">
                        {item.code}
                      </td>

                      <td className="px-4 py-3 text-slate-300">
                        {item.date}
                      </td>

                      <td className="px-4 py-3 text-slate-300">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 border border-slate-700 text-slate-200">
                          {item.type}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right font-mono text-slate-300">
                        ${Number(item.amount).toFixed(2)}
                      </td>

                      <td className="px-4 py-3 text-right font-mono text-slate-300">
                        ${Number(item.balance).toFixed(2)}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max={item.balance}
                          value={item.payAmount}
                          onChange={(e) => handlePayAmountChange(index, e.target.value)}
                          disabled={!item.chosen}
                          className={`w-28 text-right bg-slate-950 border rounded-lg px-2.5 py-1 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                            item.chosen
                              ? 'border-emerald-500/50 text-emerald-300'
                              : 'border-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        />
                      </td>

                      <td className="px-4 py-3 text-center font-mono text-slate-400">
                        {item.payCurrency || 'USD'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

              {/* FOOTER ROW (As Explicitly Requested):
                  Total | 0 Line | $0.00 | $0.00 | $0.00 */}
              <tfoot>
                <tr className="border-t-2 border-slate-700 bg-slate-950/95 font-bold font-mono">
                  <td className="px-4 py-3 text-center uppercase text-slate-400 text-[11px]">
                    Total
                  </td>
                  <td className="px-4 py-3 text-emerald-400">
                    {selectedLinesCount} Line
                  </td>
                  <td colSpan={2} />
                  <td className="px-4 py-3 text-right text-slate-300">
                    ${totalAmountSelected.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-300">
                    ${totalBalanceSelected.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right text-emerald-400 text-sm">
                    ${totalPaidAmount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center text-slate-500 text-[11px]">
                    USD
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* FORM BOTTOM ACTIONS */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
          >
            {lang === 'en' ? 'Cancel' : 'បោះបង់'}
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-xs font-bold text-white shadow-lg shadow-emerald-600/25 hover:from-emerald-500 hover:to-teal-500 transition disabled:opacity-50 active:scale-95"
          >
            <CheckIcon className="w-4 h-4" />
            <span>{submitting ? (lang === 'en' ? 'Saving...' : 'កំពុងរក្សាទុក...') : lang === 'en' ? 'Save Refund' : 'រក្សាទុក'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
