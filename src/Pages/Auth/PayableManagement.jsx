import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useNotifications } from '../../context/NotificationContext'
import { adminCashOperationAPI } from '../../api/api'
import { exportStyledExcel } from '../../utils/excelExport'

// 3D Icons
import creditCardIcon from '../../assets/icon/3dicons-credit-card-dynamic-color.png'
import fileTextIcon from '../../assets/icon/3dicons-file-text-dynamic-color.png'
import walletIcon from '../../assets/icon/3dicons-wallet-dynamic-color.png'
import travelIcon from '../../assets/icon/3dicons-travel-dynamic-color.png'
import crownIcon from '../../assets/icon/3dicons-crown-dynamic-color.png'
import dollarIcon from '../../assets/icon/3dicons-dollar-dynamic-color.png'
import moneyBagIcon from '../../assets/icon/3dicons-money-bag-dynamic-color.png'

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

function SearchOffIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.5 10.5a5 5 0 017.071 7.071m-2.121-2.121A5 5 0 005.5 10.5a5 5 0 017.071-7.071" />
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

function DownloadIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  )
}

function EyeIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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

function ChevronDownIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
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

function ChevronIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Exactly the 5 Core Payable Management Hub Modules
export const PAYABLE_MODULES = [
  {
    key: 'enter-bill',
    icon: fileTextIcon,
    en: 'Enter Bill',
    kh: 'បញ្ចូលប៊ីលអ្នកផ្គត់ផ្គង់',
    descEn: 'Match supplier invoices against received PO shipments and record accounts payable liabilities.',
    descKh: 'ផ្ទៀងផ្ទាត់វិក័យប័ត្រអ្នកផ្គត់ផ្គង់ជាមួយ PO និងបញ្ចូលប៊ីលត្រូវបង់។',
    color: '#3B82F6',
    bg: 'rgba(59, 130, 246, 0.12)',
    tag: 'Billing',
    badge: 'Invoices',
    route: '/admin/payable-management/enter-bill',
  },
  {
    key: 'bill-payment',
    icon: walletIcon,
    en: 'Bill Payment',
    kh: 'ការបង់ប្រាក់ប៊ីល',
    descEn: 'Disburse supplier payments, manage bank transfers, and settle open vendor bills.',
    descKh: 'គ្រប់គ្រងការទូទាត់ប្រាក់ជូនអ្នកផ្គត់ផ្គង់ ផ្ទេរប្រាក់ និងកាត់កងប៊ីលដែលនៅជំពាក់។',
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.12)',
    tag: 'Disbursement',
    badge: 'Settlement',
    route: '/admin/payable-management/bill-payment',
  },
  {
    key: 'enter-freight',
    icon: travelIcon,
    en: 'Enter Freight',
    kh: 'វិក័យប័ត្រដឹកជញ្ជូន',
    descEn: 'Record inbound shipping bills, port demurrage, customs duties, and allocate freight expenses.',
    descKh: 'បញ្ចូលវិក័យប័ត្រដឹកជញ្ជូន ថ្លៃលើកដាក់កំពង់ផែ និងបែងចែកថ្លៃដើមដឹកជញ្ជូន។',
    color: '#FF9900',
    bg: 'rgba(255, 153, 0, 0.12)',
    tag: 'Logistics',
    badge: 'Freight & Port',
    route: '/admin/payable-management/enter-freight',
  },
  {
    key: 'supplier-deposit',
    icon: crownIcon,
    en: 'Supplier Deposit',
    kh: 'ប្រាក់កក់អ្នកផ្គត់ផ្គង់',
    descEn: 'Record advance procurement deposits held with key suppliers, farmers, and distributors.',
    descKh: 'កត់ត្រាប្រាក់កក់មុនដែលបានបង់ជូនកសិករ រោងចក្រ និងអ្នកផ្គត់ផ្គង់។',
    color: '#8B5CF6',
    bg: 'rgba(139, 92, 246, 0.12)',
    tag: 'Advance',
    badge: 'Vendor Deposit',
    route: '/admin/payable-management/supplier-deposit',
  },
  {
    key: 'supplier-refund',
    icon: dollarIcon,
    en: 'Supplier Refund',
    kh: 'ប្រាក់សងត្រឡប់ពីអ្នកផ្គត់ផ្គង់',
    descEn: 'Process supplier cash refunds, credit adjustments, and debit notes for returned stock.',
    descKh: 'ទទួលប្រាក់សងត្រឡប់ពីអ្នកផ្គត់ផ្គង់សម្រាប់ទំនិញខូច ឬប្រគល់ត្រឡប់វិញ។',
    color: '#EC4899',
    bg: 'rgba(236, 72, 153, 0.12)',
    tag: 'Refund',
    badge: 'Credit Memo',
    route: '/admin/payable-management/supplier-refund',
  },
]

