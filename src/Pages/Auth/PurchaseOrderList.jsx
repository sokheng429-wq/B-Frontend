import React, { useState, useEffect, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useNotifications } from '../../context/NotificationContext'
import { adminProductAPI, adminSupplierAPI } from '../../api/api'
import { exportStyledExcel } from '../../utils/excelExport'
import bagIcon from '../../assets/icon/3dicons-bag-dynamic-color.png'
import './ProductsHub.css'

const ALL_COLUMNS = [
  { key: 'code', label: { en: 'PO Code', kh: 'លេខកូដ PO' }, always: true },
  { key: 'orderDate', label: { en: 'Order Date', kh: 'កាលបរិច្ឆេទបញ្ជាទិញ' }, always: true },
  { key: 'deliveryDate', label: { en: 'Expected Delivery', kh: 'កាលបរិច្ឆេទដឹក' }, always: true },
  { key: 'supplier', label: { en: 'Supplier', kh: 'អ្នកផ្គត់ផ្គង់' }, always: true },
  { key: 'warehouse', label: { en: 'Warehouse Outlet', kh: 'ឃ្លាំង / សាខា' } },
  { key: 'paymentTerm', label: { en: 'Payment Term', kh: 'លក្ខខណ្ឌទូទាត់' } },
  { key: 'status', label: { en: 'Status', kh: 'ស្ថានភាព' }, always: true },
  { key: 'itemsCount', label: { en: 'Items', kh: 'ចំនួនមុខ' } },
  { key: 'grandTotal', label: { en: 'Grand Total ($)', kh: 'សរុប ($)' }, always: true },
  { key: 'buyer', label: { en: 'Buyer / Officer', kh: 'អ្នកបញ្ជាទិញ' } },
  { key: 'actions', label: { en: 'Actions', kh: 'សកម្មភាព' }, always: true },
]

const DEFAULT_VISIBLE = [
  'code',
  'orderDate',
  'deliveryDate',
  'supplier',
  'warehouse',
  'status',
  'itemsCount',
  'grandTotal',
  'actions',
]

const INITIAL_POS = [
  {
    id: 1,
    code: 'PO-2609-0001',
    orderDate: '2026-09-01',
    deliveryDate: '2026-09-05',
    supplier: 'Cambodia Beverage Co.',
    supplierContact: '012 889 900',
    warehouse: 'Main Store Warehouse',
    paymentTerm: 'Net 30 Days',
    buyer: 'Vanna Touch',
    status: 'ISSUED',
    note: 'Urgent weekend stock delivery',
    lines: [
      { id: 1, productName: 'Coca Cola 330ml Can', qty: 200, unitCost: 0.45, discount: 0, lineTotal: 90.00 },
    ],
    subtotal: 90.00,
    taxPercent: 0,
    taxAmount: 0,
    grandTotal: 90.00,
  },
  {
    id: 2,
    code: 'PO-2609-0002',
    orderDate: '2026-09-02',
    deliveryDate: '2026-09-07',
    supplier: 'Global Food Supply',
    supplierContact: '011 223 344',
    warehouse: 'Central Cold Storage',
    paymentTerm: 'Cash on Delivery (COD)',
    buyer: 'Admin Purchasing',
    status: 'PARTIALLY_RECEIVED',
    note: 'Delivery slot 8:00 AM - 11:00 AM',
    lines: [
      { id: 1, productName: 'Lays Potato Chips Classic', qty: 100, unitCost: 1.10, discount: 5, lineTotal: 105.00 },
    ],
    subtotal: 105.00,
    taxPercent: 0,
    taxAmount: 0,
    grandTotal: 105.00,
  },
  {
    id: 3,
    code: 'PO-2609-0003',
    orderDate: '2026-08-28',
    deliveryDate: '2026-09-02',
    supplier: 'Farm Pure Dairy',
    supplierContact: '077 445 566',
    warehouse: 'Main Store Warehouse',
    paymentTerm: 'Net 15 Days',
    buyer: 'Vanna Touch',
    status: 'COMPLETED',
    note: 'Batch 2609 inspected and cleared',
    lines: [
      { id: 1, productName: 'Fresh Whole Milk 1L', qty: 80, unitCost: 1.80, discount: 0, lineTotal: 144.00 },
    ],
    subtotal: 144.00,
    taxPercent: 0,
    taxAmount: 0,
    grandTotal: 144.00,
  },
]

