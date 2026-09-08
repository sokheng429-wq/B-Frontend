import React, { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useNotifications } from '../../context/NotificationContext'
import { adminEnterBillAPI } from '../../api/api'
import { exportStyledExcel } from '../../utils/excelExport'
import fileTextIcon from '../../assets/icon/3dicons-file-text-dynamic-color.png'
import EnterBillCreate from './EnterBillCreate'
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

function RefreshIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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

// All Table Columns for Entity (as explicitly requested):
// Code, Supplier Invoice Code, Date, Due Date, Amount, Balance, Supplier, Reference, Contact, Bill Type, Username, Outlet, Status, Actions
export const ALL_BILL_COLUMNS = [
  { key: 'code', label: { en: 'Code', kh: 'លេខកូដប៊ីល' }, always: true },
  { key: 'supplierInvoiceCode', label: { en: 'Supplier Invoice Code', kh: 'លេខវិក័យប័ត្រអ្នកផ្គត់ផ្គង់' } },
  { key: 'date', label: { en: 'Date', kh: 'កាលបរិច្ឆេទ' } },
  { key: 'dueDate', label: { en: 'Due Date', kh: 'កាលបរិច្ឆេទកំណត់បង់' } },
  { key: 'amount', label: { en: 'Amount ($)', kh: 'ចំនួនទឹកប្រាក់ ($)' } },
  { key: 'balance', label: { en: 'Balance ($)', kh: 'សមតុល្យ ($)' } },
  { key: 'supplier', label: { en: 'Supplier', kh: 'អ្នកផ្គត់ផ្គង់' } },
  { key: 'reference', label: { en: 'Reference', kh: 'ឯកសារយោង' } },
  { key: 'contact', label: { en: 'Contact', kh: 'អ្នកទំនាក់ទំនង' } },
  { key: 'billType', label: { en: 'Bill Type', kh: 'ប្រភេទប៊ីល' } },
  { key: 'username', label: { en: 'Username', kh: 'អ្នកប្រើប្រាស់' } },
  { key: 'outlet', label: { en: 'Outlet', kh: 'សាខា / ឃ្លាំង' } },
  { key: 'status', label: { en: 'Status', kh: 'ស្ថានភាព' } },
  { key: 'actions', label: { en: 'Actions', kh: 'សកម្មភាព' }, always: true },
]

export const DEFAULT_VISIBLE_COLUMNS = [
  'code',
  'supplierInvoiceCode',
  'date',
  'dueDate',
  'amount',
  'balance',
  'supplier',
  'reference',
  'contact',
  'billType',
  'username',
  'outlet',
  'status',
  'actions',
]

// Dropdown Options
export const SEARCH_BY_OPTIONS = [
  { value: 'Any', label: { en: 'Any', kh: 'ទាំងអស់' } },
  { value: 'Code', label: { en: 'Code', kh: 'លេខកូដប៊ីល' } },
  { value: 'Amount', label: { en: 'Amount', kh: 'ចំនួនទឹកប្រាក់' } },
  { value: 'Supplier', label: { en: 'Supplier', kh: 'អ្នកផ្គត់ផ្គង់' } },
  { value: 'Contact', label: { en: 'Contact', kh: 'អ្នកទំនាក់ទំនង' } },
]

