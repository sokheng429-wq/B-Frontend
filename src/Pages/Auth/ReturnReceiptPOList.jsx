import React, { useState, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useNotifications } from '../../context/NotificationContext'
import { adminProductAPI, adminSupplierAPI } from '../../api/api'
import { exportStyledExcel } from '../../utils/excelExport'
import copyIcon from '../../assets/icon/3dicons-copy-dynamic-color.png'
import './ProductsHub.css'

const ALL_COLUMNS = [
  { key: 'code', label: { en: 'Return Code', kh: 'លេខកូដបង្វិល' }, always: true },
  { key: 'date', label: { en: 'Return Date', kh: 'កាលបរិច្ឆេទបង្វិល' }, always: true },
  { key: 'refReceipt', label: { en: 'Ref Receipt / PO', kh: 'លេខយោងប័ណ្ណទទួល' }, always: true },
  { key: 'supplier', label: { en: 'Supplier', kh: 'អ្នកផ្គត់ផ្គង់' }, always: true },
  { key: 'reason', label: { en: 'Reason for Return', kh: 'មូលហេតុបង្វិល' }, always: true },
  { key: 'debitNote', label: { en: 'Debit Note No', kh: 'លេខប័ណ្ណឥណពន្ធ' } },
  { key: 'status', label: { en: 'Status', kh: 'ស្ថានភាព' }, always: true },
  { key: 'returnedQty', label: { en: 'Qty Returned', kh: 'ចំនួនបង្វិល' }, always: true },
  { key: 'refundAmount', label: { en: 'Refund Amount ($)', kh: 'ទឹកប្រាក់បង្វិល ($)' }, always: true },
  { key: 'authorizedBy', label: { en: 'Authorized By', kh: 'អ្នកអនុញ្ញាត' } },
  { key: 'actions', label: { en: 'Actions', kh: 'សកម្មភាព' }, always: true },
]

const DEFAULT_VISIBLE = [
  'code',
  'date',
  'refReceipt',
  'supplier',
  'reason',
  'status',
  'returnedQty',
  'refundAmount',
  'actions',
]

const INITIAL_RETURNS = [
  {
    id: 1,
    code: 'RTV-2609-0001',
    date: '2026-09-03',
    refReceipt: 'REC-2609-0002',
    supplier: 'Global Food Supply',
    reason: 'Damaged on Arrival',
    debitNote: 'DN-GFS-0901',
    authorizedBy: 'Chenda Lim',
    status: 'CREDIT_NOTE_RECEIVED',
    note: '5 bags crushed in delivery truck. Supplier credit note issued and credited.',
    lines: [
      { id: 1, productName: 'Lays Potato Chips Classic', returnQty: 5, unitCost: 1.10, refundSubtotal: 5.50 },
    ],
    returnedQty: 5,
    refundAmount: 5.50,
  },
  {
    id: 2,
    code: 'RTV-2609-0002',
    date: '2026-09-04',
    refReceipt: 'REC-2609-0001',
    supplier: 'Farm Pure Dairy',
    reason: 'Near Expiry Date',
    debitNote: 'DN-FARM-0904',
    authorizedBy: 'Vireak Men',
    status: 'DISPATCHED',
    note: 'Dairy carton expiry date within 3 days. Awaiting vendor replacement / credit.',
    lines: [
      { id: 1, productName: 'Fresh Whole Milk 1L', returnQty: 10, unitCost: 1.80, refundSubtotal: 18.00 },
    ],
    returnedQty: 10,
    refundAmount: 18.00,
  },
]

