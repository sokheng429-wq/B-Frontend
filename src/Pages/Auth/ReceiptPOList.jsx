import React, { useState, useEffect, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useNotifications } from '../../context/NotificationContext'
import { adminProductAPI, adminSupplierAPI } from '../../api/api'
import { exportStyledExcel } from '../../utils/excelExport'
import mailIcon from '../../assets/icon/3dicons-mail-dynamic-color.png'
import './ProductsHub.css'

const ALL_COLUMNS = [
  { key: 'code', label: { en: 'Receipt Code', kh: 'លេខកូដប័ណ្ណទទួល' }, always: true },
  { key: 'date', label: { en: 'Received Date', kh: 'កាលបរិច្ឆេទទទួល' }, always: true },
  { key: 'poRef', label: { en: 'PO Reference', kh: 'លេខយោង PO' }, always: true },
  { key: 'supplier', label: { en: 'Supplier', kh: 'អ្នកផ្គត់ផ្គង់' }, always: true },
  { key: 'waybill', label: { en: 'Delivery Note / Waybill', kh: 'ប័ណ្ណដឹកជញ្ជូន' } },
  { key: 'warehouse', label: { en: 'Warehouse Outlet', kh: 'ឃ្លាំងទទួល' } },
  { key: 'status', label: { en: 'Status', kh: 'ស្ថានភាព' }, always: true },
  { key: 'receivedQty', label: { en: 'Total Qty', kh: 'ចំនួនទទួល' }, always: true },
  { key: 'totalValue', label: { en: 'Received Value ($)', kh: 'តម្លៃសរុប ($)' }, always: true },
  { key: 'receivedBy', label: { en: 'Received By', kh: 'អ្នកទទួល' } },
  { key: 'actions', label: { en: 'Actions', kh: 'សកម្មភាព' }, always: true },
]

const DEFAULT_VISIBLE = [
  'code',
  'date',
  'poRef',
  'supplier',
  'waybill',
  'warehouse',
  'status',
  'receivedQty',
  'totalValue',
  'actions',
]

const INITIAL_RECEIPTS = [
  {
    id: 1,
    code: 'REC-2609-0001',
    date: '2026-09-02',
    poRef: 'PO-2609-0003',
    supplier: 'Farm Pure Dairy',
    waybill: 'DN-88910',
    warehouse: 'Main Store Warehouse',
    receivedBy: 'Vireak Men',
    status: 'VERIFIED',
    note: 'Temperature controlled arrival checked at 4°C. All cartons intact.',
    lines: [
      { id: 1, productName: 'Fresh Whole Milk 1L', orderedQty: 80, receivedQty: 80, rejectedQty: 0, acceptedQty: 80, unitCost: 1.80, total: 144.00 },
    ],
    receivedQty: 80,
    totalValue: 144.00,
  },
  {
    id: 2,
    code: 'REC-2609-0002',
    date: '2026-09-03',
    poRef: 'PO-2609-0002',
    supplier: 'Global Food Supply',
    waybill: 'WB-44201',
    warehouse: 'Central Cold Storage',
    receivedBy: 'Chenda Lim',
    status: 'PARTIAL',
    note: '5 bags damaged during truck transit, marked for return debit note.',
    lines: [
      { id: 1, productName: 'Lays Potato Chips Classic', orderedQty: 100, receivedQty: 100, rejectedQty: 5, acceptedQty: 95, unitCost: 1.10, total: 104.50 },
    ],
    receivedQty: 95,
    totalValue: 104.50,
  },
]