export const BILL_TYPE_OPTIONS = [
  { value: 'All', label: { en: 'All', kh: 'ទាំងអស់' } },
  { value: 'Enter Bill', label: { en: 'Enter Bill', kh: 'បញ្ចូលប៊ីល' } },
  { value: 'Debit Memo', label: { en: 'Debit Memo', kh: 'ប័ណ្ណឥណពន្ធ' } },
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

export const STATUS_OPTIONS = ['ALL', 'OPEN', 'PARTIAL', 'PAID', 'DRAFT', 'VOIDED']

export default function EnterBillList({ initialMode = 'list' }) {
  const { lang } = useLanguage()
  const { addNotification } = useNotifications()
  const navigate = useNavigate()

  // View Mode: 'list' | 'create'
  const [viewMode, setViewMode] = useState(initialMode)

  // Bills Data & Loading
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)

  // 1. Search Bill States
  // Search - Textbox
  // Search By - DropDown Any Code Amount Supplier Contact
  // Bill Type - Dropdown All Enter Bill Debit Memo
  // Search Button
  const [searchText, setSearchText] = useState('')
  const [searchBy, setSearchBy] = useState('Any')
  const [billTypeFilter, setBillTypeFilter] = useState('All')
  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    searchBy: 'Any',
    billType: 'All',
  })

  // 2. Advance Filter States
  // From Date to Date , Outlet Dropdown, Bill Status Dropdown
  const [advanceFilterOpen, setAdvanceFilterOpen] = useState(false)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [outletFilter, setOutletFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('ALL')

  // 3. Choose Column States & Persistence
  const [chooseColumnOpen, setChooseColumnOpen] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState(() => {
    try {
      const saved = localStorage.getItem('bg_enter_bill_columns')
      return saved ? JSON.parse(saved) : DEFAULT_VISIBLE_COLUMNS
    } catch {
      return DEFAULT_VISIBLE_COLUMNS
    }
  })

  useEffect(() => {
    localStorage.setItem('bg_enter_bill_columns', JSON.stringify(visibleColumns))
  }, [visibleColumns])

  // 4. Detail / View Modal State
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedBill, setSelectedBill] = useState(null)

  // Fetch Bills from API
  const fetchBills = async () => {
    try {
      setLoading(true)
      const params = {}
      if (appliedFilters.search.trim()) {
        params.search = appliedFilters.search.trim()
        if (appliedFilters.searchBy !== 'Any') params.searchBy = appliedFilters.searchBy
      }
      if (appliedFilters.billType !== 'All') params.billType = appliedFilters.billType
      if (fromDate) params.fromDate = fromDate
      if (toDate) params.toDate = toDate
      if (outletFilter !== 'All') params.outlet = outletFilter
      if (statusFilter !== 'ALL') params.status = statusFilter

      const res = await adminEnterBillAPI.getAll(params)
      const list = res.data || res || []
      setBills(Array.isArray(list) ? list : [])
    } catch (err) {
      console.error('Failed to fetch bills:', err)
      addNotification?.(err.message || 'Failed to load bills', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (viewMode === 'list') {
      fetchBills()
    }
  }, [appliedFilters, fromDate, toDate, outletFilter, statusFilter, viewMode])

  // Search Button Action
  const handleTriggerSearch = () => {
    setAppliedFilters({
      search: searchText,
      searchBy,
      billType: billTypeFilter,
    })
  }

  // Reset Filters Action
  const handleResetFilters = () => {
    setSearchText('')
    setSearchBy('Any')
    setBillTypeFilter('All')
    setAppliedFilters({ search: '', searchBy: 'Any', billType: 'All' })
    setFromDate('')
    setToDate('')
    setOutletFilter('All')
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
    setVisibleColumns(ALL_BILL_COLUMNS.map((c) => c.key))
  }

  const deselectAllColumns = () => {
    setVisibleColumns(['code', 'actions'])
  }

  const resetDefaultColumns = () => {
    setVisibleColumns(DEFAULT_VISIBLE_COLUMNS)
  }

  // Active advance filter count
  const activeAdvanceFilterCount = useMemo(() => {
    let count = 0
    if (fromDate) count++
    if (toDate) count++
    if (outletFilter !== 'All') count++
    if (statusFilter !== 'ALL') count++
    return count
  }, [fromDate, toDate, outletFilter, statusFilter])

  // KPI Summary Metrics
  const kpi = useMemo(() => {
    const totalCount = bills.length
    const totalAmount = bills.reduce((sum, b) => sum + (Number(b.amount) || 0), 0)
    const totalBalance = bills.reduce((sum, b) => sum + (Number(b.balance) || 0), 0)
    const openCount = bills.filter((b) => b.status === 'OPEN' || b.status === 'PARTIAL').length
    const paidCount = bills.filter((b) => b.status === 'PAID').length
    return {
      totalCount,
      totalAmount,
      totalBalance,
      openCount,
      paidCount,
    }
  }, [bills])

  // Direct Status Update
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await adminEnterBillAPI.updateStatus(id, newStatus)
      addNotification?.(`Bill status updated to ${newStatus}`, 'success')
      fetchBills()
      if (selectedBill && selectedBill.id === id) {
        setSelectedBill((prev) => ({ ...prev, status: newStatus }))
      }
    } catch (err) {
      addNotification?.(err.message || 'Failed to update status', 'error')
    }
  }

  // Delete Bill
  const handleDeleteBill = async (id, code) => {
    if (!window.confirm(`Are you sure you want to delete Bill ${code}?`)) return
    try {
      await adminEnterBillAPI.delete(id)
      addNotification?.(`Bill ${code} deleted successfully`, 'success')
      fetchBills()
    } catch (err) {
      addNotification?.(err.message || 'Failed to delete bill', 'error')
    }
  }

  // Export to Excel
  const handleExportExcel = () => {
    if (bills.length === 0) {
      addNotification?.('No bills to export', 'warning')
      return
    }

    const headers = []
    const keys = []

    ALL_BILL_COLUMNS.forEach((col) => {
      if (col.key !== 'actions' && visibleColumns.includes(col.key)) {
        headers.push(col.label[lang] || col.label.en)
        keys.push(col.key)
      }
    })

    const data = bills.map((b) => {
      const row = {}
      keys.forEach((k) => {
        if (k === 'amount' || k === 'balance') {
          row[k] = Number(b[k] || 0)
        } else {
          row[k] = b[k] || '—'
        }
      })
      return row
    })

    exportStyledExcel({
      filename: `Enter_Bills_${new Date().toISOString().slice(0, 10)}`,
      title: "B'Groceries - Accounts Payable Enter Bill List",
      subtitle: `Exported on ${new Date().toLocaleDateString()} | Total: ${bills.length} Records`,
      headers,
      data,
      columnKeys: keys,
    })

    addNotification?.('Enter bills exported to Excel', 'success')
  }

  // If in create view mode, render EnterBillCreate
  if (viewMode === 'create') {
    return (
      <EnterBillCreate
        onCancel={() => setViewMode('list')}
        onSuccess={() => {
          setViewMode('list')
          fetchBills()
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8 space-y-6 text-slate-100 font-['Montserrat']">
      {/* 1. BREADCRUMBS & TOP HEADER */}
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
              {lang === 'en' ? 'Enter Bill' : 'បញ្ចូលប៊ីល'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/15 border border-red-500/30 text-2xl shadow-lg shadow-red-500/10">
              <img src={fileTextIcon} alt="Enter Bill" className="h-7 w-7 object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black tracking-tight text-white font-['Montserrat']">
                  {lang === 'en' ? 'Enter Bill List' : 'បញ្ជីប៊ីលអ្នកផ្គត់ផ្គង់'}
                </h1>
                <span className="rounded-full bg-red-500/20 px-2.5 py-0.5 text-xs font-bold text-red-300 border border-red-500/30 font-mono">
                  {bills.length} {lang === 'en' ? 'Bills' : 'ប៊ីល'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'en'
                  ? 'Accounts Payable bills matched with purchase order receipts and operational vendor expenses.'
                  : 'បញ្ជីប៊ីលត្រូវសង ផ្ទៀងផ្ទាត់ជាមួយការទទួលទំនិញតាម PO និងចំណាយអ្នកផ្គត់ផ្គង់។'}
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
            <span>{lang === 'en' ? 'Export Excel' : 'ទាញយក Excel'}</span>
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
            <span>{lang === 'en' ? 'Create Bill' : 'បញ្ចូលប៊ីលថ្មី'}</span>
          </button>
        </div>
      </div>

      {/* 2. KPI SUMMARY METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-3.5 shadow-lg backdrop-blur-md">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {lang === 'en' ? 'Total Bills' : 'ប៊ីលសរុប'}
          </span>
          <div className="mt-1 text-2xl font-black text-white font-mono">{kpi.totalCount}</div>
          <span className="text-[10px] text-slate-500">
            {kpi.openCount} {lang === 'en' ? 'active / unpaid' : 'មិនទាន់ទូទាត់'}
          </span>
        </div>

        <div className="rounded-2xl border border-red-500/20 bg-red-950/20 p-3.5 shadow-lg backdrop-blur-md">
          <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider">
            {lang === 'en' ? 'Total Invoiced' : 'ទឹកប្រាក់វិក័យប័ត្រសរុប'}
          </span>
          <div className="mt-1 text-2xl font-black text-red-300 font-mono">
            ${kpi.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-red-500/80">
            {lang === 'en' ? 'Gross payable liabilities' : 'បំណុលសរុប'}
          </span>
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-950/20 p-3.5 shadow-lg backdrop-blur-md">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
            {lang === 'en' ? 'Outstanding Balance' : 'សមតុល្យនៅជំពាក់'}
          </span>
          <div className="mt-1 text-2xl font-black text-amber-300 font-mono">
            ${kpi.totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-amber-500/80">
            {lang === 'en' ? 'Pending disbursement' : 'នៅសល់ត្រូវទូទាត់'}
          </span>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-3.5 shadow-lg backdrop-blur-md">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
            {lang === 'en' ? 'Settled Bills' : 'ប៊ីលបានទូទាត់រួច'}
          </span>
          <div className="mt-1 text-2xl font-black text-emerald-300 font-mono">
            {kpi.paidCount}
          </div>
          <span className="text-[10px] text-emerald-500/80">
            {lang === 'en' ? 'Completed payments' : 'បានបង់ប្រាក់រួច'}
          </span>
        </div>
      </div>

      {/* 3. SEARCH BILL & ADVANCE FILTER & CHOOSE COLUMN CONTROLS */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          {/* Search Textbox + Search By + Bill Type + Search Button */}
          <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Search By DropDown: Any, Code, Amount, Supplier, Contact */}
            <div className="relative min-w-[150px]">
              <select
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-800/90 px-3.5 py-2.5 text-xs font-semibold text-slate-200 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 cursor-pointer"
              >
                {SEARCH_BY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
                    {opt.label[lang] || opt.label.en}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>

            {/* Bill Type Dropdown: All, Enter Bill, Debit Memo */}
            <div className="relative min-w-[140px]">
              <select
                value={billTypeFilter}
                onChange={(e) => setBillTypeFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-800/90 px-3.5 py-2.5 text-xs font-semibold text-slate-200 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 cursor-pointer"
              >
                {BILL_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
                    {opt.label[lang] || opt.label.en}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>

            {/* Search - Textbox */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={
                  searchBy === 'Code'
                    ? lang === 'en' ? 'Enter Bill Code (e.g. BILL-20260904-0001)...' : 'ស្វែងរកតាមកូដប៊ីល...'
                    : searchBy === 'Amount'
                    ? lang === 'en' ? 'Enter Amount (e.g. 1450)...' : 'ស្វែងរកតាមចំនួនទឹកប្រាក់...'
                    : searchBy === 'Supplier'
                    ? lang === 'en' ? 'Enter Supplier name...' : 'ស្វែងរកតាមឈ្មោះអ្នកផ្គត់ផ្គង់...'
                    : searchBy === 'Contact'
                    ? lang === 'en' ? 'Enter Contact person / phone...' : 'ស្វែងរកតាមអ្នកទំនាក់ទំនង...'
                    : lang === 'en' ? 'Search by Bill Code, Invoice Code, Supplier, Contact, Amount...' : 'ស្វែងរកប៊ីល...'
                }
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTriggerSearch()}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/90 pl-9 pr-8 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all"
              />
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              {searchText && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchText('')
                    setAppliedFilters((prev) => ({ ...prev, search: '' }))
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Search Button */}
            <button
              type="button"
              onClick={handleTriggerSearch}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 px-4 py-2.5 text-xs font-bold text-white transition-all shadow-md shadow-red-600/20 active:scale-95 whitespace-nowrap"
            >
              <SearchIcon className="w-4 h-4" />
              <span>{lang === 'en' ? 'Search' : 'ស្វែងរក'}</span>
            </button>
          </div>

          {/* Right Action Controls: Advance Filter, Choose Column, Reset */}
          <div className="flex items-center gap-2 self-end lg:self-auto">
            {/* Advance Filter Button */}
            <button
              type="button"
              onClick={() => setAdvanceFilterOpen((prev) => !prev)}
              className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition-all active:scale-95 ${
                advanceFilterOpen || activeAdvanceFilterCount > 0
                  ? 'border-red-500/60 bg-red-500/15 text-red-300'
                  : 'border-slate-700 bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <FilterIcon className="w-4 h-4" />
              <span>{lang === 'en' ? 'Advance Filter' : 'តម្រងកម្រិតខ្ពស់'}</span>
              {activeAdvanceFilterCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white font-mono">
                  {activeAdvanceFilterCount}
                </span>
              )}
            </button>

            {/* Choose Column Button */}
            <button
              type="button"
              onClick={() => setChooseColumnOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/90 px-3.5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-all active:scale-95"
            >
              <ColumnsIcon className="w-4 h-4" />
              <span>{lang === 'en' ? 'Choose Column' : 'ជ្រើសរើសជួរឈរ'}</span>
            </button>

            {/* Reset All */}
            <button
              type="button"
              onClick={handleResetFilters}
              title="Reset all filters"
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800/90 p-2.5 text-slate-400 hover:text-white hover:bg-slate-700 transition active:scale-95"
            >
              <RefreshIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4. ADVANCE FILTER COLLAPSIBLE PANEL */}
        {advanceFilterOpen && (
          <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 animate-fadeIn">
            {/* From Date */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                {lang === 'en' ? 'From Date' : 'ចាប់ពីថ្ងៃ'}
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-3 py-2 text-xs text-white outline-none focus:border-red-500"
              />
            </div>

            {/* To Date */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                {lang === 'en' ? 'To Date' : 'ដល់ថ្ងៃ'}
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-3 py-2 text-xs text-white outline-none focus:border-red-500"
              />
            </div>

            {/* Outlet Dropdown */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                {lang === 'en' ? 'Outlet' : 'សាខា / ឃ្លាំង'}
              </label>
              <div className="relative">
                <select
                  value={outletFilter}
                  onChange={(e) => setOutletFilter(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-800/90 px-3 py-2 text-xs text-white outline-none focus:border-red-500 cursor-pointer"
                >
                  {OUTLET_OPTIONS.map((o) => (
                    <option key={o} value={o} className="bg-slate-900 text-slate-200">
                      {o}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            {/* Bill Status Dropdown */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                {lang === 'en' ? 'Bill Status' : 'ស្ថានភាពប៊ីល'}
              </label>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-800/90 px-3 py-2 text-xs text-white outline-none focus:border-red-500 cursor-pointer"
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st} className="bg-slate-900 text-slate-200">
                      {st}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. BILL LIST TABLE */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-300 font-mono text-[11px] uppercase tracking-wider">
                {visibleColumns.includes('code') && (
                  <th className="py-3.5 px-4 font-bold">{lang === 'en' ? 'Code' : 'កូដប៊ីល'}</th>
                )}
                {visibleColumns.includes('supplierInvoiceCode') && (
                  <th className="py-3.5 px-4 font-bold">{lang === 'en' ? 'Supplier Invoice Code' : 'លេខវិក័យប័ត្រ'}</th>
                )}
                {visibleColumns.includes('date') && (
                  <th className="py-3.5 px-4 font-bold">{lang === 'en' ? 'Date' : 'កាលបរិច្ឆេទ'}</th>
                )}
                {visibleColumns.includes('dueDate') && (
                  <th className="py-3.5 px-4 font-bold">{lang === 'en' ? 'Due Date' : 'កាលកំណត់បង់'}</th>
                )}
                {visibleColumns.includes('amount') && (
                  <th className="py-3.5 px-4 text-right font-bold">{lang === 'en' ? 'Amount ($)' : 'ទឹកប្រាក់ ($)'}</th>
                )}
                {visibleColumns.includes('balance') && (
                  <th className="py-3.5 px-4 text-right font-bold">{lang === 'en' ? 'Balance ($)' : 'សមតុល្យ ($)'}</th>
                )}
                {visibleColumns.includes('supplier') && (
                  <th className="py-3.5 px-4 font-bold">{lang === 'en' ? 'Supplier' : 'អ្នកផ្គត់ផ្គង់'}</th>
                )}
                {visibleColumns.includes('reference') && (
                  <th className="py-3.5 px-4 font-bold">{lang === 'en' ? 'Reference' : 'ឯកសារយោង'}</th>
                )}
                {visibleColumns.includes('contact') && (
                  <th className="py-3.5 px-4 font-bold">{lang === 'en' ? 'Contact' : 'អ្នកទំនាក់ទំនង'}</th>
                )}
                {visibleColumns.includes('billType') && (
                  <th className="py-3.5 px-4 font-bold">{lang === 'en' ? 'Bill Type' : 'ប្រភេទប៊ីល'}</th>
                )}
                {visibleColumns.includes('username') && (
                  <th className="py-3.5 px-4 font-bold">{lang === 'en' ? 'Username' : 'អ្នកប្រើប្រាស់'}</th>
                )}
                {visibleColumns.includes('outlet') && (
                  <th className="py-3.5 px-4 font-bold">{lang === 'en' ? 'Outlet' : 'សាខា'}</th>
                )}
                {visibleColumns.includes('status') && (
                  <th className="py-3.5 px-4 font-bold">{lang === 'en' ? 'Status' : 'ស្ថានភាព'}</th>
                )}
                {visibleColumns.includes('actions') && (
                  <th className="py-3.5 px-4 text-center font-bold">{lang === 'en' ? 'Actions' : 'សកម្មភាព'}</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={visibleColumns.length} className="py-12 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                      <span>{lang === 'en' ? 'Loading bills...' : 'កំពុងទាញយកទិន្នន័យប៊ីល...'}</span>
                    </div>
                  </td>
                </tr>
              ) : bills.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumns.length} className="py-12 text-center text-slate-500">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-slate-400">
                        {lang === 'en' ? 'No bills found matching your criteria.' : 'មិនមានប៊ីលដែលត្រូវនឹងលក្ខខណ្ឌស្វែងរកទេ។'}
                      </p>
                      <button
                        type="button"
                        onClick={() => setViewMode('create')}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-500 transition"
                      >
                        <PlusIcon className="w-3.5 h-3.5" />
                        <span>{lang === 'en' ? 'Enter First Bill' : 'បញ្ចូលប៊ីលដំបូង'}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                bills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Code */}
                    {visibleColumns.includes('code') && (
                      <td className="py-3 px-4 font-mono font-bold text-white">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedBill(bill)
                            setDetailModalOpen(true)
                          }}
                          className="hover:text-red-400 transition underline underline-offset-2 decoration-red-500/40"
                        >
                          {bill.code}
                        </button>
                      </td>
                    )}

                    {/* Supplier Invoice Code */}
                    {visibleColumns.includes('supplierInvoiceCode') && (
                      <td className="py-3 px-4 font-mono text-slate-300">
                        {bill.supplierInvoiceCode || '—'}
                      </td>
                    )}

                    {/* Date */}
                    {visibleColumns.includes('date') && (
                      <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                        {bill.date}
                      </td>
                    )}

                    {/* Due Date */}
                    {visibleColumns.includes('dueDate') && (
                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap font-mono text-[11px]">
                        {bill.dueDate || '—'}
                      </td>
                    )}

                    {/* Amount ($) */}
                    {visibleColumns.includes('amount') && (
                      <td className="py-3 px-4 text-right font-mono font-bold text-white">
                        ${Number(bill.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    )}

                    {/* Balance ($) */}
                    {visibleColumns.includes('balance') && (
                      <td className="py-3 px-4 text-right font-mono font-black text-amber-300">
                        ${Number(bill.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    )}

                    {/* Supplier */}
                    {visibleColumns.includes('supplier') && (
                      <td className="py-3 px-4 font-semibold text-slate-200">
                        {bill.supplier}
                      </td>
                    )}

                    {/* Reference */}
                    {visibleColumns.includes('reference') && (
                      <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                        {bill.reference || '—'}
                      </td>
                    )}

                    {/* Contact */}
                    {visibleColumns.includes('contact') && (
                      <td className="py-3 px-4 text-slate-300 text-[11px]">
                        {bill.contact || '—'}
                      </td>
                    )}

                    {/* Bill Type */}
                    {visibleColumns.includes('billType') && (
                      <td className="py-3 px-4">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                            bill.billType === 'Debit Memo'
                              ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                              : 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                          }`}
                        >
                          {bill.billType || 'Enter Bill'}
                        </span>
                      </td>
                    )}

                    {/* Username */}
                    {visibleColumns.includes('username') && (
                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        {bill.username || 'Admin'}
                      </td>
                    )}

                    {/* Outlet */}
                    {visibleColumns.includes('outlet') && (
                      <td className="py-3 px-4 text-slate-300 text-[11px] whitespace-nowrap">
                        {bill.outlet || '—'}
                      </td>
                    )}

                    {/* Status */}
                    {visibleColumns.includes('status') && (
                      <td className="py-3 px-4">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider border ${
                            bill.status === 'PAID'
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : bill.status === 'PARTIAL'
                              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                              : bill.status === 'DRAFT'
                              ? 'bg-slate-700/50 text-slate-300 border-slate-600'
                              : bill.status === 'VOIDED'
                              ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                              : 'bg-red-500/15 text-red-300 border-red-500/30' // OPEN
                          }`}
                        >
                          {bill.status}
                        </span>
                      </td>
                    )}

                    {/* Actions */}
                    {visibleColumns.includes('actions') && (
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedBill(bill)
                              setDetailModalOpen(true)
                            }}
                            title="View Bill Details"
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>

                          {bill.status !== 'PAID' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(bill.id, 'PAID')}
                              title="Mark as Paid"
                              className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/20 transition text-[11px] font-bold"
                            >
                              ✓
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeleteBill(bill.id, bill.code)}
                            title="Delete Bill"
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. CHOOSE COLUMN MODAL */}
      {/* "Choose column you want to display on table" */}
      {chooseColumnOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-black text-white font-['Montserrat']">
                  {lang === 'en' ? 'Choose Column' : 'ជ្រើសរើសជួរឈរ'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lang === 'en'
                    ? 'Choose column you want to display on table'
                    : 'ជ្រើសរើសជួរឈរដែលអ្នកចង់បង្ហាញនៅលើតារាង'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setChooseColumnOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-3">
              <span className="text-slate-400">
                {visibleColumns.length} of {ALL_BILL_COLUMNS.length} visible
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={selectAllColumns}
                  className="font-bold text-red-400 hover:text-red-300"
                >
                  Select All
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={deselectAllColumns}
                  className="font-bold text-slate-400 hover:text-white"
                >
                  Deselect All
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={resetDefaultColumns}
                  className="font-bold text-slate-400 hover:text-white"
                >
                  Reset Default
                </button>
              </div>
            </div>

            {/* Column Checkboxes Grid */}
            <div className="grid grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {ALL_BILL_COLUMNS.map((col) => {
                const checked = visibleColumns.includes(col.key)
                return (
                  <label
                    key={col.key}
                    className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-xs transition cursor-pointer ${
                      checked
                        ? 'border-red-500/40 bg-red-500/10 text-white font-semibold'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleColumn(col.key)}
                      className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-red-500 focus:ring-red-500/30 accent-red-500"
                    />
                    <span className="truncate">{col.label[lang] || col.label.en}</span>
                  </label>
                )
              })}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setChooseColumnOpen(false)}
                className="rounded-xl bg-red-600 hover:bg-red-500 px-5 py-2 text-xs font-bold text-white transition shadow-md shadow-red-600/25"
              >
                {lang === 'en' ? 'Done' : 'រួចរាល់'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. BILL DETAIL MODAL */}
      {detailModalOpen && selectedBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">📄</span>
                  <h3 className="text-lg font-black text-white font-mono">
                    {selectedBill.code}
                  </h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                      selectedBill.billType === 'Debit Memo'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                        : 'bg-red-500/20 text-red-300 border-red-500/30'
                    }`}
                  >
                    {selectedBill.billType || 'Enter Bill'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Supplier: <span className="text-white font-semibold">{selectedBill.supplier}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDetailModalOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* General Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
              <div>
                <span className="text-slate-500">Supplier Invoice Code:</span>
                <p className="font-mono text-white font-bold">{selectedBill.supplierInvoiceCode || '—'}</p>
              </div>
              <div>
                <span className="text-slate-500">Bill Date:</span>
                <p className="text-white font-medium">{selectedBill.date || '—'}</p>
              </div>
              <div>
                <span className="text-slate-500">Due Date:</span>
                <p className="text-amber-400 font-medium font-mono">{selectedBill.dueDate || '—'}</p>
              </div>
              <div>
                <span className="text-slate-500">Payment Term:</span>
                <p className="text-white font-medium">{selectedBill.paymentTerm || 'Net 30'}</p>
              </div>
              <div>
                <span className="text-slate-500">Contact:</span>
                <p className="text-white font-medium">{selectedBill.contact || '—'}</p>
              </div>
              <div>
                <span className="text-slate-500">Outlet:</span>
                <p className="text-white font-medium">{selectedBill.outlet || '—'}</p>
              </div>
              {selectedBill.note && (
                <div className="col-span-2 sm:col-span-3 pt-2 border-t border-slate-800">
                  <span className="text-slate-500">Note:</span>
                  <p className="text-slate-300 italic">{selectedBill.note}</p>
                </div>
              )}
            </div>

            {/* Linked Receipts if any */}
            {selectedBill.receipts && selectedBill.receipts.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Matched Goods Receipts ({selectedBill.receipts.length})
                </h4>
                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 space-y-2 text-xs">
                  {selectedBill.receipts.map((r, i) => (
                    <div key={i} className="flex justify-between items-center text-slate-300">
                      <div>
                        <span className="font-mono font-bold text-white">{r.poCode}</span>
                        <span className="text-slate-500 ml-2">({r.receiveCode})</span>
                      </div>
                      <div className="font-mono text-emerald-400">
                        ${Number(r.receiveAmount || 0).toFixed(2)} (+${Number(r.taxAmount || 0).toFixed(2)} tax)
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other Expenses if any */}
            {selectedBill.otherExpenses && selectedBill.otherExpenses.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Other Operational Expenses ({selectedBill.otherExpenses.length})
                </h4>
                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 space-y-2 text-xs">
                  {selectedBill.otherExpenses.map((exp, i) => (
                    <div key={i} className="flex justify-between items-center text-slate-300">
                      <div>
                        <span className="font-mono text-slate-400 mr-2">#{exp.lineNo || i + 1}</span>
                        <span className="text-white">{exp.description || 'Expense item'}</span>
                        <span className="text-slate-500 ml-2 text-[10px]">({exp.expenseDate})</span>
                      </div>
                      <div className="font-mono text-amber-400">
                        ${Number(exp.expenseAmount || 0).toFixed(2)} (+${Number(exp.taxAmount || 0).toFixed(2)} tax)
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Financial Summary */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 flex justify-between items-center text-xs">
              <div>
                <span className="text-slate-400">Status: </span>
                <span className="font-bold text-white uppercase">{selectedBill.status}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block">Net Balance Payable</span>
                <span className="text-xl font-mono font-black text-emerald-400">
                  ${Number(selectedBill.balance || 0).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setDetailModalOpen(false)}
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