export default function ReturnReceiptPOList() {
  const { lang } = useLanguage()
  const { addNotification } = useNotifications()
  const location = useLocation()

  // State
  const [returns, setReturns] = useState(() => {
    try {
      const saved = localStorage.getItem('bg_return_receipt_pos')
      return saved ? JSON.parse(saved) : INITIAL_RETURNS
    } catch {
      return INITIAL_RETURNS
    }
  })

  const [suppliers, setSuppliers] = useState([])
  const [products, setProducts] = useState([])

  // Search & Filter
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [reasonFilter, setReasonFilter] = useState('ALL')
  const [supplierFilter, setSupplierFilter] = useState('all')

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [viewingReturn, setViewingReturn] = useState(null)
  const [chooseColumnOpen, setChooseColumnOpen] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState(DEFAULT_VISIBLE)

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    refReceipt: 'REC-2609-0002',
    supplier: 'Global Food Supply',
    date: new Date().toISOString().slice(0, 10),
    reason: 'Damaged on Arrival',
    debitNote: '',
    authorizedBy: 'Warehouse Manager',
    note: '',
    lines: [
      { id: 1, productName: 'Lays Potato Chips Classic', returnQty: 5, unitCost: 1.10, refundSubtotal: 5.50 },
    ],
  })

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('bg_return_receipt_pos', JSON.stringify(returns))
  }, [returns])

  // Fetch live suppliers & products
  useEffect(() => {
    Promise.allSettled([adminSupplierAPI.getAll(), adminProductAPI.getAll()]).then(([sRes, pRes]) => {
      if (sRes.status === 'fulfilled' && sRes.value) {
        const list = sRes.value.data || sRes.value || []
        if (Array.isArray(list)) setSuppliers(list)
      }
      if (pRes.status === 'fulfilled' && pRes.value) {
        const list = pRes.value.data || pRes.value || []
        if (Array.isArray(list)) setProducts(list)
      }
    })
  }, [])

  // Auto-open if redirected from Receipt PO
  useEffect(() => {
    if (location.state?.autoOpenCreate) {
      const nextNum = returns.length + 1
      const code = `RTV-${new Date().toISOString().slice(2, 4)}${new Date().toISOString().slice(5, 7)}-${String(nextNum).padStart(4, '0')}`

      let prefillLines = [
        { id: 1, productName: 'Rejected Goods', returnQty: 5, unitCost: 1.0, refundSubtotal: 5.0 },
      ]

      if (location.state.items && location.state.items.length > 0) {
        prefillLines = location.state.items.map((it, idx) => {
          const qty = Number(it.rejectedQty || it.qty || 1)
          const cost = Number(it.unitCost || 1)
          return {
            id: idx + 1,
            productName: it.productName,
            returnQty: qty,
            unitCost: cost,
            refundSubtotal: Number((qty * cost).toFixed(2)),
          }
        })
      }

      setFormData({
        code,
        refReceipt: location.state.recRef || location.state.poRef || 'REC-2609-0001',
        supplier: location.state.supplier || suppliers[0]?.name || 'Global Food Supply',
        date: new Date().toISOString().slice(0, 10),
        reason: 'Damaged on Arrival',
        debitNote: `DN-${Date.now().toString().slice(-4)}`,
        authorizedBy: 'Warehouse Quality Manager',
        note: `Return initiated from receipt ${location.state.recRef || ''}`,
        lines: prefillLines,
      })
      setCreateModalOpen(true)
    }
  }, [location.state, suppliers, returns.length])

  // Filtered Returns
  const filteredReturns = useMemo(() => {
    return returns.filter((r) => {
      if (statusFilter !== 'ALL' && r.status !== statusFilter) return false
      if (reasonFilter !== 'ALL' && r.reason !== reasonFilter) return false
      if (supplierFilter !== 'all' && r.supplier !== supplierFilter) return false
      if (!searchText.trim()) return true
      const q = searchText.trim().toLowerCase()
      return (
        r.code.toLowerCase().includes(q) ||
        r.refReceipt.toLowerCase().includes(q) ||
        r.supplier.toLowerCase().includes(q) ||
        (r.debitNote || '').toLowerCase().includes(q) ||
        (r.note || '').toLowerCase().includes(q)
      )
    })
  }, [returns, statusFilter, reasonFilter, supplierFilter, searchText])

  // KPIs
  const kpi = useMemo(() => {
    const total = returns.length
    const creditReceived = returns.filter((r) => r.status === 'CREDIT_NOTE_RECEIVED' || r.status === 'SETTLED').length
    const dispatched = returns.filter((r) => r.status === 'DISPATCHED').length
    const totalRefund = returns.reduce((s, r) => s + Number(r.refundAmount || 0), 0)
    return { total, creditReceived, dispatched, totalRefund }
  }, [returns])

  // Open Create Modal
  const handleOpenCreate = () => {
    const nextNum = returns.length + 1
    const code = `RTV-${new Date().toISOString().slice(2, 4)}${new Date().toISOString().slice(5, 7)}-${String(nextNum).padStart(4, '0')}`
    setFormData({
      code,
      refReceipt: 'REC-2609-0002',
      supplier: suppliers[0]?.name || 'Global Food Supply',
      date: new Date().toISOString().slice(0, 10),
      reason: 'Damaged on Arrival',
      debitNote: `DN-${Date.now().toString().slice(-4)}`,
      authorizedBy: 'Warehouse Manager',
      note: '',
      lines: [
        { id: 1, productName: products[0]?.productName || 'Lays Potato Chips Classic', returnQty: 5, unitCost: 1.10, refundSubtotal: 5.50 },
      ],
    })
    setCreateModalOpen(true)
  }

  // Manage Form Lines
  const handleLineChange = (index, field, val) => {
    setFormData((prev) => {
      const nextLines = [...prev.lines]
      const current = { ...nextLines[index], [field]: val }
      if (field === 'returnQty' || field === 'unitCost') {
        const q = Number(current.returnQty) || 0
        const c = Number(current.unitCost) || 0
        current.refundSubtotal = Number((q * c).toFixed(2))
      }
      nextLines[index] = current
      return { ...prev, lines: nextLines }
    })
  }

  const addLine = () => {
    setFormData((prev) => ({
      ...prev,
      lines: [
        ...prev.lines,
        {
          id: Date.now(),
          productName: products[0]?.productName || '',
          returnQty: 5,
          unitCost: 1.0,
          refundSubtotal: 5.0,
        },
      ],
    }))
  }

  const removeLine = (idx) => {
    if (formData.lines.length <= 1) return
    setFormData((prev) => ({
      ...prev,
      lines: prev.lines.filter((_, i) => i !== idx),
    }))
  }

  // Save Return
  const handleSaveReturn = (e) => {
    e.preventDefault()
    const totalQty = formData.lines.reduce((s, l) => s + Number(l.returnQty || 0), 0)
    const refundAmount = formData.lines.reduce((s, l) => s + Number(l.refundSubtotal || 0), 0)

    const newReturn = {
      id: Date.now(),
      code: formData.code,
      date: formData.date,
      refReceipt: formData.refReceipt,
      supplier: formData.supplier,
      reason: formData.reason,
      debitNote: formData.debitNote,
      authorizedBy: formData.authorizedBy,
      status: 'DISPATCHED',
      note: formData.note,
      lines: formData.lines,
      returnedQty: totalQty,
      refundAmount,
    }

    setReturns((prev) => [newReturn, ...prev])
    setCreateModalOpen(false)
    addNotification?.(`Return Receipt PO ${newReturn.code} issued successfully!`, 'success')
  }

  // Status changes
  const handleUpdateStatus = (rtn, newStatus) => {
    setReturns((prev) =>
      prev.map((r) => (r.id === rtn.id ? { ...r, status: newStatus } : r))
    )
    addNotification?.(`Return ${rtn.code} status set to ${newStatus}`, 'success')
  }

  // Delete
  const handleDelete = (id, code) => {
    if (!window.confirm(`Delete return record ${code}?`)) return
    setReturns((prev) => prev.filter((r) => r.id !== id))
    addNotification?.(`Return ${code} removed`, 'success')
  }

  // Toggle Column
  const toggleColumn = (key) => {
    const def = ALL_COLUMNS.find((c) => c.key === key)
    if (def?.always) return
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  // Export to Excel
  const handleExportExcel = () => {
    if (filteredReturns.length === 0) {
      addNotification?.('No returns to export', 'warning')
      return
    }
    const headers = [
      'Return Code',
      'Return Date',
      'Ref Receipt / PO',
      'Supplier',
      'Reason',
      'Debit Note No',
      'Status',
      'Qty Returned',
      'Refund Amount ($)',
      'Authorized By',
    ]
    const data = filteredReturns.map((r) => [
      r.code,
      r.date,
      r.refReceipt,
      r.supplier,
      r.reason,
      r.debitNote || '',
      r.status,
      r.returnedQty,
      Number(r.refundAmount || 0).toFixed(2),
      r.authorizedBy || '',
    ])
    const totalVal = filteredReturns.reduce((s, r) => s + Number(r.refundAmount || 0), 0)
    exportStyledExcel({
      filename: `return-receipt-po-${new Date().toISOString().slice(0, 10)}.xlsx`,
      sheetName: 'Returns',
      title: "B'GROCERIES RETURN RECEIPT PO (RTV / DEBIT NOTES)",
      subtitle: `Filter: ${statusFilter} · Total Refund Value: $${totalVal.toFixed(2)}`,
      headers,
      data,
      summary: {
        'Total Return Documents': filteredReturns.length,
        'Total Refund Value': `$${totalVal.toFixed(2)}`,
      },
    })
    addNotification?.('Return receipt documents exported to Excel', 'success')
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8 space-y-6 text-slate-100 font-['Montserrat']">
      {/* 1. HEADER & BREADCRUMBS */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link to="/admin" className="hover:text-rose-400 transition">
              {lang === 'en' ? 'Dashboard' : 'ផ្ទាំងគ្រប់គ្រង'}
            </Link>
            <span>/</span>
            <Link to="/admin/purchase-management" className="hover:text-rose-400 transition">
              {lang === 'en' ? 'Purchase Management' : 'ការគ្រប់គ្រងការទិញ'}
            </Link>
            <span>/</span>
            <span className="text-rose-400 font-semibold">
              {lang === 'en' ? 'Return Receipt PO' : 'ការប្រគល់ទំនិញត្រឡប់ជូនអ្នកផ្គត់ផ្គង់'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 border border-rose-500/30 text-2xl shadow-lg shadow-rose-500/10">
              <img src={copyIcon} alt="" className="h-7 w-7 object-contain" />
            </span>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2 font-['Montserrat']">
                {lang === 'en' ? 'Return Receipt PO (RTV)' : 'ការប្រគល់ទំនិញត្រឡប់ជូនអ្នកផ្គត់ផ្គង់'}
                <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 text-xs font-bold text-rose-300 border border-rose-500/30">
                  Debit Notes
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'en'
                  ? 'Return rejected or damaged items back to suppliers with debit notes.'
                  : 'ប្រគល់ទំនិញខូច ឬមិនត្រូវតាមស្តង់ដារត្រឡប់ជូនអ្នកផ្គត់ផ្គង់វិញ។'}
              </p>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="flex items-center gap-2">
          <Link
            to="/admin/purchase-management"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:border-rose-400 hover:text-white transition active:scale-95"
          >
            <span>←</span>
            <span>{lang === 'en' ? 'Back to Hub' : 'ត្រឡប់ទៅមជ្ឈមណ្ឌល'}</span>
          </Link>
        </div>
      </div>

      {/* 2. KPI METRICS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {lang === 'en' ? 'Total Return Documents' : 'ប័ណ្ណបង្វិលសរុប'}
          </span>
          <p className="text-2xl font-black text-white mt-1">{kpi.total}</p>
          <span className="text-[10px] text-slate-500">Return to vendor (RTV)</span>
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 shadow-lg">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
            {lang === 'en' ? 'Dispatched / In Transit' : 'បានបញ្ជូនចេញ'}
          </span>
          <p className="text-2xl font-black text-amber-300 mt-1">{kpi.dispatched}</p>
          <span className="text-[10px] text-amber-400/80">Pending supplier debit confirmation</span>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 shadow-lg">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
            {lang === 'en' ? 'Credit Note Settled' : 'បានទូទាត់សំណង'}
          </span>
          <p className="text-2xl font-black text-emerald-300 mt-1">{kpi.creditReceived}</p>
          <span className="text-[10px] text-emerald-400/80">Credited to payable account</span>
        </div>

        <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-4 shadow-lg">
          <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">
            {lang === 'en' ? 'Total Return Value' : 'តម្លៃទំនិញបង្វិលសរុប'}
          </span>
          <p className="text-2xl font-black text-rose-300 mt-1">${kpi.totalRefund.toFixed(2)}</p>
          <span className="text-[10px] text-rose-400/80">Recovered expenditure</span>
        </div>
      </div>

      {/* 3. SEARCH & FILTERS SECTION */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <div className="h-4 w-1 rounded-full bg-rose-500" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-rose-400">
            {lang === 'en' ? 'Search Return Receipts' : 'ស្វែងរកប័ណ្ណបង្វិលទំនិញ'}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 items-end">
          {/* Search Textbox */}
          <div className="lg:col-span-4">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              {lang === 'en' ? 'Search' : 'ស្វែងរក'}
            </label>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder={lang === 'en' ? 'Return code, ref receipt, supplier...' : 'កូដបង្វិល, អ្នកផ្គត់ផ្គង់...'}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 py-2 px-3 text-xs text-white placeholder-slate-500 outline-none transition focus:border-rose-400"
            />
          </div>

          {/* Status Filter */}
          <div className="lg:col-span-3">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              {lang === 'en' ? 'Status' : 'ស្ថានភាព'}
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 py-2 px-3 text-xs text-white outline-none focus:border-rose-400"
            >
              <option value="ALL">{lang === 'en' ? 'All Statuses' : 'ស្ថានភាពទាំងអស់'}</option>
              <option value="DISPATCHED">{lang === 'en' ? 'Dispatched' : 'បានបញ្ជូនចេញ'}</option>
              <option value="CREDIT_NOTE_RECEIVED">{lang === 'en' ? 'Credit Note Received' : 'បានទទួលប័ណ្ណឥណទាន'}</option>
              <option value="SETTLED">{lang === 'en' ? 'Settled' : 'ទូទាត់រួច'}</option>
              <option value="DRAFT">{lang === 'en' ? 'Draft' : 'សេចក្តីព្រាង'}</option>
            </select>
          </div>

          {/* Reason Filter */}
          <div className="lg:col-span-3">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              {lang === 'en' ? 'Reason' : 'មូលហេតុ'}
            </label>
            <select
              value={reasonFilter}
              onChange={(e) => setReasonFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 py-2 px-3 text-xs text-white outline-none focus:border-rose-400"
            >
              <option value="ALL">{lang === 'en' ? 'All Reasons' : 'មូលហេតុទាំងអស់'}</option>
              <option value="Damaged on Arrival">{lang === 'en' ? 'Damaged on Arrival' : 'ខូចខាតពេលដឹកមកដល់'}</option>
              <option value="Near Expiry Date">{lang === 'en' ? 'Near Expiry Date' : 'ជិតផុតកំណត់'}</option>
              <option value="Defective Quality">{lang === 'en' ? 'Defective Quality' : 'គុណភាពមិនត្រឹមត្រូវ'}</option>
              <option value="Wrong Item">{lang === 'en' ? 'Wrong Item' : 'ច្រឡំមុខទំនិញ'}</option>
            </select>
          </div>

          {/* Supplier Filter */}
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              {lang === 'en' ? 'Supplier' : 'អ្នកផ្គត់ផ្គង់'}
            </label>
            <select
              value={supplierFilter}
              onChange={(e) => setSupplierFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 py-2 px-3 text-xs text-white outline-none focus:border-rose-400"
            >
              <option value="all">{lang === 'en' ? 'All' : 'ទាំងអស់'}</option>
              {suppliers.map((s) => (
                <option key={s.id || s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* 4. RETURNS TABLE SECTION */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-800/80">
          <div>
            <h2 className="text-base font-bold text-white">
              {lang === 'en' ? 'Returns to Vendor List' : 'បញ្ជីការប្រគល់ទំនិញត្រឡប់'}
            </h2>
            <p className="text-[11px] text-slate-400">
              {lang === 'en' ? `Showing ${filteredReturns.length} return documents` : `បង្ហាញ ${filteredReturns.length} ប័ណ្ណបង្វិល`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Choose Column */}
            <button
              type="button"
              onClick={() => setChooseColumnOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-1.5 text-xs font-bold text-slate-300 hover:border-rose-400 hover:text-white transition active:scale-95"
            >
              <span>⚙️</span>
              <span>{lang === 'en' ? 'Choose Column' : 'ជ្រើសរើសជួរឈរ'}</span>
            </button>

            {/* Export Excel */}
            <button
              type="button"
              onClick={handleExportExcel}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white transition active:scale-95 shadow-md"
            >
              <span>📊</span>
              <span>{lang === 'en' ? 'Excel' : 'Excel'}</span>
            </button>

            {/* Create Return Button */}
            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-1.5 text-xs font-bold text-white transition active:scale-95 shadow-md shadow-rose-600/25"
            >
              <span>+</span>
              <span>{lang === 'en' ? 'Create Return PO' : 'បង្កើតប័ណ្ណបង្វិល'}</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/90 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-800">
              <tr>
                {visibleColumns.includes('code') && <th className="py-3 px-3.5">Return Code</th>}
                {visibleColumns.includes('date') && <th className="py-3 px-3.5">Date</th>}
                {visibleColumns.includes('refReceipt') && <th className="py-3 px-3.5">Ref Receipt / PO</th>}
                {visibleColumns.includes('supplier') && <th className="py-3 px-3.5">Supplier</th>}
                {visibleColumns.includes('reason') && <th className="py-3 px-3.5">Reason</th>}
                {visibleColumns.includes('debitNote') && <th className="py-3 px-3.5">Debit Note</th>}
                {visibleColumns.includes('status') && <th className="py-3 px-3.5 text-center">Status</th>}
                {visibleColumns.includes('returnedQty') && <th className="py-3 px-3.5 text-center">Qty Returned</th>}
                {visibleColumns.includes('refundAmount') && <th className="py-3 px-3.5 text-right">Refund Value ($)</th>}
                {visibleColumns.includes('authorizedBy') && <th className="py-3 px-3.5">Authorized By</th>}
                {visibleColumns.includes('actions') && <th className="py-3 px-3.5 text-center">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
              {filteredReturns.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumns.length} className="py-12 text-center text-slate-500 space-y-2">
                    <div className="text-3xl">↩️</div>
                    <p className="font-semibold text-slate-300">
                      {lang === 'en' ? 'No return documents found' : 'មិនមានប័ណ្ណបង្វិលទំនិញឡើយ'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredReturns.map((rtn) => (
                  <tr key={rtn.id || rtn.code} className="hover:bg-slate-800/50 transition">
                    {visibleColumns.includes('code') && (
                      <td className="py-3 px-3.5 font-mono font-bold text-rose-400 whitespace-nowrap">
                        <span className="bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-lg">
                          {rtn.code}
                        </span>
                      </td>
                    )}
                    {visibleColumns.includes('date') && (
                      <td className="py-3 px-3.5 whitespace-nowrap text-slate-300">{rtn.date}</td>
                    )}
                    {visibleColumns.includes('refReceipt') && (
                      <td className="py-3 px-3.5 font-mono font-semibold text-cyan-400 whitespace-nowrap">{rtn.refReceipt}</td>
                    )}
                    {visibleColumns.includes('supplier') && (
                      <td className="py-3 px-3.5 font-bold text-white whitespace-nowrap">{rtn.supplier}</td>
                    )}
                    {visibleColumns.includes('reason') && (
                      <td className="py-3 px-3.5 text-slate-300 whitespace-nowrap">
                        <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px] font-medium">
                          {rtn.reason}
                        </span>
                      </td>
                    )}
                    {visibleColumns.includes('debitNote') && (
                      <td className="py-3 px-3.5 font-mono text-slate-400 whitespace-nowrap">{rtn.debitNote || '-'}</td>
                    )}
                    {visibleColumns.includes('status') && (
                      <td className="py-3 px-3.5 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            rtn.status === 'CREDIT_NOTE_RECEIVED' || rtn.status === 'SETTLED'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : rtn.status === 'DISPATCHED'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {rtn.status}
                        </span>
                      </td>
                    )}
                    {visibleColumns.includes('returnedQty') && (
                      <td className="py-3 px-3.5 text-center font-mono font-bold text-rose-400">{rtn.returnedQty}</td>
                    )}
                    {visibleColumns.includes('refundAmount') && (
                      <td className="py-3 px-3.5 text-right font-mono font-black text-white whitespace-nowrap">
                        ${Number(rtn.refundAmount || 0).toFixed(2)}
                      </td>
                    )}
                    {visibleColumns.includes('authorizedBy') && (
                      <td className="py-3 px-3.5 text-slate-400 whitespace-nowrap">{rtn.authorizedBy || '-'}</td>
                    )}
                    {visibleColumns.includes('actions') && (
                      <td className="py-3 px-3.5 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setViewingReturn(rtn)}
                            className="p-1 text-slate-400 hover:text-rose-400 transition"
                            title="View Return Details"
                          >
                            👁️
                          </button>

                          {rtn.status === 'DISPATCHED' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(rtn, 'CREDIT_NOTE_RECEIVED')}
                              className="px-2 py-0.5 rounded bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold hover:bg-emerald-600 hover:text-white transition"
                              title="Mark Credit Note Received"
                            >
                              Credit Received ✓
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDelete(rtn.id, rtn.code)}
                            className="p-1 text-slate-500 hover:text-rose-400 transition"
                            title="Delete"
                          >
                            🗑️
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
      </section>

      {/* 5. CREATE RETURN MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl border border-rose-500/30 bg-slate-900 shadow-2xl p-6 space-y-4 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20 border border-rose-500/30 text-xl">
                  ↩️
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {lang === 'en' ? 'Create Return to Vendor (Return PO)' : 'បង្កើតប័ណ្ណប្រគល់ទំនិញត្រឡប់'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {lang === 'en' ? 'Return damaged or non-compliant goods with debit note' : 'ប្រគល់ទំនិញខូចត្រឡប់ទៅអ្នកផ្គត់ផ្គង់'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="h-8 w-8 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveReturn} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Return Code
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={formData.code}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-2 px-3 text-xs font-mono font-bold text-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Reference Receipt PO *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.refReceipt}
                    onChange={(e) => setFormData({ ...formData, refReceipt: e.target.value })}
                    placeholder="e.g. REC-2609-0001"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-xs font-mono text-cyan-400 outline-none focus:border-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Supplier *
                  </label>
                  <select
                    required
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-xs text-white outline-none focus:border-rose-400"
                  >
                    <option value="">-- Select Supplier --</option>
                    {suppliers.map((s) => (
                      <option key={s.id || s.name} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                    <option value="Global Food Supply">Global Food Supply</option>
                    <option value="Farm Pure Dairy">Farm Pure Dairy</option>
                    <option value="Cambodia Beverage Co.">Cambodia Beverage Co.</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Reason for Return *
                  </label>
                  <select
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-xs text-white outline-none focus:border-rose-400"
                  >
                    <option value="Damaged on Arrival">Damaged on Arrival</option>
                    <option value="Near Expiry Date">Near Expiry Date</option>
                    <option value="Defective Quality">Defective Quality</option>
                    <option value="Wrong Item Delivered">Wrong Item Delivered</option>
                    <option value="Over-delivery">Over-delivery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Return Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-xs text-white outline-none focus:border-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Debit Note No
                  </label>
                  <input
                    type="text"
                    value={formData.debitNote}
                    onChange={(e) => setFormData({ ...formData, debitNote: e.target.value })}
                    placeholder="e.g. DN-2026-001"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-xs text-white outline-none focus:border-rose-400"
                  />
                </div>
              </div>

              {/* Items Return Table */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                    Returned Line Items
                  </span>
                  <button
                    type="button"
                    onClick={addLine}
                    className="text-xs font-bold text-rose-400 hover:text-rose-300"
                  >
                    + Add Item
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {formData.lines.map((line, idx) => (
                    <div key={line.id} className="grid grid-cols-12 gap-2 items-center bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                      <div className="col-span-5">
                        <select
                          value={line.productName}
                          onChange={(e) => handleLineChange(idx, 'productName', e.target.value)}
                          className="w-full rounded-lg border border-slate-700 bg-slate-900 py-1.5 px-2 text-xs text-white outline-none"
                        >
                          <option value="">-- Select Product --</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.productName || p.name}>
                              {p.productName || p.name}
                            </option>
                          ))}
                          <option value="Lays Potato Chips Classic">Lays Potato Chips Classic</option>
                          <option value="Fresh Whole Milk 1L">Fresh Whole Milk 1L</option>
                          <option value="Coca Cola 330ml Can">Coca Cola 330ml Can</option>
                        </select>
                      </div>

                      <div className="col-span-3">
                        <input
                          type="number"
                          min="1"
                          placeholder="Return Qty"
                          value={line.returnQty}
                          onChange={(e) => handleLineChange(idx, 'returnQty', e.target.value)}
                          className="w-full rounded-lg border border-slate-700 bg-slate-900 py-1.5 px-2 text-xs text-center text-white"
                        />
                      </div>

                      <div className="col-span-3 text-right font-mono font-bold text-rose-400 text-xs">
                        ${line.refundSubtotal?.toFixed(2)}
                      </div>

                      <div className="col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => removeLine(idx)}
                          className="text-slate-500 hover:text-rose-400 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2 font-bold text-xs border-t border-slate-800">
                  <span className="text-slate-400">Total Refund / Debit Value:</span>
                  <span className="text-rose-400 font-mono text-base">
                    ${formData.lines.reduce((s, l) => s + Number(l.refundSubtotal || 0), 0).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-rose-600 hover:bg-rose-500 px-5 py-2 text-xs font-bold text-white transition active:scale-95 shadow-md shadow-rose-600/20"
                >
                  Dispatch Return & Issue Debit Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. VIEW DETAILS MODAL */}
      {viewingReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-rose-400">{viewingReturn.code}</span>
                <h3 className="text-base font-bold text-white mt-0.5">Return to Vendor (RTV) Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingReturn(null)}
                className="h-8 w-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">Ref Receipt / PO:</span>
                <span className="font-mono font-semibold text-cyan-400">{viewingReturn.refReceipt}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Supplier:</span>
                <span className="font-semibold text-white">{viewingReturn.supplier}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Return Date:</span>
                <span className="font-semibold text-white">{viewingReturn.date}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Debit Note:</span>
                <span className="font-semibold text-white">{viewingReturn.debitNote || '-'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Reason:</span>
                <span className="font-bold text-amber-300">{viewingReturn.reason}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Status:</span>
                <span className="font-bold text-emerald-400">{viewingReturn.status}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-xs font-bold text-rose-300 uppercase tracking-wider block">Returned Items</span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {viewingReturn.lines?.map((line, i) => (
                  <div key={i} className="flex items-center justify-between text-xs bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                    <span className="text-white font-medium">{line.productName}</span>
                    <span className="text-slate-400">Qty: {line.returnQty}</span>
                    <span className="font-mono font-bold text-rose-400">${Number(line.refundSubtotal).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-2 font-bold text-xs border-t border-slate-800">
                <span className="text-slate-400">Total Debit Claim:</span>
                <span className="text-rose-400 font-mono text-base">${Number(viewingReturn.refundAmount).toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingReturn(null)}
                className="rounded-xl bg-rose-600 px-4 py-1.5 text-xs font-bold text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. CHOOSE COLUMN MODAL */}
      {chooseColumnOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Choose Column</h3>
              <button
                type="button"
                onClick={() => setChooseColumnOpen(false)}
                className="h-8 w-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto">
              {ALL_COLUMNS.map((col) => {
                const checked = visibleColumns.includes(col.key)
                return (
                  <label
                    key={col.key}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition cursor-pointer ${
                      checked ? 'border-rose-500/50 bg-rose-500/10 text-white' : 'border-slate-800 bg-slate-950/60 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={col.always}
                        onChange={() => toggleColumn(col.key)}
                        className="rounded border-slate-700 text-rose-600 accent-rose-500"
                      />
                      <span className="text-xs font-semibold">{lang === 'en' ? col.label.en : col.label.kh}</span>
                    </div>
                  </label>
                )
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setChooseColumnOpen(false)}
                className="rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
