import React, { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useNotifications } from '../../context/NotificationContext'
import { adminEnterFreightAPI, adminSupplierAPI, adminPaymentTermAPI } from '../../api/api'
import { exportStyledExcel } from '../../utils/excelExport'
import travelIcon from '../../assets/icon/3dicons-travel-dynamic-color.png'
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

function TrashIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

// Columns specified by user:
// Date, Due Date, Amount, Balance, Supplier, Bill Type, Reference, Payment Term, Contact, Username, Status, Reset (+ Code, Actions)
export const ALL_FREIGHT_COLUMNS = [
  { key: 'code', label: { en: 'Code', kh: 'លេខកូដដឹកជញ្ជូន' }, always: true },
  { key: 'date', label: { en: 'Date', kh: 'កាលបរិច្ឆេទ' } },
  { key: 'dueDate', label: { en: 'Due Date', kh: 'កាលបរិច្ឆេទកំណត់បង់' } },
  { key: 'amount', label: { en: 'Amount ($)', kh: 'ចំនួនទឹកប្រាក់ ($)' } },
  { key: 'balance', label: { en: 'Balance ($)', kh: 'សមតុល្យ ($)' } },
  { key: 'supplier', label: { en: 'Supplier', kh: 'អ្នកផ្គត់ផ្គង់' } },
  { key: 'billType', label: { en: 'Bill Type', kh: 'ប្រភេទប៊ីល' } },
  { key: 'reference', label: { en: 'Reference', kh: 'ឯកសារយោង' } },
  { key: 'paymentTerm', label: { en: 'Payment Term', kh: 'លក្ខខណ្ឌទូទាត់' } },
  { key: 'contact', label: { en: 'Contact', kh: 'អ្នកទំនាក់ទំនង' } },
  { key: 'username', label: { en: 'Username', kh: 'អ្នកប្រើប្រាស់' } },
  { key: 'status', label: { en: 'Status', kh: 'ស្ថានភាព' } },
  { key: 'actions', label: { en: 'Actions', kh: 'សកម្មភាព' }, always: true },
]

export const DEFAULT_VISIBLE_FREIGHT_COLUMNS = [
  'code',
  'date',
  'dueDate',
  'amount',
  'balance',
  'supplier',
  'billType',
  'reference',
  'paymentTerm',
  'contact',
  'username',
  'status',
  'actions',
]

