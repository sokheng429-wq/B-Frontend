import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useNotifications } from '../../context/NotificationContext'
import { adminSupplierDepositAPI, adminSupplierAPI } from '../../api/api'
import { exportStyledExcel } from '../../utils/excelExport'
import crownIcon from '../../assets/icon/3dicons-crown-dynamic-color.png'
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
// Code, Date, Amount, Balance, Service Charge, Supplier, Status, Payment Type, Reference, Username, Contact, Reset Button, Actions
export const ALL_DEPOSIT_COLUMNS = [
  { key: 'code', label: { en: 'Code', kh: 'លេខកូដប្រាក់កក់' }, always: true },
  { key: 'date', label: { en: 'Date', kh: 'កាលបរិច្ឆេទ' } },
  { key: 'amount', label: { en: 'Amount ($)', kh: 'ចំនួនទឹកប្រាក់ ($)' } },
  { key: 'balance', label: { en: 'Balance ($)', kh: 'សមតុល្យ ($)' } },
  { key: 'serviceCharge', label: { en: 'Service Charge ($)', kh: 'ថ្លៃសេវា ($)' } },
  { key: 'supplier', label: { en: 'Supplier', kh: 'អ្នកផ្គត់ផ្គង់' } },
  { key: 'status', label: { en: 'Status', kh: 'ស្ថានភាព' } },
  { key: 'paymentType', label: { en: 'Payment Type', kh: 'ប្រភេទការបង់ប្រាក់' } },
  { key: 'reference', label: { en: 'Reference', kh: 'ឯកសារយោង' } },
  { key: 'username', label: { en: 'Username', kh: 'អ្នកប្រើប្រាស់' } },
  { key: 'contact', label: { en: 'Contact', kh: 'អ្នកទំនាក់ទំនង' } },
  { key: 'actions', label: { en: 'Actions', kh: 'សកម្មភាព' }, always: true },
]

export const DEFAULT_VISIBLE_DEPOSIT_COLUMNS = [
  'code',
  'date',
  'amount',
  'balance',
  'serviceCharge',
  'supplier',
  'status',
  'paymentType',
  'reference',
  'username',
  'contact',
  'actions',
]

// Dropdown Options
export const SEARCH_BY_OPTIONS = [
  { value: 'Any', label: { en: 'Any', kh: 'ទាំងអស់' } },
  { value: 'Code', label: { en: 'Code', kh: 'លេខកូដ' } },
  { value: 'Amount', label: { en: 'Amount', kh: 'ចំនួនទឹកប្រាក់' } },
]

export const STATUS_OPTIONS = [
  { value: 'Any', label: { en: 'Any', kh: 'ទាំងអស់' } },
  { value: 'None-void', label: { en: 'None-void', kh: 'មិនមោឃៈ' } },
  { value: 'voided', label: { en: 'voided', kh: 'មោឃៈ' } },
]

export const PAYMENT_TYPE_OPTIONS = ['ABA QR', 'CASH', 'BANK TRANSFER', 'CHEQUE']

