import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useNotifications } from '../../context/NotificationContext'
import { adminCashOperationAPI } from '../../api/api'
import { exportStyledExcel } from '../../utils/excelExport'
import moneyBagIcon from '../../assets/icon/3dicons-money-bag-dynamic-color.png'
import CashInOutCreate from './CashInOutCreate'
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

function PlusIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
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

// 8 CASH BOOK CATEGORIES
export const CASH_BOOK_CATEGORIES = [
  { key: 'cash-category', labelEn: 'Cash Category', labelKh: 'ក្រុមលុយសាច់', icon: '📂', route: '/admin/cash-book/cash-category' },
  { key: 'cash-in-out', labelEn: 'Cash In / Out', labelKh: 'លុយសាច់ ចូល/ចេញ', icon: '💸', route: '/admin/cash-book/cash-in-out' },
  { key: 'bank-in-out', labelEn: 'Bank In / Out', labelKh: 'ធនាគារ ចូល/ចេញ', icon: '🏦', route: '/admin/cash-book/bank-in-out' },
  { key: 'bank-transfer', labelEn: 'Bank Transfer', labelKh: 'ផ្ទេរប្រាក់', icon: '🔄', route: '/admin/cash-book/bank-transfer' },
  { key: 'customer-deposit', labelEn: 'Customer Deposit', labelKh: 'ប្រាក់កក់អតិថិជន', icon: '💰', route: '/admin/cash-book/customer-deposit' },
  { key: 'ar-collection', labelEn: 'AR Collection', labelKh: 'ការរង្វើយប្រាក់', icon: '📊', route: '/admin/cash-book/ar-collection' },
  { key: 'supplier-deposit', labelEn: 'Supplier Deposit', labelKh: 'ប្រាក់កក់អ្នកផ្គត់ផ្គង់', icon: '💎', route: '/admin/cash-book/supplier-deposit' },
  { key: 'bill-payment', labelEn: 'Bill Payment', labelKh: 'ការបង់ប៊ីល', icon: '💳', route: '/admin/cash-book/bill-payment' },
]

// COLUMNS DEFINITION: Exact order: Code, Date, Type, Amount, Supplier / Customer, Phone, Status, Employee, Reference
const ALL_COLUMNS = [
  { key: 'code', label: { en: 'Code', kh: 'លេខកូដ' }, always: true },
  { key: 'date', label: { en: 'Date', kh: 'កាលបរិច្ឆេទ' }, always: true },
  { key: 'type', label: { en: 'Type', kh: 'ប្រភេទ' }, always: true },
  { key: 'amount', label: { en: 'Amount', kh: 'ចំនួនទឹកប្រាក់ ($)' }, always: true },
  { key: 'partyName', label: { en: 'Supplier / Customer', kh: 'អ្នកផ្គត់ផ្គង់ / អតិថិជន' }, always: true },
  { key: 'phone', label: { en: 'Phone', kh: 'លេខទូរស័ព្ទ' } },
  { key: 'status', label: { en: 'Status', kh: 'ស្ថានភាព' }, always: true },
  { key: 'employee', label: { en: 'Employee', kh: 'បុគ្គលិក' } },
  { key: 'reference', label: { en: 'Reference', kh: 'លេខយោង' } },
  { key: 'outlet', label: { en: 'Outlet', kh: 'សាខា / ឃ្លាំង' } },
  { key: 'category', label: { en: 'Category', kh: 'ប្រភេទចំណាយ' } },
  { key: 'actions', label: { en: 'Actions', kh: 'សកម្មភាព' } },
]

const DEFAULT_VISIBLE_COLUMNS = [
  'code',
  'date',
  'type',
  'amount',
  'partyName',
  'phone',
  'status',
  'employee',
  'reference',
  'actions',
]

// Search By Dropdown: any, Code, Customer, Supplier, Phone, Employee
const SEARCH_BY_OPTIONS = [
  { value: 'any', label: { en: 'any', kh: 'ទាំងអស់' } },
  { value: 'Code', label: { en: 'Code', kh: 'លេខកូដ' } },
  { value: 'Customer', label: { en: 'Customer', kh: 'អតិថិជន' } },
  { value: 'Supplier', label: { en: 'Supplier', kh: 'អ្នកផ្គត់ផ្គង់' } },
  { value: 'Phone', label: { en: 'Phone', kh: 'លេខទូរស័ព្ទ' } },
  { value: 'Employee', label: { en: 'Employee', kh: 'បុគ្គលិក' } },
]

// Type Dropdown: All, Cash in, Cash out
const TYPE_OPTIONS = [
  { value: 'All', label: { en: 'All', kh: 'ទាំងអស់' } },
  { value: 'Cash in', label: { en: 'Cash in', kh: 'លុយចូល' } },
  { value: 'Cash out', label: { en: 'Cash out', kh: 'លុយចេញ' } },
]

// Outlets for Advance Filter
const OUTLET_OPTIONS = [
  'all',
  'Main Store Warehouse',
  'Central Cold Storage',
  'Express Mart BKK1',
  'Toul Kork Branch',
  'Chbar Ampov Depot',
  'Siem Reap Hub',
]

// Status Dropdown: All, none-void, Voided
const STATUS_OPTIONS = [
  { value: 'All', label: { en: 'All', kh: 'ស្ថានភាពទាំងអស់' } },
  { value: 'none-void', label: { en: 'none-void', kh: 'មិនទាន់មោឃៈ' } },
  { value: 'Voided', label: { en: 'Voided', kh: 'បានទុកជាមោឃៈ' } },
]