export default function ReceiptPOList() {
  const { lang } = useLanguage()
  const { addNotification } = useNotifications()
  const location = useLocation()
  const navigate = useNavigate()

  // State
  const [receipts, setReceipts] = useState(() => {
    try {
      const saved = localStorage.getItem('bg_receipt_pos')
      return saved ? JSON.parse(saved) : INITIAL_RECEIPTS
    } catch {
      return INITIAL_RECEIPTS
    }
  })

  const [suppliers, setSuppliers] = useState([])
  const [products, setProducts] = useState([])

  // Search & Filter
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [supplierFilter, setSupplierFilter] = useState('all')

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [viewingReceipt, setViewingReceipt] = useState(null)
  const [chooseColumnOpen, setChooseColumnOpen] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState(DEFAULT_VISIBLE)

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    poRef: 'PO-2609-0001',
    supplier: 'Cambodia Beverage Co.',
    date: new Date().toISOString().slice(0, 10),
    waybill: '',
    warehouse: 'Main Store Warehouse',
    receivedBy: 'Inspector Staff',
    note: '',
    lines: [
      { id: 1, productName: 'Coca Cola 330ml Can', orderedQty: 200, receivedQty: 200, rejectedQty: 0, acceptedQty: 200, unitCost: 0.45, total: 90.00 },
    ],
  })

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('bg_receipt_pos', JSON.stringify(receipts))
  }, [receipts])

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

  // Check if opened from Purchase Order "Receive Goods"
  useEffect(() => {
    if (location.state?.autoOpenCreate) {
      const nextNum = receipts.length + 1
      const code = `REC-${new Date().toISOString().slice(2, 4)}${new Date().toISOString().slice(5, 7)}-${String(nextNum).padStart(4, '0')}`

      let prefillLines = [
        { id: 1, productName: 'Coca Cola 330ml Can', orderedQty: 100, receivedQty: 100, rejectedQty: 0, acceptedQty: 100, unitCost: 0.45, total: 45.00 },
      ]

      if (location.state.items && location.state.items.length > 0) {
        prefillLines = location.state.items.map((it, idx) => {
          const qty = Number(it.qty) || 1
          const cost = Number(it.unitCost) || 1
          return {
            id: idx + 1,
            productName: it.productName,
            orderedQty: qty,
            receivedQty: qty,
            rejectedQty: 0,
            acceptedQty: qty,
            unitCost: cost,
            total: Number((qty * cost).toFixed(2)),
          }
        })
      }

      setFormData({
        code,
        poRef: location.state.poRef || 'PO-2609-0001',
        supplier: location.state.supplier || suppliers[0]?.name || 'Cambodia Beverage Co.',
        date: new Date().toISOString().slice(0, 10),
        waybill: `DN-${Date.now().toString().slice(-5)}`,
        warehouse: location.state.warehouse || 'Main Store Warehouse',
        receivedBy: 'Admin Receiving Officer',
        note: `Goods receipt for order ${location.state.poRef || ''}`,
        lines: prefillLines,
      })
      setCreateModalOpen(true)
    }
  }, [location.state, suppliers, receipts.length])

  // Filtered Receipts
  const filteredReceipts = useMemo(() => {
    return receipts.filter((r) => {
      if (statusFilter !== 'ALL' && r.status !== statusFilter) return false
      if (supplierFilter !== 'all' && r.supplier !== supplierFilter) return false
      if (!searchText.trim()) return true
      const q = searchText.trim().toLowerCase()
      return (
        r.code.toLowerCase().includes(q) ||
        r.poRef.toLowerCase().includes(q) ||
        r.supplier.toLowerCase().includes(q) ||
        (r.waybill || '').toLowerCase().includes(q) ||
        (r.receivedBy || '').toLowerCase().includes(q)
      )
    })
  }, [receipts, statusFilter, supplierFilter, searchText])

  // KPIs
  const kpi = useMemo(() => {
    const total = receipts.length
    const verified = receipts.filter((r) => r.status === 'VERIFIED').length
    const partial = receipts.filter((r) => r.status === 'PARTIAL').length
    const totalVal = receipts.reduce((s, r) => s + Number(r.totalValue || 0), 0)
    return { total, verified, partial, totalVal }
  }, [receipts])

  // Open Create Modal manually
  const handleOpenCreate = () => {
    const nextNum = receipts.length + 1
    const code = `REC-${new Date().toISOString().slice(2, 4)}${new Date().toISOString().slice(5, 7)}-${String(nextNum).padStart(4, '0')}`
    setFormData({
      code,
      poRef: 'PO-2609-0001',
      supplier: suppliers[0]?.name || 'Cambodia Beverage Co.',
      date: new Date().toISOString().slice(0, 10),
      waybill: `DN-${Date.now().toString().slice(-5)}`,
      warehouse: 'Main Store Warehouse',
      receivedBy: 'Receiving Staff',
      note: '',
      lines: [
        { id: 1, productName: products[0]?.productName || 'Coca Cola 330ml Can', orderedQty: 50, receivedQty: 50, rejectedQty: 0, acceptedQty: 50, unitCost: 0.45, total: 22.50 },
      ],
    })
    setCreateModalOpen(true)
  }

  // Manage Form lines
  const handleLineChange = (index, field, val) => {
    setFormData((prev) => {
      const nextLines = [...prev.lines]
      const current = { ...nextLines[index], [field]: val }
      if (field === 'receivedQty' || field === 'rejectedQty' || field === 'unitCost') {
        const rec = Number(current.receivedQty) || 0
        const rej = Number(current.rejectedQty) || 0
        const acc = Math.max(0, rec - rej)
        const cost = Number(current.unitCost) || 0
        current.acceptedQty = acc
        current.total = Number((acc * cost).toFixed(2))
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
          orderedQty: 20,
          receivedQty: 20,
          rejectedQty: 0,
          acceptedQty: 20,
          unitCost: 1.0,
          total: 20.0,
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

  // Save Receipt
  const handleSaveReceipt = (e) => {
    e.preventDefault()
    const totalQty = formData.lines.reduce((s, l) => s + Number(l.acceptedQty || 0), 0)
    const totalValue = formData.lines.reduce((s, l) => s + Number(l.total || 0), 0)
    const hasRejected = formData.lines.some((l) => Number(l.rejectedQty || 0) > 0)

    const newRec = {
      id: Date.now(),
      code: formData.code,
      date: formData.date,
      poRef: formData.poRef,
      supplier: formData.supplier,
      waybill: formData.waybill,
      warehouse: formData.warehouse,
      receivedBy: formData.receivedBy,
      status: hasRejected ? 'PARTIAL' : 'VERIFIED',
      note: formData.note,
      lines: formData.lines,
      receivedQty: totalQty,
      totalValue,
    }

    setReceipts((prev) => [newRec, ...prev])
    setCreateModalOpen(false)
    addNotification?.(`Goods Receipt ${newRec.code} recorded successfully!`, 'success')
  }

  // Action: Create Return from damaged goods
  const handleCreateReturn = (rec) => {
    const rejectedItems = rec.lines?.filter((l) => Number(l.rejectedQty || 0) > 0)
    addNotification?.(`Opening Return to Vendor for ${rec.code}...`, 'info')
    navigate('/admin/purchase-management/return-receipt-po', {
      state: {
        autoOpenCreate: true,
        recRef: rec.code,
        poRef: rec.poRef,
        supplier: rec.supplier,
        items: rejectedItems && rejectedItems.length > 0 ? rejectedItems : rec.lines,
      },
    })
  }

  // Delete
  const handleDelete = (id, code) => {
    if (!window.confirm(`Delete receipt note ${code}?`)) return
    setReceipts((prev) => prev.filter((r) => r.id !== id))
    addNotification?.(`Receipt ${code} removed`, 'success')
  }

  // Toggle Column
  const toggleColumn = (key) => {
    const def = ALL_COLUMNS.find((c) => c.key === key)
    if (def?.always) return
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  // Export Excel
  const handleExportExcel = () => {
    if (filteredReceipts.length === 0) {
      addNotification?.('No receipts to export', 'warning')
      return
    }
    const headers = [
      'Receipt Code',
      'Received Date',
      'PO Reference',
      'Supplier',
      'Delivery Note',
      'Warehouse',
      'Status',
      'Accepted Qty',
      'Total Value ($)',
      'Received By',
    ]
    const data = filteredReceipts.map((r) => [
      r.code,
      r.date,
      r.poRef,
      r.supplier,
      r.waybill || '',
      r.warehouse,
      r.status,
      r.receivedQty,
      Number(r.totalValue || 0).toFixed(2),
      r.receivedBy || '',
    ])
    const totalVal = filteredReceipts.reduce((s, r) => s + Number(r.totalValue || 0), 0)
    exportStyledExcel({
      filename: `goods-receipts-po-${new Date().toISOString().slice(0, 10)}.xlsx`,
      sheetName: 'Receipts',
      title: "B'GROCERIES GOODS RECEIPT PO (GRN REPORT)",
      subtitle: `Filter: ${statusFilter} · Total Value Received: $${totalVal.toFixed(2)}`,
      headers,
      data,
      summary: {
        'Total Receipts': filteredReceipts.length,
        'Total Received Value': `$${totalVal.toFixed(2)}`,
      },
    })
    addNotification?.('Goods receipts exported to Excel', 'success')
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8 space-y-6 text-slate-100 font-['Montserrat']">
      {/* 1. HEADER & BREADCRUMBS */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link to="/admin" className="hover:text-emerald-400 transition">
              {lang === 'en' ? 'Dashboard' : 'ផ្ទាំងគ្រប់គ្រង'}
            </Link>
            <span>/</span>
            <Link to="/admin/purchase-management" className="hover:text-emerald-400 transition">
              {lang === 'en' ? 'Purchase Management' : 'ការគ្រប់គ្រងការទិញ'}
            </Link>
            <span>/</span>
            <span className="text-emerald-400 font-semibold">
              {lang === 'en' ? 'Receipt PO' : 'ការទទួលទំនិញតាម PO'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-2xl shadow-lg shadow-emerald-500/10">
              <img src={mailIcon} alt="" className="h-7 w-7 object-contain" />
            </span>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2 font-['Montserrat']">
                {lang === 'en' ? 'Goods Receipt PO' : 'ការទទួលទំនិញតាម PO'}
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                  Warehouse Intake
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'en'
                  ? 'Inspect physical shipments, record received batches, and verify delivery notes against POs.'
                  : 'ពិនិត្យទំនិញជាក់ស្តែង កត់ត្រាចំនួនទទួល និងផ្ទៀងផ្ទាត់ប័ណ្ណដឹក។'}
              </p>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="flex items-center gap-2">
          <Link
            to="/admin/purchase-management"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:border-emerald-400 hover:text-white transition active:scale-95"
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
            {lang === 'en' ? 'Total Intake Receipts' : 'ប័ណ្ណទទួលសរុប'}
          </span>
          <p className="text-2xl font-black text-white mt-1">{kpi.total}</p>
          <span className="text-[10px] text-slate-500">Warehouse shipments</span>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 shadow-lg">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
            {lang === 'en' ? 'Verified Shipments' : 'បានផ្ទៀងផ្ទាត់ត្រឹមត្រូវ'}
          </span>
          <p className="text-2xl font-black text-emerald-300 mt-1">{kpi.verified}</p>
          <span className="text-[10px] text-emerald-400/80">100% matched with PO</span>
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 shadow-lg">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
            {lang === 'en' ? 'Partial / Discrepancy' : 'មិនគ្រប់ ឬខូចខាត'}
          </span>
          <p className="text-2xl font-black text-amber-300 mt-1">{kpi.partial}</p>
          <span className="text-[10px] text-amber-400/80">Items rejected for return</span>
        </div>

        <div className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-4 shadow-lg">
          <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
            {lang === 'en' ? 'Total Received Value' : 'តម្លៃទំនិញទទួលសរុប'}
          </span>
          <p className="text-2xl font-black text-blue-300 mt-1">${kpi.totalVal.toFixed(2)}</p>
          <span className="text-[10px] text-blue-400/80">Added to live stock</span>
        </div>
      </div>

      {/* 3. SEARCH & FILTERS SECTION */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <div className="h-4 w-1 rounded-full bg-emerald-500" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            {lang === 'en' ? 'Search Goods Receipts' : 'ស្វែងរកប័ណ្ណទទួលទំនិញ'}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-12 items-end">
          {/* Search Textbox */}
          <div className="lg:col-span-5">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              {lang === 'en' ? 'Search' : 'ស្វែងរក'}
            </label>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder={lang === 'en' ? 'Receipt code, PO ref, supplier, waybill...' : 'កូដទទួល, កូដ PO...'}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 py-2 px-3 text-xs text-white placeholder-slate-500 outline-none transition focus:border-emerald-400"
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
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 py-2 px-3 text-xs text-white outline-none focus:border-emerald-400"
            >
              <option value="ALL">{lang === 'en' ? 'All Statuses' : 'ស្ថានភាពទាំងអស់'}</option>
              <option value="VERIFIED">{lang === 'en' ? 'Verified / Intact' : 'ត្រឹមត្រូវពេញលេញ'}</option>
              <option value="PARTIAL">{lang === 'en' ? 'Partial / Rejected Items' : 'មានទំនិញខូច / មិនគ្រប់'}</option>
              <option value="RECEIVED">{lang === 'en' ? 'Received' : 'បានទទួល'}</option>
            </select>
          </div>

          {/* Supplier Filter */}
          <div className="lg:col-span-4">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              {lang === 'en' ? 'Supplier' : 'អ្នកផ្គត់ផ្គង់'}
            </label>
            <select
              value={supplierFilter}
              onChange={(e) => setSupplierFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 py-2 px-3 text-xs text-white outline-none focus:border-emerald-400"
            >
              <option value="all">{lang === 'en' ? 'All Suppliers' : 'អ្នកផ្គត់ផ្គង់ទាំងអស់'}</option>
              {suppliers.map((s) => (
                <option key={s.id || s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* 4. RECEIPTS TABLE SECTION */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-800/80">
          <div>
            <h2 className="text-base font-bold text-white">
              {lang === 'en' ? 'Goods Receipt Notes List' : 'បញ្ជីប័ណ្ណទទួលទំនិញ (GRN)'}
            </h2>
            <p className="text-[11px] text-slate-400">
              {lang === 'en' ? `Showing ${filteredReceipts.length} receipt documents` : `បង្ហាញ ${filteredReceipts.length} ប័ណ្ណទទួល`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Choose Column */}
            <button
              type="button"
              onClick={() => setChooseColumnOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-1.5 text-xs font-bold text-slate-300 hover:border-emerald-400 hover:text-white transition active:scale-95"
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

            {/* New Receipt Button */}
            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-1.5 text-xs font-bold text-white transition active:scale-95 shadow-md shadow-emerald-600/25"
            >
              <span>+</span>
              <span>{lang === 'en' ? 'Receipt PO' : 'ទទួលទំនិញថ្មី'}</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/90 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-800">
              <tr>
                {visibleColumns.includes('code') && <th className="py-3 px-3.5">Receipt Code</th>}
                {visibleColumns.includes('date') && <th className="py-3 px-3.5">Received Date</th>}
                {visibleColumns.includes('poRef') && <th className="py-3 px-3.5">PO Ref</th>}
                {visibleColumns.includes('supplier') && <th className="py-3 px-3.5">Supplier</th>}
                {visibleColumns.includes('waybill') && <th className="py-3 px-3.5">Waybill / Note</th>}
                {visibleColumns.includes('warehouse') && <th className="py-3 px-3.5">Warehouse</th>}
                {visibleColumns.includes('status') && <th className="py-3 px-3.5 text-center">Status</th>}
                {visibleColumns.includes('receivedQty') && <th className="py-3 px-3.5 text-center">Qty Accepted</th>}
                {visibleColumns.includes('totalValue') && <th className="py-3 px-3.5 text-right">Received Value ($)</th>}
                {visibleColumns.includes('receivedBy') && <th className="py-3 px-3.5">Received By</th>}
                {visibleColumns.includes('actions') && <th className="py-3 px-3.5 text-center">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
              {filteredReceipts.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumns.length} className="py-12 text-center text-slate-500 space-y-2">
                    <div className="text-3xl">📬</div>
                    <p className="font-semibold text-slate-300">
                      {lang === 'en' ? 'No goods receipt notes found' : 'មិនមានប័ណ្ណទទួលទំនិញឡើយ'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredReceipts.map((rec) => (
                  <tr key={rec.id || rec.code} className="hover:bg-slate-800/50 transition">
                    {visibleColumns.includes('code') && (
                      <td className="py-3 px-3.5 font-mono font-bold text-emerald-400 whitespace-nowrap">
                        <span className="bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
                          {rec.code}
                        </span>
                      </td>
                    )}
                    {visibleColumns.includes('date') && (
                      <td className="py-3 px-3.5 whitespace-nowrap text-slate-300">{rec.date}</td>
                    )}
                    {visibleColumns.includes('poRef') && (
                      <td className="py-3 px-3.5 font-mono font-semibold text-cyan-400 whitespace-nowrap">{rec.poRef}</td>
                    )}
                    {visibleColumns.includes('supplier') && (
                      <td className="py-3 px-3.5 font-bold text-white whitespace-nowrap">{rec.supplier}</td>
                    )}
                    {visibleColumns.includes('waybill') && (
                      <td className="py-3 px-3.5 text-slate-400 whitespace-nowrap">{rec.waybill || '-'}</td>
                    )}
                    {visibleColumns.includes('warehouse') && (
                      <td className="py-3 px-3.5 text-slate-300 whitespace-nowrap">{rec.warehouse}</td>
                    )}
                    {visibleColumns.includes('status') && (
                      <td className="py-3 px-3.5 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            rec.status === 'VERIFIED'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : rec.status === 'PARTIAL'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          {rec.status}
                        </span>
                      </td>
                    )}
                    {visibleColumns.includes('receivedQty') && (
                      <td className="py-3 px-3.5 text-center font-mono font-bold text-emerald-400">{rec.receivedQty}</td>
                    )}
                    {visibleColumns.includes('totalValue') && (
                      <td className="py-3 px-3.5 text-right font-mono font-black text-white whitespace-nowrap">
                        ${Number(rec.totalValue || 0).toFixed(2)}
                      </td>
                    )}
                    {visibleColumns.includes('receivedBy') && (
                      <td className="py-3 px-3.5 text-slate-400 whitespace-nowrap">{rec.receivedBy || '-'}</td>
                    )}
                    {visibleColumns.includes('actions') && (
                      <td className="py-3 px-3.5 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setViewingReceipt(rec)}
                            className="p-1 text-slate-400 hover:text-emerald-400 transition"
                            title="View Details"
                          >
                            👁️
                          </button>

                          {/* Quick Return shortcut if any items rejected/partial */}
                          <button
                            type="button"
                            onClick={() => handleCreateReturn(rec)}
                            className="px-2 py-0.5 rounded bg-rose-600/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold hover:bg-rose-600 hover:text-white transition"
                            title="Create Return to Vendor"
                          >
                            Return ↩
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(rec.id, rec.code)}
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

      {/* 5. CREATE RECEIPT PO MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl border border-emerald-500/30 bg-slate-900 shadow-2xl p-6 space-y-4 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-xl">
                  📬
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {lang === 'en' ? 'Record Goods Receipt (Receipt PO)' : 'កត់ត្រាការទទួលទំនិញតាម PO'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {lang === 'en' ? 'Verify delivered batches and update stock counts' : 'ផ្ទៀងផ្ទាត់ទំនិញ និងកត់ត្រាចូលស្តុក'}
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

            <form onSubmit={handleSaveReceipt} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Receipt Code
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={formData.code}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-2 px-3 text-xs font-mono font-bold text-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    PO Reference Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.poRef}
                    onChange={(e) => setFormData({ ...formData, poRef: e.target.value })}
                    placeholder="e.g. PO-2609-0001"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-xs font-mono text-cyan-400 outline-none focus:border-emerald-400"
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
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-xs text-white outline-none focus:border-emerald-400"
                  >
                    <option value="">-- Select Supplier --</option>
                    {suppliers.map((s) => (
                      <option key={s.id || s.name} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                    <option value="Cambodia Beverage Co.">Cambodia Beverage Co.</option>
                    <option value="Global Food Supply">Global Food Supply</option>
                    <option value="Farm Pure Dairy">Farm Pure Dairy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Delivery Note / Waybill No
                  </label>
                  <input
                    type="text"
                    value={formData.waybill}
                    onChange={(e) => setFormData({ ...formData, waybill: e.target.value })}
                    placeholder="e.g. DN-99123"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Received Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Warehouse Destination
                  </label>
                  <select
                    value={formData.warehouse}
                    onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-xs text-white outline-none focus:border-emerald-400"
                  >
                    <option value="Main Store Warehouse">Main Store Warehouse</option>
                    <option value="Central Cold Storage">Central Cold Storage</option>
                    <option value="Floor 2 Display Depo">Floor 2 Display Depo</option>
                  </select>
                </div>
              </div>

              {/* Items Inspection Table */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                    Received Products & Inspection
                  </span>
                  <button
                    type="button"
                    onClick={addLine}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300"
                  >
                    + Add Product
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {formData.lines.map((line, idx) => (
                    <div key={line.id} className="grid grid-cols-12 gap-2 items-center bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                      <div className="col-span-4">
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
                          <option value="Coca Cola 330ml Can">Coca Cola 330ml Can</option>
                          <option value="Lays Potato Chips Classic">Lays Potato Chips Classic</option>
                          <option value="Fresh Whole Milk 1L">Fresh Whole Milk 1L</option>
                          <option value="Jasmine Fragrant Rice 5kg">Jasmine Fragrant Rice 5kg</option>
                        </select>
                      </div>

                      <div className="col-span-2">
                        <label className="block text-[9px] text-slate-500 uppercase">Received</label>
                        <input
                          type="number"
                          min="0"
                          value={line.receivedQty}
                          onChange={(e) => handleLineChange(idx, 'receivedQty', e.target.value)}
                          className="w-full rounded-lg border border-slate-700 bg-slate-900 py-1 px-1.5 text-xs text-center text-white"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-[9px] text-rose-400 uppercase">Damaged/Rej</label>
                        <input
                          type="number"
                          min="0"
                          value={line.rejectedQty}
                          onChange={(e) => handleLineChange(idx, 'rejectedQty', e.target.value)}
                          className="w-full rounded-lg border border-rose-800/80 bg-slate-900 py-1 px-1.5 text-xs text-center text-rose-300"
                        />
                      </div>

                      <div className="col-span-1 text-center">
                        <label className="block text-[9px] text-emerald-400 uppercase">Accepted</label>
                        <span className="font-mono font-bold text-xs text-emerald-400">{line.acceptedQty}</span>
                      </div>

                      <div className="col-span-2 text-right font-mono font-bold text-white text-xs">
                        ${line.total?.toFixed(2)}
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
                  <span className="text-slate-400">Total Verified Intake Value:</span>
                  <span className="text-emerald-400 font-mono text-base">
                    ${formData.lines.reduce((s, l) => s + Number(l.total || 0), 0).toFixed(2)}
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
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2 text-xs font-bold text-white transition active:scale-95 shadow-md shadow-emerald-600/20"
                >
                  Post Goods Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. VIEW DETAILS MODAL */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400">{viewingReceipt.code}</span>
                <h3 className="text-base font-bold text-white mt-0.5">Goods Receipt Note (GRN)</h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingReceipt(null)}
                className="h-8 w-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">PO Reference:</span>
                <span className="font-mono font-semibold text-cyan-400">{viewingReceipt.poRef}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Supplier:</span>
                <span className="font-semibold text-white">{viewingReceipt.supplier}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Received Date:</span>
                <span className="font-semibold text-white">{viewingReceipt.date}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Delivery Note:</span>
                <span className="font-semibold text-white">{viewingReceipt.waybill || '-'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Warehouse:</span>
                <span className="font-semibold text-white">{viewingReceipt.warehouse}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Status:</span>
                <span className="font-bold text-emerald-400">{viewingReceipt.status}</span>
              </div>
              {viewingReceipt.note && (
                <div className="col-span-2">
                  <span className="text-slate-400 block">Inspection Note:</span>
                  <span className="text-slate-300">{viewingReceipt.note}</span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">Intake Line Items</span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {viewingReceipt.lines?.map((line, i) => (
                  <div key={i} className="flex items-center justify-between text-xs bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                    <span className="text-white font-medium">{line.productName}</span>
                    <span className="text-slate-400">Accepted: {line.acceptedQty} pcs</span>
                    <span className="font-mono font-bold text-emerald-400">${Number(line.total).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-2 font-bold text-xs border-t border-slate-800">
                <span className="text-slate-400">Total Value:</span>
                <span className="text-emerald-400 font-mono text-base">${Number(viewingReceipt.totalValue).toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingReceipt(null)}
                className="rounded-xl bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white"
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
                      checked ? 'border-emerald-500/50 bg-emerald-500/10 text-white' : 'border-slate-800 bg-slate-950/60 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={col.always}
                        onChange={() => toggleColumn(col.key)}
                        className="rounded border-slate-700 text-emerald-600 accent-emerald-500"
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
                className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white"
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