export default function SupplierDepositList({ initialMode = 'list' }) {
  const { lang } = useLanguage()
  const { addNotification } = useNotifications()
  const navigate = useNavigate()

  // View Mode: 'list' | 'create'
  const [viewMode, setViewMode] = useState(initialMode)

  // Deposits Data & Loading
  const [deposits, setDeposits] = useState([])
  const [loading, setLoading] = useState(true)

  // 1. Search States
  // Search - Textbox
  // Search By - Dropdown , Any , Code , Amount
  // Search button
  const [searchText, setSearchText] = useState('')
  const [searchBy, setSearchBy] = useState('Any')
  const [appliedSearch, setAppliedSearch] = useState({ text: '', by: 'Any' })

  // 2. Advance Filter States
  // Advance Filter - From Date to Date
  // Status - Dropdown , None-void, voided
  const [advanceFilterOpen, setAdvanceFilterOpen] = useState(false)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [statusFilter, setStatusFilter] = useState('Any')

  // 3. Choose Column States & Persistence
  const [chooseColumnOpen, setChooseColumnOpen] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState(() => {
    try {
      const saved = localStorage.getItem('bg_supplier_deposit_columns')
      return saved ? JSON.parse(saved) : DEFAULT_VISIBLE_DEPOSIT_COLUMNS
    } catch {
      return DEFAULT_VISIBLE_DEPOSIT_COLUMNS
    }
  })

  useEffect(() => {
    localStorage.setItem('bg_supplier_deposit_columns', JSON.stringify(visibleColumns))
  }, [visibleColumns])

  // 4. Detail Modal State
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedDeposit, setSelectedDeposit] = useState(null)

  // Fetch Deposits from Live API
  const fetchDeposits = async () => {
    try {
      setLoading(true)
      const params = {}
      if (appliedSearch.text.trim()) {
        params.search = appliedSearch.text.trim()
        if (appliedSearch.by !== 'Any') params.searchBy = appliedSearch.by
      }
      if (statusFilter !== 'Any') {
        params.status = statusFilter
      }
      if (fromDate) params.fromDate = fromDate
      if (toDate) params.toDate = toDate

      const res = await adminSupplierDepositAPI.getAll(params)
      const list = res?.data || res || []
      setDeposits(Array.isArray(list) ? list : [])
    } catch (err) {
      console.error('Failed to fetch supplier deposits:', err)
      addNotification?.(err.message || 'Failed to load supplier deposits', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (viewMode === 'list') {
      fetchDeposits()
    }
  }, [appliedSearch, statusFilter, fromDate, toDate, viewMode])

  // Trigger Search
  const handleTriggerSearch = () => {
    setAppliedSearch({ text: searchText, by: searchBy })
  }

  // Reset Filters Action (search_off)
  const handleResetFilters = () => {
    setSearchText('')
    setSearchBy('Any')
    setAppliedSearch({ text: '', by: 'Any' })
    setFromDate('')
    setToDate('')
    setStatusFilter('Any')
    addNotification?.('Filters reset to default', 'info')
  }

  // Column Chooser Helpers
  const toggleColumn = (key) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  const selectAllColumns = () => {
    setVisibleColumns(ALL_DEPOSIT_COLUMNS.map((c) => c.key))
  }

  const deselectAllColumns = () => {
    setVisibleColumns(['code', 'actions'])
  }

  const resetDefaultColumns = () => {
    setVisibleColumns(DEFAULT_VISIBLE_DEPOSIT_COLUMNS)
    addNotification?.('Columns reset to default', 'info')
  }

  // Active advance filter count
  const activeAdvanceFilterCount = useMemo(() => {
    let count = 0
    if (fromDate) count++
    if (toDate) count++
    if (statusFilter !== 'Any') count++
    return count
  }, [fromDate, toDate, statusFilter])

  // Summary Metrics
  const summaryMetrics = useMemo(() => {
    const totalCount = deposits.length
    const totalAmount = deposits
      .filter((d) => d.status !== 'VOIDED')
      .reduce((sum, d) => sum + (Number(d.amount) || 0), 0)
    const totalBalance = deposits
      .filter((d) => d.status !== 'VOIDED')
      .reduce((sum, d) => sum + (Number(d.balance) || 0), 0)
    const voidedCount = deposits.filter((d) => d.status === 'VOIDED').length
    const activeCount = totalCount - voidedCount
    return { totalCount, totalAmount, totalBalance, activeCount, voidedCount }
  }, [deposits])

  // Void Action
  const handleVoidDeposit = async (id, code) => {
    if (!window.confirm(`Are you sure you want to void Supplier Deposit ${code}?`)) return
    try {
      await adminSupplierDepositAPI.void(id)
      addNotification?.(`Supplier Deposit ${code} voided successfully`, 'success')
      fetchDeposits()
      if (selectedDeposit && selectedDeposit.id === id) {
        setSelectedDeposit((prev) => ({ ...prev, status: 'VOIDED' }))
      }
    } catch (err) {
      addNotification?.(err.message || 'Failed to void supplier deposit', 'error')
    }
  }

  // Export to Excel
  const handleExportExcel = () => {
    if (deposits.length === 0) {
      addNotification?.('No supplier deposits to export', 'warning')
      return
    }

    const headers = []
    const keys = []

    ALL_DEPOSIT_COLUMNS.forEach((col) => {
      if (col.key !== 'actions' && visibleColumns.includes(col.key)) {
        headers.push(col.label[lang] || col.label.en)
        keys.push(col.key)
      }
    })

    const data = deposits.map((d) => {
      const row = {}
      keys.forEach((k) => {
        if (k === 'amount' || k === 'balance' || k === 'serviceCharge') {
          row[k] = Number(d[k] || 0)
        } else if (k === 'status') {
          row[k] = d.status === 'NONE_VOID' ? 'None-void' : d.status === 'VOIDED' ? 'Voided' : d.status
        } else {
          row[k] = d[k] || '—'
        }
      })
      return row
    })

    exportStyledExcel({
      filename: `Supplier_Deposits_${new Date().toISOString().slice(0, 10)}`,
      title: "B'Groceries - Accounts Payable Supplier Deposit List",
      subtitle: `Exported on ${new Date().toLocaleDateString()} | Total: ${deposits.length} Records`,
      headers,
      data,
      columnKeys: keys,
    })

    addNotification?.('Supplier deposits exported to Excel', 'success')
  }

  // View Mode: 'create'
  if (viewMode === 'create') {
    return (
      <SupplierDepositCreateView
        onCancel={() => setViewMode('list')}
        onSuccess={() => {
          setViewMode('list')
          fetchDeposits()
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8 space-y-6 text-slate-100 font-['Montserrat']">
      {/* 1. TOP HEADER & BREADCRUMBS */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link to="/admin" className="hover:text-purple-400 transition-colors">
              {lang === 'en' ? 'Dashboard' : 'ផ្ទាំងគ្រប់គ្រង'}
            </Link>
            <span>/</span>
            <Link to="/admin/payable-management" className="hover:text-purple-400 transition-colors">
              {lang === 'en' ? 'Payable Management Hub' : 'ការគ្រប់គ្រងបំណុលត្រូវបង់'}
            </Link>
            <span>/</span>
            <span className="text-purple-400 font-bold">
              {lang === 'en' ? 'Supplier Deposit' : 'ប្រាក់កក់អ្នកផ្គត់ផ្គង់'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15 border border-purple-500/30 text-2xl shadow-lg shadow-purple-500/10">
              <img src={crownIcon} alt="Supplier Deposit" className="h-7 w-7 object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black tracking-tight text-white font-['Montserrat']">
                  {lang === 'en' ? 'Supplier Deposit List' : 'បញ្ជីប្រាក់កក់អ្នកផ្គត់ផ្គង់'}
                </h1>
                <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-xs font-bold text-purple-300 border border-purple-500/30 font-mono">
                  {deposits.length} {lang === 'en' ? 'Deposits' : 'ប្រាក់កក់'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'en'
                  ? 'Show information of supplier deposit'
                  : 'បង្ហាញព័ត៌មាននៃប្រាក់កក់ដែលបានបង់ជូនអ្នកផ្គត់ផ្គង់។'}
              </p>
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportExcel}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-2.5 text-xs font-semibold text-purple-300 hover:bg-slate-800 hover:border-purple-400 transition-all active:scale-95 shadow-md shadow-purple-950/20"
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

          {/* For Create button */}
          <button
            type="button"
            onClick={() => setViewMode('create')}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-5 py-2.5 text-xs font-black text-white transition-all shadow-lg shadow-purple-600/30 active:scale-95"
          >
            <PlusIcon className="w-4 h-4" />
            <span>{lang === 'en' ? 'Create Deposit' : 'បង្កើតប្រាក់កក់'}</span>
          </button>
        </div>
      </div>

      {/* KPI METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-sm backdrop-blur">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {lang === 'en' ? 'Total Deposits' : 'ចំនួនប្រាក់កក់សរុប'}
          </p>
          <p className="mt-1 text-2xl font-black text-white font-mono">{summaryMetrics.totalCount}</p>
        </div>
        <div className="rounded-2xl border border-purple-900/40 bg-purple-950/20 p-4 shadow-sm backdrop-blur">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-purple-400">
            {lang === 'en' ? 'Total Deposited Amount' : 'ទឹកប្រាក់កក់សរុប'}
          </p>
          <p className="mt-1 text-2xl font-black text-purple-400 font-mono">
            $${summaryMetrics.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-4 shadow-sm backdrop-blur">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
            {lang === 'en' ? 'Available Balance' : 'សមតុល្យអាចកាត់កង'}
          </p>
          <p className="mt-1 text-2xl font-black text-emerald-400 font-mono">
            $${summaryMetrics.totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="rounded-2xl border border-rose-900/40 bg-rose-950/20 p-4 shadow-sm backdrop-blur">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-rose-400">
            {lang === 'en' ? 'Voided Deposits' : 'ប្រាក់កក់មោឃៈ'}
          </p>
          <p className="mt-1 text-2xl font-black text-rose-400 font-mono">{summaryMetrics.voidedCount}</p>
        </div>
      </div>

      {/* 2. SEARCH SUPPLIER DEPOSIT */}
      {/* Search - Textbox */}
      {/* Search By - Dropdown , Any , Code , Amount */}
      {/* Search button */}
      {/* Advance Filter - From Date to Date */}
      {/* Status - Dropdown , None-void, voided */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5 backdrop-blur shadow-xl space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <SearchIcon className="w-4 h-4 text-purple-400" />
              <span>{lang === 'en' ? 'Search Supplier Deposit' : 'ស្វែងរកប្រាក់កក់អ្នកផ្គត់ផ្គង់'}</span>
            </h2>
            <div className="flex items-center gap-2">
              {/* Choose Column Button */}
              <button
                type="button"
                onClick={() => setChooseColumnOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-600 transition"
              >
                <ColumnsIcon className="w-3.5 h-3.5 text-purple-400" />
                <span>{lang === 'en' ? 'Choose Column' : 'ជ្រើសរើសជួរឈរ'}</span>
              </button>

              {/* Reset Search / Filters Button (search_off) */}
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-800/50 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition"
                title="Reset search and filters"
              >
                <SearchOffIcon className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Reset' : 'កំណត់ឡើងវិញ'}</span>
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'en'
              ? 'Search supplier deposit by any condition. Ex(Any, Code, Amount...)'
              : 'ស្វែងរកប្រាក់កក់តាមលក្ខខណ្ឌណាមួយ (ទាំងអស់, លេខកូដ, ចំនួនទឹកប្រាក់...)'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Search - Textbox */}
          <div className="sm:col-span-6 relative">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTriggerSearch()}
              placeholder={lang === 'en' ? 'Search supplier deposit...' : 'ស្វែងរកប្រាក់កក់...'}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Search By - Dropdown , Any , Code , Amount */}
          <div className="sm:col-span-3">
            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2.5 text-xs text-slate-200 focus:border-purple-500 focus:outline-none"
            >
              {SEARCH_BY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {lang === 'en' ? `Search By: ${opt.label.en}` : `ស្វែងរកតាម: ${opt.label.kh}`}
                </option>
              ))}
            </select>
          </div>

          {/* Search button & Advance Filter toggle */}
          <div className="sm:col-span-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleTriggerSearch}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-2.5 text-xs font-bold text-white transition active:scale-95 shadow-md shadow-purple-950/30"
            >
              <SearchIcon className="w-4 h-4" />
              <span>{lang === 'en' ? 'Search' : 'ស្វែងរក'}</span>
            </button>

            {/* Advance Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setAdvanceFilterOpen((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-semibold transition active:scale-95 ${
                advanceFilterOpen || activeAdvanceFilterCount > 0
                  ? 'border-purple-500/50 bg-purple-500/10 text-purple-300'
                  : 'border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
              title="Toggle Advance Filter"
            >
              <FilterListIcon className="w-4 h-4" />
              <span>{lang === 'en' ? 'Advance Filter' : 'តម្រងកម្រិតខ្ពស់'}</span>
              {activeAdvanceFilterCount > 0 && (
                <span className="rounded-full bg-purple-600 px-1.5 py-0.2 text-[10px] font-bold text-white font-mono">
                  {activeAdvanceFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Advance Filter - From Date to Date & Status: None-void, voided */}
        {advanceFilterOpen && (
          <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fadeIn">
            {/* From Date to Date */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                {lang === 'en' ? 'From Date' : 'ចាប់ពីថ្ងៃ'}
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                {lang === 'en' ? 'To Date' : 'ដល់ថ្ងៃ'}
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Status - Dropdown , None-void, voided */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                {lang === 'en' ? 'Status' : 'ស្ថានភាព'}
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-slate-200 focus:border-purple-500 focus:outline-none"
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st.value} value={st.value}>
                    {lang === 'en' ? st.label.en : st.label.kh}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 3. SUPPLIER DEPOSIT LIST TABLE */}
      {/* Show information of supplier deposit */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur shadow-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-base font-bold text-white">
              {lang === 'en' ? 'Supplier Deposit List' : 'បញ្ជីប្រាក់កក់អ្នកផ្គត់ផ្គង់'}
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'en'
                ? 'Show information of supplier deposit'
                : 'បង្ហាញព័ត៌មាននៃប្រាក់កក់ដែលបានបង់ជូនអ្នកផ្គត់ផ្គង់។'}
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {deposits.length} {lang === 'en' ? 'records found' : 'កំណត់ត្រាបានរកឃើញ'}
          </span>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-xs font-semibold">{lang === 'en' ? 'Loading live supplier deposits...' : 'កំពុងផ្ទុកទិន្នន័យប្រាក់កក់...'}</p>
            </div>
          ) : deposits.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <span className="text-4xl mb-2">💎</span>
              <p className="text-sm font-semibold text-slate-300">
                {lang === 'en' ? 'No Supplier Deposits Found' : 'មិនមានកំណត់ត្រាប្រាក់កក់ឡើយ'}
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm text-center">
                {lang === 'en'
                  ? 'Click "Create Deposit" to record an advance procurement deposit.'
                  : 'ចុច "បង្កើតប្រាក់កក់" ដើម្បីកត់ត្រាប្រាក់កក់អ្នកផ្គត់ផ្គង់ថ្មី។'}
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                  {visibleColumns.includes('code') && <th className="px-4 py-3.5">Code</th>}
                  {visibleColumns.includes('date') && <th className="px-4 py-3.5">Date</th>}
                  {visibleColumns.includes('amount') && <th className="px-4 py-3.5 text-right">Amount</th>}
                  {visibleColumns.includes('balance') && <th className="px-4 py-3.5 text-right">Balance</th>}
                  {visibleColumns.includes('serviceCharge') && <th className="px-4 py-3.5 text-right">Service Charge</th>}
                  {visibleColumns.includes('supplier') && <th className="px-4 py-3.5">Supplier</th>}
                  {visibleColumns.includes('status') && <th className="px-4 py-3.5 text-center">Status</th>}
                  {visibleColumns.includes('paymentType') && <th className="px-4 py-3.5">Payment Type</th>}
                  {visibleColumns.includes('reference') && <th className="px-4 py-3.5">Reference</th>}
                  {visibleColumns.includes('username') && <th className="px-4 py-3.5">Username</th>}
                  {visibleColumns.includes('contact') && <th className="px-4 py-3.5">Contact</th>}
                  {visibleColumns.includes('actions') && <th className="px-4 py-3.5 text-center">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {deposits.map((d) => {
                  const isVoided = d.status === 'VOIDED'
                  return (
                    <tr key={d.id} className="hover:bg-slate-800/40 transition-colors group">
                      {/* Code */}
                      {visibleColumns.includes('code') && (
                        <td className="px-4 py-3 font-mono font-bold text-purple-400 whitespace-nowrap">
                          {d.code}
                        </td>
                      )}

                      {/* Date */}
                      {visibleColumns.includes('date') && (
                        <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                          {d.date || '—'}
                        </td>
                      )}

                      {/* Amount */}
                      {visibleColumns.includes('amount') && (
                        <td className="px-4 py-3 text-right font-mono font-bold text-white whitespace-nowrap">
                          $${Number(d.amount || 0).toFixed(2)}
                        </td>
                      )}

                      {/* Balance */}
                      {visibleColumns.includes('balance') && (
                        <td className="px-4 py-3 text-right font-mono font-bold text-emerald-400 whitespace-nowrap">
                          $${Number(d.balance || 0).toFixed(2)}
                        </td>
                      )}

                      {/* Service Charge */}
                      {visibleColumns.includes('serviceCharge') && (
                        <td className="px-4 py-3 text-right font-mono text-slate-400 whitespace-nowrap">
                          $${Number(d.serviceCharge || 0).toFixed(2)}
                        </td>
                      )}

                      {/* Supplier */}
                      {visibleColumns.includes('supplier') && (
                        <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">
                          {d.supplier || '—'}
                        </td>
                      )}

                      {/* Status */}
                      {visibleColumns.includes('status') && (
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isVoided
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            }`}
                          >
                            {isVoided ? 'Voided' : 'None-void'}
                          </span>
                        </td>
                      )}

                      {/* Payment Type */}
                      {visibleColumns.includes('paymentType') && (
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                            {d.paymentType || 'ABA QR'}
                          </span>
                        </td>
                      )}

                      {/* Reference */}
                      {visibleColumns.includes('reference') && (
                        <td className="px-4 py-3 text-slate-300 font-mono whitespace-nowrap">
                          {d.reference || '—'}
                        </td>
                      )}

                      {/* Username */}
                      {visibleColumns.includes('username') && (
                        <td className="px-4 py-3 text-slate-400 whitespace-nowrap font-mono text-[11px]">
                          {d.username || 'Badmin'}
                        </td>
                      )}

                      {/* Contact */}
                      {visibleColumns.includes('contact') && (
                        <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                          {d.contact || '—'}
                        </td>
                      )}

                      {/* Actions */}
                      {visibleColumns.includes('actions') && (
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            {/* View Detail */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedDeposit(d)
                                setDetailModalOpen(true)
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                              title="View Voucher"
                            >
                              <EyeIcon className="w-4 h-4" />
                            </button>

                            {/* Void Action */}
                            {!isVoided && (
                              <button
                                type="button"
                                onClick={() => handleVoidDeposit(d.id, d.code)}
                                className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition"
                                title="Void Deposit"
                              >
                                <BanIcon className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 4. CHOOSE COLUMN MODAL */}
      {/* Reset Button included */}
      {chooseColumnOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <ColumnsIcon className="w-5 h-5 text-purple-400" />
                  <span>{lang === 'en' ? 'Choose Column' : 'ជ្រើសរើសជួរឈរ'}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setChooseColumnOpen(false)}
                  className="text-slate-400 hover:text-white text-lg font-bold"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {lang === 'en'
                  ? 'Choose column you want to display on table'
                  : 'ជ្រើសរើសជួរឈរដែលអ្នកចង់បង្ហាញនៅលើតារាង'}
              </p>
            </div>

            {/* Quick action buttons & Reset Button */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={selectAllColumns}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-200 transition"
              >
                {lang === 'en' ? 'Select All' : 'ជ្រើសរើសទាំងអស់'}
              </button>
              <button
                type="button"
                onClick={deselectAllColumns}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-200 transition"
              >
                {lang === 'en' ? 'Deselect All' : 'លុបការជ្រើសរើស'}
              </button>
              <button
                type="button"
                onClick={resetDefaultColumns}
                className="px-2.5 py-1 rounded-lg bg-purple-600/20 border border-purple-500/40 hover:bg-purple-600/30 text-[11px] font-bold text-purple-300 transition"
              >
                {lang === 'en' ? 'Reset Button' : 'ប៊ូតុងកំណត់ឡើងវិញ'}
              </button>
            </div>

            {/* Column Checkboxes */}
            <div className="grid grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
              {ALL_DEPOSIT_COLUMNS.map((col) => {
                const checked = visibleColumns.includes(col.key)
                return (
                  <label
                    key={col.key}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition select-none ${
                      checked
                        ? 'border-purple-500/50 bg-purple-500/10 text-white font-semibold'
                        : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleColumn(col.key)}
                      className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
                    />
                    <span>{col.label[lang] || col.label.en}</span>
                  </label>
                )
              })}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setChooseColumnOpen(false)}
                className="rounded-xl bg-purple-600 hover:bg-purple-500 px-5 py-2 text-xs font-bold text-white transition active:scale-95"
              >
                {lang === 'en' ? 'Done' : 'រួចរាល់'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. DETAIL MODAL */}
      {detailModalOpen && selectedDeposit && (
        <DepositPreviewModal
          deposit={selectedDeposit}
          onClose={() => setDetailModalOpen(false)}
        />
      )}
    </div>
  )
}

// ===== CREATE VIEW COMPONENT =====
// For Create button
// General Information: Input general supplier deposit information
// Code - Auto Generate Code - Textbox
// Date - date
// Supplier * - dropdown
// Contact * - dropdown
// Payment Type - Dropdown
// Amount * - textbox
// Reference - textbox
// Service Charge - textbox
function SupplierDepositCreateView({ onCancel, onSuccess }) {
  const { lang } = useLanguage()
  const { addNotification } = useNotifications()

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), [])

  // Form States
  const [code, setCode] = useState('')
  const [date, setDate] = useState(todayStr)
  const [supplier, setSupplier] = useState('')
  const [supplierId, setSupplierId] = useState(null)
  const [contact, setContact] = useState('')
  const [paymentType, setPaymentType] = useState('ABA QR')
  const [amount, setAmount] = useState('')
  const [reference, setReference] = useState('')
  const [serviceCharge, setServiceCharge] = useState('0.00')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Master Data
  const [suppliersList, setSuppliersList] = useState([])
  const [contactOptions, setContactOptions] = useState([])

  // Post-Save Preview Modal state
  // "When save it show preview and close and print"
  const [savedDeposit, setSavedDeposit] = useState(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  // Auto Generate Next Code
  const fetchNextCode = async () => {
    try {
      const res = await adminSupplierDepositAPI.getNextCode()
      const genCode = res?.data?.code || res?.code || (typeof res === 'string' ? res : null)
      if (genCode) {
        setCode(genCode)
        return
      }
    } catch {}
    const rand = Math.floor(1000 + Math.random() * 9000)
    setCode(`SD-${todayStr.replace(/-/g, '')}-${rand}`)
  }

  useEffect(() => {
    fetchNextCode()
  }, [])

  // Load Suppliers Master Data
  useEffect(() => {
    let mounted = true
    const loadSups = async () => {
      try {
        const supRes = await adminSupplierAPI.getAll()
        const rawSups = Array.isArray(supRes?.data) ? supRes.data : Array.isArray(supRes) ? supRes : []
        if (mounted && rawSups.length > 0) {
          setSuppliersList(rawSups)
        } else if (mounted) {
          setSuppliersList([
            { id: 9, name: 'KabPris', contactFirstName: 'Sok', contactLastName: 'Heng', contactPhone: '09887766' },
            { id: 10, name: 'MONA LISA', contactFirstName: 'LingFu', contactLastName: 'susman', contactPhone: '0318325599' },
            { id: 11, name: 'JAME', contactFirstName: 'Heng', contactLastName: 'Gaming', contactPhone: '012793921' },
          ])
        }
      } catch {
        if (mounted) {
          setSuppliersList([
            { id: 9, name: 'KabPris', contactFirstName: 'Sok', contactLastName: 'Heng', contactPhone: '09887766' },
            { id: 10, name: 'MONA LISA', contactFirstName: 'LingFu', contactLastName: 'susman', contactPhone: '0318325599' },
            { id: 11, name: 'JAME', contactFirstName: 'Heng', contactLastName: 'Gaming', contactPhone: '012793921' },
          ])
        }
      }
    }
    loadSups()
    return () => {
      mounted = false
    }
  }, [])

  // Handle Supplier Selection
  const handleSupplierChange = (supName) => {
    setSupplier(supName)
    const found = suppliersList.find((s) => (s.name || s.supplierName) === supName)
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
  }

  // Handle Form Submit
  const handleSubmitDeposit = async (e) => {
    e.preventDefault()

    if (!supplier) {
      addNotification?.('Please select a Supplier', 'warning')
      return
    }

    const numericAmount = parseFloat(amount)
    if (!numericAmount || numericAmount <= 0) {
      addNotification?.('Please enter a valid deposit Amount', 'warning')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        code,
        date,
        amount: numericAmount,
        balance: numericAmount,
        serviceCharge: parseFloat(serviceCharge) || 0.0,
        supplier,
        supplierId,
        contact,
        status: 'NONE_VOID',
        paymentType,
        reference: reference || `REF-${code}`,
        username: 'Badmin',
        note,
      }

      const res = await adminSupplierDepositAPI.create(payload)
      const createdRecord = res?.data || payload

      addNotification?.(`Supplier Deposit ${code} created successfully! Amount: $${numericAmount.toFixed(2)}`, 'success')

      // "When save it show preview and close and print"
      setSavedDeposit(createdRecord)
      setPreviewOpen(true)
    } catch (err) {
      console.error('Failed to create supplier deposit:', err)
      addNotification?.(err.message || 'Failed to submit supplier deposit', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmitDeposit} className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8 space-y-6 text-slate-100 font-['Montserrat']">
        {/* HEADER & BREADCRUMBS */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Link to="/admin" className="hover:text-purple-400 transition-colors">
                {lang === 'en' ? 'Dashboard' : 'ផ្ទាំងគ្រប់គ្រង'}
              </Link>
              <span>/</span>
              <Link to="/admin/payable-management" className="hover:text-purple-400 transition-colors">
                {lang === 'en' ? 'Payable Management Hub' : 'ការគ្រប់គ្រងបំណុលត្រូវបង់'}
              </Link>
              <span>/</span>
              <button
                type="button"
                onClick={onCancel}
                className="hover:text-purple-400 transition-colors"
              >
                {lang === 'en' ? 'Supplier Deposit' : 'ប្រាក់កក់អ្នកផ្គត់ផ្គង់'}
              </button>
              <span>/</span>
              <span className="text-purple-400 font-bold">
                {lang === 'en' ? 'Create Deposit' : 'បង្កើតប្រាក់កក់ថ្មី'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition"
                title="Back to Supplier Deposit List"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white font-['Montserrat']">
                  {lang === 'en' ? 'Create Supplier Deposit' : 'បង្កើតប្រាក់កក់អ្នកផ្គត់ផ្គង់'}
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lang === 'en'
                    ? 'Disburse advance procurement deposit held against supplier account.'
                    : 'កត់ត្រាប្រាក់កក់មុនដែលបានបង់ជូនអ្នកផ្គត់ផ្គង់ សម្រាប់កាត់កងប៊ីលទំនិញ។'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              {lang === 'en' ? 'Cancel' : 'បោះបង់'}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-6 py-2.5 text-xs font-black text-white transition shadow-lg shadow-purple-600/30 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{lang === 'en' ? 'Saving...' : 'កំពុងរក្សាទុក...'}</span>
                </>
              ) : (
                <>
                  <CheckIcon className="w-4 h-4" />
                  <span>{lang === 'en' ? 'Submit Deposit' : 'រក្សាទុកប្រាក់កក់'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* GENERAL INFORMATION */}
        {/* Input general supplier deposit information */}
        {/* Code - Auto Generate Code - Textbox */}
        {/* Date - date */}
        {/* Supplier * - dropdown */}
        {/* Contact * - dropdown */}
        {/* Payment Type - Dropdown */}
        {/* Amount * - textbox */}
        {/* Reference - textbox */}
        {/* Service Charge - textbox */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 text-xs font-mono font-bold">
                1
              </span>
              <span>{lang === 'en' ? 'General Information' : 'ព័ត៌មានទូទៅ'}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 ml-8">
              {lang === 'en' ? 'Input general supplier deposit information' : 'បញ្ចូលព័ត៌មានទូទៅនៃប្រាក់កក់អ្នកផ្គត់ផ្គង់'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Code - Auto Generate Code - Textbox */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>{lang === 'en' ? 'Code (Auto Generated)' : 'លេខកូដ (ស្វ័យប្រវត្តិ)'}</span>
                <button
                  type="button"
                  onClick={fetchNextCode}
                  className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  title="Regenerate code"
                >
                  <RefreshIcon className="w-3 h-3" />
                  <span>Refresh</span>
                </button>
              </label>
              <input
                type="text"
                readOnly
                value={code}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/90 px-3.5 py-2.5 text-xs text-purple-300 font-mono font-bold focus:outline-none cursor-not-allowed"
              />
            </div>

            {/* Date - date */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {lang === 'en' ? 'Date *' : 'កាលបរិច្ឆេទ *'}
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Supplier * - dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {lang === 'en' ? 'Supplier *' : 'អ្នកផ្គត់ផ្គង់ *'}
              </label>
              <select
                required
                value={supplier}
                onChange={(e) => handleSupplierChange(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="">{lang === 'en' ? '— Select Supplier —' : '— ជ្រើសរើសអ្នកផ្គត់ផ្គង់ —'}</option>
                {suppliersList.map((s) => {
                  const sName = s.name || s.supplierName
                  return (
                    <option key={s.id || sName} value={sName}>
                      {sName}
                    </option>
                  )
                })}
              </select>
            </div>

            {/* Contact * - dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {lang === 'en' ? 'Contact *' : 'អ្នកទំនាក់ទំនង *'}
              </label>
              {contactOptions.length > 0 ? (
                <select
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                >
                  {contactOptions.map((c, idx) => (
                    <option key={idx} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  required
                  placeholder={lang === 'en' ? 'Contact person / phone' : 'លេខទូរស័ព្ទ / អ្នកទំនាក់ទំនង'}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              )}
            </div>

            {/* Payment Type - Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {lang === 'en' ? 'Payment Type *' : 'ប្រភេទការបង់ប្រាក់ *'}
              </label>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
              >
                {PAYMENT_TYPE_OPTIONS.map((pt) => (
                  <option key={pt} value={pt}>
                    {pt}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount * - textbox */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {lang === 'en' ? 'Amount ($) *' : 'ចំនួនទឹកប្រាក់ ($) *'}
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white font-mono font-bold focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Reference - textbox */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {lang === 'en' ? 'Reference' : 'ឯកសារយោង'}
              </label>
              <input
                type="text"
                placeholder="e.g. TXN-DEP-0089"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none font-mono"
              />
            </div>

            {/* Service Charge - textbox */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {lang === 'en' ? 'Service Charge ($)' : 'ថ្លៃសេវា ($)'}
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={serviceCharge}
                onChange={(e) => setServiceCharge(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-slate-300 font-mono focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Note - textbox (spans 3 cols) */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {lang === 'en' ? 'Note' : 'កំណត់សម្គាល់'}
              </label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={lang === 'en' ? 'Remarks about advance harvest or procurement terms...' : 'កំណត់ចំណាំផ្សេងៗ...'}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-800 bg-slate-900 px-5 py-2.5 text-xs font-bold text-slate-400 hover:text-white transition"
          >
            {lang === 'en' ? 'Cancel & Return' : 'បោះបង់ និងត្រឡប់ក្រោយ'}
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">
              {lang === 'en' ? 'Deposit Total: ' : 'សរុបប្រាក់កក់: '}
              <strong className="text-purple-400 font-mono text-sm font-black">
                $${Number(amount || 0).toFixed(2)}
              </strong>
            </span>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-7 py-2.5 text-xs font-black text-white transition shadow-lg shadow-purple-600/30 disabled:opacity-50 active:scale-95"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{lang === 'en' ? 'Saving...' : 'កំពុងរក្សាទុក...'}</span>
                </>
              ) : (
                <>
                  <CheckIcon className="w-4 h-4" />
                  <span>{lang === 'en' ? 'Save & Preview' : 'រក្សាទុក និងមើលទម្រង់'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* WHEN SAVE IT SHOW PREVIEW AND CLOSE AND PRINT */}
      {previewOpen && savedDeposit && (
        <DepositPreviewModal
          deposit={savedDeposit}
          isPostSave={true}
          onClose={() => {
            setPreviewOpen(false)
            onSuccess?.()
          }}
        />
      )}
    </>
  )
}

// ===== OFFICIAL VOUCHER / RECEIPT PREVIEW MODAL =====
// Features: Official Layout, Print Button, Close Button
function DepositPreviewModal({ deposit, isPostSave = false, onClose }) {
  const { lang } = useLanguage()

  const handlePrint = () => {
    window.print()
  }

  const principal = Number(deposit.amount || 0)
  const fee = Number(deposit.serviceCharge || 0)
  const netTotal = principal + fee

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn print:p-0 print:bg-white print:static">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Modal Top Actions (Hidden in print) */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 print:hidden">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {isPostSave ? (lang === 'en' ? 'Deposit Recorded Successfully — Voucher Preview' : 'បានរក្សាទុកជោគជ័យ — បង្ហាញប័ណ្ណប្រាក់កក់') : (lang === 'en' ? 'Deposit Voucher Details' : 'ព័ត៌មានលម្អិតប័ណ្ណប្រាក់កក់')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* PRINT BUTTON */}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-2 text-xs font-bold text-white transition active:scale-95 shadow-md shadow-purple-950/30"
            >
              <PrintIcon className="w-4 h-4" />
              <span>{lang === 'en' ? 'Print' : 'បោះពុម្ព'}</span>
            </button>

            {/* CLOSE BUTTON */}
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-bold text-slate-200 hover:text-white transition active:scale-95"
            >
              {lang === 'en' ? 'Close' : 'បិទ'}
            </button>
          </div>
        </div>

        {/* PRINTABLE RECEIPT CONTENT */}
        <div id="printable-deposit-receipt" className="p-8 space-y-6 bg-slate-900 print:bg-white print:text-black print:p-6 font-['Montserrat']">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-800 print:border-black/20 pb-5">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-2xl font-black tracking-tight text-white print:text-black">
                  B'Groceries
                </span>
                <span className="rounded-md bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-300 print:bg-gray-200 print:text-black font-mono">
                  AP-HUB
                </span>
              </div>
              <p className="text-xs text-slate-400 print:text-gray-600 mt-1">
                Central Cold-Chain & Wholesale Grocery Distribution
              </p>
              <p className="text-[11px] text-slate-500 print:text-gray-500">
                Phnom Penh, Cambodia | Tel: +855 23 999 888
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400 print:text-black block">
                Supplier Deposit Voucher
              </span>
              <span className="font-mono text-lg font-black text-white print:text-black block mt-0.5">
                {deposit.code}
              </span>
              <span className="text-xs text-slate-400 print:text-gray-600 block mt-0.5">
                Date: {deposit.date || '—'}
              </span>
            </div>
          </div>

          {/* Supplier & Payment Summary */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="rounded-2xl border border-slate-800 print:border-gray-300 p-4 bg-slate-950/40 print:bg-gray-50 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 print:text-gray-500 block">
                Beneficiary Supplier
              </span>
              <p className="text-sm font-bold text-white print:text-black">
                {deposit.supplier || '—'}
              </p>
              <p className="text-slate-300 print:text-gray-700">
                Contact: {deposit.contact || '—'}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 print:border-gray-300 p-4 bg-slate-950/40 print:bg-gray-50 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 print:text-gray-500 block">
                Transaction Details
              </span>
              <p className="text-slate-300 print:text-gray-700">
                <strong className="text-white print:text-black font-semibold">Payment Type: </strong>
                {deposit.paymentType || 'ABA QR'}
              </p>
              <p className="text-slate-300 print:text-gray-700 font-mono">
                <strong className="text-white print:text-black font-semibold">Reference: </strong>
                {deposit.reference || '—'}
              </p>
              <p className="text-slate-300 print:text-gray-700">
                <strong className="text-white print:text-black font-semibold">Status: </strong>
                <span className={`font-bold ${deposit.status === 'VOIDED' ? 'text-rose-400 print:text-red-600' : 'text-emerald-400 print:text-green-600'}`}>
                  {deposit.status === 'VOIDED' ? 'VOIDED' : 'NONE-VOID (ACTIVE)'}
                </span>
              </p>
            </div>
          </div>

          {/* Financial Breakdown Table */}
          <div className="rounded-2xl border border-slate-800 print:border-gray-300 overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 print:border-gray-300 bg-slate-950/90 print:bg-gray-100 text-slate-400 print:text-gray-700 uppercase text-[10px] font-bold">
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3 text-center">Payment Channel</th>
                  <th className="px-4 py-3 text-right">Amount (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 print:divide-gray-200">
                <tr>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-white print:text-black">Advance Procurement Deposit</p>
                    <p className="text-[11px] text-slate-400 print:text-gray-600">
                      Credit security deposit held against purchase orders & bills
                    </p>
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-slate-300 print:text-gray-700">
                    {deposit.paymentType || 'ABA QR'}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-white print:text-black text-sm">
                    $${principal.toFixed(2)}
                  </td>
                </tr>

                {fee > 0 && (
                  <tr>
                    <td className="px-4 py-2.5 text-slate-400 print:text-gray-600">
                      Bank Transaction & Service Fee
                    </td>
                    <td className="px-4 py-2.5 text-center text-slate-500 print:text-gray-500">—</td>
                    <td className="px-4 py-2.5 text-right font-mono text-slate-400 print:text-gray-600">
                      $${fee.toFixed(2)}
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="border-t-2 border-slate-700 print:border-black bg-slate-950/90 print:bg-gray-100 font-bold text-xs">
                <tr>
                  <td colSpan={2} className="px-4 py-3 text-slate-300 print:text-black uppercase tracking-wider">
                    Total Disbursed (Net)
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-purple-400 print:text-black text-base font-black">
                    $${netTotal.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Note */}
          {deposit.note && (
            <div className="rounded-xl border border-slate-800 print:border-gray-300 bg-slate-950/40 print:bg-gray-50 p-3 text-xs">
              <span className="text-[10px] font-bold uppercase text-slate-400 print:text-gray-500 block mb-0.5">
                Note / Memo:
              </span>
              <p className="text-slate-300 print:text-gray-800">{deposit.note}</p>
            </div>
          )}

          {/* Signatures */}
          <div className="pt-8 grid grid-cols-3 gap-6 text-center text-[11px] text-slate-400 print:text-gray-600">
            <div className="border-t border-slate-700 print:border-black pt-2">
              <p className="font-bold text-slate-200 print:text-black">Prepared By</p>
              <p className="font-mono text-[10px] mt-0.5">{deposit.username || 'Badmin'}</p>
            </div>
            <div className="border-t border-slate-700 print:border-black pt-2">
              <p className="font-bold text-slate-200 print:text-black">Approved By</p>
              <p className="text-[10px] mt-0.5">Finance Department</p>
            </div>
            <div className="border-t border-slate-700 print:border-black pt-2">
              <p className="font-bold text-slate-200 print:text-black">Supplier Acknowledgment</p>
              <p className="text-[10px] mt-0.5">Signature & Stamp</p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions (Hidden in print) */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/60 print:hidden">
          <span className="text-xs text-slate-400">
            {lang === 'en' ? 'Press "Print" to print voucher or "Close" to return' : 'ចុច "បោះពុម្ព" ដើម្បីចេញប័ណ្ណ ឬ "បិទ" ដើម្បីត្រឡប់ក្រោយ'}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 px-5 py-2 text-xs font-bold text-white transition active:scale-95 shadow-md shadow-purple-950/30"
            >
              <PrintIcon className="w-4 h-4" />
              <span>{lang === 'en' ? 'Print Voucher' : 'បោះពុម្ពប័ណ្ណ'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-5 py-2 text-xs font-bold text-white transition active:scale-95"
            >
              {lang === 'en' ? 'Close & Return' : 'បិទ និងត្រឡប់ក្រោយ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
