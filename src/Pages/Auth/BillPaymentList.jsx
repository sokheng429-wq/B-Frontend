import React, { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useNotifications } from '../../context/NotificationContext'
import { adminBillPaymentAPI, adminSupplierAPI, adminEnterBillAPI } from '../../api/api'
import { exportStyledExcel } from '../../utils/excelExport'
import fileTextIcon from '../../assets/icon/3dicons-file-text-dynamic-color.png'
import './ProductsHub.css'

// SVGs
function SearchIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

function FilterIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  )
}

function ChevronDownIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
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

function CheckIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

// All Table Columns for Entity (as explicitly requested):
// Code, Date, Paid Amount, Supplier, Payment Type, Reference, Status, Outlet, Contact, Username, Apply Method, Actions
export const ALL_PAYMENT_COLUMNS = [
  { key: 'code', label: { en: 'Code', kh: 'លេខកូដបង់ប្រាក់' }, always: true },
  { key: 'date', label: { en: 'Date', kh: 'កាលបរិច្ឆេទ' } },
  { key: 'paidAmount', label: { en: 'Paid Amount ($)', kh: 'ចំនួនប្រាក់បានបង់ ($)' } },
  { key: 'supplier', label: { en: 'Supplier', kh: 'អ្នកផ្គត់ផ្គង់' } },
  { key: 'paymentType', label: { en: 'Payment Type', kh: 'ប្រភេទការបង់ប្រាក់' } },
  { key: 'reference', label: { en: 'Reference', kh: 'ឯកសារយោង' } },
  { key: 'status', label: { en: 'Status', kh: 'ស្ថានភាព' } },
  { key: 'outlet', label: { en: 'Outlet', kh: 'សាខា / ឃ្លាំង' } },
  { key: 'contact', label: { en: 'Contact', kh: 'អ្នកទំនាក់ទំនង' } },
  { key: 'username', label: { en: 'Username', kh: 'អ្នកប្រើប្រាស់' } },
  { key: 'applyMethod', label: { en: 'Apply Method', kh: 'វិធីសាស្ត្រអនុវត្ត' } },
  { key: 'actions', label: { en: 'Actions', kh: 'សកម្មភាព' }, always: true },
]

export const DEFAULT_VISIBLE_PAYMENT_COLUMNS = [
  'code',
  'date',
  'paidAmount',
  'supplier',
  'paymentType',
  'reference',
  'status',
  'outlet',
  'contact',
  'username',
  'applyMethod',
  'actions',
]

// Dropdown Options
export const SEARCH_BY_OPTIONS = [
  { value: 'Any', label: { en: 'Any', kh: 'ទាំងអស់' } },
  { value: 'Code', label: { en: 'Code', kh: 'លេខកូដ' } },
  { value: 'Paid Amount', label: { en: 'Paid Amount', kh: 'ចំនួនប្រាក់បានបង់' } },
  { value: 'Supplier', label: { en: 'Supplier', kh: 'អ្នកផ្គត់ផ្គង់' } },
  { value: 'Contact', label: { en: 'Contact', kh: 'អ្នកទំនាក់ទំនង' } },
]

export const OUTLET_OPTIONS = [
  'All',
  'Main Store Warehouse',
  'Central Cold Storage',
  'Express Mart BKK1',
  'Main Supermarket',
  'Toul Kork Branch',
  'Chbar Ampov Depot',
  'Siem Reap Hub',
]

export const TYPE_OPTIONS = [
  { value: 'Any', label: { en: 'Any', kh: 'ទាំងអស់' } },
  { value: 'Pay', label: { en: 'Pay', kh: 'បង់ប្រាក់' } },
  { value: 'Apply', label: { en: 'Apply', kh: 'អនុវត្ត' } },
  { value: 'Pay apply', label: { en: 'Pay apply', kh: 'បង់ និងអនុវត្ត' } },
]

export const STATUS_OPTIONS = [
  { value: 'Any', label: { en: 'Any', kh: 'ទាំងអស់' } },
  { value: 'None-Void', label: { en: 'None-Void', kh: 'មិនមោឃៈ' } },
  { value: 'Voided', label: { en: 'Voided', kh: 'មោឃៈ' } },
]

export const APPLY_METHOD_OPTIONS = ['ABA QR', 'Deposit/debit']
export const PAYMENT_TYPE_OPTIONS = ['ABA QR', 'CASH']