// Dropdown Options
export const SEARCH_BY_OPTIONS = [
  { value: 'Any', label: { en: 'Any', kh: 'ទាំងអស់' } },
  { value: 'Code', label: { en: 'Code', kh: 'លេខកូដ' } },
  { value: 'Amount', label: { en: 'Amount', kh: 'ចំនួនទឹកប្រាក់' } },
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

export const BILL_TYPE_OPTIONS = [
  'All',
  'Standard Freight',
  'Inland Freight',
  'Air Freight',
  'Sea Freight',
  'Port Demurrage',
  'Customs Clearance',
]

export const STATUS_OPTIONS = ['ALL', 'OPEN', 'PARTIAL', 'PAID', 'DRAFT', 'VOIDED']

export const PAYMENT_TERM_OPTIONS = [
  'Net 30',
  'Net 15',
  'Net 45',
  'Net 60',
  'Cash',
  'COD',
]

export const TEMPLATE_OPTIONS = [
  'Default Freight Template',
  'Standard Freight Template',
  'Inland Logistics Template',
  'Air Cargo Priority',
  'Port Demurrage Template',
  'Customs Clearance Template',
]

export default function EnterFreightList({ initialMode = 'list' }) {
  const { lang } = useLanguage()
  const { addNotification } = useNotifications()
  const navigate = useNavigate()

  // View Mode: 'list' | 'create'
  const [viewMode, setViewMode] = useState(initialMode)

  // Freight Data & Loading
  const [freights, setFreights] = useState([])
  const [loading, setLoading] = useState(true)

  // 1. Search Freight States
  // Search - Textbox (Search here)
  // Search By - DropDown Any, Code, Amount, Supplier, Contact
  // Search Button
  const [searchText, setSearchText] = useState('')
  const [searchBy, setSearchBy] = useState('Any')
  const [appliedSearch, setAppliedSearch] = useState({ text: '', by: 'Any' })

  // 2. Advance Filter States
  // filter_list toggle: From Date to Date , Outlet , Bill Type, Status
  const [advanceFilterOpen, setAdvanceFilterOpen] = useState(false)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [outletFilter, setOutletFilter] = useState('All')
  const [billTypeFilter, setBillTypeFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('ALL')

  // 3. Choose Column States & Persistence
  const [chooseColumnOpen, setChooseColumnOpen] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState(() => {
    try {
      const saved = localStorage.getItem('bg_enter_freight_columns')
      return saved ? JSON.parse(saved) : DEFAULT_VISIBLE_FREIGHT_COLUMNS
    } catch {
      return DEFAULT_VISIBLE_FREIGHT_COLUMNS
    }
  })

  useEffect(() => {
    localStorage.setItem('bg_enter_freight_columns', JSON.stringify(visibleColumns))
  }, [visibleColumns])

  // 4. Detail Modal State
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedFreight, setSelectedFreight] = useState(null)

  // Fetch Freights from Live API
  const fetchFreights = async () => {
    try {
      setLoading(true)
      const params = {}
      if (appliedSearch.text.trim()) {
        params.search = appliedSearch.text.trim()
        if (appliedSearch.by !== 'Any') params.searchBy = appliedSearch.by
      }
      if (billTypeFilter !== 'All') params.billType = billTypeFilter
      if (outletFilter !== 'All') params.outlet = outletFilter
      if (statusFilter !== 'ALL') params.status = statusFilter
      if (fromDate) params.fromDate = fromDate
      if (toDate) params.toDate = toDate

      const res = await adminEnterFreightAPI.getAll(params)
      const list = res?.data || res || []
      setFreights(Array.isArray(list) ? list : [])
    } catch (err) {
      console.error('Failed to fetch freights:', err)
      addNotification?.(err.message || 'Failed to load freight list', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (viewMode === 'list') {
      fetchFreights()
    }
  }, [appliedSearch, billTypeFilter, outletFilter, statusFilter, fromDate, toDate, viewMode])

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
    setOutletFilter('All')
    setBillTypeFilter('All')
    setStatusFilter('ALL')
    addNotification?.('Filters reset to default', 'info')
  }

  // Column Chooser Helpers
  const toggleColumn = (key) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  const selectAllColumns = () => {
    setVisibleColumns(ALL_FREIGHT_COLUMNS.map((c) => c.key))
  }

  const deselectAllColumns = () => {
    setVisibleColumns(['code', 'actions'])
  }

  const resetDefaultColumns = () => {
    setVisibleColumns(DEFAULT_VISIBLE_FREIGHT_COLUMNS)
  }

  // Active advance filter count
  const activeAdvanceFilterCount = useMemo(() => {
    let count = 0
    if (fromDate) count++
    if (toDate) count++
    if (outletFilter !== 'All') count++
    if (billTypeFilter !== 'All') count++
    if (statusFilter !== 'ALL') count++
    return count
  }, [fromDate, toDate, outletFilter, billTypeFilter, statusFilter])

  // Summary Metrics
  const summaryMetrics = useMemo(() => {
    const totalCount = freights.length
    const totalAmount = freights.reduce((sum, f) => sum + (Number(f.amount) || 0), 0)
    const totalBalance = freights.reduce((sum, f) => sum + (Number(f.balance) || 0), 0)
    const openCount = freights.filter((f) => f.status === 'OPEN' || f.status === 'PARTIAL').length
    const paidCount = freights.filter((f) => f.status === 'PAID').length
    return { totalCount, totalAmount, totalBalance, openCount, paidCount }
  }, [freights])

  // Delete Freight Action
  const handleDeleteFreight = async (id, code) => {
    if (!window.confirm(`Are you sure you want to delete Freight record ${code}?`)) return
    try {
      await adminEnterFreightAPI.delete(id)
      addNotification?.(`Freight record ${code} deleted successfully`, 'success')
      fetchFreights()
    } catch (err) {
      addNotification?.(err.message || 'Failed to delete freight', 'error')
    }
  }

  // Update Status Action
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await adminEnterFreightAPI.updateStatus(id, newStatus)
      addNotification?.(`Status updated to ${newStatus}`, 'success')
      fetchFreights()
      if (selectedFreight && selectedFreight.id === id) {
        setSelectedFreight((prev) => ({ ...prev, status: newStatus }))
      }
    } catch (err) {
      addNotification?.(err.message || 'Failed to update status', 'error')
    }
  }

  // Export to Excel
  const handleExportExcel = () => {
    if (freights.length === 0) {
      addNotification?.('No freights to export', 'warning')
      return
    }

    const headers = []
    const keys = []

    ALL_FREIGHT_COLUMNS.forEach((col) => {
      if (col.key !== 'actions' && visibleColumns.includes(col.key)) {
        headers.push(col.label[lang] || col.label.en)
        keys.push(col.key)
      }
    })

    const data = freights.map((f) => {
      const row = {}
      keys.forEach((k) => {
        if (k === 'date') {
          row[k] = f.freightDate || '—'
        } else if (k === 'dueDate') {
          row[k] = f.dueDate || '—'
        } else if (k === 'amount' || k === 'balance') {
          row[k] = Number(f[k] || 0)
        } else {
          row[k] = f[k] || '—'
        }
      })
      return row
    })

    exportStyledExcel({
      filename: `Enter_Freight_${new Date().toISOString().slice(0, 10)}`,
      title: "B'Groceries - Accounts Payable Enter Freight List",
      subtitle: `Exported on ${new Date().toLocaleDateString()} | Total: ${freights.length} Records`,
      headers,
      data,
      columnKeys: keys,
    })

    addNotification?.('Enter freights exported to Excel', 'success')
  }

  // View Mode: 'create'
  if (viewMode === 'create') {
    return (
      <EnterFreightCreateView
        onCancel={() => setViewMode('list')}
        onSuccess={() => {
          setViewMode('list')
          fetchFreights()
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
            <Link to="/admin" className="hover:text-red-400 transition-colors">
              {lang === 'en' ? 'Dashboard' : 'ផ្ទាំងគ្រប់គ្រង'}
            </Link>
            <span>/</span>
            <Link to="/admin/payable-management" className="hover:text-red-400 transition-colors">
              {lang === 'en' ? 'Payable Management Hub' : 'ការគ្រប់គ្រងបំណុលត្រូវបង់'}
            </Link>
            <span>/</span>
            <span className="text-red-400 font-bold">
              {lang === 'en' ? 'Enter Freight' : 'វិក័យប័ត្រដឹកជញ្ជូន'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-500/30 text-2xl shadow-lg shadow-amber-500/10">
              <img src={travelIcon} alt="Enter Freight" className="h-7 w-7 object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black tracking-tight text-white font-['Montserrat']">
                  {lang === 'en' ? 'Freight List' : 'បញ្ជីវិក័យប័ត្រដឹកជញ្ជូន'}
                </h1>
                <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-300 border border-amber-500/30 font-mono">
                  {freights.length} {lang === 'en' ? 'Records' : 'កំណត់ត្រា'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'en'
                  ? 'Show information of freight. Ex(Code, Date, Amount...)'
                  : 'បង្ហាញព័ត៌មាននៃការដឹកជញ្ជូន។ ឧទាហរណ៍ (លេខកូដ, កាលបរិច្ឆេទ, ចំនួនទឹកប្រាក់...)'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons: Export Excel, Back to Hub & Create Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportExcel}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-2.5 text-xs font-semibold text-amber-300 hover:bg-slate-800 hover:border-amber-400 transition-all active:scale-95 shadow-md shadow-amber-950/20"
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
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 px-5 py-2.5 text-xs font-black text-white transition-all shadow-lg shadow-amber-600/30 active:scale-95"
          >
            <PlusIcon className="w-4 h-4" />
            <span>{lang === 'en' ? 'Create Freight' : 'បញ្ចូលការដឹកជញ្ជូន'}</span>
          </button>
        </div>
      </div>

      {/* KPI METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-sm backdrop-blur">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {lang === 'en' ? 'Total Freight Records' : 'វិក័យប័ត្រដឹកជញ្ជូនសរុប'}
          </p>
          <p className="mt-1 text-2xl font-black text-white font-mono">{summaryMetrics.totalCount}</p>
        </div>
        <div className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-4 shadow-sm backdrop-blur">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
            {lang === 'en' ? 'Total Freight Amount' : 'ទឹកប្រាក់ដឹកជញ្ជូនសរុប'}
          </p>
          <p className="mt-1 text-2xl font-black text-amber-400 font-mono">
            $${summaryMetrics.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="rounded-2xl border border-rose-900/40 bg-rose-950/20 p-4 shadow-sm backdrop-blur">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-rose-400">
            {lang === 'en' ? 'Outstanding Balance' : 'សមតុល្យនៅសល់'}
          </p>
          <p className="mt-1 text-2xl font-black text-rose-400 font-mono">
            $${summaryMetrics.totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-4 shadow-sm backdrop-blur">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
            {lang === 'en' ? 'Settled Invoices' : 'វិក័យប័ត្របានទូទាត់'}
          </p>
          <p className="mt-1 text-2xl font-black text-emerald-400 font-mono">{summaryMetrics.paidCount}</p>
        </div>
      </div>

      {/* 2. SEARCH FREIGHT */}
      {/* Search freight by any condition. Ex(Any, Code, Amount...) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5 backdrop-blur shadow-xl space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <SearchIcon className="w-4 h-4 text-amber-400" />
              <span>{lang === 'en' ? 'Search Freight' : 'ស្វែងរកការដឹកជញ្ជូន'}</span>
            </h2>
            <div className="flex items-center gap-2">
              {/* Choose Column Button */}
              <button
                type="button"
                onClick={() => setChooseColumnOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-600 transition"
              >
                <ColumnsIcon className="w-3.5 h-3.5 text-amber-400" />
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
              ? 'Search freight by any condition. Ex(Any, Code, Amount...)'
              : 'ស្វែងរកការដឹកជញ្ជូនតាមលក្ខខណ្ឌណាមួយ។ ឧទាហរណ៍ (ទាំងអស់, លេខកូដ, ចំនួនទឹកប្រាក់...)'}
          </p>
        </div>

        {/* Row: Search - Textbox (Search here), Search By Dropdown, Search Button, Advance Filter Button */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Search - Textbox */}
          <div className="sm:col-span-6 relative">
            <label className="block text-[11px] font-semibold text-slate-400 mb-1 sm:hidden">
              {lang === 'en' ? 'Search' : 'ស្វែងរក'}
            </label>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTriggerSearch()}
              placeholder={lang === 'en' ? 'Search here' : 'ស្វែងរកនៅទីនេះ...'}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Search By - DropDown Any, Code, Amount, Supplier, Contact */}
          <div className="sm:col-span-3">
            <label className="block text-[11px] font-semibold text-slate-400 mb-1 sm:hidden">
              {lang === 'en' ? 'Search By' : 'ស្វែងរកតាម'}
            </label>
            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
            >
              {SEARCH_BY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {lang === 'en' ? `Search By: ${opt.label.en}` : `ស្វែងរកតាម: ${opt.label.kh}`}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button & Advance Filter Button (filter_list) */}
          <div className="sm:col-span-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleTriggerSearch}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 px-4 py-2.5 text-xs font-bold text-white transition active:scale-95 shadow-md shadow-amber-950/30"
            >
              <SearchIcon className="w-4 h-4" />
              <span>{lang === 'en' ? 'Search' : 'ស្វែងរក'}</span>
            </button>

            {/* filter_list Advance Filter */}
            <button
              type="button"
              onClick={() => setAdvanceFilterOpen((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-semibold transition active:scale-95 ${
                advanceFilterOpen || activeAdvanceFilterCount > 0
                  ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
                  : 'border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
              title="Toggle Advance Filter"
            >
              <FilterListIcon className="w-4 h-4" />
              <span>{lang === 'en' ? 'Advance Filter' : 'តម្រងកម្រិតខ្ពស់'}</span>
              {activeAdvanceFilterCount > 0 && (
                <span className="rounded-full bg-amber-600 px-1.5 py-0.2 text-[10px] font-bold text-white font-mono">
                  {activeAdvanceFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Advance Filter Collapsible Panel */}
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
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
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
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
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
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
              >
                {OUTLET_OPTIONS.map((out) => (
                  <option key={out} value={out}>
                    {out}
                  </option>
                ))}
              </select>
            </div>

            {/* Bill Type Dropdown */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                {lang === 'en' ? 'Bill Type' : 'ប្រភេទប៊ីល'}
              </label>
              <select
                value={billTypeFilter}
                onChange={(e) => setBillTypeFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
              >
                {BILL_TYPE_OPTIONS.map((bt) => (
                  <option key={bt} value={bt}>
                    {bt}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Dropdown */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                {lang === 'en' ? 'Status' : 'ស្ថានភាព'}
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 3. FREIGHT LIST TABLE */}
      {/* Show information of freight. Ex(Code, Date, Amount...) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur shadow-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-base font-bold text-white">
              {lang === 'en' ? 'Freight List' : 'បញ្ជីវិក័យប័ត្រដឹកជញ្ជូន'}
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'en'
                ? 'Show information of freight. Ex(Code, Date, Amount...)'
                : 'បង្ហាញព័ត៌មាននៃការដឹកជញ្ជូន។ ឧទាហរណ៍ (លេខកូដ, កាលបរិច្ឆេទ, ចំនួនទឹកប្រាក់...)'}
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {freights.length} {lang === 'en' ? 'records found' : 'កំណត់ត្រាបានរកឃើញ'}
          </span>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-xs font-semibold">{lang === 'en' ? 'Loading live freights...' : 'កំពុងផ្ទុកទិន្នន័យដឹកជញ្ជូន...'}</p>
            </div>
          ) : freights.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <span className="text-4xl mb-2">🚚</span>
              <p className="text-sm font-semibold text-slate-300">
                {lang === 'en' ? 'No Freight Records Found' : 'មិនមានកំណត់ត្រាដឹកជញ្ជូនឡើយ'}
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm text-center">
                {lang === 'en'
                  ? 'Click "Create Freight" to record a new carrier shipping invoice or adjust search filters.'
                  : 'ចុច "បញ្ចូលការដឹកជញ្ជូន" ដើម្បីបញ្ចូលវិក័យប័ត្រដឹកជញ្ជូនថ្មី ឬកែសម្រួលតម្រង។'}
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                  {visibleColumns.includes('code') && <th className="px-4 py-3.5">Code</th>}
                  {visibleColumns.includes('date') && <th className="px-4 py-3.5">Date</th>}
                  {visibleColumns.includes('dueDate') && <th className="px-4 py-3.5">Due Date</th>}
                  {visibleColumns.includes('amount') && <th className="px-4 py-3.5 text-right">Amount</th>}
                  {visibleColumns.includes('balance') && <th className="px-4 py-3.5 text-right">Balance</th>}
                  {visibleColumns.includes('supplier') && <th className="px-4 py-3.5">Supplier</th>}
                  {visibleColumns.includes('billType') && <th className="px-4 py-3.5">Bill Type</th>}
                  {visibleColumns.includes('reference') && <th className="px-4 py-3.5">Reference</th>}
                  {visibleColumns.includes('paymentTerm') && <th className="px-4 py-3.5">Payment Term</th>}
                  {visibleColumns.includes('contact') && <th className="px-4 py-3.5">Contact</th>}
                  {visibleColumns.includes('username') && <th className="px-4 py-3.5">Username</th>}
                  {visibleColumns.includes('status') && <th className="px-4 py-3.5 text-center">Status</th>}
                  {visibleColumns.includes('actions') && <th className="px-4 py-3.5 text-center">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {freights.map((f) => {
                  const statusColors = {
                    OPEN: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
                    PARTIAL: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40',
                    PAID: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
                    DRAFT: 'bg-slate-500/20 text-slate-300 border border-slate-500/40',
                    VOIDED: 'bg-rose-500/20 text-rose-300 border border-rose-500/40',
                  }
                  return (
                    <tr key={f.id} className="hover:bg-slate-800/40 transition-colors group">
                      {/* Code */}
                      {visibleColumns.includes('code') && (
                        <td className="px-4 py-3 font-mono font-bold text-amber-400 whitespace-nowrap">
                          {f.code}
                        </td>
                      )}

                      {/* Date */}
                      {visibleColumns.includes('date') && (
                        <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                          {f.freightDate || '—'}
                        </td>
                      )}

                      {/* Due Date */}
                      {visibleColumns.includes('dueDate') && (
                        <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                          {f.dueDate || '—'}
                        </td>
                      )}

                      {/* Amount */}
                      {visibleColumns.includes('amount') && (
                        <td className="px-4 py-3 text-right font-mono font-bold text-white whitespace-nowrap">
                          $${Number(f.amount || 0).toFixed(2)}
                        </td>
                      )}

                      {/* Balance */}
                      {visibleColumns.includes('balance') && (
                        <td className="px-4 py-3 text-right font-mono font-bold text-amber-400 whitespace-nowrap">
                          $${Number(f.balance || 0).toFixed(2)}
                        </td>
                      )}

                      {/* Supplier */}
                      {visibleColumns.includes('supplier') && (
                        <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">
                          {f.supplier || '—'}
                        </td>
                      )}

                      {/* Bill Type */}
                      {visibleColumns.includes('billType') && (
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] bg-slate-800 text-slate-300 border border-slate-700">
                            {f.billType || 'Standard Freight'}
                          </span>
                        </td>
                      )}

                      {/* Reference */}
                      {visibleColumns.includes('reference') && (
                        <td className="px-4 py-3 text-slate-300 font-mono whitespace-nowrap">
                          {f.reference || '—'}
                        </td>
                      )}

                      {/* Payment Term */}
                      {visibleColumns.includes('paymentTerm') && (
                        <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                          {f.paymentTerm || 'Net 30'}
                        </td>
                      )}

                      {/* Contact */}
                      {visibleColumns.includes('contact') && (
                        <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                          {f.contact || '—'}
                        </td>
                      )}

                      {/* Username */}
                      {visibleColumns.includes('username') && (
                        <td className="px-4 py-3 text-slate-400 whitespace-nowrap font-mono text-[11px]">
                          {f.username || 'Badmin'}
                        </td>
                      )}

                      {/* Status */}
                      {visibleColumns.includes('status') && (
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              statusColors[f.status] || statusColors.OPEN
                            }`}
                          >
                            {f.status || 'OPEN'}
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
                                setSelectedFreight(f)
                                setDetailModalOpen(true)
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                              title="View Details"
                            >
                              <EyeIcon className="w-4 h-4" />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => handleDeleteFreight(f.id, f.code)}
                              className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition"
                              title="Delete Record"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
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
      {chooseColumnOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <ColumnsIcon className="w-5 h-5 text-amber-400" />
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

            {/* Quick action buttons (Reset button requested) */}
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
                className="px-2.5 py-1 rounded-lg bg-amber-600/20 border border-amber-500/40 hover:bg-amber-600/30 text-[11px] font-bold text-amber-300 transition"
              >
                {lang === 'en' ? 'Reset' : 'កំណត់ឡើងវិញ'}
              </button>
            </div>

            {/* Column Checkboxes */}
            <div className="grid grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
              {ALL_FREIGHT_COLUMNS.map((col) => {
                const checked = visibleColumns.includes(col.key)
                return (
                  <label
                    key={col.key}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition select-none ${
                      checked
                        ? 'border-amber-500/50 bg-amber-500/10 text-white font-semibold'
                        : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleColumn(col.key)}
                      className="rounded border-slate-700 text-amber-600 focus:ring-amber-500"
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
                className="rounded-xl bg-amber-600 hover:bg-amber-500 px-5 py-2 text-xs font-bold text-white transition active:scale-95"
              >
                {lang === 'en' ? 'Done' : 'រួចរាល់'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. DETAIL VIEW MODAL */}
      {detailModalOpen && selectedFreight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-lg font-black text-white">
                    {lang === 'en' ? 'Freight Details' : 'ព័ត៌មានលម្អិតការដឹកជញ្ជូន'}
                  </h3>
                  <span className="font-mono text-sm text-amber-400 font-bold">
                    {selectedFreight.code}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lang === 'en' ? 'Supplier invoice & tariff distribution breakdown' : 'ព័ត៌មានវិក័យប័ត្រ និងការបែងចែកថ្លៃដឹកជញ្ជូន'}
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

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Freight Date</span>
                <span className="text-white font-semibold mt-0.5 block">{selectedFreight.freightDate || '—'}</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Due Date</span>
                <span className="text-white font-semibold mt-0.5 block">{selectedFreight.dueDate || '—'}</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Supplier</span>
                <span className="text-white font-semibold mt-0.5 block">{selectedFreight.supplier || '—'}</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Contact</span>
                <span className="text-white font-semibold mt-0.5 block">{selectedFreight.contact || '—'}</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Amount</span>
                <span className="text-white font-mono font-bold text-sm mt-0.5 block">
                  $${Number(selectedFreight.amount || 0).toFixed(2)}
                </span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Balance</span>
                <span className="text-amber-400 font-mono font-bold text-sm mt-0.5 block">
                  $${Number(selectedFreight.balance || 0).toFixed(2)}
                </span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Supplier Invoice</span>
                <span className="text-white font-mono mt-0.5 block">{selectedFreight.supplierInvoiceCode || '—'}</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment Term</span>
                <span className="text-white font-semibold mt-0.5 block">{selectedFreight.paymentTerm || 'Net 30'}</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Status</span>
                <span className="text-amber-300 font-bold uppercase mt-0.5 block">{selectedFreight.status || 'OPEN'}</span>
              </div>
            </div>

            {selectedFreight.note && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 text-xs">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Note:</span>
                <span className="text-slate-200">{selectedFreight.note}</span>
              </div>
            )}

            {/* Nested Tariffs */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                {lang === 'en' ? 'Freight Tariffs & Shipments' : 'តារាងតម្លៃដឹកជញ្ជូន'}
              </h4>
              <div className="rounded-xl border border-slate-800 overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="px-3 py-2">Code</th>
                      <th className="px-3 py-2">Tariff Description</th>
                      <th className="px-3 py-2">Date</th>
                      <th className="px-3 py-2 text-right">Freight Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {selectedFreight.tariffItems && selectedFreight.tariffItems.length > 0 ? (
                      selectedFreight.tariffItems.map((it, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30">
                          <td className="px-3 py-2 font-mono text-amber-400 font-bold">{it.code}</td>
                          <td className="px-3 py-2 text-slate-200">{it.tariffDescription}</td>
                          <td className="px-3 py-2 text-slate-400">{it.date || '—'}</td>
                          <td className="px-3 py-2 text-right font-mono font-bold text-white">
                            $${Number(it.freightAmount || 0).toFixed(2)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-3 py-4 text-center text-slate-500">
                          No tariff items recorded.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Nested Other Expenses */}
            {selectedFreight.otherExpenses && selectedFreight.otherExpenses.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  {lang === 'en' ? 'Other Expenses' : 'ចំណាយផ្សេងៗ'}
                </h4>
                <div className="rounded-xl border border-slate-800 overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                      <tr>
                        <th className="px-3 py-2">Expense Category</th>
                        <th className="px-3 py-2">Description</th>
                        <th className="px-3 py-2 text-right">Amount</th>
                        <th className="px-3 py-2 text-right">Tax</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {selectedFreight.otherExpenses.map((exp, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30">
                          <td className="px-3 py-2 font-semibold text-slate-300">{exp.expenseCategory}</td>
                          <td className="px-3 py-2 text-slate-400">{exp.description}</td>
                          <td className="px-3 py-2 text-right font-mono text-white">$${Number(exp.amount || 0).toFixed(2)}</td>
                          <td className="px-3 py-2 text-right font-mono text-slate-400">$${Number(exp.taxAmount || 0).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

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
// General Information: Input the general freight information
// Code Auto Generate Code - Textbox
// Freight Date - Date
// Supplier * - Dropdown
// Contact * - Dropdown
// Supplier Invoice Code
// Supplier Invoice Date - date
// Payment Term * - Dropdown
// Template Name - Dropdown
// Note - Textbox
// Freights: Enter Freight List | Other Expense
// Table: Choose, Code, Tariff Description, Date, Freight Amount
// Footer: Total 0 Line, $0.00
function EnterFreightCreateView({ onCancel, onSuccess }) {
  const { lang } = useLanguage()
  const { addNotification } = useNotifications()

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), [])

  // General Information States
  const [code, setCode] = useState('')
  const [freightDate, setFreightDate] = useState(todayStr)
  const [dueDate, setDueDate] = useState('')
  const [supplier, setSupplier] = useState('')
  const [supplierId, setSupplierId] = useState(null)
  const [contact, setContact] = useState('')
  const [supplierInvoiceCode, setSupplierInvoiceCode] = useState('')
  const [supplierInvoiceDate, setSupplierInvoiceDate] = useState(todayStr)
  const [paymentTerm, setPaymentTerm] = useState('Net 30')
  const [templateName, setTemplateName] = useState(TEMPLATE_OPTIONS[0])
  const [note, setNote] = useState('')
  const [billType, setBillType] = useState('Standard Freight')
  const [outlet, setOutlet] = useState('Main Store Warehouse')
  const [reference, setReference] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Master Data
  const [suppliersList, setSuppliersList] = useState([])
  const [contactOptions, setContactOptions] = useState([])
  const [paymentTermsList, setPaymentTermsList] = useState(PAYMENT_TERM_OPTIONS)

  // Sub-tabs: 'freight-list' | 'other-expense'
  const [activeTab, setActiveTab] = useState('freight-list')

  // Freights -> Enter Freight List Items
  // [{ id, chosen, code, tariffDescription, date, freightAmount }]
  const [tariffItems, setTariffItems] = useState([
    {
      id: 1,
      chosen: true,
      code: 'TRF-SEA-40FT',
      tariffDescription: 'Sea Freight 40ft Container Sihanoukville - Phnom Penh',
      date: todayStr,
      freightAmount: 950.00,
    },
    {
      id: 2,
      chosen: true,
      code: 'TRF-ROD-5TON',
      tariffDescription: 'Refrigerated 5-ton Truck Highway Battambang - PP',
      date: todayStr,
      freightAmount: 300.00,
    }
  ])

  // Freights -> Other Expense Items
  // [{ id, chosen, expenseCategory, description, amount, taxAmount }]
  const [otherExpenses, setOtherExpenses] = useState([
    {
      id: 1,
      chosen: true,
      expenseCategory: 'Port Handling',
      description: 'Terminal Handling Charges (THC) & Port Demurrage',
      amount: 150.00,
      taxAmount: 15.00,
    }
  ])

  // Auto Code Generation
  const fetchNextCode = async () => {
    try {
      const res = await adminEnterFreightAPI.getNextCode()
      const genCode = res?.data?.code || res?.code || (typeof res === 'string' ? res : null)
      if (genCode) {
        setCode(genCode)
        return
      }
    } catch {}
    const rand = Math.floor(1000 + Math.random() * 9000)
    setCode(`FRT-${todayStr.replace(/-/g, '')}-${rand}`)
  }

  useEffect(() => {
    fetchNextCode()
  }, [])

  // Auto calculate due date when freightDate or paymentTerm changes
  useEffect(() => {
    try {
      const d = new Date(freightDate || todayStr)
      let daysToAdd = 30
      if (paymentTerm === 'Net 15') daysToAdd = 15
      else if (paymentTerm === 'Net 45') daysToAdd = 45
      else if (paymentTerm === 'Net 60') daysToAdd = 60
      else if (paymentTerm === 'Cash' || paymentTerm === 'COD') daysToAdd = 0
      d.setDate(d.getDate() + daysToAdd)
      setDueDate(d.toISOString().slice(0, 10))
    } catch {
      setDueDate(freightDate)
    }
  }, [freightDate, paymentTerm])

  // Fetch Master Suppliers & Payment Terms
  useEffect(() => {
    let mounted = true
    const loadMaster = async () => {
      try {
        const supRes = await adminSupplierAPI.getAll()
        const rawSups = Array.isArray(supRes?.data) ? supRes.data : Array.isArray(supRes) ? supRes : []
        if (mounted && rawSups.length > 0) {
          setSuppliersList(rawSups)
        } else if (mounted) {
          setSuppliersList([
            { id: 3, name: 'Mekong Cold-Chain Logistics', contactFirstName: 'Ly', contactLastName: 'Chantha', contactPhone: '077 112 233' },
            { id: 9, name: 'KabPris', contactFirstName: 'Sok', contactLastName: 'Heng', contactPhone: '09887766' },
            { id: 10, name: 'MONA LISA', contactFirstName: 'LingFu', contactLastName: 'susman', contactPhone: '0318325599' },
            { id: 11, name: 'JAME', contactFirstName: 'Heng', contactLastName: 'Gaming', contactPhone: '012793921' },
          ])
        }
      } catch {
        if (mounted) {
          setSuppliersList([
            { id: 3, name: 'Mekong Cold-Chain Logistics', contactFirstName: 'Ly', contactLastName: 'Chantha', contactPhone: '077 112 233' },
            { id: 9, name: 'KabPris', contactFirstName: 'Sok', contactLastName: 'Heng', contactPhone: '09887766' },
            { id: 10, name: 'MONA LISA', contactFirstName: 'LingFu', contactLastName: 'susman', contactPhone: '0318325599' },
            { id: 11, name: 'JAME', contactFirstName: 'Heng', contactLastName: 'Gaming', contactPhone: '012793921' },
          ])
        }
      }

      try {
        const ptRes = await adminPaymentTermAPI.getAll()
        const rawPt = Array.isArray(ptRes?.data) ? ptRes.data : Array.isArray(ptRes) ? ptRes : []
        if (mounted && rawPt.length > 0) {
          const names = rawPt.map((p) => p.description || p.termName || p.name || p.code).filter(Boolean)
          if (names.length > 0) setPaymentTermsList(names)
        }
      } catch {}
    }

    loadMaster()
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

  // Dynamic Total Amount Calculations
  const totalTariffAmount = useMemo(() => {
    return tariffItems
      .filter((t) => t.chosen)
      .reduce((sum, t) => sum + (Number(t.freightAmount) || 0), 0)
  }, [tariffItems])

  const totalOtherExpAmount = useMemo(() => {
    return otherExpenses
      .filter((e) => e.chosen)
      .reduce((sum, e) => sum + (Number(e.amount) || 0) + (Number(e.taxAmount) || 0), 0)
  }, [otherExpenses])

  const grandTotal = useMemo(() => {
    return totalTariffAmount + totalOtherExpAmount
  }, [totalTariffAmount, totalOtherExpAmount])

  // Tariff Items Row Handlers
  const handleToggleTariff = (idx) => {
    setTariffItems((prev) => {
      const next = [...prev]
      next[idx] = { ...next[idx], chosen: !next[idx].chosen }
      return next
    })
  }

  const handleTariffChange = (idx, field, value) => {
    setTariffItems((prev) => {
      const next = [...prev]
      next[idx] = { ...next[idx], [field]: field === 'freightAmount' ? Number(value) || 0 : value }
      return next
    })
  }

  const handleAddTariffRow = () => {
    const num = tariffItems.length + 1
    setTariffItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        chosen: true,
        code: `TRF-CUST-${num}`,
        tariffDescription: 'Container Haulage & Surcharge',
        date: freightDate,
        freightAmount: 100.00,
      }
    ])
  }

  const handleRemoveTariffRow = (idx) => {
    setTariffItems((prev) => prev.filter((_, i) => i !== idx))
  }

  // Other Expense Row Handlers
  const handleToggleExpense = (idx) => {
    setOtherExpenses((prev) => {
      const next = [...prev]
      next[idx] = { ...next[idx], chosen: !next[idx].chosen }
      return next
    })
  }

  const handleExpenseChange = (idx, field, value) => {
    setOtherExpenses((prev) => {
      const next = [...prev]
      next[idx] = { ...next[idx], [field]: (field === 'amount' || field === 'taxAmount') ? Number(value) || 0 : value }
      return next
    })
  }

  const handleAddExpenseRow = () => {
    setOtherExpenses((prev) => [
      ...prev,
      {
        id: Date.now(),
        chosen: true,
        expenseCategory: 'Customs Duty',
        description: 'Document fee & administrative inspection',
        amount: 50.00,
        taxAmount: 0.00,
      }
    ])
  }

  const handleRemoveExpenseRow = (idx) => {
    setOtherExpenses((prev) => prev.filter((_, i) => i !== idx))
  }

  // Submit Freight Form
  const handleSubmitFreight = async (e) => {
    e.preventDefault()

    if (!supplier) {
      addNotification?.('Please select a Supplier', 'warning')
      return
    }

    const chosenTariffs = tariffItems.filter((t) => t.chosen)
    const chosenExpenses = otherExpenses.filter((e) => e.chosen)

    if (chosenTariffs.length === 0 && chosenExpenses.length === 0) {
      addNotification?.('Please include at least one freight tariff or expense line', 'warning')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        code,
        freightDate,
        dueDate: dueDate || freightDate,
        amount: grandTotal,
        balance: grandTotal,
        supplier,
        supplierId,
        contact,
        supplierInvoiceCode,
        supplierInvoiceDate,
        paymentTerm,
        templateName,
        note,
        billType,
        reference: reference || `REF-${code}`,
        outlet,
        status: 'OPEN',
        username: 'Badmin',
        tariffItems: chosenTariffs.map((t) => ({
          code: t.code,
          tariffDescription: t.tariffDescription,
          date: t.date || freightDate,
          freightAmount: t.freightAmount,
          chosen: true,
        })),
        otherExpenses: chosenExpenses.map((e) => ({
          expenseCategory: e.expenseCategory,
          description: e.description,
          amount: e.amount,
          taxAmount: e.taxAmount || 0,
          chosen: true,
        })),
      }

      await adminEnterFreightAPI.create(payload)
      addNotification?.(`Freight record ${code} created successfully! Total: $${grandTotal.toFixed(2)}`, 'success')
      onSuccess?.()
    } catch (err) {
      console.error('Failed to create freight:', err)
      addNotification?.(err.message || 'Failed to submit freight', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmitFreight} className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8 space-y-6 text-slate-100 font-['Montserrat']">
      {/* TOP HEADER & BREADCRUMBS */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link to="/admin" className="hover:text-amber-400 transition-colors">
              {lang === 'en' ? 'Dashboard' : 'ផ្ទាំងគ្រប់គ្រង'}
            </Link>
            <span>/</span>
            <Link to="/admin/payable-management" className="hover:text-amber-400 transition-colors">
              {lang === 'en' ? 'Payable Management Hub' : 'ការគ្រប់គ្រងបំណុលត្រូវបង់'}
            </Link>
            <span>/</span>
            <button
              type="button"
              onClick={onCancel}
              className="hover:text-amber-400 transition-colors"
            >
              {lang === 'en' ? 'Enter Freight' : 'វិក័យប័ត្រដឹកជញ្ជូន'}
            </button>
            <span>/</span>
            <span className="text-amber-400 font-bold">
              {lang === 'en' ? 'Create Freight' : 'បញ្ចូលការដឹកជញ្ជូនថ្មី'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition"
              title="Back to Freight List"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white font-['Montserrat']">
                {lang === 'en' ? 'Create Freight' : 'បញ្ចូលការដឹកជញ្ជូនថ្មី'}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'en'
                  ? 'Record inbound shipping bills, port charges, and freight cost allocation.'
                  : 'កត់ត្រាថ្លៃដឹកជញ្ជូនចូល ថ្លៃកំពង់ផែ និងបែងចែកថ្លៃដើមដឹកជញ្ជូន។'}
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
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 px-6 py-2.5 text-xs font-black text-white transition shadow-lg shadow-amber-600/30 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{lang === 'en' ? 'Submitting...' : 'កំពុងរក្សាទុក...'}</span>
              </>
            ) : (
              <>
                <CheckIcon className="w-4 h-4" />
                <span>{lang === 'en' ? 'Submit Freight' : 'រក្សាទុកការដឹកជញ្ជូន'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* SECTION 1: GENERAL INFORMATION */}
      {/* General Information */}
      {/* Input the general freight information */}
      {/* Code Auto Generate Code - Textbox */}
      {/* Freight Date - Date */}
      {/* Supplier * - Dropdown */}
      {/* Contact * - Dropdown */}
      {/* Supplier Invoice Code */}
      {/* Supplier Invoice Date - date */}
      {/* Payment Term * - Dropdown */}
      {/* Template Name - Dropdown */}
      {/* Note - Textbox */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur shadow-xl space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 text-xs font-mono font-bold">
              1
            </span>
            <span>{lang === 'en' ? 'General Information' : 'ព័ត៌មានទូទៅ'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 ml-8">
            {lang === 'en' ? 'Input the general freight information' : 'បញ្ចូលព័ត៌មានទូទៅនៃការដឹកជញ្ជូន'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Code Auto Generate Code - Textbox */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
              <span>{lang === 'en' ? 'Code (Auto Generated)' : 'លេខកូដ (ស្វ័យប្រវត្តិ)'}</span>
              <button
                type="button"
                onClick={fetchNextCode}
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1"
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
              className="w-full rounded-xl border border-slate-800 bg-slate-950/90 px-3.5 py-2.5 text-xs text-amber-300 font-mono font-bold focus:outline-none cursor-not-allowed"
            />
          </div>

          {/* Freight Date - Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {lang === 'en' ? 'Freight Date *' : 'កាលបរិច្ឆេទដឹកជញ្ជូន *'}
            </label>
            <input
              type="date"
              required
              value={freightDate}
              onChange={(e) => setFreightDate(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
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
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
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
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
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
                placeholder={lang === 'en' ? 'Contact phone / person' : 'លេខទូរស័ព្ទ / ឈ្មោះ'}
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            )}
          </div>

          {/* Supplier Invoice Code */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {lang === 'en' ? 'Supplier Invoice Code' : 'លេខវិក័យប័ត្រអ្នកផ្គត់ផ្គង់'}
            </label>
            <input
              type="text"
              placeholder="e.g. INV-LOG-202609"
              value={supplierInvoiceCode}
              onChange={(e) => setSupplierInvoiceCode(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none font-mono"
            />
          </div>

          {/* Supplier Invoice Date - date */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {lang === 'en' ? 'Supplier Invoice Date' : 'កាលបរិច្ឆេទវិក័យប័ត្រអ្នកផ្គត់ផ្គង់'}
            </label>
            <input
              type="date"
              value={supplierInvoiceDate}
              onChange={(e) => setSupplierInvoiceDate(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Payment Term * - Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {lang === 'en' ? 'Payment Term *' : 'លក្ខខណ្ឌទូទាត់ *'}
            </label>
            <select
              value={paymentTerm}
              onChange={(e) => setPaymentTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
            >
              {paymentTermsList.map((pt) => (
                <option key={pt} value={pt}>
                  {pt}
                </option>
              ))}
            </select>
          </div>

          {/* Template Name - Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {lang === 'en' ? 'Template Name' : 'ឈ្មោះគំរូ'}
            </label>
            <select
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
            >
              {TEMPLATE_OPTIONS.map((tmpl) => (
                <option key={tmpl} value={tmpl}>
                  {tmpl}
                </option>
              ))}
            </select>
          </div>

          {/* Bill Type / Outlet */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {lang === 'en' ? 'Bill Type' : 'ប្រភេទប៊ីល'}
            </label>
            <select
              value={billType}
              onChange={(e) => setBillType(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
            >
              {BILL_TYPE_OPTIONS.filter((b) => b !== 'All').map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Note - Textbox (spans 3 cols) */}
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {lang === 'en' ? 'Note' : 'កំណត់សម្គាល់'}
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={lang === 'en' ? 'Shipping notes, bill of lading tracking numbers, demurrage remarks...' : 'កំណត់ចំណាំផ្សេងៗ...'}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: FREIGHTS (Dual Tabs: Enter Freight List | Other Expense) */}
      {/* Freights */}
      {/* Enter Freight List Other Expense */}
      {/* Choose, Code, Tariff Description, Date, Freight Amount */}
      {/* Total 0 Line $0.00 */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur shadow-xl space-y-4">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 text-xs font-mono font-bold">
                2
              </span>
              <span>{lang === 'en' ? 'Freights' : 'ការដឹកជញ្ជូន'}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 ml-8">
              {lang === 'en' ? 'Freight tariff charges and additional operational expenses' : 'ថ្លៃដឹកជញ្ជូន និងចំណាយប្រតិបត្តិការបន្ថែម'}
            </p>
          </div>

          {/* Tab buttons: Enter Freight List | Other Expense */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('freight-list')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'freight-list'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'en' ? 'Enter Freight List' : 'បញ្ជីថ្លៃដឹកជញ្ជូន'}
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 font-mono">
                {tariffItems.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('other-expense')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'other-expense'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'en' ? 'Other Expense' : 'ចំណាយផ្សេងៗ'}
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 font-mono">
                {otherExpenses.length}
              </span>
            </button>
          </div>
        </div>

        {/* TAB 1: ENTER FREIGHT LIST */}
        {activeTab === 'freight-list' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">
                {lang === 'en' ? 'Tariff Items & Shipment Rates' : 'តារាងតម្លៃដឹកជញ្ជូន'}
              </span>
              <button
                type="button"
                onClick={handleAddTariffRow}
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 transition"
              >
                <PlusIcon className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Add Tariff Line' : 'បន្ថែមជួរថ្មី'}</span>
              </button>
            </div>

            {/* Table: Choose, Code, Tariff Description, Date, Freight Amount */}
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/50">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/90 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                    <th className="px-3.5 py-3 w-10 text-center">Choose</th>
                    <th className="px-3.5 py-3 w-36">Code</th>
                    <th className="px-3.5 py-3">Tariff Description</th>
                    <th className="px-3.5 py-3 w-36">Date</th>
                    <th className="px-3.5 py-3 w-36 text-right">Freight Amount ($)</th>
                    <th className="px-3.5 py-3 w-12 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {tariffItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        {lang === 'en' ? 'No freight tariff items added.' : 'មិនមានជួរថ្លៃដឹកជញ្ជូននៅឡើយទេ។'}
                      </td>
                    </tr>
                  ) : (
                    tariffItems.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-800/30">
                        {/* Choose */}
                        <td className="px-3.5 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={item.chosen}
                            onChange={() => handleToggleTariff(idx)}
                            className="rounded border-slate-700 text-amber-600 focus:ring-amber-500"
                          />
                        </td>

                        {/* Code */}
                        <td className="px-3.5 py-2">
                          <input
                            type="text"
                            value={item.code}
                            onChange={(e) => handleTariffChange(idx, 'code', e.target.value)}
                            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-amber-400 font-mono font-bold focus:border-amber-500 focus:outline-none"
                          />
                        </td>

                        {/* Tariff Description */}
                        <td className="px-3.5 py-2">
                          <input
                            type="text"
                            value={item.tariffDescription}
                            onChange={(e) => handleTariffChange(idx, 'tariffDescription', e.target.value)}
                            placeholder="e.g. Sea Freight Sihanoukville - Phnom Penh"
                            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-white focus:border-amber-500 focus:outline-none"
                          />
                        </td>

                        {/* Date */}
                        <td className="px-3.5 py-2">
                          <input
                            type="date"
                            value={item.date}
                            onChange={(e) => handleTariffChange(idx, 'date', e.target.value)}
                            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                          />
                        </td>

                        {/* Freight Amount */}
                        <td className="px-3.5 py-2 text-right">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.freightAmount}
                            onChange={(e) => handleTariffChange(idx, 'freightAmount', e.target.value)}
                            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-right text-xs text-white font-mono font-bold focus:border-amber-500 focus:outline-none"
                          />
                        </td>

                        {/* Delete Row */}
                        <td className="px-3.5 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveTariffRow(idx)}
                            className="text-slate-500 hover:text-rose-400 transition"
                            title="Remove"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                {/* Footer: Total 0 Line, $0.00 */}
                <tfoot className="border-t border-slate-800 bg-slate-950/80 font-semibold text-xs">
                  <tr>
                    <td colSpan={4} className="px-3.5 py-3 text-slate-400">
                      Total: {tariffItems.filter((t) => t.chosen).length} Line{tariffItems.filter((t) => t.chosen).length !== 1 ? 's' : ''}
                    </td>
                    <td className="px-3.5 py-3 text-right font-mono text-amber-400 font-bold text-sm">
                      $${totalTariffAmount.toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: OTHER EXPENSE */}
        {activeTab === 'other-expense' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">
                {lang === 'en' ? 'Demurrage, Customs & Handling Surcharges' : 'ចំណាយប្រតិបត្តិការកំពង់ផែ និងពន្ធ'}
              </span>
              <button
                type="button"
                onClick={handleAddExpenseRow}
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 transition"
              >
                <PlusIcon className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Add Expense Line' : 'បន្ថែមចំណាយ'}</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/50">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/90 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                    <th className="px-3.5 py-3 w-10 text-center">Choose</th>
                    <th className="px-3.5 py-3 w-48">Expense Category</th>
                    <th className="px-3.5 py-3">Description</th>
                    <th className="px-3.5 py-3 w-32 text-right">Amount ($)</th>
                    <th className="px-3.5 py-3 w-32 text-right">Tax Amount ($)</th>
                    <th className="px-3.5 py-3 w-12 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {otherExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        {lang === 'en' ? 'No other expenses added.' : 'មិនមានចំណាយផ្សេងៗនៅឡើយទេ។'}
                      </td>
                    </tr>
                  ) : (
                    otherExpenses.map((exp, idx) => (
                      <tr key={exp.id} className="hover:bg-slate-800/30">
                        {/* Choose */}
                        <td className="px-3.5 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={exp.chosen}
                            onChange={() => handleToggleExpense(idx)}
                            className="rounded border-slate-700 text-amber-600 focus:ring-amber-500"
                          />
                        </td>

                        {/* Category */}
                        <td className="px-3.5 py-2">
                          <input
                            type="text"
                            value={exp.expenseCategory}
                            onChange={(e) => handleExpenseChange(idx, 'expenseCategory', e.target.value)}
                            placeholder="e.g. Port Handling"
                            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-white font-semibold focus:border-amber-500 focus:outline-none"
                          />
                        </td>

                        {/* Description */}
                        <td className="px-3.5 py-2">
                          <input
                            type="text"
                            value={exp.description}
                            onChange={(e) => handleExpenseChange(idx, 'description', e.target.value)}
                            placeholder="e.g. Terminal inspection fee"
                            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-300 focus:border-amber-500 focus:outline-none"
                          />
                        </td>

                        {/* Amount */}
                        <td className="px-3.5 py-2 text-right">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={exp.amount}
                            onChange={(e) => handleExpenseChange(idx, 'amount', e.target.value)}
                            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-right text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
                          />
                        </td>

                        {/* Tax Amount */}
                        <td className="px-3.5 py-2 text-right">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={exp.taxAmount}
                            onChange={(e) => handleExpenseChange(idx, 'taxAmount', e.target.value)}
                            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-right text-xs text-slate-400 font-mono focus:border-amber-500 focus:outline-none"
                          />
                        </td>

                        {/* Delete */}
                        <td className="px-3.5 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveExpenseRow(idx)}
                            className="text-slate-500 hover:text-rose-400 transition"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot className="border-t border-slate-800 bg-slate-950/80 font-semibold text-xs">
                  <tr>
                    <td colSpan={3} className="px-3.5 py-3 text-slate-400">
                      Total: {otherExpenses.filter((e) => e.chosen).length} Line{otherExpenses.filter((e) => e.chosen).length !== 1 ? 's' : ''}
                    </td>
                    <td colSpan={2} className="px-3.5 py-3 text-right font-mono text-amber-400 font-bold text-sm">
                      $${totalOtherExpAmount.toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER ACTIONS & GRAND TOTAL */}
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
            {lang === 'en' ? 'Total Freight Amount: ' : 'ទឹកប្រាក់ដឹកជញ្ជូនសរុប: '}
            <strong className="text-amber-400 font-mono text-sm font-black">
              $${grandTotal.toFixed(2)}
            </strong>
          </span>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 px-7 py-2.5 text-xs font-black text-white transition shadow-lg shadow-amber-600/30 disabled:opacity-50 active:scale-95"
          >
            {submitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{lang === 'en' ? 'Saving...' : 'កំពុងរក្សាទុក...'}</span>
              </>
            ) : (
              <>
                <CheckIcon className="w-4 h-4" />
                <span>{lang === 'en' ? 'Submit Freight' : 'រក្សាទុកការដឹកជញ្ជូន'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}