export default function PurchaseOrderList() {
  const { lang } = useLanguage()
  const { addNotification } = useNotifications()
  const location = useLocation()
  const navigate = useNavigate()

  // State: PO Records
  const [purchaseOrders, setPurchaseOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('bg_purchase_orders')
      return saved ? JSON.parse(saved) : INITIAL_POS
    } catch {
      return INITIAL_POS
    }
  })

  // Catalogs
  const [suppliers, setSuppliers] = useState([])
  const [products, setProducts] = useState([])

  // Search & Filters
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [supplierFilter, setSupplierFilter] = useState('all')

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [viewingPO, setViewingPO] = useState(null)
  const [chooseColumnOpen, setChooseColumnOpen] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState(DEFAULT_VISIBLE)

  // New PO Form
  const [formData, setFormData] = useState({
    code: '',
    supplier: '',
    orderDate: new Date().toISOString().slice(0, 10),
    deliveryDate: new Date(Date.now() + 4 * 86400000).toISOString().slice(0, 10),
    warehouse: 'Main Store Warehouse',
    paymentTerm: 'Net 30 Days',
    buyer: 'Admin User',
    note: '',
    lines: [
      { id: 1, productName: '', qty: 50, unitCost: 1.0, discount: 0, lineTotal: 50.0 },
    ],
  })

  // Save POs to localStorage
  useEffect(() => {
    localStorage.setItem('bg_purchase_orders', JSON.stringify(purchaseOrders))
  }, [purchaseOrders])

  // Load live suppliers & products
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

  // Auto-open modal if navigated from Inventory Order or Requisition
  useEffect(() => {
    if (location.state?.autoOpenCreate) {
      const nextNum = purchaseOrders.length + 1
      const code = `PO-${new Date().toISOString().slice(2, 4)}${new Date().toISOString().slice(5, 7)}-${String(nextNum).padStart(4, '0')}`

      let prefillLines = [
        { id: 1, productName: 'Coca Cola 330ml Can', qty: 50, unitCost: 0.45, discount: 0, lineTotal: 22.50 },
      ]
      let prefillSupplier = suppliers[0]?.name || 'Cambodia Beverage Co.'
      let note = ''

      if (location.state.prefillItem) {
        const itm = location.state.prefillItem
        prefillLines = [
          {
            id: 1,
            productName: itm.name,
            qty: itm.suggestedQty || 50,
            unitCost: itm.unitCost || 1.0,
            discount: 0,
            lineTotal: (itm.suggestedQty || 50) * (itm.unitCost || 1.0),
          },
        ]
        prefillSupplier = itm.supplier || prefillSupplier
        note = `Auto-drafted from low stock alert for ${itm.name}`
      } else if (location.state.items) {
        prefillLines = location.state.items.map((it, idx) => ({
          id: idx + 1,
          productName: it.productName,
          qty: it.qty,
          unitCost: it.estCost || 1.0,
          discount: 0,
          lineTotal: (it.qty || 1) * (it.estCost || 1.0),
        }))
        note = `Converted from requisition ${location.state.requisitionCode || ''}`
      }

      setFormData({
        code,
        supplier: prefillSupplier,
        orderDate: new Date().toISOString().slice(0, 10),
        deliveryDate: new Date(Date.now() + 4 * 86400000).toISOString().slice(0, 10),
        warehouse: 'Main Store Warehouse',
        paymentTerm: 'Net 30 Days',
        buyer: 'Admin Purchasing',
        note,
        lines: prefillLines,
      })
      setCreateModalOpen(true)
    }
  }, [location.state, suppliers, purchaseOrders.length])

  // Filtered POs
  const filteredPOs = useMemo(() => {
    return purchaseOrders.filter((po) => {
      if (statusFilter !== 'ALL' && po.status !== statusFilter) return false
      if (supplierFilter !== 'all' && po.supplier !== supplierFilter) return false
      if (!searchText.trim()) return true
      const q = searchText.trim().toLowerCase()
      return (
        po.code.toLowerCase().includes(q) ||
        po.supplier.toLowerCase().includes(q) ||
        po.warehouse.toLowerCase().includes(q) ||
        (po.buyer || '').toLowerCase().includes(q) ||
        (po.note || '').toLowerCase().includes(q)
      )
    })
  }, [purchaseOrders, statusFilter, supplierFilter, searchText])

  // KPIs
  const kpi = useMemo(() => {
    const total = purchaseOrders.length
    const open = purchaseOrders.filter((p) => p.status === 'ISSUED' || p.status === 'DRAFT').length
    const completed = purchaseOrders.filter((p) => p.status === 'COMPLETED').length
    const totalVal = purchaseOrders.reduce((sum, p) => sum + Number(p.grandTotal || 0), 0)
    return { total, open, completed, totalVal }
  }, [purchaseOrders])

  // Open Create Modal manually
  const handleOpenCreateModal = () => {
    const nextNum = purchaseOrders.length + 1
    const code = `PO-${new Date().toISOString().slice(2, 4)}${new Date().toISOString().slice(5, 7)}-${String(nextNum).padStart(4, '0')}`
    setFormData({
      code,
      supplier: suppliers[0]?.name || 'Cambodia Beverage Co.',
      orderDate: new Date().toISOString().slice(0, 10),
      deliveryDate: new Date(Date.now() + 4 * 86400000).toISOString().slice(0, 10),
      warehouse: 'Main Store Warehouse',
      paymentTerm: 'Net 30 Days',
      buyer: 'Admin User',
      note: '',
      lines: [
        { id: 1, productName: products[0]?.productName || 'Coca Cola 330ml Can', qty: 50, unitCost: 0.45, discount: 0, lineTotal: 22.50 },
      ],
    })
    setCreateModalOpen(true)
  }

  // Manage form lines
  const handleLineChange = (index, field, val) => {
    setFormData((prev) => {
      const nextLines = [...prev.lines]
      const current = { ...nextLines[index], [field]: val }
      if (field === 'qty' || field === 'unitCost' || field === 'discount') {
        const q = Number(current.qty) || 0
        const c = Number(current.unitCost) || 0
        const d = Number(current.discount) || 0
        current.lineTotal = Number(Math.max(0, q * c - d).toFixed(2))
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
          qty: 20,
          unitCost: 1.0,
          discount: 0,
          lineTotal: 20.0,
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

  // Save PO
  const handleSavePO = (e) => {
    e.preventDefault()
    const subtotal = formData.lines.reduce((s, l) => s + Number(l.lineTotal || 0), 0)
    const grandTotal = subtotal

    const newPO = {
      id: Date.now(),
      code: formData.code,
      orderDate: formData.orderDate,
      deliveryDate: formData.deliveryDate,
      supplier: formData.supplier || 'Direct Supplier',
      warehouse: formData.warehouse,
      paymentTerm: formData.paymentTerm,
      buyer: formData.buyer,
      status: 'ISSUED',
      note: formData.note,
      lines: formData.lines,
      subtotal,
      taxPercent: 0,
      taxAmount: 0,
      grandTotal,
    }

    setPurchaseOrders((prev) => [newPO, ...prev])
    setCreateModalOpen(false)
    addNotification?.(`Purchase Order ${newPO.code} issued successfully!`, 'success')
  }

  // Quick Action: Receive Goods (Navigate to Receipt PO)
  const handleReceiveGoods = (po) => {
    addNotification?.(`Opening Goods Receipt for ${po.code}...`, 'info')
    navigate('/admin/purchase-management/receipt-po', {
      state: {
        autoOpenCreate: true,
        poRef: po.code,
        supplier: po.supplier,
        warehouse: po.warehouse,
        items: po.lines,
      },
    })
  }

  // Status Change
  const handleUpdateStatus = (po, newStatus) => {
    setPurchaseOrders((prev) =>
      prev.map((p) => (p.id === po.id ? { ...p, status: newStatus } : p))
    )
    addNotification?.(`PO ${po.code} marked as ${newStatus}`, 'success')
  }

  // Delete
  const handleDeletePO = (id, code) => {
    if (!window.confirm(`Delete Purchase Order ${code}?`)) return
    setPurchaseOrders((prev) => prev.filter((p) => p.id !== id))
    addNotification?.(`PO ${code} deleted`, 'success')
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
    if (filteredPOs.length === 0) {
      addNotification?.('No POs to export', 'warning')
      return
    }
    const headers = [
      'PO Code',
      'Order Date',
      'Delivery Date',
      'Supplier',
      'Warehouse',
      'Payment Term',
      'Status',
      'Buyer',
      'Grand Total ($)',
    ]
    const data = filteredPOs.map((p) => [
      p.code,
      p.orderDate,
      p.deliveryDate,
      p.supplier,
      p.warehouse,
      p.paymentTerm,
      p.status,
      p.buyer || '',
      Number(p.grandTotal || 0).toFixed(2),
    ])
    const totalVal = filteredPOs.reduce((s, p) => s + Number(p.grandTotal || 0), 0)
    exportStyledExcel({
      filename: `purchase-orders-${new Date().toISOString().slice(0, 10)}.xlsx`,
      sheetName: 'Purchase Orders',
      title: "B'GROCERIES OFFICIAL PURCHASE ORDERS",
      subtitle: `Filter: ${statusFilter} · Total Value: $${totalVal.toFixed(2)}`,
      headers,
      data,
      summary: {
        'Total PO Count': filteredPOs.length,
        'Total Order Value': `$${totalVal.toFixed(2)}`,
      },
    })
    addNotification?.('Purchase orders exported to Excel', 'success')
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8 space-y-6 text-slate-100 font-['Montserrat']">
      {/* 1. HEADER & BREADCRUMBS */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link to="/admin" className="hover:text-cyan-400 transition">
              {lang === 'en' ? 'Dashboard' : 'ផ្ទាំងគ្រប់គ្រង'}
            </Link>
            <span>/</span>
            <Link to="/admin/purchase-management" className="hover:text-cyan-400 transition">
              {lang === 'en' ? 'Purchase Management' : 'ការគ្រប់គ្រងការទិញ'}
            </Link>
            <span>/</span>
            <span className="text-cyan-400 font-semibold">
              {lang === 'en' ? 'Purchase Orders' : 'ការបញ្ជាទិញទំនិញ (PO)'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-2xl shadow-lg shadow-cyan-500/10">
              <img src={bagIcon} alt="" className="h-7 w-7 object-contain" />
            </span>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2 font-['Montserrat']">
                {lang === 'en' ? 'Purchase Orders' : 'ការបញ្ជាទិញទំនិញ (PO)'}
                <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-xs font-bold text-cyan-300 border border-cyan-500/30">
                  Procurement
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'en'
                  ? 'Official purchase orders sent to vendors with quantities, pricing and delivery schedules.'
                  : 'លិខិតបញ្ជាទិញផ្លូវការផ្ញើជូនអ្នកផ្គត់ផ្គង់ ជាមួយតម្លៃ និងកាលបរិច្ឆេទដឹក។'}
              </p>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="flex items-center gap-2">
          <Link
            to="/admin/purchase-management"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:border-cyan-400 hover:text-white transition active:scale-95"
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
            {lang === 'en' ? 'Total Purchase Orders' : 'PO សរុប'}
          </span>
          <p className="text-2xl font-black text-white mt-1">{kpi.total}</p>
          <span className="text-[10px] text-slate-500">All vendor orders</span>
        </div>

        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-4 shadow-lg">
          <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
            {lang === 'en' ? 'Open Orders' : 'PO កំពុងដំណើរការ'}
          </span>
          <p className="text-2xl font-black text-cyan-300 mt-1">{kpi.open}</p>
          <span className="text-[10px] text-cyan-400/80">Awaiting vendor delivery</span>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 shadow-lg">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
            {lang === 'en' ? 'Total Order Value' : 'តម្លៃបញ្ជាទិញសរុប'}
          </span>
          <p className="text-2xl font-black text-emerald-300 mt-1">${kpi.totalVal.toFixed(2)}</p>
          <span className="text-[10px] text-emerald-400/80">Cumulative spend</span>
        </div>

        <div className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-4 shadow-lg">
          <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
            {lang === 'en' ? 'Completed & Received' : 'បានទទួលពេញលេញ'}
          </span>
          <p className="text-2xl font-black text-blue-300 mt-1">{kpi.completed}</p>
          <span className="text-[10px] text-blue-400/80">Fully verified in stock</span>
        </div>
      </div>

      {/* 3. SEARCH & FILTERS SECTION */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <div className="h-4 w-1 rounded-full bg-cyan-500" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            {lang === 'en' ? 'Search Purchase Orders' : 'ស្វែងរកការបញ្ជាទិញ'}
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
              placeholder={lang === 'en' ? 'PO code, supplier, warehouse, buyer...' : 'កូដ PO, អ្នកផ្គត់ផ្គង់...'}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 py-2 px-3 text-xs text-white placeholder-slate-500 outline-none transition focus:border-cyan-400"
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
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 py-2 px-3 text-xs text-white outline-none focus:border-cyan-400"
            >
              <option value="ALL">{lang === 'en' ? 'All Statuses' : 'ស្ថានភាពទាំងអស់'}</option>
              <option value="ISSUED">{lang === 'en' ? 'Issued / Sent to Vendor' : 'បានផ្ញើទៅអ្នកផ្គត់ផ្គង់'}</option>
              <option value="PARTIALLY_RECEIVED">{lang === 'en' ? 'Partially Received' : 'ទទួលមួយផ្នែក'}</option>
              <option value="COMPLETED">{lang === 'en' ? 'Completed' : 'រួចរាល់'}</option>
              <option value="DRAFT">{lang === 'en' ? 'Draft' : 'សេចក្តីព្រាង'}</option>
              <option value="CANCELLED">{lang === 'en' ? 'Cancelled' : 'បានលុបចោល'}</option>
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
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 py-2 px-3 text-xs text-white outline-none focus:border-cyan-400"
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

      {/* 4. PURCHASE ORDERS TABLE SECTION */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-800/80">
          <div>
            <h2 className="text-base font-bold text-white">
              {lang === 'en' ? 'Purchase Orders List' : 'បញ្ជីការបញ្ជាទិញទំនិញ'}
            </h2>
            <p className="text-[11px] text-slate-400">
              {lang === 'en' ? `Showing ${filteredPOs.length} purchase orders` : `បង្ហាញ ${filteredPOs.length} ការបញ្ជាទិញ`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Choose Column */}
            <button
              type="button"
              onClick={() => setChooseColumnOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-1.5 text-xs font-bold text-slate-300 hover:border-cyan-400 hover:text-white transition active:scale-95"
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

            {/* Create PO Button */}
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 px-4 py-1.5 text-xs font-bold text-white transition active:scale-95 shadow-md shadow-cyan-600/25"
            >
              <span>+</span>
              <span>{lang === 'en' ? 'Create PO' : 'បង្កើត PO ថ្មី'}</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/90 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-800">
              <tr>
                {visibleColumns.includes('code') && <th className="py-3 px-3.5">PO Code</th>}
                {visibleColumns.includes('orderDate') && <th className="py-3 px-3.5">Order Date</th>}
                {visibleColumns.includes('deliveryDate') && <th className="py-3 px-3.5">Expected Delivery</th>}
                {visibleColumns.includes('supplier') && <th className="py-3 px-3.5">Supplier</th>}
                {visibleColumns.includes('warehouse') && <th className="py-3 px-3.5">Warehouse</th>}
                {visibleColumns.includes('paymentTerm') && <th className="py-3 px-3.5">Payment Term</th>}
                {visibleColumns.includes('status') && <th className="py-3 px-3.5 text-center">Status</th>}
                {visibleColumns.includes('itemsCount') && <th className="py-3 px-3.5 text-center">Items</th>}
                {visibleColumns.includes('grandTotal') && <th className="py-3 px-3.5 text-right">Grand Total</th>}
                {visibleColumns.includes('buyer') && <th className="py-3 px-3.5">Buyer</th>}
                {visibleColumns.includes('actions') && <th className="py-3 px-3.5 text-center">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
              {filteredPOs.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumns.length} className="py-12 text-center text-slate-500 space-y-2">
                    <div className="text-3xl">🛒</div>
                    <p className="font-semibold text-slate-300">
                      {lang === 'en' ? 'No purchase orders found' : 'មិនមានការបញ្ជាទិញឡើយ'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredPOs.map((po) => (
                  <tr key={po.id || po.code} className="hover:bg-slate-800/50 transition">
                    {visibleColumns.includes('code') && (
                      <td className="py-3 px-3.5 font-mono font-bold text-cyan-400 whitespace-nowrap">
                        <span className="bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-lg">
                          {po.code}
                        </span>
                      </td>
                    )}
                    {visibleColumns.includes('orderDate') && (
                      <td className="py-3 px-3.5 whitespace-nowrap text-slate-300">{po.orderDate}</td>
                    )}
                    {visibleColumns.includes('deliveryDate') && (
                      <td className="py-3 px-3.5 whitespace-nowrap text-slate-400 font-medium">{po.deliveryDate}</td>
                    )}
                    {visibleColumns.includes('supplier') && (
                      <td className="py-3 px-3.5 font-bold text-white whitespace-nowrap">{po.supplier}</td>
                    )}
                    {visibleColumns.includes('warehouse') && (
                      <td className="py-3 px-3.5 text-slate-300 whitespace-nowrap">{po.warehouse}</td>
                    )}
                    {visibleColumns.includes('paymentTerm') && (
                      <td className="py-3 px-3.5 text-slate-400 whitespace-nowrap">{po.paymentTerm}</td>
                    )}
                    {visibleColumns.includes('status') && (
                      <td className="py-3 px-3.5 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            po.status === 'COMPLETED'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : po.status === 'PARTIALLY_RECEIVED'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : po.status === 'ISSUED'
                              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                              : po.status === 'CANCELLED'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {po.status}
                        </span>
                      </td>
                    )}
                    {visibleColumns.includes('itemsCount') && (
                      <td className="py-3 px-3.5 text-center font-mono">{po.lines?.length || 0}</td>
                    )}
                    {visibleColumns.includes('grandTotal') && (
                      <td className="py-3 px-3.5 text-right font-mono font-black text-emerald-400 whitespace-nowrap">
                        ${Number(po.grandTotal || 0).toFixed(2)}
                      </td>
                    )}
                    {visibleColumns.includes('buyer') && (
                      <td className="py-3 px-3.5 text-slate-400">{po.buyer || '-'}</td>
                    )}
                    {visibleColumns.includes('actions') && (
                      <td className="py-3 px-3.5 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setViewingPO(po)}
                            className="p-1 text-slate-400 hover:text-cyan-400 transition"
                            title="View PO Details"
                          >
                            👁️
                          </button>

                          {po.status !== 'COMPLETED' && po.status !== 'CANCELLED' && (
                            <button
                              type="button"
                              onClick={() => handleReceiveGoods(po)}
                              className="px-2 py-0.5 rounded bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold hover:bg-emerald-600 hover:text-white transition"
                              title="Receive goods into inventory"
                            >
                              Receive →
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeletePO(po.id, po.code)}
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

      {/* 5. CREATE PURCHASE ORDER MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl border border-cyan-500/30 bg-slate-900 shadow-2xl p-6 space-y-4 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-xl">
                  🛒
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {lang === 'en' ? 'New Purchase Order (PO)' : 'បង្កើតការបញ្ជាទិញទំនិញថ្មី (PO)'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {lang === 'en' ? 'Issue official order to supplier with delivery terms' : 'បញ្ជាទិញផ្លូវការទៅកាន់អ្នកផ្គត់ផ្គង់'}
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

            <form onSubmit={handleSavePO} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    PO Code
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={formData.code}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-2 px-3 text-xs font-mono font-bold text-cyan-400"
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
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-xs text-white outline-none focus:border-cyan-400"
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
                    Order Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.orderDate}
                    onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Expected Delivery Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.deliveryDate}
                    onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Warehouse / Outlet
                  </label>
                  <select
                    value={formData.warehouse}
                    onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-xs text-white outline-none focus:border-cyan-400"
                  >
                    <option value="Main Store Warehouse">Main Store Warehouse</option>
                    <option value="Central Cold Storage">Central Cold Storage</option>
                    <option value="Floor 2 Display Depo">Floor 2 Display Depo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Payment Term
                  </label>
                  <select
                    value={formData.paymentTerm}
                    onChange={(e) => setFormData({ ...formData, paymentTerm: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-xs text-white outline-none focus:border-cyan-400"
                  >
                    <option value="Net 30 Days">Net 30 Days</option>
                    <option value="Net 15 Days">Net 15 Days</option>
                    <option value="Cash on Delivery (COD)">Cash on Delivery (COD)</option>
                    <option value="Advance Payment">Advance Payment</option>
                  </select>
                </div>
              </div>

              {/* Items Line */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                    Order Items
                  </span>
                  <button
                    type="button"
                    onClick={addLine}
                    className="text-xs font-bold text-cyan-400 hover:text-cyan-300"
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
                          <option value="Coca Cola 330ml Can">Coca Cola 330ml Can</option>
                          <option value="Lays Potato Chips Classic">Lays Potato Chips Classic</option>
                          <option value="Fresh Whole Milk 1L">Fresh Whole Milk 1L</option>
                          <option value="Jasmine Fragrant Rice 5kg">Jasmine Fragrant Rice 5kg</option>
                        </select>
                      </div>

                      <div className="col-span-2">
                        <input
                          type="number"
                          min="1"
                          placeholder="Qty"
                          value={line.qty}
                          onChange={(e) => handleLineChange(idx, 'qty', e.target.value)}
                          className="w-full rounded-lg border border-slate-700 bg-slate-900 py-1.5 px-2 text-xs text-center text-white"
                        />
                      </div>

                      <div className="col-span-2">
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Cost ($)"
                          value={line.unitCost}
                          onChange={(e) => handleLineChange(idx, 'unitCost', e.target.value)}
                          className="w-full rounded-lg border border-slate-700 bg-slate-900 py-1.5 px-2 text-xs text-right text-white"
                        />
                      </div>

                      <div className="col-span-2 text-right font-mono font-bold text-emerald-400 text-xs">
                        ${line.lineTotal?.toFixed(2)}
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
                  <span className="text-slate-400">Grand Total:</span>
                  <span className="text-emerald-400 font-mono text-base">
                    ${formData.lines.reduce((s, l) => s + Number(l.lineTotal || 0), 0).toFixed(2)}
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
                  className="rounded-xl bg-cyan-600 hover:bg-cyan-500 px-5 py-2 text-xs font-bold text-white transition active:scale-95 shadow-md shadow-cyan-600/20"
                >
                  Issue Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. VIEW PO DETAILS MODAL */}
      {viewingPO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400">{viewingPO.code}</span>
                <h3 className="text-base font-bold text-white mt-0.5">Purchase Order Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingPO(null)}
                className="h-8 w-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">Supplier:</span>
                <span className="font-semibold text-white">{viewingPO.supplier}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Warehouse:</span>
                <span className="font-semibold text-white">{viewingPO.warehouse}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Order Date:</span>
                <span className="font-semibold text-white">{viewingPO.orderDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Expected Delivery:</span>
                <span className="font-semibold text-white">{viewingPO.deliveryDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Payment Term:</span>
                <span className="font-semibold text-white">{viewingPO.paymentTerm}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Status:</span>
                <span className="font-bold text-cyan-400">{viewingPO.status}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block">Ordered Lines</span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {viewingPO.lines?.map((line, i) => (
                  <div key={i} className="flex items-center justify-between text-xs bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                    <span className="text-white font-medium">{line.productName}</span>
                    <span className="text-slate-400">{line.qty} pcs @ ${Number(line.unitCost).toFixed(2)}</span>
                    <span className="font-mono font-bold text-emerald-400">${Number(line.lineTotal).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-2 font-bold text-xs border-t border-slate-800">
                <span className="text-slate-400">Grand Total:</span>
                <span className="text-emerald-400 font-mono text-base">${Number(viewingPO.grandTotal).toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingPO(null)}
                className="rounded-xl bg-cyan-600 px-4 py-1.5 text-xs font-bold text-white"
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
                      checked ? 'border-cyan-500/50 bg-cyan-500/10 text-white' : 'border-slate-800 bg-slate-950/60 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={col.always}
                        onChange={() => toggleColumn(col.key)}
                        className="rounded border-slate-700 text-cyan-600 accent-cyan-500"
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
                className="rounded-xl bg-cyan-600 px-5 py-2 text-xs font-bold text-white"
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