// Search By Dropdown: Any - Code - Customer - Supplier
const SEARCH_BY_OPTIONS = [
  { value: 'Any', label: { en: 'Any', kh: 'ទាំងអស់' } },
  { value: 'Code', label: { en: 'Code', kh: 'លេខកូដ' } },
  { value: 'Customer', label: { en: 'Customer', kh: 'អតិថិជន' } },
  { value: 'Supplier', label: { en: 'Supplier', kh: 'អ្នកផ្គត់ផ្គង់' } },
]

// Type Dropdown: Any - Cash in - Cash Out
const TYPE_OPTIONS = [
  { value: 'Any', label: { en: 'Any', kh: 'ទាំងអស់' } },
  { value: 'Cash in', label: { en: 'Cash in', kh: 'លុយចូល' } },
  { value: 'Cash Out', label: { en: 'Cash Out', kh: 'លុយចេញ' } },
]

// Outlets for Advance Filter
const OUTLET_OPTIONS = [
  'all',
  'Main Store Warehouse',
  'Central Cold Storage',
  'Express Mart BKK1',
  'Main Supermarket',
  'Toul Kork Branch',
  'Chbar Ampov Depot',
  'Siem Reap Hub',
]

// Status Dropdown: Any - Non-voided - Voided
const STATUS_OPTIONS = [
  { value: 'Any', label: { en: 'Any Status', kh: 'ស្ថានភាពទាំងអស់' } },
  { value: 'Non-voided', label: { en: 'Non-voided', kh: 'មិនទាន់មោឃៈ' } },
  { value: 'Voided', label: { en: 'Voided', kh: 'បានទុកជាមោឃៈ' } },
]

// Column definitions for Table & Choose Column modal
const ALL_COLUMNS = [
  { key: 'code', label: { en: 'Code', kh: 'លេខកូដ' }, always: true },
  { key: 'date', label: { en: 'Date', kh: 'កាលបរិច្ឆេទ' }, always: true },
  { key: 'type', label: { en: 'Type', kh: 'ប្រភេទ' }, always: true },
  { key: 'partyName', label: { en: 'Customer / Supplier', kh: 'អតិថិជន / អ្នកផ្គត់ផ្គង់' } },
  { key: 'amount', label: { en: 'Amount', kh: 'ចំនួនទឹកប្រាក់ ($)' }, always: true },
  { key: 'outlet', label: { en: 'Outlet', kh: 'សាខា / ឃ្លាំង' } },
  { key: 'status', label: { en: 'Status', kh: 'ស្ថានភាព' } },
  { key: 'category', label: { en: 'Category', kh: 'ប្រភេទចំណាយ' } },
  { key: 'username', label: { en: 'Username', kh: 'អ្នកប្រើប្រាស់' } },
  { key: 'actions', label: { en: 'Actions', kh: 'សកម្មភាព' }, always: true },
]

const DEFAULT_VISIBLE_COLUMNS = [
  'code',
  'date',
  'type',
  'partyName',
  'amount',
  'outlet',
  'status',
  'category',
  'username',
  'actions',
]