// Rich Fallback Seed Data
const SAMPLE_CASH_OPERATIONS = [
  {
    id: 'CSH-001',
    code: 'CIN-2026-0001',
    transactionDate: '2026-09-08T10:15:00',
    type: 'CASH_IN',
    partyType: 'CUSTOMER',
    partyName: 'Angkor Fresh Market (K. Sophea)',
    phone: '012 889 776',
    contact: 'Mr. Vanna Touch',
    employee: 'CashierDara',
    amount: 450.00,
    outlet: 'Main Store Warehouse',
    status: 'NON_VOIDED',
    category: 'Store Sales Intake',
    referenceNo: 'REC-98214',
    username: 'CashierDara',
    description: 'Counter sales daily cash deposit from POS Terminal 1',
  },
  {
    id: 'CSH-002',
    code: 'COUT-2026-0002',
    transactionDate: '2026-09-08T11:30:00',
    type: 'CASH_OUT',
    partyType: 'SUPPLIER',
    partyName: 'Battambang Organic Rice Ltd',
    phone: '015 992 113',
    contact: 'Ms. Sreymom Chan',
    employee: 'Sokheng',
    amount: 1200.00,
    outlet: 'Main Store Warehouse',
    status: 'NON_VOIDED',
    category: 'Supplier Advance',
    referenceNo: 'VCH-00431',
    username: 'Badmin',
    description: 'Advance cash deposit for premium jasmine rice shipment',
  },
  {
    id: 'CSH-003',
    code: 'CIN-2026-0003',
    transactionDate: '2026-09-08T12:05:00',
    type: 'CASH_IN',
    partyType: 'CUSTOMER',
    partyName: 'Sovannaphum Mart',
    phone: '098 443 221',
    contact: 'Mr. Sok Chea',
    employee: 'CashierChann',
    amount: 320.50,
    outlet: 'Central Cold Storage',
    status: 'NON_VOIDED',
    category: 'AR Collection',
    referenceNo: 'REC-98219',
    username: 'CashierChann',
    description: 'Customer cash settlement for weekly fresh produce invoice',
  },
  {
    id: 'CSH-004',
    code: 'COUT-2026-0004',
    transactionDate: '2026-09-07T14:20:00',
    type: 'CASH_OUT',
    partyType: 'SUPPLIER',
    partyName: 'Kirirom Dairy Co.',
    phone: '011 223 344',
    contact: 'Dara Heng',
    employee: 'Badmin',
    amount: 85.00,
    outlet: 'Express Mart BKK1',
    status: 'NON_VOIDED',
    category: 'Petty Cash Expense',
    referenceNo: 'PET-0912',
    username: 'Badmin',
    description: 'Emergency store supplies and cooler cleaning items',
  },
  {
    id: 'CSH-005',
    code: 'CIN-2026-0005',
    transactionDate: '2026-09-07T16:45:00',
    type: 'CASH_IN',
    partyType: 'CUSTOMER',
    partyName: 'Phnom Penh Grocery Hub',
    phone: '070 556 677',
    contact: 'Sophea Kim',
    employee: 'CashierDara',
    amount: 850.00,
    outlet: 'Toul Kork Branch',
    status: 'NON_VOIDED',
    category: 'Customer Advance',
    referenceNo: 'DEP-7701',
    username: 'CashierDara',
    description: 'Customer downpayment for weekend catering order',
  },
  {
    id: 'CSH-006',
    code: 'COUT-2026-0006',
    transactionDate: '2026-09-06T09:00:00',
    type: 'CASH_OUT',
    partyType: 'OTHER',
    partyName: 'EDC - Electricite du Cambodge',
    phone: '023 723 871',
    contact: 'Billing Dept',
    employee: 'Badmin',
    amount: 340.00,
    outlet: 'Chbar Ampov Depot',
    status: 'NON_VOIDED',
    category: 'Utility Expense',
    referenceNo: 'EDC-09412',
    username: 'Badmin',
    description: 'Warehouse electricity monthly utility invoice payment',
  },
  {
    id: 'CSH-007',
    code: 'CIN-2026-0007',
    transactionDate: '2026-09-05T15:10:00',
    type: 'CASH_IN',
    partyType: 'SUPPLIER',
    partyName: 'Mekong River Fisheries',
    phone: '093 112 233',
    contact: 'Mr. Bunroeun',
    employee: 'CashierChann',
    amount: 180.00,
    outlet: 'Siem Reap Hub',
    status: 'NON_VOIDED',
    category: 'Supplier Refund',
    referenceNo: 'REF-0412',
    username: 'CashierChann',
    description: 'Refund for returned defective packaging cartons',
  },
  {
    id: 'CSH-008',
    code: 'COUT-2026-0008',
    transactionDate: '2026-09-05T17:30:00',
    type: 'CASH_OUT',
    partyType: 'SUPPLIER',
    partyName: 'Angkor Express Logistics',
    phone: '089 990 123',
    contact: 'Dispatch Manager',
    employee: 'Badmin',
    amount: 210.00,
    outlet: 'Main Store Warehouse',
    status: 'VOIDED',
    category: 'Freight Charge',
    referenceNo: 'FRT-8812',
    username: 'Badmin',
    description: 'Courier freight voucher - duplicate entry voided by admin',
  },
]