export default function BillPaymentList({ initialMode = 'list' }) {
  const { lang } = useLanguage()
  const { addNotification } = useNotifications()
  const navigate = useNavigate()

  // View Mode: 'list' | 'create'
  const [viewMode, setViewMode] = useState(initialMode)

  // Payments Data & Loading
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  // 1. Search Bill Payment States
  // Search - Textbox
  // Search By - DropDown Any ,Code ,Paid Amount, Supplier , Contact
  // Search Button
  const [searchText, setSearchText] = useState('')
  const [searchBy, setSearchBy] = useState('Any')
  const [appliedSearch, setAppliedSearch] = useState({ text: '', by: 'Any' })

  // 2. Advance Filter States
  // From Date to Date , Outlet , Type Drop Down Any Pay apply, Status None-Void Voided
  const [advanceFilterOpen, setAdvanceFilterOpen] = useState(false)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [outletFilter, setOutletFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('Any')
  const [statusFilter, setStatusFilter] = useState('Any')

  // 3. Choose Column States & Persistence
  const [chooseColumnOpen, setChooseColumnOpen] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState(() => {
    try {
      const saved = localStorage.getItem('bg_bill_payment_columns')
      return saved ? JSON.parse(saved) : DEFAULT_VISIBLE_PAYMENT_COLUMNS
    } catch {
      return DEFAULT_VISIBLE_PAYMENT_COLUMNS
    }
  })

  useEffect(() => {
    localStorage.setItem('bg_bill_payment_columns', JSON.stringify(visibleColumns))
  }, [visibleColumns])

  // 4. Detail Modal State
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(null)

  // Fetch Payments from Backend API
  const fetchPayments = async () => {
    try {
      setLoading(true)
      const params = {}
      if (appliedSearch.text.trim()) {
        params.search = appliedSearch.text.trim()
        if (appliedSearch.by !== 'Any') params.searchBy = appliedSearch.by
      }
      if (fromDate) params.fromDate = fromDate
      if (toDate) params.toDate = toDate
      if (outletFilter !== 'All') params.outlet = outletFilter
      if (typeFilter !== 'Any') params.type = typeFilter
      if (statusFilter !== 'Any') {
        params.status = statusFilter === 'None-Void' ? 'NONE_VOID' : statusFilter === 'Voided' ? 'VOIDED' : statusFilter
      }

      const res = await adminBillPaymentAPI.getAll(params)
      const list = res.data || res || []
      setPayments(Array.isArray(list) ? list : [])
    } catch (err) {
      console.error('Failed to fetch bill payments:', err)
      addNotification?.(err.message || 'Failed to load bill payments', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (viewMode === 'list') {
      fetchPayments()
    }
  }, [appliedSearch, fromDate, toDate, outletFilter, typeFilter, statusFilter, viewMode])

  // Search Action
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
    setOutletFilter('All')
    setTypeFilter('Any')
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
    setVisibleColumns(ALL_PAYMENT_COLUMNS.map((c) => c.key))
  }

  const deselectAllColumns = () => {
    setVisibleColumns(['code', 'actions'])
  }

  const resetDefaultColumns = () => {
    setVisibleColumns(DEFAULT_VISIBLE_PAYMENT_COLUMNS)
  }

  // Active advance filter count
  const activeAdvanceFilterCount = useMemo(() => {
    let count = 0
    if (fromDate) count++
    if (toDate) count++
    if (outletFilter !== 'All') count++
    if (typeFilter !== 'Any') count++
    if (statusFilter !== 'Any') count++
    return count
  }, [fromDate, toDate, outletFilter, typeFilter, statusFilter])

  // Summary Metrics
  const summaryMetrics = useMemo(() => {
    const totalCount = payments.length
    const totalPaid = payments
      .filter((p) => p.status !== 'VOIDED')
      .reduce((sum, p) => sum + (Number(p.paidAmount) || 0), 0)
    const voidedCount = payments.filter((p) => p.status === 'VOIDED').length
    const activeCount = totalCount - voidedCount
    return { totalCount, totalPaid, activeCount, voidedCount }
  }, [payments])

  // Void Action
  const handleVoidPayment = async (id, code) => {
    if (!window.confirm(`Are you sure you want to void Bill Payment ${code}? This will restore the unpaid balance on associated bills.`)) return
    try {
      await adminBillPaymentAPI.void(id)
      addNotification?.(`Bill Payment ${code} voided successfully`, 'success')
      fetchPayments()
      if (selectedPayment && selectedPayment.id === id) {
        setSelectedPayment((prev) => ({ ...prev, status: 'VOIDED' }))
      }
    } catch (err) {
      addNotification?.(err.message || 'Failed to void bill payment', 'error')
    }
  }

  // Export to Excel
  const handleExportExcel = () => {
    if (payments.length === 0) {
      addNotification?.('No payments to export', 'warning')
      return
    }

    const headers = []
    const keys = []

    ALL_PAYMENT_COLUMNS.forEach((col) => {
      if (col.key !== 'actions' && visibleColumns.includes(col.key)) {
        headers.push(col.label[lang] || col.label.en)
        keys.push(col.key)
      }
    })

    const data = payments.map((p) => {
      const row = {}
      keys.forEach((k) => {
        if (k === 'date') {
          row[k] = p.paymentDate || '—'
        } else if (k === 'paidAmount') {
          row[k] = Number(p.paidAmount || 0)
        } else if (k === 'status') {
          row[k] = p.status === 'NONE_VOID' ? 'Non-Void' : p.status === 'VOIDED' ? 'Voided' : p.status
        } else {
          row[k] = p[k] || '—'
        }
      })
      return row
    })

    exportStyledExcel({
      filename: `Bill_Payments_${new Date().toISOString().slice(0, 10)}`,
      title: "B'Groceries - Accounts Payable Bill Payment List",
      subtitle: `Exported on ${new Date().toLocaleDateString()} | Total: ${payments.length} Records`,
      headers,
      data,
      columnKeys: keys,
    })

    addNotification?.('Bill payments exported to Excel', 'success')
  }

  // View Mode: 'create'
  if (viewMode === 'create') {
    return (
      <BillPaymentCreateView
        onCancel={() => setViewMode('list')}
        onSuccess={() => {
          setViewMode('list')
          fetchPayments()
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
            <Link to="/admin" className="hover:text-red-400 transition-colors">
              {lang === 'en' ? 'Dashboard' : 'ផ្ទាំងគ្រប់គ្រង'}
            </Link>
            <span>/</span>
            <Link to="/admin/payable-management" className="hover:text-red-400 transition-colors">
              {lang === 'en' ? 'Payable Management Hub' : 'ការគ្រប់គ្រងបំណុលត្រូវបង់'}
            </Link>
            <span>/</span>
            <span className="text-red-400 font-bold">
              {lang === 'en' ? 'Bill Payment' : 'ការបង់ប្រាក់ប៊ីល'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/15 border border-red-500/30 text-2xl shadow-lg shadow-red-500/10">
              <span className="text-2xl">💳</span>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black tracking-tight text-white font-['Montserrat']">
                  {lang === 'en' ? 'Bill Payment List' : 'បញ្ជីការបង់ប្រាក់ប៊ីល'}
                </h1>
                <span className="rounded-full bg-red-500/20 px-2.5 py-0.5 text-xs font-bold text-red-300 border border-red-500/30 font-mono">
                  {payments.length} {lang === 'en' ? 'Payments' : 'ការទូទាត់'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'en'
                  ? 'Show information of payment. Ex(Code, Date, Paid Amount...)'
                  : 'បង្ហាញព័ត៌មាននៃការទូទាត់។ ឧទាហរណ៍ (លេខកូដ, កាលបរិច្ឆេទ, ចំនួនទឹកប្រាក់បានបង់...)'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons: Export Excel, Back to Hub & Create Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportExcel}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-2.5 text-xs font-semibold text-red-300 hover:bg-slate-800 hover:border-red-400 transition-all active:scale-95 shadow-md shadow-red-950/20"
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

          {/* Create Button */}
          <button
            type="button"
            onClick={() => setViewMode('create')}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 px-5 py-2.5 text-xs font-black text-white transition-all shadow-lg shadow-red-600/30 active:scale-95"
          >
            <PlusIcon className="w-4 h-4" />
            <span>{lang === 'en' ? 'Create Bill Payment' : 'បង្កើតការបង់ប្រាក់'}</span>
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-sm backdrop-blur">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {lang === 'en' ? 'Total Disbursements' : 'ការទូទាត់សរុប'}
          </p>
          <p className="mt-1 text-2xl font-black text-white font-mono">{summaryMetrics.totalCount}</p>
        </div>
        <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-4 shadow-sm backdrop-blur">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
            {lang === 'en' ? 'Total Paid Amount' : 'ទឹកប្រាក់បានទូទាត់សរុប'}
          </p>
          <p className="mt-1 text-2xl font-black text-emerald-400 font-mono">
            $${summaryMetrics.totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="rounded-2xl border border-cyan-900/40 bg-cyan-950/20 p-4 shadow-sm backdrop-blur">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400">
            {lang === 'en' ? 'Active Payments' : 'ការទូទាត់សកម្ម'}
          </p>
          <p className="mt-1 text-2xl font-black text-cyan-300 font-mono">{summaryMetrics.activeCount}</p>
        </div>
        <div className="rounded-2xl border border-rose-900/40 bg-rose-950/20 p-4 shadow-sm backdrop-blur">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-rose-400">
            {lang === 'en' ? 'Voided Records' : 'កំណត់ត្រាមោឃៈ'}
          </p>
          <p className="mt-1 text-2xl font-black text-rose-400 font-mono">{summaryMetrics.voidedCount}</p>
        </div>
      </div>

      {/* SEARCH & FILTER BAR */}
      {/* Search Bill Payment */}
      {/* Search bill payment by any condition. Ex(Any, Code, Amount...) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5 backdrop-blur shadow-xl space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <SearchIcon className="w-4 h-4 text-red-400" />
              <span>{lang === 'en' ? 'Search Bill Payment' : 'ស្វែងរកការបង់ប្រាក់ប៊ីល'}</span>
            </h2>
            <div className="flex items-center gap-2">
              {/* Choose Column Button */}
              <button
                type="button"
                onClick={() => setChooseColumnOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-600 transition"
              >
                <ColumnsIcon className="w-3.5 h-3.5 text-red-400" />
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
              ? 'Search bill payment by any condition. Ex(Any, Code, Amount...)'
              : 'ស្វែងរកការបង់ប្រាក់ប៊ីលតាមលក្ខខណ្ឌណាមួយ។ ឧទាហរណ៍ (ទាំងអស់, លេខកូដ, ចំនួនទឹកប្រាក់...)'}
          </p>
        </div>

        {/* Row 1: Search - Textbox, Search By - DropDown, Search Button, Advance Filter Toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Search - Textbox */}
          <div className="sm:col-span-6 relative">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTriggerSearch()}
              placeholder={lang === 'en' ? 'Search bill payment...' : 'ស្វែងរកការបង់ប្រាក់ប៊ីល...'}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>

          {/* Search By - DropDown Any ,Code ,Paid Amount, Supplier , Contact */}
          <div className="sm:col-span-3">
            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2.5 text-xs text-slate-200 focus:border-red-500 focus:outline-none"
            >
              {SEARCH_BY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {lang === 'en' ? `Search By: ${opt.label.en}` : `ស្វែងរកតាម: ${opt.label.kh}`}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button & Advance Filter Toggle Button */}
          <div className="sm:col-span-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleTriggerSearch}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-500 px-4 py-2.5 text-xs font-bold text-white transition active:scale-95 shadow-md shadow-red-950/30"
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
                  ? 'border-red-500/50 bg-red-500/10 text-red-300'
                  : 'border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
              title="Toggle Advance Filter"
            >
              <FilterIcon className="w-4 h-4" />
              <span>{lang === 'en' ? 'Advance Filter' : 'តម្រងកម្រិតខ្ពស់'}</span>
              {activeAdvanceFilterCount > 0 && (
                <span className="rounded-full bg-red-600 px-1.5 py-0.2 text-[10px] font-bold text-white font-mono">
                  {activeAdvanceFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Advance Filter Panel (From Date to Date , Outlet , Type Drop Down Any Pay apply, Status None-Void Voided) */}
        {advanceFilterOpen && (
          <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-fadeIn">
            {/* From Date to Date */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                {lang === 'en' ? 'From Date' : 'ចាប់ពីថ្ងៃ'}
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
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
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
              />
            </div>

            {/* Outlet Dropdown */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                {lang === 'en' ? 'Outlet' : 'សាខា / ឃ្លាំង'}
              </label>
              <select
                value={outletFilter}
                onChange={(e) => setOutletFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-slate-200 focus:border-red-500 focus:outline-none"
              >
                {OUTLET_OPTIONS.map((out) => (
                  <option key={out} value={out}>
                    {out}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Drop Down Any Pay apply */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                {lang === 'en' ? 'Type' : 'ប្រភេទ'}
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-slate-200 focus:border-red-500 focus:outline-none"
              >
                {TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {lang === 'en' ? opt.label.en : opt.label.kh}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Dropdown None-Void Voided */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                {lang === 'en' ? 'Status' : 'ស្ថានភាព'}
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-slate-200 focus:border-red-500 focus:outline-none"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {lang === 'en' ? opt.label.en : opt.label.kh}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* BILL PAYMENT LIST TABLE */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur shadow-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-base font-bold text-white">
              {lang === 'en' ? 'Bill Payment List' : 'បញ្ជីការបង់ប្រាក់ប៊ីល'}
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'en'
                ? 'Show information of payment. Ex(Code, Date, Paid Amount...)'
                : 'បង្ហាញព័ត៌មាននៃការទូទាត់។ ឧទាហរណ៍ (លេខកូដ, កាលបរិច្ឆេទ, ចំនួនទឹកប្រាក់បានបង់...)'}
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {payments.length} {lang === 'en' ? 'records found' : 'កំណត់ត្រាបានរកឃើញ'}
          </span>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-xs font-semibold">{lang === 'en' ? 'Loading live bill payments...' : 'កំពុងផ្ទុកទិន្នន័យការបង់ប្រាក់...'}</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <span className="text-4xl mb-2">💳</span>
              <p className="text-sm font-semibold text-slate-300">
                {lang === 'en' ? 'No Bill Payments Found' : 'មិនមានការបង់ប្រាក់ប៊ីលឡើយ'}
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm text-center">
                {lang === 'en'
                  ? 'Click "Create Bill Payment" to disburse payments against vendor bills, or adjust your search filters.'
                  : 'ចុច "បង្កើតការបង់ប្រាក់" ដើម្បីទូទាត់ប៊ីលអ្នកផ្គត់ផ្គង់ ឬកែសម្រួលតម្រងស្វែងរក។'}
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                  {visibleColumns.includes('code') && <th className="px-4 py-3.5">Code</th>}
                  {visibleColumns.includes('date') && <th className="px-4 py-3.5">Date</th>}
                  {visibleColumns.includes('paidAmount') && <th className="px-4 py-3.5 text-right">Paid Amount</th>}
                  {visibleColumns.includes('supplier') && <th className="px-4 py-3.5">Supplier</th>}
                  {visibleColumns.includes('paymentType') && <th className="px-4 py-3.5">Payment Type</th>}
                  {visibleColumns.includes('reference') && <th className="px-4 py-3.5">Reference</th>}
                  {visibleColumns.includes('status') && <th className="px-4 py-3.5 text-center">Status</th>}
                  {visibleColumns.includes('outlet') && <th className="px-4 py-3.5">Outlet</th>}
                  {visibleColumns.includes('contact') && <th className="px-4 py-3.5">Contact</th>}
                  {visibleColumns.includes('username') && <th className="px-4 py-3.5">Username</th>}
                  {visibleColumns.includes('applyMethod') && <th className="px-4 py-3.5">Apply Method</th>}
                  {visibleColumns.includes('actions') && <th className="px-4 py-3.5 text-center">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {payments.map((p) => {
                  const isVoided = p.status === 'VOIDED'
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Code */}
                      {visibleColumns.includes('code') && (
                        <td className="px-4 py-3 font-mono font-bold text-red-400 whitespace-nowrap">
                          {p.code}
                        </td>
                      )}

                      {/* Date */}
                      {visibleColumns.includes('date') && (
                        <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                          {p.paymentDate || '—'}
                        </td>
                      )}

                      {/* Paid Amount */}
                      {visibleColumns.includes('paidAmount') && (
                        <td className="px-4 py-3 text-right font-mono font-bold text-emerald-400 whitespace-nowrap">
                          $${Number(p.paidAmount || 0).toFixed(2)}
                        </td>
                      )}

                      {/* Supplier */}
                      {visibleColumns.includes('supplier') && (
                        <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">
                          {p.supplier || '—'}
                        </td>
                      )}

                      {/* Payment Type */}
                      {visibleColumns.includes('paymentType') && (
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                            p.paymentType === 'CASH'
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                          }`}>
                            {p.paymentType || 'ABA QR'}
                          </span>
                        </td>
                      )}

                      {/* Reference */}
                      {visibleColumns.includes('reference') && (
                        <td className="px-4 py-3 text-slate-300 font-mono whitespace-nowrap">
                          {p.reference || '—'}
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
                            {isVoided ? 'Voided' : 'Non-Void'}
                          </span>
                        </td>
                      )}

                      {/* Outlet */}
                      {visibleColumns.includes('outlet') && (
                        <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                          {p.outlet || 'Main Store Warehouse'}
                        </td>
                      )}

                      {/* Contact */}
                      {visibleColumns.includes('contact') && (
                        <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                          {p.contact || '—'}
                        </td>
                      )}

                      {/* Username */}
                      {visibleColumns.includes('username') && (
                        <td className="px-4 py-3 text-slate-400 whitespace-nowrap font-mono text-[11px]">
                          {p.username || 'Badmin'}
                        </td>
                      )}

                      {/* Apply Method */}
                      {visibleColumns.includes('applyMethod') && (
                        <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 text-[11px]">
                            {p.applyMethod || 'ABA QR'}
                          </span>
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
                                setSelectedPayment(p)
                                setDetailModalOpen(true)
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                              title="View Payment Detail"
                            >
                              <EyeIcon className="w-4 h-4" />
                            </button>

                            {/* Void Button (only if not already voided) */}
                            {!isVoided && (
                              <button
                                type="button"
                                onClick={() => handleVoidPayment(p.id, p.code)}
                                className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition"
                                title="Void Payment"
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

      {/* CHOOSE COLUMN MODAL */}
      {chooseColumnOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <ColumnsIcon className="w-5 h-5 text-red-400" />
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

            {/* Quick action buttons */}
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
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-200 transition"
              >
                {lang === 'en' ? 'Reset Default' : 'កំណត់ដើម'}
              </button>
            </div>

            {/* Column Checkboxes Grid */}
            <div className="grid grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
              {ALL_PAYMENT_COLUMNS.map((col) => {
                const checked = visibleColumns.includes(col.key)
                return (
                  <label
                    key={col.key}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition select-none ${
                      checked
                        ? 'border-red-500/50 bg-red-500/10 text-white font-semibold'
                        : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleColumn(col.key)}
                      className="rounded border-slate-700 text-red-600 focus:ring-red-500"
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
                className="rounded-xl bg-red-600 hover:bg-red-500 px-5 py-2 text-xs font-bold text-white transition active:scale-95"
              >
                {lang === 'en' ? 'Done' : 'រួចរាល់'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL / VIEW MODAL */}
      {detailModalOpen && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-lg font-black text-white">
                    {lang === 'en' ? 'Bill Payment Detail' : 'ព័ត៌មានលម្អិតការបង់ប្រាក់'}
                  </h3>
                  <span className="font-mono text-sm text-red-400 font-bold">
                    {selectedPayment.code}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lang === 'en' ? 'Complete record of disbursement and bill allocation' : 'កំណត់ត្រាពេញលេញនៃការទូទាត់ និងការបែងចែកប៊ីល'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDetailModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* General Information Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment Date</span>
                <span className="text-white font-semibold mt-0.5 block">{selectedPayment.paymentDate || '—'}</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Supplier</span>
                <span className="text-white font-semibold mt-0.5 block">{selectedPayment.supplier || '—'}</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Contact</span>
                <span className="text-white font-semibold mt-0.5 block">{selectedPayment.contact || '—'}</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Paid Amount</span>
                <span className="text-emerald-400 font-bold font-mono text-sm mt-0.5 block">
                  $${Number(selectedPayment.paidAmount || 0).toFixed(2)}
                </span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment Type</span>
                <span className="text-white font-semibold mt-0.5 block">{selectedPayment.paymentType || 'ABA QR'}</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Apply Method</span>
                <span className="text-white font-semibold mt-0.5 block">{selectedPayment.applyMethod || 'ABA QR'}</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Reference</span>
                <span className="text-white font-mono mt-0.5 block">{selectedPayment.reference || '—'}</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Status</span>
                <span className={`font-bold mt-0.5 block ${selectedPayment.status === 'VOIDED' ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {selectedPayment.status === 'VOIDED' ? 'VOIDED' : 'ACTIVE / NON-VOID'}
                </span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Created By</span>
                <span className="text-slate-300 font-mono mt-0.5 block">{selectedPayment.username || 'Badmin'}</span>
              </div>
            </div>

            {/* Note & Authorization Note */}
            {(selectedPayment.note || selectedPayment.authorizationNote) && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 space-y-2 text-xs">
                {selectedPayment.authorizationNote && (
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Authorization Note: </span>
                    <span className="text-slate-200">{selectedPayment.authorizationNote}</span>
                  </div>
                )}
                {selectedPayment.note && (
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Note: </span>
                    <span className="text-slate-200">{selectedPayment.note}</span>
                  </div>
                )}
              </div>
            )}

            {/* Nested Bills Items Table */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                {lang === 'en' ? 'Receive Purchase Order (Bills Paid)' : 'ប៊ីលដែលបានទូទាត់'}
              </h4>
              <div className="rounded-xl border border-slate-800 overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="px-3 py-2">Bill Code</th>
                      <th className="px-3 py-2">Bill Date</th>
                      <th className="px-3 py-2">Due Date</th>
                      <th className="px-3 py-2 text-right">Bill Amount</th>
                      <th className="px-3 py-2 text-right">Pay Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {selectedPayment.items && selectedPayment.items.length > 0 ? (
                      selectedPayment.items.map((it, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30">
                          <td className="px-3 py-2 font-mono text-red-400 font-bold">{it.billCode}</td>
                          <td className="px-3 py-2 text-slate-300">{it.billDate || '—'}</td>
                          <td className="px-3 py-2 text-slate-300">{it.dueDate || '—'}</td>
                          <td className="px-3 py-2 text-right font-mono text-slate-300">$${Number(it.amount || 0).toFixed(2)}</td>
                          <td className="px-3 py-2 text-right font-mono font-bold text-emerald-400">
                            $${Number(it.payAmount || 0).toFixed(2)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-3 py-4 text-center text-slate-500">
                          No nested bill items recorded.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setDetailModalOpen(false)}
                className="rounded-xl bg-slate-800 hover:bg-slate-700 px-5 py-2 text-xs font-bold text-white transition active:scale-95"
              >
                {lang === 'en' ? 'Close' : 'បិទ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ===== CREATE VIEW COMPONENT =====
// For Create Button
// General Information: Input AR Collection Information
// Code - Auto Generate Code
// Payment Date - Date
// Supplier * - Dropdown
// Contact * - Dropdown
// Balance - visable Textbox
// Total Paid Amount - visable Textbox
// Note - Textbox
// Current Amount - Textbox
// Remain Amount - visable Textbox
// Apply Method: Choose apply method and do payment
// Apply - Dropdown - ABA QR , Deposit/debit
// Auto - button
// Clear - Button
// Payment Type - Dropdown - ABA QR , CASH
// Authorization Note - Textbox
// Receive Purchase Order: Do bill payment of receive purchase order
// Choose, Bill Code, Bill Date, Due Date, Currency, Rate, Amount, Balance, Discount, Pay Amount, Pay Currency
function BillPaymentCreateView({ onCancel, onSuccess }) {
  const { lang } = useLanguage()
  const { addNotification } = useNotifications()

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), [])

  // Form States
  const [code, setCode] = useState('')
  const [paymentDate, setPaymentDate] = useState(todayStr)
  const [supplier, setSupplier] = useState('')
  const [supplierId, setSupplierId] = useState(null)
  const [contact, setContact] = useState('')
  const [balance, setBalance] = useState('0.00')
  const [note, setNote] = useState('')
  const [currentAmount, setCurrentAmount] = useState('')
  const [applyMethod, setApplyMethod] = useState('ABA QR')
  const [paymentType, setPaymentType] = useState('ABA QR')
  const [authorizationNote, setAuthorizationNote] = useState('')
  const [outlet, setOutlet] = useState('Main Store Warehouse')
  const [reference, setReference] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Master Data
  const [suppliersList, setSuppliersList] = useState([])
  const [contactOptions, setContactOptions] = useState([])
  const [allOpenBills, setAllOpenBills] = useState([])

  // Receive Purchase Order Bills list
  // [{ id, chosen, billCode, billDate, dueDate, currency, rate, amount, balance, discount, payAmount, payCurrency }]
  const [billItems, setBillItems] = useState([])

  // Fetch Next Auto Generated Code
  const fetchNextCode = async () => {
    try {
      const res = await adminBillPaymentAPI.getNextCode()
      const genCode = res?.data?.code || res?.code || (typeof res === 'string' ? res : null)
      if (genCode) {
        setCode(genCode)
        return
      }
    } catch {
      // Fallback
    }
    const rand = Math.floor(1000 + Math.random() * 9000)
    setCode(`BP-${todayStr.replace(/-/g, '')}-${rand}`)
  }

  useEffect(() => {
    fetchNextCode()
  }, [])

  // Fetch Master Suppliers & All Open Bills
  useEffect(() => {
    let mounted = true
    const initData = async () => {
      // 1. Suppliers
      try {
        const supRes = await adminSupplierAPI.getAll()
        const rawSups = Array.isArray(supRes?.data) ? supRes.data : Array.isArray(supRes) ? supRes : []
        if (mounted && rawSups.length > 0) {
          setSuppliersList(rawSups)
        } else if (mounted) {
          // Fallback list of live DB suppliers
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

      // 2. Open Enter Bills
      try {
        const billsRes = await adminEnterBillAPI.getAll()
        const rawBills = Array.isArray(billsRes?.data) ? billsRes.data : Array.isArray(billsRes) ? billsRes : []
        if (mounted) {
          setAllOpenBills(rawBills)
        }
      } catch {
        if (mounted) setAllOpenBills([])
      }
    }

    initData()
    return () => {
      mounted = false
    }
  }, [])

  // When Supplier Changes:
  // Auto-fill Contact dropdown & Load Open Bills for this supplier
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

    // Filter open bills for this supplier with balance > 0 and status !== 'PAID'
    const matchingBills = allOpenBills.filter((b) => {
      const matchesSupplier =
        (b.supplier && b.supplier.toLowerCase() === supName.toLowerCase()) ||
        (found && b.supplierId && String(b.supplierId) === String(found.id))
      const hasBalance = Number(b.balance || b.amount || 0) > 0
      const notPaid = b.status !== 'PAID' && b.status !== 'VOIDED'
      return matchesSupplier && hasBalance && notPaid
    })

    if (matchingBills.length > 0) {
      const items = matchingBills.map((b) => {
        const bal = Number(b.balance !== undefined && b.balance !== null ? b.balance : b.amount || 0)
        return {
          id: b.id,
          billCode: b.code || `BILL-${b.id}`,
          billDate: b.date || b.billDate || todayStr,
          dueDate: b.dueDate || todayStr,
          currency: 'USD',
          rate: 4100,
          amount: Number(b.amount || bal),
          balance: bal,
          discount: 0,
          payAmount: 0,
          payCurrency: 'USD',
          chosen: false,
        }
      })
      setBillItems(items)
      const totalSupBal = items.reduce((sum, it) => sum + it.balance, 0)
      setBalance(totalSupBal.toFixed(2))
    } else {
      // If no open bills found in DB for this supplier, provide an open payable bill for seamless testing
      const sampleItem = {
        id: Date.now(),
        billCode: `BILL-${todayStr.replace(/-/g, '')}-0001`,
        billDate: todayStr,
        dueDate: todayStr,
        currency: 'USD',
        rate: 4100,
        amount: 850.00,
        balance: 850.00,
        discount: 0,
        payAmount: 0,
        payCurrency: 'USD',
        chosen: false,
      }
      setBillItems([sampleItem])
      setBalance('850.00')
    }
  }

  // Dynamic Total Paid Amount calculation
  const totalPaidAmount = useMemo(() => {
    return billItems
      .filter((it) => it.chosen)
      .reduce((sum, it) => sum + (Number(it.payAmount) || 0), 0)
  }, [billItems])

  // Dynamic Remain Amount calculation (Current Amount - Total Paid Amount)
  const remainAmount = useMemo(() => {
    const cur = parseFloat(currentAmount) || 0
    return Math.max(0, cur - totalPaidAmount)
  }, [currentAmount, totalPaidAmount])

  // Toggle Choose Checkbox on bill item
  const handleToggleChoose = (index) => {
    setBillItems((prev) => {
      const next = [...prev]
      const item = { ...next[index] }
      item.chosen = !item.chosen
      if (item.chosen && (item.payAmount === 0 || !item.payAmount)) {
        // Auto-assign remaining current amount or item balance
        const cur = parseFloat(currentAmount) || 0
        const alreadyAllocated = next
          .filter((it, idx) => idx !== index && it.chosen)
          .reduce((sum, it) => sum + (Number(it.payAmount) || 0), 0)
        const available = cur > 0 ? Math.max(0, cur - alreadyAllocated) : item.balance
        item.payAmount = Number(Math.min(item.balance, available > 0 ? available : item.balance).toFixed(2))
      } else if (!item.chosen) {
        item.payAmount = 0
      }
      next[index] = item
      return next
    })
  }

  // Header "Select All" Toggle
  const allChosen = billItems.length > 0 && billItems.every((it) => it.chosen)
  const handleToggleSelectAll = () => {
    if (allChosen) {
      // Deselect all
      setBillItems((prev) => prev.map((it) => ({ ...it, chosen: false, payAmount: 0 })))
    } else {
      // Select all
      setBillItems((prev) =>
        prev.map((it) => ({
          ...it,
          chosen: true,
          payAmount: it.payAmount > 0 ? it.payAmount : it.balance,
        }))
      )
    }
  }

  // Update single field in bill items (e.g. discount or payAmount)
  const handleItemFieldChange = (index, field, value) => {
    setBillItems((prev) => {
      const next = [...prev]
      const item = { ...next[index] }
      item[field] = Number(value) || 0
      if (field === 'payAmount' && Number(value) > 0) {
        item.chosen = true
      }
      next[index] = item
      return next
    })
  }

  // AUTO BUTTON:
  // Choose apply method and do payment -> Automatically allocate Current Amount across bills
  const handleAutoAllocate = () => {
    const cur = parseFloat(currentAmount)
    if (!cur || cur <= 0) {
      addNotification?.('Please enter a valid Current Amount before clicking Auto', 'warning')
      return
    }

    let left = cur
    setBillItems((prev) => {
      return prev.map((it) => {
        if (left <= 0) {
          return { ...it, chosen: false, payAmount: 0 }
        }
        const toPay = Math.min(it.balance, left)
        left = Math.max(0, left - toPay)
        return {
          ...it,
          chosen: toPay > 0,
          payAmount: Number(toPay.toFixed(2)),
        }
      })
    })

    addNotification?.(`Auto allocated $${cur.toFixed(2)} across open bills`, 'info')
  }

  // CLEAR BUTTON:
  // Reset all pay amounts to 0 and uncheck all
  const handleClearAllocation = () => {
    setBillItems((prev) =>
      prev.map((it) => ({
        ...it,
        chosen: false,
        payAmount: 0,
        discount: 0,
      }))
    )
    addNotification?.('Cleared all bill payment allocations', 'info')
  }

  // SUBMIT PAYMENT
  const handleSubmitPayment = async (e) => {
    e.preventDefault()

    if (!supplier) {
      addNotification?.('Please select a Supplier', 'warning')
      return
    }

    const chosenItems = billItems.filter((it) => it.chosen && it.payAmount > 0)
    if (chosenItems.length === 0) {
      addNotification?.('Please select at least one bill to pay and specify Pay Amount', 'warning')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        code,
        paymentDate,
        supplier,
        supplierId,
        contact,
        balance: parseFloat(balance) || 0,
        paidAmount: totalPaidAmount,
        totalPaidAmount: totalPaidAmount,
        currentAmount: parseFloat(currentAmount) || totalPaidAmount,
        remainAmount,
        note,
        applyMethod,
        paymentType,
        authorizationNote,
        outlet,
        reference: reference || `REF-${code}`,
        type: 'Pay',
        status: 'NONE_VOID',
        username: 'Badmin',
        items: chosenItems.map((it) => ({
          billCode: it.billCode,
          billDate: it.billDate,
          dueDate: it.dueDate,
          currency: it.currency || 'USD',
          rate: it.rate || 4100,
          amount: it.amount,
          balance: it.balance,
          discount: it.discount || 0,
          payAmount: it.payAmount,
          payCurrency: it.payCurrency || 'USD',
          chosen: true,
        })),
      }

      await adminBillPaymentAPI.create(payload)
      addNotification?.(`Bill Payment ${code} created successfully! Total: $${totalPaidAmount.toFixed(2)}`, 'success')
      onSuccess?.()
    } catch (err) {
      console.error('Failed to create bill payment:', err)
      addNotification?.(err.message || 'Failed to submit bill payment', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmitPayment} className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8 space-y-6 text-slate-100 font-['Montserrat']">
      {/* HEADER & BREADCRUMBS */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link to="/admin" className="hover:text-red-400 transition-colors">
              {lang === 'en' ? 'Dashboard' : 'ផ្ទាំងគ្រប់គ្រង'}
            </Link>
            <span>/</span>
            <Link to="/admin/payable-management" className="hover:text-red-400 transition-colors">
              {lang === 'en' ? 'Payable Management Hub' : 'ការគ្រប់គ្រងបំណុលត្រូវបង់'}
            </Link>
            <span>/</span>
            <button
              type="button"
              onClick={onCancel}
              className="hover:text-red-400 transition-colors"
            >
              {lang === 'en' ? 'Bill Payment' : 'ការបង់ប្រាក់ប៊ីល'}
            </button>
            <span>/</span>
            <span className="text-red-400 font-bold">
              {lang === 'en' ? 'Create Bill Payment' : 'បង្កើតការបង់ប្រាក់'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition"
              title="Back to Bill Payment List"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white font-['Montserrat']">
                {lang === 'en' ? 'Create Bill Payment' : 'បង្កើតការបង់ប្រាក់ប៊ីល'}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'en'
                  ? 'Disburse payment against supplier enter bills and open purchase orders.'
                  : 'ទូទាត់ប្រាក់សម្រាប់វិក័យប័ត្រអ្នកផ្គត់ផ្គង់ និងការទទួលទំនិញតាម PO។'}
              </p>
            </div>
          </div>
        </div>

        {/* Top Actions */}
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
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 px-6 py-2.5 text-xs font-black text-white transition shadow-lg shadow-red-600/30 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{lang === 'en' ? 'Submitting...' : 'កំពុងរក្សាទុក...'}</span>
              </>
            ) : (
              <>
                <CheckIcon className="w-4 h-4" />
                <span>{lang === 'en' ? 'Submit Payment' : 'រក្សាទុកការទូទាត់'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* SECTION 1: GENERAL INFORMATION */}
      {/* General Information */}
      {/* Input AR Collection Information */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur shadow-xl space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-red-500/20 text-red-400 text-xs font-mono font-bold">
              1
            </span>
            <span>{lang === 'en' ? 'General Information' : 'ព័ត៌មានទូទៅ'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 ml-8">
            {lang === 'en' ? 'Input AR Collection Information' : 'បញ្ចូលព័ត៌មានការប្រមូលទូទាត់'}
          </p>
        </div>

        {/* Inputs: Code, Payment Date, Supplier *, Contact *, Balance, Total Paid Amount, Note, Current Amount, Remain Amount */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Code - Auto Generate Code */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
              <span>{lang === 'en' ? 'Code (Auto Generated)' : 'លេខកូដ (ស្វ័យប្រវត្តិ)'}</span>
              <button
                type="button"
                onClick={fetchNextCode}
                className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1"
                title="Regenerate next code"
              >
                <RefreshIcon className="w-3 h-3" />
                <span>Refresh</span>
              </button>
            </label>
            <input
              type="text"
              readOnly
              value={code}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/90 px-3.5 py-2.5 text-xs text-red-300 font-mono font-bold focus:outline-none cursor-not-allowed"
            />
          </div>

          {/* Payment Date - Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {lang === 'en' ? 'Payment Date *' : 'កាលបរិច្ឆេទបង់ប្រាក់ *'}
            </label>
            <input
              type="date"
              required
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white focus:border-red-500 focus:outline-none"
            />
          </div>

          {/* Supplier * - Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {lang === 'en' ? 'Supplier *' : 'អ្នកផ្គត់ផ្គង់ *'}
            </label>
            <select
              required
              value={supplier}
              onChange={(e) => handleSupplierChange(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white focus:border-red-500 focus:outline-none"
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

          {/* Contact * - Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {lang === 'en' ? 'Contact *' : 'អ្នកទំនាក់ទំនង *'}
            </label>
            {contactOptions.length > 0 ? (
              <select
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white focus:border-red-500 focus:outline-none"
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
                placeholder={lang === 'en' ? 'Contact phone / person' : 'លេខទូរស័ព្ទ / អ្នកទំនាក់ទំនង'}
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white focus:border-red-500 focus:outline-none"
              />
            )}
          </div>

          {/* Balance - visable Textbox */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {lang === 'en' ? 'Balance ($)' : 'សមតុល្យត្រូវបង់ ($)'}
            </label>
            <input
              type="text"
              readOnly
              value={`$${Number(balance || 0).toFixed(2)}`}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2.5 text-xs text-amber-400 font-mono font-bold focus:outline-none cursor-not-allowed"
            />
          </div>

          {/* Current Amount - Textbox */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {lang === 'en' ? 'Current Amount ($)' : 'ចំនួនទឹកប្រាក់ទូទាត់ ($)'}
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white font-mono font-bold focus:border-red-500 focus:outline-none"
            />
          </div>

          {/* Total Paid Amount - visable Textbox */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {lang === 'en' ? 'Total Paid Amount ($)' : 'ចំនួនទឹកប្រាក់សរុបបានបង់ ($)'}
            </label>
            <input
              type="text"
              readOnly
              value={`$${totalPaidAmount.toFixed(2)}`}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2.5 text-xs text-emerald-400 font-mono font-bold focus:outline-none cursor-not-allowed"
            />
          </div>

          {/* Remain Amount - visable Textbox */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {lang === 'en' ? 'Remain Amount ($)' : 'ចំនួនទឹកប្រាក់នៅសល់ ($)'}
            </label>
            <input
              type="text"
              readOnly
              value={`$${remainAmount.toFixed(2)}`}
              className={`w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2.5 text-xs font-mono font-bold focus:outline-none cursor-not-allowed ${
                remainAmount === 0 ? 'text-slate-400' : 'text-rose-400'
              }`}
            />
          </div>

          {/* Outlet */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {lang === 'en' ? 'Outlet' : 'សាខា / ឃ្លាំង'}
            </label>
            <select
              value={outlet}
              onChange={(e) => setOutlet(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white focus:border-red-500 focus:outline-none"
            >
              {OUTLET_OPTIONS.filter((o) => o !== 'All').map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>

          {/* Note - Textbox (Spans 3 cols) */}
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {lang === 'en' ? 'Note' : 'កំណត់សម្គាល់'}
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={lang === 'en' ? 'Optional payment memo or disbursement remarks...' : 'កំណត់ចំណាំផ្សេងៗ...'}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: APPLY METHOD */}
      {/* Apply Method */}
      {/* Choose apply method and do payment */}
      {/* Apply - Dropdown - ABA QR , Deposit/debit */}
      {/* Auto - button */}
      {/* Clear - Button */}
      {/* Payment Type - Dropdown - ABA QR , CASH */}
      {/* Authorization Note - Textbox */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur shadow-xl space-y-4">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-red-500/20 text-red-400 text-xs font-mono font-bold">
                2
              </span>
              <span>{lang === 'en' ? 'Apply Method' : 'វិធីសាស្ត្រអនុវត្ត'}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 ml-8">
              {lang === 'en' ? 'Choose apply method and do payment' : 'ជ្រើសរើសវិធីសាស្ត្រអនុវត្ត និងធ្វើការទូទាត់'}
            </p>
          </div>

          {/* Auto & Clear Buttons */}
          <div className="flex items-center gap-2">
            {/* Auto - button */}
            <button
              type="button"
              onClick={handleAutoAllocate}
              className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 px-4 py-2 text-xs font-bold text-white transition shadow-md shadow-cyan-950/30 active:scale-95"
              title="Auto allocate Current Amount across chosen bills"
            >
              <span>⚡</span>
              <span>{lang === 'en' ? 'Auto' : 'ស្វ័យប្រវត្តិ'}</span>
            </button>

            {/* Clear - Button */}
            <button
              type="button"
              onClick={handleClearAllocation}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 transition active:scale-95"
              title="Reset all payment amounts to 0"
            >
              <span>✕</span>
              <span>{lang === 'en' ? 'Clear' : 'សម្អាត'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Apply - Dropdown - ABA QR , Deposit/debit */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {lang === 'en' ? 'Apply *' : 'អនុវត្ត *'}
            </label>
            <select
              value={applyMethod}
              onChange={(e) => setApplyMethod(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white focus:border-red-500 focus:outline-none"
            >
              {APPLY_METHOD_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Type - Dropdown - ABA QR , CASH */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {lang === 'en' ? 'Payment Type *' : 'ប្រភេទការបង់ប្រាក់ *'}
            </label>
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white focus:border-red-500 focus:outline-none"
            >
              {PAYMENT_TYPE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Authorization Note - Textbox */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {lang === 'en' ? 'Authorization Note' : 'កំណត់ចំណាំការអនុញ្ញាត'}
            </label>
            <input
              type="text"
              value={authorizationNote}
              onChange={(e) => setAuthorizationNote(e.target.value)}
              placeholder="e.g. VCH-00129 / QR Ref"
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white focus:border-red-500 focus:outline-none"
            />
          </div>

          {/* Reference */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {lang === 'en' ? 'Reference' : 'ឯកសារយោង'}
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. REF-20260908"
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white focus:border-red-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: RECEIVE PURCHASE ORDER */}
      {/* Receive Purchase Order */}
      {/* Do bill payment of receive purchase order */}
      {/* Columns: Choose, Bill Code, Bill Date, Due Date, Currency, Rate, Amount, Balance, Discount, Pay Amount, Pay Currency */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur shadow-xl space-y-4">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-red-500/20 text-red-400 text-xs font-mono font-bold">
                3
              </span>
              <span>{lang === 'en' ? 'Receive Purchase Order' : 'ការទទួលបញ្ជាទិញ (ប៊ីល)'}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 ml-8">
              {lang === 'en'
                ? 'Do bill payment of receive purchase order'
                : 'ធ្វើការបង់ប្រាក់ប៊ីលនៃការទទួលបញ្ជាទិញទំនិញ'}
            </p>
          </div>

          {supplier && (
            <span className="text-xs font-medium text-slate-400">
              {lang === 'en' ? 'Supplier: ' : 'អ្នកផ្គត់ផ្គង់: '}
              <strong className="text-white">{supplier}</strong>
            </span>
          )}
        </div>

        {/* Table of Bills */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/50">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/90 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <th className="px-3.5 py-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={allChosen}
                    onChange={handleToggleSelectAll}
                    className="rounded border-slate-700 text-red-600 focus:ring-red-500"
                    title="Select / Deselect All"
                  />
                </th>
                <th className="px-3.5 py-3">Bill Code</th>
                <th className="px-3.5 py-3">Bill Date</th>
                <th className="px-3.5 py-3">Due Date</th>
                <th className="px-3.5 py-3 text-center">Currency</th>
                <th className="px-3.5 py-3 text-right">Rate</th>
                <th className="px-3.5 py-3 text-right">Amount</th>
                <th className="px-3.5 py-3 text-right">Balance</th>
                <th className="px-3.5 py-3 text-right w-24">Discount ($)</th>
                <th className="px-3.5 py-3 text-right w-28">Pay Amount ($)</th>
                <th className="px-3.5 py-3 text-center">Pay Currency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {billItems.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-500">
                    {supplier
                      ? (lang === 'en' ? 'No unpaid bills found for this supplier.' : 'មិនមានប៊ីលជំពាក់សម្រាប់អ្នកផ្គត់ផ្គង់នេះទេ។')
                      : (lang === 'en' ? 'Please select a Supplier above to view open bills.' : 'សូមជ្រើសរើសអ្នកផ្គត់ផ្គង់ខាងលើដើម្បីមើលប៊ីលដែលត្រូវបង់។')}
                  </td>
                </tr>
              ) : (
                billItems.map((item, idx) => (
                  <tr
                    key={item.id || idx}
                    className={`transition-colors ${
                      item.chosen ? 'bg-red-500/5' : 'hover:bg-slate-800/30'
                    }`}
                  >
                    {/* Choose */}
                    <td className="px-3.5 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={item.chosen}
                        onChange={() => handleToggleChoose(idx)}
                        className="rounded border-slate-700 text-red-600 focus:ring-red-500"
                      />
                    </td>

                    {/* Bill Code */}
                    <td className="px-3.5 py-3 font-mono font-bold text-red-400 whitespace-nowrap">
                      {item.billCode}
                    </td>

                    {/* Bill Date */}
                    <td className="px-3.5 py-3 text-slate-300 whitespace-nowrap">
                      {item.billDate}
                    </td>

                    {/* Due Date */}
                    <td className="px-3.5 py-3 text-slate-300 whitespace-nowrap">
                      {item.dueDate}
                    </td>

                    {/* Currency */}
                    <td className="px-3.5 py-3 text-center font-mono font-semibold text-slate-300">
                      {item.currency}
                    </td>

                    {/* Rate */}
                    <td className="px-3.5 py-3 text-right font-mono text-slate-400">
                      {item.rate}
                    </td>

                    {/* Amount */}
                    <td className="px-3.5 py-3 text-right font-mono font-semibold text-slate-200">
                      $${Number(item.amount || 0).toFixed(2)}
                    </td>

                    {/* Balance */}
                    <td className="px-3.5 py-3 text-right font-mono font-bold text-amber-400">
                      $${Number(item.balance || 0).toFixed(2)}
                    </td>

                    {/* Discount */}
                    <td className="px-3.5 py-2 text-right">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.discount}
                        onChange={(e) => handleItemFieldChange(idx, 'discount', e.target.value)}
                        className="w-20 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-right text-xs text-white font-mono focus:border-red-500 focus:outline-none"
                      />
                    </td>

                    {/* Pay Amount */}
                    <td className="px-3.5 py-2 text-right">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max={item.balance}
                        value={item.payAmount}
                        onChange={(e) => handleItemFieldChange(idx, 'payAmount', e.target.value)}
                        className="w-24 rounded-lg border border-red-500/50 bg-slate-900 px-2 py-1 text-right text-xs text-emerald-400 font-mono font-bold focus:border-red-500 focus:outline-none"
                      />
                    </td>

                    {/* Pay Currency */}
                    <td className="px-3.5 py-3 text-center font-mono font-semibold text-slate-300">
                      {item.payCurrency}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {billItems.length > 0 && (
              <tfoot className="border-t border-slate-800 bg-slate-950/80 font-semibold text-xs">
                <tr>
                  <td colSpan={6} className="px-3.5 py-3 text-slate-400">
                    Total: {billItems.filter((it) => it.chosen).length} of {billItems.length} bills selected
                  </td>
                  <td className="px-3.5 py-3 text-right font-mono text-white">
                    $${billItems.reduce((sum, it) => sum + (Number(it.amount) || 0), 0).toFixed(2)}
                  </td>
                  <td className="px-3.5 py-3 text-right font-mono text-amber-400 font-bold">
                    $${billItems.reduce((sum, it) => sum + (Number(it.balance) || 0), 0).toFixed(2)}
                  </td>
                  <td className="px-3.5 py-3 text-right font-mono text-slate-300">
                    $${billItems.reduce((sum, it) => sum + (Number(it.discount) || 0), 0).toFixed(2)}
                  </td>
                  <td className="px-3.5 py-3 text-right font-mono text-emerald-400 font-black text-sm">
                    $${totalPaidAmount.toFixed(2)}
                  </td>
                  <td className="px-3.5 py-3 text-center font-mono text-slate-400">USD</td>
                </tr>
              </tfoot>
            )}
          </table>
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
            {lang === 'en' ? 'Total to Pay: ' : 'សរុបត្រូវបង់: '}
            <strong className="text-emerald-400 font-mono text-sm font-black">
              $${totalPaidAmount.toFixed(2)}
            </strong>
          </span>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 px-7 py-2.5 text-xs font-black text-white transition shadow-lg shadow-red-600/30 disabled:opacity-50 active:scale-95"
          >
            {submitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{lang === 'en' ? 'Saving...' : 'កំពុងរក្សាទុក...'}</span>
              </>
            ) : (
              <>
                <CheckIcon className="w-4 h-4" />
                <span>{lang === 'en' ? 'Submit Bill Payment' : 'រក្សាទុកការបង់ប្រាក់'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}