function ModuleCard({ item, lang }) {
  return (
    <Link
      to={item.route}
      className="hub-card group relative overflow-hidden flex flex-col justify-between rounded-3xl border border-slate-800 bg-[#141922]/90 p-5 sm:p-6 text-left transition-all duration-300 hover:border-slate-700 hover:bg-[#1a2230] hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-1"
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-30"
        style={{ background: item.color }}
      />

      <div className="relative space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div
            className="hub-icon flex h-14 w-14 items-center justify-center rounded-2xl ring-1 transition-all duration-300 group-hover:scale-110 shadow-lg"
            style={{
              background: item.bg,
              borderColor: item.color + '40',
            }}
          >
            <img src={item.icon} alt="" className="h-8 w-8 object-contain drop-shadow" />
          </div>
          <div className="flex flex-col items-end gap-1">
            {item.tag && (
              <span
                className="rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider font-mono shadow-sm"
                style={{
                  background: item.bg,
                  color: item.color,
                  border: `1px solid ${item.color}40`,
                }}
              >
                {item.tag}
              </span>
            )}
            {item.badge && (
              <span className="text-[10px] font-bold text-slate-500 font-mono">
                {item.badge}
              </span>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-black text-white tracking-tight group-hover:text-red-300 transition-colors font-['Montserrat']">
            {lang === 'kh' ? item.kh : item.en}
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-400 line-clamp-2">
            {lang === 'kh' ? item.descKh : item.descEn}
          </p>
        </div>
      </div>

      <div
        className="relative mt-6 flex items-center justify-between pt-3.5 border-t border-slate-800/80 text-xs font-bold transition-all"
        style={{ color: item.color }}
      >
        <span>{lang === 'kh' ? 'បើកដំណើរការ' : 'Open Module'}</span>
        <span className="transform transition-transform duration-200 group-hover:translate-x-1.5">
          <ChevronIcon />
        </span>
      </div>
    </Link>
  )
}

export default function PayableManagement() {
  const { lang } = useLanguage()
  const { addNotification } = useNotifications()

  // 1. Search Operation Cash States
  // Search - textbox
  // Search By - Dropdown - Any - Code - Customer - Supplier
  // Type - DropDown - Any - Cash in - Cash Out
  // Search - button
  // filter_list (Advance Filter toggle)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchBy, setSearchBy] = useState('Any')
  const [selectedType, setSelectedType] = useState('Any')

  // Advance Filter: From Date to Date - Outlet Dropdown - Status Dropdown Any Non-voided Voided
  const [showAdvanceFilter, setShowAdvanceFilter] = useState(false)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [selectedOutlet, setSelectedOutlet] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('Any')

  // 2. Cash In / Out List Data & Loading States
  const [operations, setOperations] = useState([])
  const [loading, setLoading] = useState(true)

  // 3. Modals & Column Visibility
  const [showColumnModal, setShowColumnModal] = useState(false)
  const [selectedOp, setSelectedOp] = useState(null) // for detail modal
  const [visibleColumns, setVisibleColumns] = useState(() => {
    try {
      const saved = localStorage.getItem('bg_payable_cash_columns')
      return saved ? JSON.parse(saved) : DEFAULT_VISIBLE_COLUMNS
    } catch {
      return DEFAULT_VISIBLE_COLUMNS
    }
  })

  // Format currency with prominent $
  const formatCurrency = (val) => {
    const num = Number(val || 0)
    return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  // Format date time
  const formatDateTime = (dtStr) => {
    if (!dtStr) return '—'
    const d = new Date(dtStr)
    return isNaN(d)
      ? dtStr
      : d.toLocaleDateString(lang === 'kh' ? 'km-KH' : 'en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
  }

  // Fetch Live Cash Operations from Backend
  const fetchOperations = useCallback(async () => {
    try {
      setLoading(true)
      const params = {}
      if (searchQuery.trim()) {
        params.search = searchQuery.trim()
        if (searchBy !== 'Any') params.searchBy = searchBy
      }
      if (selectedType !== 'Any') {
        params.type = selectedType === 'Cash in' ? 'CASH_IN' : 'CASH_OUT'
      }
      if (selectedOutlet !== 'all') params.outlet = selectedOutlet
      if (selectedStatus !== 'Any') {
        params.status = selectedStatus.replace('-', '_').toUpperCase()
      }
      if (fromDate) params.fromDate = `${fromDate}T00:00:00`
      if (toDate) params.toDate = `${toDate}T23:59:59`

      const res = await adminCashOperationAPI.getAll(params)
      if (Array.isArray(res)) {
        setOperations(res)
      } else if (res && Array.isArray(res.data)) {
        setOperations(res.data)
      } else {
        setOperations([])
      }
    } catch (err) {
      console.error('Failed to fetch cash operations:', err)
      addNotification?.(err.message || 'Failed to load cash operations', 'error')
      setOperations([])
    } finally {
      setLoading(false)
    }
  }, [searchQuery, searchBy, selectedType, selectedOutlet, selectedStatus, fromDate, toDate, addNotification])

  useEffect(() => {
    fetchOperations()
  }, [fetchOperations])

  // search_off / Reset All Filters
  const handleResetFilters = () => {
    setSearchQuery('')
    setSearchBy('Any')
    setSelectedType('Any')
    setFromDate('')
    setToDate('')
    setSelectedOutlet('all')
    setSelectedStatus('Any')
    addNotification?.(
      lang === 'en' ? 'Filters reset to default' : 'សម្អាតការស្វែងរកទាំងអស់',
      'info'
    )
  }

  // Column toggle helper
  const toggleColumn = (key) => {
    setVisibleColumns((prev) => {
      let updated
      if (prev.includes(key)) {
        updated = prev.filter((k) => k !== key)
      } else {
        updated = [...prev, key]
      }
      localStorage.setItem('bg_payable_cash_columns', JSON.stringify(updated))
      return updated
    })
  }

  const resetColumns = () => {
    setVisibleColumns(DEFAULT_VISIBLE_COLUMNS)
    localStorage.setItem('bg_payable_cash_columns', JSON.stringify(DEFAULT_VISIBLE_COLUMNS))
  }

  // Export to Styled Excel
  const handleExportExcel = () => {
    if (operations.length === 0) {
      addNotification?.(
        lang === 'en' ? 'No cash operations to export' : 'គ្មានទិន្នន័យដើម្បីនាំចេញទេ',
        'warning'
      )
      return
    }

    const headers = [
      lang === 'kh' ? 'លេខកូដ' : 'Code',
      lang === 'kh' ? 'កាលបរិច្ឆេទ' : 'Date',
      lang === 'kh' ? 'ប្រភេទ' : 'Type',
      lang === 'kh' ? 'អតិថិជន / អ្នកផ្គត់ផ្គង់' : 'Customer / Supplier',
      lang === 'kh' ? 'ចំនួនទឹកប្រាក់ ($)' : 'Amount ($)',
      lang === 'kh' ? 'សាខា / ឃ្លាំង' : 'Outlet',
      lang === 'kh' ? 'ស្ថានភាព' : 'Status',
      lang === 'kh' ? 'ប្រភេទចំណាយ' : 'Category',
      lang === 'kh' ? 'លេខយោង' : 'Reference',
      lang === 'kh' ? 'អ្នកប្រើប្រាស់' : 'Username',
      lang === 'kh' ? 'ការពិពណ៌នា' : 'Description',
    ]

    const dataRows = operations.map((item) => [
      item.code || '',
      formatDateTime(item.transactionDate),
      item.type === 'CASH_IN' ? 'Cash In' : 'Cash Out',
      item.partyName || '—',
      Number(item.amount || 0),
      item.outlet || '—',
      item.status === 'NON_VOIDED' ? 'Non-voided' : 'Voided',
      item.category || '—',
      item.referenceNo || '—',
      item.username || '—',
      item.description || '—',
    ])

    exportStyledExcel({
      sheetName: 'Cash In Out List',
      title: "B'Groceries - Payable Management Hub (Operation Cash)",
      subtitle: `Exported on: ${new Date().toLocaleString()} | Total Records: ${operations.length}`,
      headers,
      dataRows,
      fileName: `Payable_Operation_Cash_${new Date().toISOString().slice(0, 10)}.xlsx`,
    })

    addNotification?.(
      lang === 'en' ? 'Cash operations exported to Excel' : 'ទិន្នន័យត្រូវបាននាំចេញជាឯកសារ Excel រួចរាល់',
      'success'
    )
  }

  // Summary Metrics of the live cash list
  const metrics = useMemo(() => {
    let totalIn = 0
    let totalOut = 0
    operations.forEach((op) => {
      if (op.status !== 'VOIDED') {
        const amt = Number(op.amount || 0)
        if (op.type === 'CASH_IN') totalIn += amt
        else totalOut += amt
      }
    })
    return {
      totalIn,
      totalOut,
      netCash: totalIn - totalOut,
      count: operations.length,
    }
  }, [operations])

  return (
    <div className="space-y-6 text-slate-100 font-['Montserrat']">
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#0b0f17] p-5 sm:p-7 shadow-2xl shadow-red-500/10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-red-500/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 h-px w-2/3 bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-950/60 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-red-300 transition hover:border-red-400 hover:text-white active:scale-95"
            >
              <ChevronLeftIcon /> {lang === 'en' ? 'Dashboard' : 'ផ្ទាំងគ្រប់គ្រង'}
            </Link>

            <div className="flex items-center gap-3.5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-500/15 p-2 ring-1 ring-red-500/30 shadow-lg shadow-red-500/20">
                <img src={creditCardIcon} alt="" className="h-9 w-9 object-contain drop-shadow-md" />
              </span>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-red-400">
                  {lang === 'en' ? "B'Groceries Accounts Payable" : 'ការគ្រប់គ្រងបំណុល និងប៊ីលត្រូវសង'}
                </p>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {lang === 'en' ? 'Payable Management Hub' : 'មជ្ឈមណ្ឌលគ្រប់គ្រងថ្លៃត្រូវបង់'}
                </h1>
              </div>
            </div>

            <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-300">
              {lang === 'en'
                ? 'Accounts payable management — enter vendor bills, process payments, allocate freight invoices, record supplier deposits, and manage supplier refunds.'
                : 'គ្រប់គ្រងបំណុលត្រូវសង — បញ្ចូលប៊ីលអ្នកផ្គត់ផ្គង់ បង់ប្រាក់ប៊ីល វិក័យប័ត្រដឹកជញ្ជូន ប្រាក់កក់អ្នកផ្គត់ផ្គង់ និងការសងប្រាក់ត្រឡប់មកវិញ។'}
            </p>
          </div>

          {/* Quick Metrics Widget */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:flex lg:flex-col shrink-0 min-w-[240px]">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 shadow-md">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{lang === 'en' ? 'Payable Modules' : 'ម៉ូឌុលត្រូវសង'}</span>
                <span className="text-red-400 font-bold">● 5 Active</span>
              </div>
              <p className="mt-1 font-mono text-2xl font-black text-white">
                5
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 shadow-md">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{lang === 'en' ? 'Live Cash Net' : 'សមតុល្យលុយសុទ្ធ'}</span>
                <span className={metrics.netCash >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  {metrics.netCash >= 0 ? '▲ Positive' : '▼ Negative'}
                </span>
              </div>
              <p className="mt-1 font-mono text-base font-black text-white">
                {formatCurrency(metrics.netCash)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE 5 CORE PAYABLE MODULES (IT ONLY HAS 5 OF THIS) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">
            {lang === 'en' ? 'Payable Hub Modules (5)' : 'ម៉ូឌុលគ្រប់គ្រងបំណុលទាំង ៥'}
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            {lang === 'en' ? 'Enter Bill • Bill Payment • Enter Freight • Supplier Deposit • Supplier Refund' : 'ម៉ូឌុលស្នូលទាំង ៥'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4.5">
          {PAYABLE_MODULES.map((item) => (
            <ModuleCard key={item.key} item={item} lang={lang} />
          ))}
        </div>
      </div>

      {/* 3. SEARCH OPERATION CASH CARD */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl shadow-black/20 space-y-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            {lang === 'en' ? 'Search Operation Cash' : 'ស្វែងរកប្រតិបត្តិការសាច់ប្រាក់'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'en'
              ? 'Search operation cash by any condition. Ex(Any, Code, Customer...)'
              : 'ស្វែងរកប្រតិបត្តិការសាច់ប្រាក់តាមលក្ខខណ្ឌណាមួយ (ទាំងអស់, លេខកូដ, អតិថិជន...)'}
          </p>
        </div>

        {/* Primary Search Controls */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 items-end">
          {/* Search - Textbox */}
          <div className="lg:col-span-5 space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              {lang === 'en' ? 'Search' : 'ស្វែងរក'}
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                <SearchIcon />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchOperations()}
                placeholder={lang === 'en' ? 'Search by code, customer, supplier...' : 'ស្វែងរកតាមលេខកូដ, អតិថិជន...'}
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2.5 pl-10 pr-8 text-xs font-semibold text-white placeholder-slate-500 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  <XMarkIcon />
                </button>
              )}
            </div>
          </div>

          {/* Search By - Dropdown - Any - Code - Customer - Supplier */}
          <div className="lg:col-span-3 space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              {lang === 'en' ? 'Search By' : 'ស្វែងរកតាម'}
            </label>
            <div className="relative">
              <select
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-700/80 bg-slate-950/90 py-2.5 pl-3.5 pr-8 text-xs font-semibold text-white outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-400/20 cursor-pointer"
              >
                {SEARCH_BY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                    {lang === 'kh' ? opt.label.kh : opt.label.en}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <ChevronDownIcon />
              </span>
            </div>
          </div>

          {/* Type - DropDown - Any - Cash in - Cash Out */}
          <div className="lg:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              {lang === 'en' ? 'Type' : 'ប្រភេទ'}
            </label>
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-700/80 bg-slate-950/90 py-2.5 pl-3.5 pr-8 text-xs font-semibold text-white outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-400/20 cursor-pointer"
              >
                {TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                    {lang === 'kh' ? opt.label.kh : opt.label.en}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <ChevronDownIcon />
              </span>
            </div>
          </div>

          {/* Search Button & filter_list Advance Filter Toggle */}
          <div className="lg:col-span-2 flex items-center gap-2">
            <button
              type="button"
              onClick={fetchOperations}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-500 py-2.5 px-4 text-xs font-black text-white shadow-md shadow-red-600/25 transition active:scale-95"
            >
              <SearchIcon />
              <span>{lang === 'en' ? 'Search' : 'ស្វែងរក'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAdvanceFilter(!showAdvanceFilter)}
              title={lang === 'en' ? 'Advance Filter' : 'តម្រងកម្រិតខ្ពស់'}
              className={`inline-flex items-center justify-center gap-1.5 rounded-xl border py-2.5 px-3 text-xs font-bold transition active:scale-95 ${
                showAdvanceFilter
                  ? 'border-red-400 bg-red-500/20 text-red-300'
                  : 'border-slate-700/80 bg-slate-950/90 text-slate-300 hover:border-slate-500 hover:text-white'
              }`}
            >
              <FilterListIcon />
              <span className="hidden sm:inline">{lang === 'en' ? 'Advance Filter' : 'តម្រង'}</span>
            </button>
          </div>
        </div>

        {/* Advance Filter Collapsible Panel: From Date to Date - Outlet Dropdown - Status Dropdown */}
        {showAdvanceFilter && (
          <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-4 items-end bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
            {/* From Date to Date: From Date */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                {lang === 'en' ? 'From Date' : 'ចាប់ពីថ្ងៃ'}
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950 py-2 px-3 text-xs font-semibold text-white outline-none focus:border-red-400"
              />
            </div>

            {/* From Date to Date: To Date */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                {lang === 'en' ? 'To Date' : 'ដល់ថ្ងៃ'}
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950 py-2 px-3 text-xs font-semibold text-white outline-none focus:border-red-400"
              />
            </div>

            {/* Outlet Dropdown */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                {lang === 'en' ? 'Outlet' : 'សាខា'}
              </label>
              <div className="relative">
                <select
                  value={selectedOutlet}
                  onChange={(e) => setSelectedOutlet(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-700/80 bg-slate-950 py-2 pl-3 pr-8 text-xs font-semibold text-white outline-none focus:border-red-400 cursor-pointer"
                >
                  {OUTLET_OPTIONS.map((outlet) => (
                    <option key={outlet} value={outlet} className="bg-slate-900 text-white">
                      {outlet === 'all' ? (lang === 'en' ? 'All Outlets' : 'គ្រប់សាខាទាំងអស់') : outlet}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>

            {/* Status Dropdown: Any - Non-voided - Voided */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                {lang === 'en' ? 'Status' : 'ស្ថានភាព'}
              </label>
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-700/80 bg-slate-950 py-2 pl-3 pr-8 text-xs font-semibold text-white outline-none focus:border-red-400 cursor-pointer"
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st.value} value={st.value} className="bg-slate-900 text-white">
                      {lang === 'kh' ? st.label.kh : st.label.en}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 4. CASH IN / OUT LIST SECTION (NO CREATE BUTTON ALSO) */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl shadow-black/20 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                {lang === 'en' ? 'Cash in / out list' : 'បញ្ជីលុយសាច់ ចូល / ចេញ'}
              </h2>
              <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-mono font-bold text-slate-300">
                {operations.length} {lang === 'en' ? 'records' : 'កំណត់ត្រា'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'en'
                ? 'Show information of cash in / out. Ex(Code, Date, Type...)'
                : 'បង្ហាញព័ត៌មាននៃបញ្ជីលុយសាច់ចូល / ចេញ (លេខកូដ, កាលបរិច្ឆេទ, ប្រភេទ...)'}
            </p>
          </div>

          {/* Action Buttons: Export, search_off (Reset), Choose Column. (NO CREATE BUTTON) */}
          <div className="flex items-center gap-2">
            {/* search_off / Reset All Filters Button */}
            <button
              type="button"
              onClick={handleResetFilters}
              title={lang === 'en' ? 'Reset Filters (search_off)' : 'សម្អាតការស្វែងរក (search_off)'}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-950/90 py-2 px-3 text-xs font-bold text-slate-300 transition hover:border-slate-500 hover:text-white active:scale-95 shadow-sm"
            >
              <SearchOffIcon />
              <span className="hidden md:inline">{lang === 'en' ? 'Reset' : 'សម្អាត'}</span>
            </button>

            {/* Choose Column Button */}
            <button
              type="button"
              onClick={() => setShowColumnModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-950/90 py-2 px-3 text-xs font-bold text-slate-300 transition hover:border-slate-500 hover:text-white active:scale-95 shadow-sm"
            >
              <ColumnsIcon />
              <span>{lang === 'en' ? 'Choose Column' : 'ជួរឈរ'}</span>
            </button>

            {/* Export Button */}
            <button
              type="button"
              onClick={handleExportExcel}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2 px-3.5 text-xs font-black text-white shadow-md shadow-emerald-600/20 transition active:scale-95"
            >
              <DownloadIcon />
              <span>{lang === 'en' ? 'Export' : 'នាំចេញ'}</span>
            </button>
          </div>
        </div>

        {/* Live Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-slate-950/90 text-[11px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                {visibleColumns.includes('code') && (
                  <th className="py-3 px-4">{lang === 'kh' ? 'លេខកូដ' : 'Code'}</th>
                )}
                {visibleColumns.includes('date') && (
                  <th className="py-3 px-4">{lang === 'kh' ? 'កាលបរិច្ឆេទ' : 'Date'}</th>
                )}
                {visibleColumns.includes('type') && (
                  <th className="py-3 px-4">{lang === 'kh' ? 'ប្រភេទ' : 'Type'}</th>
                )}
                {visibleColumns.includes('partyName') && (
                  <th className="py-3 px-4">{lang === 'kh' ? 'អតិថិជន / អ្នកផ្គត់ផ្គង់' : 'Customer / Supplier'}</th>
                )}
                {visibleColumns.includes('amount') && (
                  <th className="py-3 px-4 text-right">{lang === 'kh' ? 'ចំនួនទឹកប្រាក់ ($)' : 'Amount ($)'}</th>
                )}
                {visibleColumns.includes('outlet') && (
                  <th className="py-3 px-4">{lang === 'kh' ? 'សាខា' : 'Outlet'}</th>
                )}
                {visibleColumns.includes('status') && (
                  <th className="py-3 px-4">{lang === 'kh' ? 'ស្ថានភាព' : 'Status'}</th>
                )}
                {visibleColumns.includes('category') && (
                  <th className="py-3 px-4">{lang === 'kh' ? 'ប្រភេទចំណាយ' : 'Category'}</th>
                )}
                {visibleColumns.includes('username') && (
                  <th className="py-3 px-4">{lang === 'kh' ? 'អ្នកប្រើ' : 'Username'}</th>
                )}
                {visibleColumns.includes('actions') && (
                  <th className="py-3 px-4 text-center">{lang === 'kh' ? 'សកម្មភាព' : 'Actions'}</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40 font-mono">
              {loading ? (
                <tr>
                  <td colSpan={visibleColumns.length} className="py-12 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                      <span className="font-['Montserrat']">{lang === 'en' ? 'Loading cash operations...' : 'កំពុងផ្ទុកទិន្នន័យ...'}</span>
                    </div>
                  </td>
                </tr>
              ) : operations.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumns.length} className="py-12 text-center text-slate-400">
                    <div className="space-y-3 font-['Montserrat']">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800/80 text-slate-400">
                        <SearchOffIcon className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-bold text-white">
                        {lang === 'en' ? 'No cash in / out records found' : 'រកមិនឃើញទិន្នន័យប្រតិបត្តិការសាច់ប្រាក់ទេ'}
                      </p>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        {lang === 'en'
                          ? 'Try clearing the search text, adjusting the filters, or clicking the reset button.'
                          : 'សូមសាកល្បងសម្អាតការស្វែងរក ឬផ្លាស់ប្តូរលក្ខខណ្ឌតម្រង។'}
                      </p>
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-slate-700"
                      >
                        {lang === 'en' ? 'Reset All Filters' : 'កំណត់ឡើងវិញ'}
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                operations.map((item) => {
                  const isCashIn = item.type === 'CASH_IN'
                  const isVoided = item.status === 'VOIDED'

                  return (
                    <tr
                      key={item.id || item.code}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Code */}
                      {visibleColumns.includes('code') && (
                        <td className="py-3 px-4 font-bold text-slate-100 whitespace-nowrap">
                          {item.code}
                        </td>
                      )}

                      {/* Date */}
                      {visibleColumns.includes('date') && (
                        <td className="py-3 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                          {formatDateTime(item.transactionDate)}
                        </td>
                      )}

                      {/* Type */}
                      {visibleColumns.includes('type') && (
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase font-mono tracking-wider ${
                              isCashIn
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            <span>{isCashIn ? '▲' : '▼'}</span>
                            <span>{isCashIn ? (lang === 'kh' ? 'លុយចូល' : 'Cash In') : (lang === 'kh' ? 'លុយចេញ' : 'Cash Out')}</span>
                          </span>
                        </td>
                      )}

                      {/* Customer / Supplier */}
                      {visibleColumns.includes('partyName') && (
                        <td className="py-3 px-4 font-['Montserrat']">
                          <div className="font-semibold text-slate-200">
                            {item.partyName || '—'}
                          </div>
                          {item.partyType && (
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                              {item.partyType}
                            </div>
                          )}
                        </td>
                      )}

                      {/* Amount with prominent $ */}
                      {visibleColumns.includes('amount') && (
                        <td className={`py-3 px-4 text-right font-bold whitespace-nowrap ${
                          isVoided ? 'line-through text-slate-500' : isCashIn ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                          {formatCurrency(item.amount)}
                        </td>
                      )}

                      {/* Outlet */}
                      {visibleColumns.includes('outlet') && (
                        <td className="py-3 px-4 text-slate-300 font-['Montserrat'] whitespace-nowrap text-xs">
                          {item.outlet || '—'}
                        </td>
                      )}

                      {/* Status */}
                      {visibleColumns.includes('status') && (
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold font-mono ${
                              isVoided
                                ? 'bg-slate-800 text-slate-400 border border-slate-700'
                                : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                            }`}
                          >
                            {isVoided ? (lang === 'kh' ? 'មោឃៈ' : 'Voided') : (lang === 'kh' ? 'ធម្មតា' : 'Non-voided')}
                          </span>
                        </td>
                      )}

                      {/* Category */}
                      {visibleColumns.includes('category') && (
                        <td className="py-3 px-4 text-slate-400 font-['Montserrat'] whitespace-nowrap text-xs">
                          {item.category || '—'}
                        </td>
                      )}

                      {/* Username */}
                      {visibleColumns.includes('username') && (
                        <td className="py-3 px-4 text-slate-400 whitespace-nowrap text-xs">
                          {item.username || '—'}
                        </td>
                      )}

                      {/* Actions */}
                      {visibleColumns.includes('actions') && (
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setSelectedOp(item)}
                            title={lang === 'en' ? 'View Details' : 'មើលព័ត៌មានលម្អិត'}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-800/80 text-slate-300 hover:border-red-400 hover:text-white transition active:scale-95"
                          >
                            <EyeIcon />
                          </button>
                        </td>
                      )}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Totals */}
        {operations.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800/80 text-xs font-mono text-slate-400">
            <div>
              <span className="font-['Montserrat']">{lang === 'en' ? 'Total Listed Records: ' : 'កំណត់ត្រាសរុប៖ '}</span>
              <strong className="text-white">{operations.length}</strong>
            </div>

            <div className="flex items-center gap-6">
              <div>
                <span>{lang === 'en' ? 'Cash In: ' : 'លុយចូល៖ '}</span>
                <strong className="text-emerald-400">{formatCurrency(metrics.totalIn)}</strong>
              </div>
              <div>
                <span>{lang === 'en' ? 'Cash Out: ' : 'លុយចេញ៖ '}</span>
                <strong className="text-rose-400">{formatCurrency(metrics.totalOut)}</strong>
              </div>
              <div>
                <span>{lang === 'en' ? 'Net Flow: ' : 'សមតុល្យ៖ '}</span>
                <strong className={metrics.netCash >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  {formatCurrency(metrics.netCash)}
                </strong>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 5. MODAL: CHOOSE COLUMN */}
      {showColumnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-[#161c28] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  {lang === 'en' ? 'Choose Column' : 'ជ្រើសរើសជួរឈរ'}
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
                className="text-slate-400 hover:text-white text-sm p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 max-h-72 overflow-y-auto py-1">
              {ALL_COLUMNS.map((col) => {
                const isChecked = visibleColumns.includes(col.key)
                return (
                  <label
                    key={col.key}
                    className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-xs font-semibold cursor-pointer transition ${
                      isChecked
                        ? 'border-red-500/50 bg-red-500/10 text-white'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={col.always}
                      onChange={() => toggleColumn(col.key)}
                      className="rounded border-slate-700 bg-slate-950 text-red-500 focus:ring-red-400/20"
                    />
                    <span>{lang === 'kh' ? col.label.kh : col.label.en}</span>
                  </label>
                )
              })}
            </div>

            <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-xs">
              <button
                type="button"
                onClick={resetColumns}
                className="font-bold text-slate-400 hover:text-white transition"
              >
                {lang === 'en' ? 'Reset to Default' : 'កំណត់លំនាំដើម'}
              </button>
              <button
                type="button"
                onClick={() => setShowColumnModal(false)}
                className="rounded-xl bg-red-600 hover:bg-red-500 px-4 py-2 text-xs font-black text-white shadow-md shadow-red-600/25 transition"
              >
                {lang === 'en' ? 'Done' : 'រួចរាល់'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL: TRANSACTION DETAIL */}
      {selectedOp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl border border-slate-700 bg-[#161c28] p-6 shadow-2xl space-y-4 font-['Montserrat']">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/20 text-xl ring-1 ring-red-400/40">
                  <img src={moneyBagIcon} alt="" className="h-6 w-6 object-contain" />
                </span>
                <div>
                  <h3 className="text-base font-black text-white">
                    {lang === 'en' ? 'Cash Voucher Details' : 'ព័ត៌មានលម្អិតប័ណ្ណសាច់ប្រាក់'}
                  </h3>
                  <p className="text-xs font-mono font-bold text-red-400">
                    {selectedOp.code}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOp(null)}
                className="text-slate-400 hover:text-white text-sm p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">{lang === 'en' ? 'Type' : 'ប្រភេទ'}</span>
                <span className={`inline-block mt-0.5 font-bold font-mono ${selectedOp.type === 'CASH_IN' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {selectedOp.type === 'CASH_IN' ? '▲ Cash In' : '▼ Cash Out'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">{lang === 'en' ? 'Amount' : 'ចំនួនទឹកប្រាក់'}</span>
                <span className="text-base font-mono font-black text-white">
                  {formatCurrency(selectedOp.amount)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">{lang === 'en' ? 'Customer / Supplier' : 'អតិថិជន / អ្នកផ្គត់ផ្គង់'}</span>
                <span className="text-slate-200 font-semibold">{selectedOp.partyName || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">{lang === 'en' ? 'Party Type' : 'ប្រភេទភាគី'}</span>
                <span className="text-slate-300 font-mono">{selectedOp.partyType || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">{lang === 'en' ? 'Date & Time' : 'កាលបរិច្ឆេទ'}</span>
                <span className="text-slate-300">{formatDateTime(selectedOp.transactionDate)}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">{lang === 'en' ? 'Outlet' : 'សាខា'}</span>
                <span className="text-slate-300">{selectedOp.outlet || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">{lang === 'en' ? 'Category' : 'ប្រភេទចំណាយ'}</span>
                <span className="text-slate-300">{selectedOp.category || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">{lang === 'en' ? 'Status' : 'ស្ថានភាព'}</span>
                <span className="text-slate-300 font-mono">{selectedOp.status || 'NON_VOIDED'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">{lang === 'en' ? 'Reference' : 'លេខយោង'}</span>
                <span className="text-slate-300 font-mono">{selectedOp.referenceNo || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">{lang === 'en' ? 'Cashier / User' : 'អ្នកប្រើ'}</span>
                <span className="text-slate-300">{selectedOp.username || '—'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">{lang === 'en' ? 'Description' : 'ការពិពណ៌នា'}</span>
                <span className="text-slate-300 leading-relaxed">{selectedOp.description || 'No notes provided.'}</span>
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-800 pt-3">
              <button
                type="button"
                onClick={() => setSelectedOp(null)}
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