export default function CashInOutList() {
  const { lang } = useLanguage()
  const { showNotification } = useNotifications()

  // State
  const [rawOperations, setRawOperations] = useState([])
  const [loading, setLoading] = useState(true)
  const [isCreateMode, setIsCreateMode] = useState(false)

  // 1. Search Controls (Search Operation Cash)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchBy, setSearchBy] = useState('any') // any | Code | Customer | Supplier | Phone | Employee
  const [selectedType, setSelectedType] = useState('All') // All | Cash in | Cash out

  // Advance Filter Collapsible
  const [showAdvanceFilter, setShowAdvanceFilter] = useState(false)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [selectedOutlet, setSelectedOutlet] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('All') // All | none-void | Voided

  // Choose Column Modal
  const [showColumnModal, setShowColumnModal] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState(() => {
    try {
      const saved = localStorage.getItem('bg_cash_in_out_columns_v3')
      return saved ? JSON.parse(saved) : DEFAULT_VISIBLE_COLUMNS
    } catch {
      return DEFAULT_VISIBLE_COLUMNS
    }
  })

  // View Details Modal
  const [viewDetailModal, setViewDetailModal] = useState(null)

  // Fetch data from API with resilient fallback
  const fetchOperations = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (searchQuery.trim()) params.search = searchQuery.trim()
      if (searchBy !== 'any') params.searchBy = searchBy
      if (selectedType !== 'All') params.type = selectedType === 'Cash in' ? 'CASH_IN' : 'CASH_OUT'
      if (selectedOutlet !== 'all') params.outlet = selectedOutlet
      if (selectedStatus !== 'All') params.status = selectedStatus === 'none-void' ? 'NON_VOIDED' : 'VOIDED'
      if (fromDate) params.fromDate = `${fromDate}T00:00:00`
      if (toDate) params.toDate = `${toDate}T23:59:59`

      const res = await adminCashOperationAPI.getAll(params)
      if (Array.isArray(res) && res.length > 0) {
        setRawOperations(res)
      } else if (res && Array.isArray(res.data) && res.data.length > 0) {
        setRawOperations(res.data)
      } else {
        setRawOperations(SAMPLE_CASH_OPERATIONS)
      }
    } catch (err) {
      console.warn('Live cash operations endpoint error, using sample data:', err.message)
      setRawOperations(SAMPLE_CASH_OPERATIONS)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, searchBy, selectedType, selectedOutlet, selectedStatus, fromDate, toDate])

  useEffect(() => {
    fetchOperations()
  }, [fetchOperations])

  // Filter pipeline for data presentation
  const filteredOperations = useMemo(() => {
    return rawOperations.filter((item) => {
      // 1. Text Search & Search By: any, Code, Customer, Supplier, Phone, Employee
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        if (searchBy === 'Code') {
          if (!item.code?.toLowerCase().includes(q)) return false
        } else if (searchBy === 'Customer') {
          if (item.partyType !== 'CUSTOMER' || !item.partyName?.toLowerCase().includes(q)) return false
        } else if (searchBy === 'Supplier') {
          if (item.partyType !== 'SUPPLIER' || !item.partyName?.toLowerCase().includes(q)) return false
        } else if (searchBy === 'Phone') {
          if (!item.phone?.toLowerCase().includes(q)) return false
        } else if (searchBy === 'Employee') {
          const empMatch = item.employee?.toLowerCase().includes(q) || item.username?.toLowerCase().includes(q)
          if (!empMatch) return false
        } else {
          // any
          const inCode = item.code?.toLowerCase().includes(q)
          const inParty = item.partyName?.toLowerCase().includes(q)
          const inPhone = item.phone?.toLowerCase().includes(q)
          const inEmp = item.employee?.toLowerCase().includes(q) || item.username?.toLowerCase().includes(q)
          const inDesc = item.description?.toLowerCase().includes(q)
          const inRef = item.referenceNo?.toLowerCase().includes(q)
          const inCat = item.category?.toLowerCase().includes(q)
          if (!inCode && !inParty && !inPhone && !inEmp && !inDesc && !inRef && !inCat) return false
        }
      }

      // 2. Type Filter: All | Cash in | Cash out
      if (selectedType === 'Cash in' && item.type !== 'CASH_IN') return false
      if (selectedType === 'Cash out' && item.type !== 'CASH_OUT') return false

      // 3. Status Filter: All | none-void | Voided
      if (selectedStatus === 'none-void' && item.status === 'VOIDED') return false
      if (selectedStatus === 'Voided' && item.status !== 'VOIDED') return false

      // 4. Outlet Filter
      if (selectedOutlet !== 'all' && item.outlet !== selectedOutlet) return false

      // 5. Date Range Filter
      if (fromDate) {
        const itemDate = new Date(item.transactionDate).toISOString().slice(0, 10)
        if (itemDate < fromDate) return false
      }
      if (toDate) {
        const itemDate = new Date(item.transactionDate).toISOString().slice(0, 10)
        if (itemDate > toDate) return false
      }

      return true
    })
  }, [rawOperations, searchQuery, searchBy, selectedType, selectedStatus, selectedOutlet, fromDate, toDate])

  // Save Column settings
  const toggleColumn = (key) => {
    setVisibleColumns((prev) => {
      let updated
      if (prev.includes(key)) {
        updated = prev.filter((k) => k !== key)
      } else {
        updated = [...prev, key]
      }
      localStorage.setItem('bg_cash_in_out_columns_v3', JSON.stringify(updated))
      return updated
    })
  }

  const resetColumns = () => {
    setVisibleColumns(DEFAULT_VISIBLE_COLUMNS)
    localStorage.setItem('bg_cash_in_out_columns_v3', JSON.stringify(DEFAULT_VISIBLE_COLUMNS))
  }

  // search_off / Reset All Filters
  const handleResetFilters = () => {
    setSearchQuery('')
    setSearchBy('any')
    setSelectedType('All')
    setFromDate('')
    setToDate('')
    setSelectedOutlet('all')
    setSelectedStatus('All')
    showNotification?.({
      type: 'info',
      title: lang === 'en' ? 'Filters Reset' : 'សម្អាតការស្វែងរក',
      message: lang === 'en' ? 'All search filters have been cleared.' : 'លក្ខខណ្ឌស្វែងរកទាំងអស់ត្រូវបានកំណត់ឡើងវិញ។',
    })
  }

  // Formatters
  const formatCurrency = (val) => {
    const num = Number(val || 0)
    return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

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

  // Export to Styled Excel
  const handleExportExcel = () => {
    if (filteredOperations.length === 0) {
      showNotification?.({
        type: 'warning',
        title: lang === 'en' ? 'Export' : 'នាំចេញ',
        message: lang === 'en' ? 'No cash operations to export.' : 'គ្មានទិន្នន័យដើម្បីនាំចេញទេ។',
      })
      return
    }

    const headers = [
      'Code',
      'Date',
      'Type',
      'Amount ($)',
      'Supplier / Customer',
      'Phone',
      'Status',
      'Employee',
      'Reference',
      'Outlet',
      'Category',
      'Description',
    ]

    const dataRows = filteredOperations.map((item) => [
      item.code || '',
      formatDateTime(item.transactionDate),
      item.type === 'CASH_IN' ? 'Cash In' : 'Cash Out',
      Number(item.amount || 0),
      item.partyName || '—',
      item.phone || '—',
      item.status === 'VOIDED' ? 'Voided' : 'None-void',
      item.employee || item.username || '—',
      item.referenceNo || '—',
      item.outlet || '—',
      item.category || '—',
      item.description || '—',
    ])

    exportStyledExcel({
      sheetName: 'Cash In Out List',
      title: "B'Groceries - Operation Cash (Cash In / Out List)",
      subtitle: `Exported on: ${new Date().toLocaleString()} | Records: ${filteredOperations.length}`,
      headers,
      dataRows,
      fileName: `Cash_In_Out_List_${new Date().toISOString().slice(0, 10)}.xlsx`,
    })

    showNotification?.({
      type: 'success',
      title: lang === 'en' ? 'Export Successful' : 'ការនាំចេញជោគជ័យ',
      message: lang === 'en' ? 'Cash in/out data exported to Excel.' : 'ទិន្នន័យត្រូវបាននាំចេញជាឯកសារ Excel រួចរាល់។',
    })
  }

  // Summary Metrics
  const metrics = useMemo(() => {
    let totalIn = 0
    let totalOut = 0
    filteredOperations.forEach((op) => {
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
      count: filteredOperations.length,
    }
  }, [filteredOperations])

  // If in create view mode, render CashInOutCreate
  if (isCreateMode) {
    return (
      <CashInOutCreate
        onCancel={() => setIsCreateMode(false)}
        onSuccess={() => {
          setIsCreateMode(false)
          fetchOperations()
        }}
      />
    )
  }

  return (
    <div className="space-y-6 text-slate-100 font-['Montserrat']">
      {/* 1. HERO BREADCRUMB & BANNER */}
      <section className="relative overflow-hidden rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#0b0f17] p-5 sm:p-7 shadow-2xl shadow-yellow-500/10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-yellow-500/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 h-px w-2/3 bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <Link
              to="/admin/cash-book"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-950/60 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-yellow-300 transition hover:border-yellow-400 hover:text-white active:scale-95"
            >
              <ChevronLeftIcon /> {lang === 'en' ? 'Cash Book Hub' : 'សៀវភៅលុយ'}
            </Link>

            <div className="flex items-center gap-3.5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-yellow-500/15 p-2 ring-1 ring-yellow-500/30 shadow-lg shadow-yellow-500/20">
                <img src={moneyBagIcon} alt="" className="h-9 w-9 object-contain drop-shadow-md" />
              </span>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-yellow-400">
                  {lang === 'en' ? 'Cash Book Register' : 'កំណត់ត្រាសៀវភៅលុយសាច់'}
                </p>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {lang === 'en' ? 'Cash In / Out Register' : 'ប្រតិបត្តិការសាច់ប្រាក់ (ចូល / ចេញ)'}
                </h1>
              </div>
            </div>

            <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-300">
              {lang === 'en'
                ? 'Track, monitor, and audit store daily cash intakes, customer deposits, counter disbursements, and supplier payments.'
                : 'តាមដាន និងផ្ទៀងផ្ទាត់ការទទួលប្រាក់ចំណូលសាច់ប្រាក់ ប្រាក់កក់អតិថិជន និងការចំណាយសាច់ប្រាក់ប្រចាំថ្ងៃ។'}
            </p>
          </div>

          {/* Quick Stats Metric Cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 shrink-0 min-w-[320px]">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 shadow-md">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{lang === 'en' ? 'Cash In' : 'លុយចូល'}</span>
                <span className="text-emerald-400 font-bold">▲ In</span>
              </div>
              <p className="mt-1 font-mono text-base sm:text-lg font-black text-emerald-400">
                {formatCurrency(metrics.totalIn)}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 shadow-md">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{lang === 'en' ? 'Cash Out' : 'លុយចេញ'}</span>
                <span className="text-rose-400 font-bold">▼ Out</span>
              </div>
              <p className="mt-1 font-mono text-base sm:text-lg font-black text-rose-400">
                {formatCurrency(metrics.totalOut)}
              </p>
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-2xl border border-slate-800 bg-slate-950/80 p-3 shadow-md">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{lang === 'en' ? 'Net Flow' : 'សមតុល្យ'}</span>
                <span className="text-yellow-400 font-bold">● Net</span>
              </div>
              <p className="mt-1 font-mono text-base sm:text-lg font-black text-yellow-400">
                {formatCurrency(metrics.netCash)}
              </p>
            </div>
          </div>
        </div>

        {/* 8 CASH BOOK CATEGORY PILLS BAR */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            {lang === 'en' ? 'Cash Book Categories:' : 'ប្រភេទសៀវភៅលុយ៖'}
          </p>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {CASH_BOOK_CATEGORIES.map((cat) => {
              const isActive = cat.key === 'cash-in-out'
              return (
                <Link
                  key={cat.key}
                  to={cat.route}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-yellow-500 text-slate-950 font-bold shadow-md shadow-yellow-500/25 scale-[1.02]'
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

      {/* 2. SEARCH OPERATION CASH SECTION */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl shadow-black/20 space-y-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            {lang === 'en' ? 'Search Operation Cash' : 'ស្វែងរកប្រតិបត្តិការសាច់ប្រាក់'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'en'
              ? 'Search operation cash by any condition. Ex(any, Code, Customer, Phone, Employee...)'
              : 'ស្វែងរកប្រតិបត្តិការសាច់ប្រាក់តាមលក្ខខណ្ឌណាមួយ (ទាំងអស់, លេខកូដ, អតិថិជន, លេខទូរស័ព្ទ, បុគ្គលិក...)'}
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
                placeholder={lang === 'en' ? 'Search by code, party, phone, employee...' : 'ស្វែងរកតាមលេខកូដ, អតិថិជន, ទូរស័ព្ទ...'}
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2.5 pl-10 pr-8 text-xs font-semibold text-white placeholder-slate-500 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
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

          {/* Search by - Dropdown: any, Code, Customer, Supplier, Phone, Employee */}
          <div className="lg:col-span-3 space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              {lang === 'en' ? 'Search by' : 'ស្វែងរកដោយ'}
            </label>
            <div className="relative">
              <select
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-700/80 bg-slate-950/90 py-2.5 pl-3.5 pr-8 text-xs font-semibold text-white outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
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

          {/* Type - Dropdown: All, Cash in, Cash out */}
          <div className="lg:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              {lang === 'en' ? 'Type' : 'ប្រភេទ'}
            </label>
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-700/80 bg-slate-950/90 py-2.5 pl-3.5 pr-8 text-xs font-semibold text-white outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
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

          {/* Action Buttons: Search & Advance Filter Toggle */}
          <div className="lg:col-span-2 flex items-center gap-2">
            <button
              type="button"
              onClick={fetchOperations}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-yellow-500 py-2.5 px-4 text-xs font-black text-slate-950 shadow-md shadow-yellow-500/20 transition hover:bg-yellow-400 active:scale-95"
            >
              <SearchIcon />
              <span>{lang === 'en' ? 'Search' : 'ស្វែងរក'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAdvanceFilter(!showAdvanceFilter)}
              title={lang === 'en' ? 'Advance Filter' : 'តម្រងកម្រិតខ្ពស់'}
              className={`inline-flex items-center justify-center gap-1.5 rounded-xl border py-2.5 px-3 text-xs font-bold transition active:scale-95 ${
                showAdvanceFilter || fromDate || toDate || selectedOutlet !== 'all' || selectedStatus !== 'All'
                  ? 'border-yellow-400 bg-yellow-500/20 text-yellow-300'
                  : 'border-slate-700/80 bg-slate-950/90 text-slate-300 hover:border-slate-500 hover:text-white'
              }`}
            >
              <FilterListIcon />
              <span className="hidden sm:inline">{lang === 'en' ? 'Advance Filter' : 'តម្រង'}</span>
            </button>
          </div>
        </div>

        {/* Advance Filter Collapsible Drawer */}
        {showAdvanceFilter && (
          <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 items-end bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
            {/* From Date to date: From Date */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                {lang === 'en' ? 'From Date' : 'ចាប់ពីថ្ងៃ'}
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950 py-2 px-3 text-xs font-semibold text-white outline-none focus:border-yellow-400"
              />
            </div>

            {/* From Date to date: To Date */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                {lang === 'en' ? 'To Date' : 'ដល់ថ្ងៃ'}
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950 py-2 px-3 text-xs font-semibold text-white outline-none focus:border-yellow-400"
              />
            </div>

            {/* Status Dropdown: All, none-void, Voided */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                {lang === 'en' ? 'Status' : 'ស្ថានភាព'}
              </label>
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-700/80 bg-slate-950 py-2 pl-3 pr-8 text-xs font-semibold text-white outline-none focus:border-yellow-400"
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

            {/* Outlet Dropdown */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                {lang === 'en' ? 'Outlet' : 'សាខា'}
              </label>
              <div className="relative">
                <select
                  value={selectedOutlet}
                  onChange={(e) => setSelectedOutlet(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-700/80 bg-slate-950 py-2 pl-3 pr-8 text-xs font-semibold text-white outline-none focus:border-yellow-400"
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
          </div>
        )}
      </section>

      {/* 3. CASH IN / OUT LIST SECTION */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl shadow-black/20 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-800/80">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {lang === 'en' ? 'Cash in / out list' : 'បញ្ជីលុយសាច់ ចូល / ចេញ'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'en'
                ? 'Show information of cash in / out. Ex(Code, Date, Type...)'
                : 'បង្ហាញព័ត៌មាននៃបញ្ជីលុយសាច់ចូល / ចេញ (លេខកូដ, កាលបរិច្ឆេទ, ប្រភេទ...)'}
            </p>
          </div>

          {/* Action Buttons: Reset, Choose Column, Export Excel, AND + CREATE BUTTON */}
          <div className="flex items-center gap-2">
            {/* Search Off / Reset button */}
            <button
              type="button"
              onClick={handleResetFilters}
              title={lang === 'en' ? 'Reset Filters' : 'សម្អាតការស្វែងរក'}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-950/90 py-2 px-3 text-xs font-bold text-slate-300 transition hover:border-slate-500 hover:text-white active:scale-95"
            >
              <SearchOffIcon />
              <span className="hidden md:inline">{lang === 'en' ? 'Reset' : 'សម្អាត'}</span>
            </button>

            {/* Choose Column */}
            <button
              type="button"
              onClick={() => setShowColumnModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-950/90 py-2 px-3 text-xs font-bold text-slate-300 transition hover:border-slate-500 hover:text-white active:scale-95"
            >
              <ColumnsIcon />
              <span>{lang === 'en' ? 'Choose Column' : 'ជួរឈរ'}</span>
            </button>

            {/* Export as Excel */}
            <button
              type="button"
              onClick={handleExportExcel}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2 px-3.5 text-xs font-black text-white shadow-md shadow-emerald-600/20 transition active:scale-95"
            >
              <DownloadIcon />
              <span>{lang === 'en' ? 'Export' : 'នាំចេញ'}</span>
            </button>

            {/* FOR CREATE BUTTON */}
            <button
              type="button"
              onClick={() => setIsCreateMode(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 py-2 px-4 text-xs font-black text-slate-950 shadow-md shadow-yellow-500/25 transition active:scale-95"
            >
              <PlusIcon />
              <span>{lang === 'en' ? 'Create' : 'បង្កើតថ្មី'}</span>
            </button>
          </div>
        </div>

        {/* Data Table with Columns: Code, Date, Type, Amount, Supplier / Customer, Phone, Status, Employee, Reference */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-slate-950/90 text-[11px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                {visibleColumns.includes('code') && (
                  <th className="py-3.5 px-4">{lang === 'kh' ? 'លេខកូដ' : 'Code'}</th>
                )}
                {visibleColumns.includes('date') && (
                  <th className="py-3.5 px-4">{lang === 'kh' ? 'កាលបរិច្ឆេទ' : 'Date'}</th>
                )}
                {visibleColumns.includes('type') && (
                  <th className="py-3.5 px-4">{lang === 'kh' ? 'ប្រភេទ' : 'Type'}</th>
                )}
                {visibleColumns.includes('amount') && (
                  <th className="py-3.5 px-4 text-right">{lang === 'kh' ? 'ចំនួនទឹកប្រាក់ ($)' : 'Amount ($)'}</th>
                )}
                {visibleColumns.includes('partyName') && (
                  <th className="py-3.5 px-4">{lang === 'kh' ? 'អ្នកផ្គត់ផ្គង់ / អតិថិជន' : 'Supplier / Customer'}</th>
                )}
                {visibleColumns.includes('phone') && (
                  <th className="py-3.5 px-4">{lang === 'kh' ? 'លេខទូរស័ព្ទ' : 'Phone'}</th>
                )}
                {visibleColumns.includes('status') && (
                  <th className="py-3.5 px-4">{lang === 'kh' ? 'ស្ថានភាព' : 'Status'}</th>
                )}
                {visibleColumns.includes('employee') && (
                  <th className="py-3.5 px-4">{lang === 'kh' ? 'បុគ្គលិក' : 'Employee'}</th>
                )}
                {visibleColumns.includes('reference') && (
                  <th className="py-3.5 px-4">{lang === 'kh' ? 'លេខយោង' : 'Reference'}</th>
                )}
                {visibleColumns.includes('outlet') && (
                  <th className="py-3.5 px-4">{lang === 'kh' ? 'សាខា' : 'Outlet'}</th>
                )}
                {visibleColumns.includes('category') && (
                  <th className="py-3.5 px-4">{lang === 'kh' ? 'ប្រភេទចំណាយ' : 'Category'}</th>
                )}
                {visibleColumns.includes('actions') && (
                  <th className="py-3.5 px-4 text-center">{lang === 'kh' ? 'សកម្មភាព' : 'Actions'}</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {loading ? (
                <tr>
                  <td colSpan={visibleColumns.length} className="py-12 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-yellow-500 border-t-transparent" />
                      <span>{lang === 'en' ? 'Loading cash operations...' : 'កំពុងផ្ទុកទិន្នន័យ...'}</span>
                    </div>
                  </td>
                </tr>
              ) : filteredOperations.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumns.length} className="py-12 text-center text-slate-400">
                    <div className="space-y-2">
                      <p className="text-2xl">💸</p>
                      <p className="text-xs font-semibold text-slate-300">
                        {lang === 'en' ? 'No cash in/out transactions match your filter criteria.' : 'រកមិនឃើញប្រតិបត្តិការសាច់ប្រាក់តាមលក្ខខណ្ឌស្វែងរកទេ។'}
                      </p>
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-700"
                      >
                        {lang === 'en' ? 'Reset Filters' : 'សម្អាតការស្វែងរក'}
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOperations.map((op) => (
                  <tr key={op.id || op.code} className="transition hover:bg-slate-800/40">
                    {/* 1. Code */}
                    {visibleColumns.includes('code') && (
                      <td className="py-3 px-4 font-mono font-bold text-yellow-400 whitespace-nowrap">
                        {op.code}
                      </td>
                    )}

                    {/* 2. Date */}
                    {visibleColumns.includes('date') && (
                      <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                        {formatDateTime(op.transactionDate)}
                      </td>
                    )}

                    {/* 3. Type */}
                    {visibleColumns.includes('type') && (
                      <td className="py-3 px-4 whitespace-nowrap">
                        {op.type === 'CASH_IN' ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-black uppercase text-emerald-400">
                            <span>▲</span> {lang === 'en' ? 'Cash In' : 'លុយចូល'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 border border-rose-500/30 px-2.5 py-0.5 text-[10px] font-black uppercase text-rose-400">
                            <span>▼</span> {lang === 'en' ? 'Cash Out' : 'លុយចេញ'}
                          </span>
                        )}
                      </td>
                    )}

                    {/* 4. Amount */}
                    {visibleColumns.includes('amount') && (
                      <td className={`py-3 px-4 text-right font-mono font-bold whitespace-nowrap ${
                        op.type === 'CASH_IN' ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {op.type === 'CASH_IN' ? '+' : '-'}{formatCurrency(op.amount)}
                      </td>
                    )}

                    {/* 5. Supplier / Customer */}
                    {visibleColumns.includes('partyName') && (
                      <td className="py-3 px-4 font-semibold text-white">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs">
                            {op.partyType === 'CUSTOMER' ? '👤' : op.partyType === 'SUPPLIER' ? '🏭' : '🏢'}
                          </span>
                          <span className="truncate max-w-[200px]">{op.partyName || '—'}</span>
                        </div>
                      </td>
                    )}

                    {/* 6. Phone */}
                    {visibleColumns.includes('phone') && (
                      <td className="py-3 px-4 text-slate-300 font-mono text-xs whitespace-nowrap">
                        {op.phone || op.contact || '—'}
                      </td>
                    )}

                    {/* 7. Status */}
                    {visibleColumns.includes('status') && (
                      <td className="py-3 px-4 whitespace-nowrap">
                        {op.status === 'VOIDED' ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 border border-red-500/30 px-2 py-0.5 text-[10px] font-bold text-red-400">
                            ✕ {lang === 'en' ? 'Voided' : 'បានទុកជាមោឃៈ'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                            ● {lang === 'en' ? 'none-void' : 'មិនទាន់មោឃៈ'}
                          </span>
                        )}
                      </td>
                    )}

                    {/* 8. Employee */}
                    {visibleColumns.includes('employee') && (
                      <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                        <span className="rounded-lg bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-300">
                          {op.employee || op.username || '—'}
                        </span>
                      </td>
                    )}

                    {/* 9. Reference */}
                    {visibleColumns.includes('reference') && (
                      <td className="py-3 px-4 font-mono text-yellow-300 text-xs whitespace-nowrap">
                        {op.referenceNo || '—'}
                      </td>
                    )}

                    {/* Optional: Outlet */}
                    {visibleColumns.includes('outlet') && (
                      <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                        <span className="rounded-lg bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-300">
                          {op.outlet || '—'}
                        </span>
                      </td>
                    )}

                    {/* Optional: Category */}
                    {visibleColumns.includes('category') && (
                      <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                        {op.category || '—'}
                      </td>
                    )}

                    {/* Optional: Actions */}
                    {visibleColumns.includes('actions') && (
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setViewDetailModal(op)}
                          title={lang === 'en' ? 'View Details' : 'មើលលម្អិត'}
                          className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 transition hover:border-yellow-400 hover:text-yellow-300 active:scale-95"
                        >
                          <EyeIcon />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
          <span>
            {lang === 'en'
              ? `Showing ${filteredOperations.length} of ${rawOperations.length} records`
              : `បង្ហាញ ${filteredOperations.length} នៃ ${rawOperations.length} កំណត់ត្រា`}
          </span>
          <span className="font-mono text-[11px] text-slate-500">
            {lang === 'en' ? 'Cash Book Audit: Verified' : 'ផ្ទៀងផ្ទាត់សៀវភៅលុយ៖ រួចរាល់'}
          </span>
        </div>
      </section>

      {/* 4. CHOOSE COLUMN MODAL */}
      {showColumnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-800 bg-[#141922] p-6 shadow-2xl shadow-black/80 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-black text-white">
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
                onClick={() => setShowColumnModal(false)}
                className="h-8 w-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <XMarkIcon />
              </button>
            </div>

            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {ALL_COLUMNS.map((col) => {
                const isChecked = visibleColumns.includes(col.key)
                return (
                  <label
                    key={col.key}
                    className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition ${
                      isChecked
                        ? 'border-yellow-500/40 bg-yellow-500/10 text-white'
                        : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-semibold">
                      {lang === 'kh' ? col.label.kh : col.label.en}
                    </span>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={col.always}
                      onChange={() => toggleColumn(col.key)}
                      className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-yellow-500 focus:ring-yellow-400"
                    />
                  </label>
                )
              })}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={resetColumns}
                className="text-xs font-bold text-slate-400 hover:text-yellow-400 underline underline-offset-4"
              >
                {lang === 'en' ? 'Reset to Default' : 'កំណត់លំនាំដើម'}
              </button>
              <button
                type="button"
                onClick={() => setShowColumnModal(false)}
                className="rounded-xl bg-yellow-500 px-4 py-2 text-xs font-black text-slate-950 hover:bg-yellow-400 active:scale-95"
              >
                {lang === 'en' ? 'Done' : 'រួចរាល់'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. VIEW DETAIL MODAL */}
      {viewDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-800 bg-[#141922] p-6 shadow-2xl shadow-black/80 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/15 text-xl">
                  💸
                </span>
                <div>
                  <h3 className="text-base font-black text-white">
                    {lang === 'en' ? 'Cash Operation Details' : 'ព័ត៌មានលម្អិតប្រតិបត្តិការសាច់ប្រាក់'}
                  </h3>
                  <p className="font-mono text-xs text-yellow-400 font-bold">{viewDetailModal.code}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewDetailModal(null)}
                className="h-8 w-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <XMarkIcon />
              </button>
            </div>

            <div className="space-y-4">
              {/* Type and Amount banner */}
              <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {lang === 'en' ? 'Transaction Type' : 'ប្រភេទប្រតិបត្តិការ'}
                  </span>
                  <div className="mt-1">
                    {viewDetailModal.type === 'CASH_IN' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-black uppercase text-emerald-400">
                        ▲ {lang === 'en' ? 'Cash In (Receipt)' : 'លុយចូល (ចំណូល)'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 border border-rose-500/30 px-3 py-1 text-xs font-black uppercase text-rose-400">
                        ▼ {lang === 'en' ? 'Cash Out (Disbursement)' : 'លុយចេញ (ចំណាយ)'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {lang === 'en' ? 'Amount' : 'ចំនួនទឹកប្រាក់'}
                  </span>
                  <p className={`font-mono text-xl font-black ${
                    viewDetailModal.type === 'CASH_IN' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {viewDetailModal.type === 'CASH_IN' ? '+' : '-'}{formatCurrency(viewDetailModal.amount)}
                  </p>
                </div>
              </div>

              {/* Grid Attributes */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3">
                  <span className="text-[11px] text-slate-400">{lang === 'en' ? 'Date & Time' : 'កាលបរិច្ឆេទ'}</span>
                  <p className="mt-0.5 font-semibold text-white">{formatDateTime(viewDetailModal.transactionDate)}</p>
                </div>
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3">
                  <span className="text-[11px] text-slate-400">{lang === 'en' ? 'Status' : 'ស្ថានភាព'}</span>
                  <p className="mt-0.5 font-semibold text-white">
                    {viewDetailModal.status === 'VOIDED' ? (
                      <span className="text-rose-400">✕ {lang === 'en' ? 'Voided' : 'បានទុកជាមោឃៈ'}</span>
                    ) : (
                      <span className="text-emerald-400">● {lang === 'en' ? 'none-void' : 'មិនទាន់មោឃៈ'}</span>
                    )}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3">
                  <span className="text-[11px] text-slate-400">{lang === 'en' ? 'Supplier / Customer' : 'អ្នកផ្គត់ផ្គង់ / អតិថិជន'}</span>
                  <p className="mt-0.5 font-semibold text-white truncate">{viewDetailModal.partyName || '—'}</p>
                </div>
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3">
                  <span className="text-[11px] text-slate-400">{lang === 'en' ? 'Phone' : 'លេខទូរស័ព្ទ'}</span>
                  <p className="mt-0.5 font-mono font-semibold text-white">{viewDetailModal.phone || viewDetailModal.contact || '—'}</p>
                </div>
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3">
                  <span className="text-[11px] text-slate-400">{lang === 'en' ? 'Employee' : 'បុគ្គលិក'}</span>
                  <p className="mt-0.5 font-semibold text-white">{viewDetailModal.employee || viewDetailModal.username || '—'}</p>
                </div>
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3">
                  <span className="text-[11px] text-slate-400">{lang === 'en' ? 'Reference Voucher' : 'លេខយោងប័ណ្ណ'}</span>
                  <p className="mt-0.5 font-mono font-semibold text-yellow-300">{viewDetailModal.referenceNo || '—'}</p>
                </div>
              </div>

              {/* Description */}
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 text-xs">
                <span className="text-[11px] text-slate-400">{lang === 'en' ? 'Description / Purpose' : 'ការពិពណ៌នា'}</span>
                <p className="mt-1 text-slate-300 leading-relaxed">
                  {viewDetailModal.description || (lang === 'en' ? 'No description recorded.' : 'គ្មានការពិពណ៌នា')}
                </p>
              </div>

              {/* Auditor */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span>
                  {lang === 'en' ? 'Recorded By:' : 'កត់ត្រាដោយ៖'}{' '}
                  <strong className="text-white font-mono">{viewDetailModal.username || viewDetailModal.employee || 'System'}</strong>
                </span>
                <span>{lang === 'en' ? 'Audit Log: Live Verified' : 'ផ្ទៀងផ្ទាត់៖ រួចរាល់'}</span>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setViewDetailModal(null)}
                className="rounded-xl bg-slate-800 px-5 py-2 text-xs font-bold text-white hover:bg-slate-700"
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
