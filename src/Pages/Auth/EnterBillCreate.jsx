import React, { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useNotifications } from '../../context/NotificationContext'
import {
  adminEnterBillAPI,
  adminSupplierAPI,
  adminPaymentTermAPI,
  adminReceiptPOAPI,
} from '../../api/api'
import fileTextIcon from '../../assets/icon/3dicons-file-text-dynamic-color.png'
import './ProductsHub.css'

function ChevronLeftIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
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

function TrashIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

function CheckIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

const DEFAULT_PAYMENT_TERMS = [
  'Cash',
  'COD',
  'Net 7',
  'Net 15',
  'Net 30',
  'Net 45',
  'Net 60',
]

const TEMPLATE_OPTIONS = [
  'Default Template',
  'Standard AP Bill',
  'Tax Invoice Template',
  'Commercial Vendor Template',
]

const OUTLET_OPTIONS = [
  'Main Store Warehouse',
  'Central Cold Storage',
  'Express Mart BKK1',
  'Main Supermarket',
  'Toul Kork Branch',
  'Chbar Ampov Depot',
  'Siem Reap Hub',
]

export default function EnterBillCreate({ onCancel, onSuccess }) {
  const { lang } = useLanguage()
  const { addNotification } = useNotifications()
  const navigate = useNavigate()

  // Format today's date YYYY-MM-DD
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), [])

  // Bill Type
  const [billType, setBillType] = useState('Enter Bill') // 'Enter Bill' | 'Debit Memo'

  // General Information States
  const [code, setCode] = useState('')
  const [supplier, setSupplier] = useState('')
  const [supplierInvoiceCode, setSupplierInvoiceCode] = useState('')
  const [paymentTerm, setPaymentTerm] = useState('Net 30')
  const [note, setNote] = useState('')
  const [adjustAmount, setAdjustAmount] = useState('0.00')
  const [billDate, setBillDate] = useState(todayStr)
  const [contact, setContact] = useState('')
  const [supplierInvoiceDate, setSupplierInvoiceDate] = useState(todayStr)
  const [templateName, setTemplateName] = useState(TEMPLATE_OPTIONS[0])
  const [outlet, setOutlet] = useState(OUTLET_OPTIONS[0])
  const [submitting, setSubmitting] = useState(false)

  // Master Data Lists
  const [suppliersList, setSuppliersList] = useState([])
  const [paymentTermsList, setPaymentTermsList] = useState(DEFAULT_PAYMENT_TERMS)
  const [contactOptions, setContactOptions] = useState([])

  // Bill Information Tabs: 'enter-bill' | 'other-expense'
  const [activeTab, setActiveTab] = useState('enter-bill')

  // Tab 1: Enter Bill List (Linked PO Receipts)
  const [poReceipts, setPoReceipts] = useState([])
  const [selectedReceiptIds, setSelectedReceiptIds] = useState([])

  // Tab 2: Other Expense List
  const [otherExpenses, setOtherExpenses] = useState([])

  // 1. Initialize Auto Generated Code
  const fetchNextCode = async (type = billType) => {
    try {
      const nextRes = await adminEnterBillAPI.getNextCode(type)
      const generated = nextRes?.data?.code || nextRes?.code || (typeof nextRes === 'string' ? nextRes : null)
      if (generated) {
        setCode(generated)
        return
      }
    } catch {
      const prefix = type === 'Debit Memo' ? 'DM' : 'BILL'
      const rand = Math.floor(1000 + Math.random() * 9000)
      setCode(`${prefix}-${todayStr.replace(/-/g, '')}-${rand}`)
    }
  }

  useEffect(() => {
    fetchNextCode(billType)
  }, [billType])

  // 2. Fetch Master Data (Suppliers, Payment Terms, Receipts)
  useEffect(() => {
    let mounted = true
    const loadMasterData = async () => {
      // Suppliers
      try {
        const supRes = await adminSupplierAPI.getAll()
        const rawSups = Array.isArray(supRes?.data) ? supRes.data : Array.isArray(supRes) ? supRes : []
        if (mounted) {
          setSuppliersList(rawSups)
        }
      } catch (err) {
        console.error('Failed to load suppliers:', err)
      }

      // Payment Terms
      try {
        const ptRes = await adminPaymentTermAPI.getAll()
        const rawPt = Array.isArray(ptRes?.data) ? ptRes.data : Array.isArray(ptRes) ? ptRes : []
        if (mounted && rawPt.length > 0) {
          const names = rawPt.map((p) => p.description || p.termName || p.name || p.code).filter(Boolean)
          if (names.length > 0) setPaymentTermsList(names)
        }
      } catch (err) {
        console.error('Failed to load payment terms:', err)
      }

      // PO Receipts
      try {
        const recRes = await adminReceiptPOAPI.getAll()
        const rawRecs = Array.isArray(recRes?.data) ? recRes.data : Array.isArray(recRes) ? recRes : []
        if (mounted) {
          const formatted = rawRecs.map((r) => ({
            id: r.id,
            poCode: r.poCode || `PO-${r.id}`,
            receiveCode: r.receiptPoCode || r.code || `REC-${r.id}`,
            receiveDate: r.date || r.createdAt?.slice(0, 10) || todayStr,
            status: r.status || 'RECEIVED',
            supplierName: r.supplier || '',
            receiveAmount: Number(r.amount || 0),
            taxAmount: Number(r.taxAmount != null ? r.taxAmount : (r.amount ? r.amount * 0.1 : 0)),
          }))
          setPoReceipts(formatted)
        }
      } catch (err) {
        console.error('Failed to load receipt POs:', err)
        if (mounted) setPoReceipts([])
      }
    }

    loadMasterData()
    return () => {
      mounted = false
    }
  }, [todayStr])

  // 3. When Supplier Changes: update Contact options, default Payment Term & Filter relevant PO receipts
  const handleSupplierChange = (e) => {
    const selectedName = e.target.value
    setSupplier(selectedName)

    const foundSup = suppliersList.find((s) => (s.name || s.supplierName) === selectedName)
    if (foundSup) {
      // Auto populate contact
      const contactName = `${foundSup.contactFirstName || ''} ${foundSup.contactLastName || ''}`.trim()
      const contactStr = contactName
        ? `${contactName} ${foundSup.contactPhone ? `(${foundSup.contactPhone})` : ''}`.trim()
        : foundSup.contactPerson || foundSup.phone || ''
      setContact(contactStr)

      const contacts = []
      if (contactStr) contacts.push(contactStr)
      if (foundSup.email) contacts.push(`${foundSup.name || foundSup.supplierName} Sales Desk (${foundSup.email})`)
      contacts.push('Accounts Department')
      setContactOptions(contacts)

      // Auto populate payment term
      if (foundSup.paymentTerm) {
        setPaymentTerm(foundSup.paymentTerm)
      }
      if (foundSup.billTemplateName) {
        setTemplateName(foundSup.billTemplateName)
      }
    } else {
      setContactOptions([])
    }
  }

  // Filtered available PO Receipts matching selected Supplier (or all if none selected)
  const availableReceipts = useMemo(() => {
    if (!supplier) return poReceipts
    return poReceipts.filter(
      (r) => (r.supplierName || '').trim().toLowerCase() === supplier.trim().toLowerCase()
    )
  }, [poReceipts, supplier])

  // 4. Toggle Receipt Selection
  const toggleReceiptChoose = (id) => {
    setSelectedReceiptIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const toggleChooseAllReceipts = () => {
    if (selectedReceiptIds.length === availableReceipts.length) {
      setSelectedReceiptIds([])
    } else {
      setSelectedReceiptIds(availableReceipts.map((r) => r.id))
    }
  }

  // 5. Other Expense Handlers
  // "Click button add to get list" -> Add
  // "When Click Add Button it auto show this:"
  // № (1), Description ("Please input description"), Expense Date ("09/08/2026"), Expense Amount ($0.00), Tax Amount ($0.00), Delete button
  const handleAddOtherExpense = () => {
    const nextNo = otherExpenses.length + 1
    const newRow = {
      id: Date.now() + Math.random(),
      lineNo: nextNo,
      description: '',
      expenseDate: todayStr,
      expenseAmount: '0.00',
      taxAmount: '0.00',
    }
    setOtherExpenses((prev) => [...prev, newRow])
  }

  const handleUpdateOtherExpense = (id, field, value) => {
    setOtherExpenses((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    )
  }

  const handleDeleteOtherExpense = (id) => {
    setOtherExpenses((prev) => {
      const filtered = prev.filter((row) => row.id !== id)
      // re-index line numbers
      return filtered.map((row, idx) => ({ ...row, lineNo: idx + 1 }))
    })
  }

  // 6. Calculations: Totals, Adjust Amount & Balance
  // Tab 1: Receipts Totals
  const selectedReceipts = useMemo(
    () => availableReceipts.filter((r) => selectedReceiptIds.includes(r.id)),
    [availableReceipts, selectedReceiptIds]
  )

  const receiptsSummary = useMemo(() => {
    const lineCount = selectedReceipts.length
    const totalReceiveAmount = selectedReceipts.reduce(
      (sum, r) => sum + (Number(r.receiveAmount) || 0),
      0
    )
    const totalTaxAmount = selectedReceipts.reduce(
      (sum, r) => sum + (Number(r.taxAmount) || 0),
      0
    )
    return {
      lineCount,
      totalReceiveAmount,
      totalTaxAmount,
      total: totalReceiveAmount + totalTaxAmount,
    }
  }, [selectedReceipts])

  // Tab 2: Other Expense Totals
  const otherExpensesSummary = useMemo(() => {
    const lineCount = otherExpenses.length
    const totalAmount = otherExpenses.reduce(
      (sum, r) => sum + (parseFloat(r.expenseAmount) || 0),
      0
    )
    const totalTax = otherExpenses.reduce(
      (sum, r) => sum + (parseFloat(r.taxAmount) || 0),
      0
    )
    return {
      lineCount,
      totalAmount,
      totalTax,
      total: totalAmount + totalTax,
    }
  }, [otherExpenses])

  // Overall Bill Totals
  const totalAmount = useMemo(() => {
    return receiptsSummary.total + otherExpensesSummary.total
  }, [receiptsSummary.total, otherExpensesSummary.total])

  const parsedAdjust = useMemo(() => {
    const val = parseFloat(adjustAmount)
    return Number.isFinite(val) ? val : 0
  }, [adjustAmount])

  // Balance = Total Amount - Adjust Amount
  const netBalance = useMemo(() => {
    const bal = totalAmount - parsedAdjust
    return bal < 0 && billType !== 'Debit Memo' ? 0 : bal
  }, [totalAmount, parsedAdjust, billType])

  // 7. Form Submission Handler
  const handleSubmitBill = async (e, isDraft = false) => {
    if (e) e.preventDefault()

    // Validations
    if (!supplier.trim()) {
      addNotification?.('Please select a Supplier *', 'warning')
      return
    }
    if (!contact.trim()) {
      addNotification?.('Please enter or select a Contact *', 'warning')
      return
    }
    if (!paymentTerm.trim()) {
      addNotification?.('Please select a Payment Term *', 'warning')
      return
    }

    if (selectedReceipts.length === 0 && otherExpenses.length === 0) {
      const confirmContinue = window.confirm(
        'You have not selected any PO Receipts or added any Other Expenses. Do you still want to save this bill with $0.00?'
      )
      if (!confirmContinue) return
    }

    try {
      setSubmitting(true)
      const primaryRef =
        selectedReceipts.length > 0
          ? selectedReceipts.map((r) => r.poCode).join(', ')
          : supplierInvoiceCode || 'DIRECT-AP'

      // Calculate Due Date based on Payment Term
      const billDateObj = new Date(billDate)
      let daysToAdd = 30
      if (paymentTerm.includes('15')) daysToAdd = 15
      else if (paymentTerm.includes('7')) daysToAdd = 7
      else if (paymentTerm.includes('45')) daysToAdd = 45
      else if (paymentTerm.includes('60')) daysToAdd = 60
      else if (paymentTerm.toLowerCase().includes('cash') || paymentTerm.toLowerCase().includes('cod')) daysToAdd = 0

      const dueDateObj = new Date(billDateObj)
      dueDateObj.setDate(dueDateObj.getDate() + daysToAdd)
      const calculatedDueDate = dueDateObj.toISOString().slice(0, 10)

      const payload = {
        code,
        supplierInvoiceCode: supplierInvoiceCode.trim() || '—',
        date: billDate,
        dueDate: calculatedDueDate,
        amount: Number(totalAmount.toFixed(2)),
        balance: Number(netBalance.toFixed(2)),
        adjustAmount: parsedAdjust,
        supplier: supplier.trim(),
        reference: primaryRef,
        contact: contact.trim(),
        billType,
        username: 'Admin',
        outlet,
        status: isDraft ? 'DRAFT' : 'OPEN',
        paymentTerm,
        templateName,
        note: note.trim(),
        supplierInvoiceDate,
        receipts: selectedReceipts,
        otherExpenses,
      }

      await adminEnterBillAPI.create(payload)
      addNotification?.(
        `${billType} ${code} created successfully!`,
        'success'
      )

      if (onSuccess) {
        onSuccess()
      } else {
        navigate('/admin/payable-management/enter-bill')
      }
    } catch (err) {
      console.error('Failed to create enter bill:', err)
      addNotification?.(err.message || 'Failed to create bill', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8 space-y-6 text-slate-100 font-['Montserrat']">
      {/* 1. TOP HEADER & BREADCRUMBS */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link to="/admin" className="hover:text-red-400 transition-colors">
              {lang === 'en' ? 'Dashboard' : 'ផ្ទាំងគ្រប់គ្រង'}
            </Link>
            <span>/</span>
            <Link to="/admin/payable-management" className="hover:text-red-400 transition-colors">
              {lang === 'en' ? 'Payable Management Hub' : 'មជ្ឈមណ្ឌលគ្រប់គ្រងបំណុល'}
            </Link>
            <span>/</span>
            <Link to="/admin/payable-management/enter-bill" className="hover:text-red-400 transition-colors">
              {lang === 'en' ? 'Bill List' : 'បញ្ជីប៊ីល'}
            </Link>
            <span>/</span>
            <span className="text-red-400 font-bold">
              {lang === 'en' ? 'Create Enter Bill' : 'បញ្ចូលប៊ីលថ្មី'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/15 border border-red-500/30 text-2xl shadow-lg shadow-red-500/10">
              <img src={fileTextIcon} alt="Enter Bill" className="h-7 w-7 object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black tracking-tight text-white font-['Montserrat']">
                  {lang === 'en' ? 'Enter Bill' : 'បញ្ចូលប៊ីលអ្នកផ្គត់ផ្គង់'}
                </h1>
                <span className="rounded-full bg-red-500/20 px-2.5 py-0.5 text-xs font-bold text-red-300 border border-red-500/30 font-mono">
                  {code || 'BILL-AUTO'}
                </span>
                <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-slate-300 border border-slate-700">
                  {billType}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'en'
                  ? 'Record accounts payable bill, match purchase order receipts, and track operational expenses.'
                  : 'កត់ត្រាវិក័យប័ត្រអ្នកផ្គត់ផ្គង់ ផ្ទៀងផ្ទាត់ការទទួលទំនិញតាម PO និងបញ្ចូលចំណាយប្រតិបត្តិការ។'}
              </p>
            </div>
          </div>
        </div>

        {/* Top Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onCancel || (() => navigate('/admin/payable-management/enter-bill'))}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/90 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition active:scale-95 shadow-sm"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            <span>{lang === 'en' ? 'Back to List' : 'ត្រឡប់ទៅបញ្ជី'}</span>
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={(e) => handleSubmitBill(e, true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 transition active:scale-95 shadow-sm"
          >
            <span>💾</span>
            <span>{lang === 'en' ? 'Save as Draft' : 'រក្សាទុកជាព្រាង'}</span>
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={(e) => handleSubmitBill(e, false)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 px-5 py-2.5 text-xs font-black text-white transition-all shadow-lg shadow-red-600/25 active:scale-95"
          >
            <CheckIcon className="w-4 h-4" />
            <span>{submitting ? (lang === 'en' ? 'Saving...' : 'កំពុងរក្សាទុក...') : (lang === 'en' ? 'Save & Submit Bill' : 'រក្សាទុក និងបញ្ចូលប៊ីល')}</span>
          </button>
        </div>
      </div>

      {/* 2. GENERAL INFORMATION CARD */}
      <div className="rounded-3xl border border-slate-800/90 bg-slate-900/80 p-5 sm:p-7 shadow-2xl backdrop-blur-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-500/20 text-red-400 font-bold text-sm">
              1
            </span>
            <div>
              <h2 className="text-base font-black text-white tracking-wide font-['Montserrat']">
                {lang === 'en' ? 'General Information' : 'ព័ត៌មានទូទៅនៃប៊ីល'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {lang === 'en'
                  ? 'Key header parameters, supplier invoicing details and payable terms.'
                  : 'ព័ត៌មានក្បាលប៊ីល អ្នកផ្គត់ផ្គង់ និងលក្ខខណ្ឌនៃការទូទាត់។'}
              </p>
            </div>
          </div>

          {/* Bill Type Selector: Enter Bill vs Debit Memo */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setBillType('Enter Bill')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                billType === 'Enter Bill'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📄 Enter Bill
            </button>
            <button
              type="button"
              onClick={() => setBillType('Debit Memo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                billType === 'Debit Memo'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ↩️ Debit Memo
            </button>
          </div>
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4.5">
          {/* Code - Textbox Auto Generated Code */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300">
                {lang === 'en' ? 'Code' : 'លេខកូដប៊ីល'}
              </label>
              <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                ● Auto Generated
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="BILL-YYYYMMDD-0001"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs font-mono font-bold text-red-300 placeholder-slate-600 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
              />
              <button
                type="button"
                onClick={() => fetchNextCode(billType)}
                title="Regenerate next code"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition"
              >
                <RefreshIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Supplier * - Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              {lang === 'en' ? 'Supplier' : 'អ្នកផ្គត់ផ្គង់'} <span className="text-red-400 font-black">*</span>
            </label>
            <select
              value={supplier}
              onChange={handleSupplierChange}
              className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-950/90 px-3.5 py-2.5 text-xs font-semibold text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 cursor-pointer"
            >
              <option value="" className="bg-slate-900 text-slate-400">
                -- {lang === 'en' ? 'Choose Supplier' : 'ជ្រើសរើសអ្នកផ្គត់ផ្គង់'} --
              </option>
              {suppliersList.map((s) => {
                const sName = s.name || s.supplierName
                return (
                  <option key={s.id || sName} value={sName} className="bg-slate-900 text-slate-200">
                    {sName} {s.code ? `(${s.code})` : ''}
                  </option>
                )
              })}
            </select>
          </div>

          {/* Supplier Invoice Code - Textbox */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              {lang === 'en' ? 'Supplier Invoice Code' : 'លេខវិក័យប័ត្រអ្នកផ្គត់ផ្គង់'}
            </label>
            <input
              type="text"
              value={supplierInvoiceCode}
              onChange={(e) => setSupplierInvoiceCode(e.target.value)}
              placeholder="e.g. INV-2026-9821"
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 font-mono"
            />
          </div>

          {/* Payment Term * - Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              {lang === 'en' ? 'Payment Term' : 'លក្ខខណ្ឌបង់ប្រាក់'} <span className="text-red-400 font-black">*</span>
            </label>
            <select
              value={paymentTerm}
              onChange={(e) => setPaymentTerm(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-950/90 px-3.5 py-2.5 text-xs font-semibold text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 cursor-pointer"
            >
              {paymentTermsList.map((term) => (
                <option key={term} value={term} className="bg-slate-900 text-slate-200">
                  {term}
                </option>
              ))}
            </select>
          </div>

          {/* Bill Date - Date */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              {lang === 'en' ? 'Bill Date' : 'កាលបរិច្ឆេទប៊ីល'}
            </label>
            <input
              type="date"
              value={billDate}
              onChange={(e) => setBillDate(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
            />
          </div>

          {/* Contact * - Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              {lang === 'en' ? 'Contact' : 'អ្នកទំនាក់ទំនង'} <span className="text-red-400 font-black">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                list="contact-options-list"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Select or enter contact..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
              />
              <datalist id="contact-options-list">
                {contactOptions.map((c, i) => (
                  <option key={i} value={c} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Supplier Invoice Date - Date */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              {lang === 'en' ? 'Supplier Invoice Date' : 'កាលបរិច្ឆេទវិក័យប័ត្រ'}
            </label>
            <input
              type="date"
              value={supplierInvoiceDate}
              onChange={(e) => setSupplierInvoiceDate(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
            />
          </div>

          {/* Template Name - DropDown */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              {lang === 'en' ? 'Template Name' : 'ទម្រង់គំរូ'}
            </label>
            <select
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-950/90 px-3.5 py-2.5 text-xs font-semibold text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 cursor-pointer"
            >
              {TEMPLATE_OPTIONS.map((t) => (
                <option key={t} value={t} className="bg-slate-900 text-slate-200">
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Outlet */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              {lang === 'en' ? 'Outlet' : 'សាខា / ឃ្លាំង'}
            </label>
            <select
              value={outlet}
              onChange={(e) => setOutlet(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-950/90 px-3.5 py-2.5 text-xs font-semibold text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 cursor-pointer"
            >
              {OUTLET_OPTIONS.map((o) => (
                <option key={o} value={o} className="bg-slate-900 text-slate-200">
                  {o}
                </option>
              ))}
            </select>
          </div>

          {/* Adjust Amount - Textbox */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              {lang === 'en' ? 'Adjust Amount' : 'ចំនួនទឹកប្រាក់កែសម្រួល'}
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">
                $
              </span>
              <input
                type="number"
                step="0.01"
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 pl-8 pr-3 py-2.5 text-xs font-mono text-white placeholder-slate-500 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
              />
            </div>
          </div>

          {/* Balance - Textbox Visable $ */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300">
                {lang === 'en' ? 'Balance' : 'សមតុល្យត្រូវបង់'}
              </label>
              <span className="text-[10px] text-amber-400 font-mono font-bold">
                (Total ${totalAmount.toFixed(2)} - Adjust ${parsedAdjust.toFixed(2)})
              </span>
            </div>
            <div className="relative flex items-center">
              <span className="pointer-events-none absolute left-4 text-emerald-400 font-black text-xl font-mono">
                $
              </span>
              <input
                type="text"
                readOnly
                value={`${netBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                className="w-full rounded-2xl border-2 border-emerald-500/40 bg-emerald-950/30 pl-9 pr-4 py-2 text-xl font-mono font-black text-emerald-300 shadow-inner outline-none cursor-default"
              />
              <span className="absolute right-3.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider border border-emerald-500/30">
                Visible $
              </span>
            </div>
          </div>

          {/* Note - Textbox */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4">
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              {lang === 'en' ? 'Note' : 'កំណត់ចំណាំ / បរិយាយ'}
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={lang === 'en' ? 'Internal bill remarks, invoice terms, or delivery note...' : 'កំណត់ចំណាំប៊ីល...'}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
            />
          </div>
        </div>
      </div>

      {/* 3. BILL INFORMATION TABS (Enter Bill List & Other Expense) */}
      <div className="rounded-3xl border border-slate-800/90 bg-slate-900/80 shadow-2xl backdrop-blur-md overflow-hidden">
        {/* Tab Headers */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 px-5 sm:px-7 pt-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-500/20 text-red-400 font-bold text-sm">
              2
            </span>
            <span className="text-base font-black text-white tracking-wide font-['Montserrat']">
              {lang === 'en' ? 'Bill Information' : 'ព័ត៌មានលម្អិតនៃប៊ីល'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('enter-bill')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
                activeTab === 'enter-bill'
                  ? 'border-red-500 bg-slate-900 text-red-400 shadow-md'
                  : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <span>📦</span>
              <span>{lang === 'en' ? 'Enter Bill List' : 'បញ្ជីប័ណ្ណទទួលទំនិញ'}</span>
              <span
                className={`rounded-full px-2 py-0.2 text-[10px] font-mono ${
                  activeTab === 'enter-bill' ? 'bg-red-500/20 text-red-300' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {selectedReceipts.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('other-expense')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
                activeTab === 'other-expense'
                  ? 'border-red-500 bg-slate-900 text-red-400 shadow-md'
                  : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <span>💳</span>
              <span>{lang === 'en' ? 'Other Expense' : 'ចំណាយផ្សេងៗ'}</span>
              <span
                className={`rounded-full px-2 py-0.2 text-[10px] font-mono ${
                  activeTab === 'other-expense' ? 'bg-red-500/20 text-red-300' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {otherExpenses.length}
              </span>
            </button>
          </div>
        </div>

        {/* Tab Body */}
        <div className="p-5 sm:p-7">
          {/* TAB 1: ENTER BILL LIST */}
          {activeTab === 'enter-bill' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
                <div>
                  <span className="font-semibold text-white">
                    {lang === 'en' ? 'Match Goods Receipt / PO Shipments:' : 'ផ្គូផ្គងការទទួលទំនិញតាម PO:'}
                  </span>{' '}
                  {supplier
                    ? lang === 'en'
                      ? `Showing receipts available for ${supplier}`
                      : `បង្ហាញប័ណ្ណទទួលសម្រាប់ ${supplier}`
                    : lang === 'en'
                    ? 'Select a Supplier above to filter specific receipts'
                    : 'ជ្រើសរើសអ្នកផ្គត់ផ្គង់ខាងលើដើម្បីចម្រាញ់'}
                </div>

                <button
                  type="button"
                  onClick={toggleChooseAllReceipts}
                  className="text-xs font-bold text-red-400 hover:text-red-300 transition self-start sm:self-auto"
                >
                  {selectedReceiptIds.length === availableReceipts.length
                    ? lang === 'en' ? 'Deselect All' : 'ដោះការជ្រើសរើសទាំងអស់'
                    : lang === 'en' ? 'Select All Receipts' : 'ជ្រើសរើសប័ណ្ណទាំងអស់'}
                </button>
              </div>

              {/* Enter Bill List Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60 shadow-md">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-300 uppercase tracking-wider font-mono text-[11px]">
                      <th className="py-3 px-4 w-12 text-center">
                        <span className="font-bold">{lang === 'en' ? 'Choose' : 'ជ្រើស'}</span>
                      </th>
                      <th className="py-3 px-4 font-bold">{lang === 'en' ? 'Purchase Order Code' : 'កូដ PO'}</th>
                      <th className="py-3 px-4 font-bold">{lang === 'en' ? 'Receive Code' : 'កូដប័ណ្ណទទួល'}</th>
                      <th className="py-3 px-4 font-bold">{lang === 'en' ? 'Receive Date' : 'កាលបរិច្ឆេទទទួល'}</th>
                      <th className="py-3 px-4 font-bold">{lang === 'en' ? 'Status' : 'ស្ថានភាព'}</th>
                      <th className="py-3 px-4 text-right font-bold">{lang === 'en' ? 'Receive Amount' : 'ទឹកប្រាក់ទទួល'}</th>
                      <th className="py-3 px-4 text-right font-bold">{lang === 'en' ? 'Tax Amount' : 'ចំនួនពន្ធ'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    {availableReceipts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-500 italic">
                          {lang === 'en' ? 'No PO receipts available to bill for this supplier.' : 'មិនមានប័ណ្ណទទួល PO សម្រាប់អ្នកផ្គត់ផ្គង់នេះទេ។'}
                        </td>
                      </tr>
                    ) : (
                      availableReceipts.map((rec) => {
                        const isChosen = selectedReceiptIds.includes(rec.id)
                        return (
                          <tr
                            key={rec.id}
                            onClick={() => toggleReceiptChoose(rec.id)}
                            className={`cursor-pointer transition-colors ${
                              isChosen ? 'bg-red-500/10 hover:bg-red-500/15' : 'hover:bg-slate-800/40'
                            }`}
                          >
                            <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={isChosen}
                                onChange={() => toggleReceiptChoose(rec.id)}
                                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-red-500 focus:ring-red-500/30 cursor-pointer accent-red-500"
                              />
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-white">
                              {rec.poCode}
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-300">
                              {rec.receiveCode}
                            </td>
                            <td className="py-3 px-4 text-slate-400">
                              {rec.receiveDate}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                                  rec.status === 'COMPLETED'
                                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                    : 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                                }`}
                              >
                                {rec.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right font-mono font-bold text-white">
                              ${Number(rec.receiveAmount || 0).toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-right font-mono text-slate-300">
                              ${Number(rec.taxAmount || 0).toFixed(2)}
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>

                  {/* Summary / Total Footer Row matching: Total 0 Line $0.00 $0.00 */}
                  <tfoot>
                    <tr className="border-t-2 border-slate-700 bg-slate-900/90 font-bold text-white">
                      <td className="py-3.5 px-4 text-center font-black uppercase text-red-400">
                        Total
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {receiptsSummary.lineCount} Line
                      </td>
                      <td className="py-3.5 px-4"></td>
                      <td className="py-3.5 px-4"></td>
                      <td className="py-3.5 px-4"></td>
                      <td className="py-3.5 px-4 text-right font-mono text-emerald-300 font-black text-sm">
                        ${receiptsSummary.totalReceiveAmount.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-amber-300 font-black text-sm">
                        ${receiptsSummary.totalTaxAmount.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: OTHER EXPENSE */}
          {activeTab === 'other-expense' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider font-['Montserrat']">
                    {lang === 'en' ? 'Other Expense list' : 'បញ្ជីចំណាយផ្សេងៗ'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {lang === 'en' ? 'Click button add to get list' : 'ចុចប៊ូតុងបន្ថែមដើម្បីបញ្ចូលចំណាយ'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddOtherExpense}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 px-4 py-2 text-xs font-bold text-white transition-all shadow-md shadow-red-600/20 active:scale-95 self-start sm:self-auto"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>{lang === 'en' ? 'Add' : 'បន្ថែម'}</span>
                </button>
              </div>

              {/* Other Expense Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60 shadow-md">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-300 uppercase tracking-wider font-mono text-[11px]">
                      <th className="py-3 px-4 w-12 text-center font-bold">№</th>
                      <th className="py-3 px-4 font-bold min-w-[240px]">{lang === 'en' ? 'Description' : 'ការពិពណ៌នា'}</th>
                      <th className="py-3 px-4 font-bold w-40">{lang === 'en' ? 'Expense Date' : 'កាលបរិច្ឆេទ'}</th>
                      <th className="py-3 px-4 font-bold w-36 text-right">{lang === 'en' ? 'Expense Amount' : 'ចំនួនទឹកប្រាក់'}</th>
                      <th className="py-3 px-4 font-bold w-36 text-right">{lang === 'en' ? 'Tax Amount' : 'ចំនួនពន្ធ'}</th>
                      <th className="py-3 px-4 font-bold w-16 text-center">{lang === 'en' ? 'Action' : 'សកម្មភាព'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    {otherExpenses.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-slate-500 italic">
                          {lang === 'en'
                            ? 'No other expenses added yet. Click "Add" button above to insert expense lines.'
                            : 'មិនទាន់មានចំណាយផ្សេងៗត្រូវបានបន្ថែមទេ។ ចុចប៊ូតុង "បន្ថែម" ខាងលើ។'}
                        </td>
                      </tr>
                    ) : (
                      otherExpenses.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-900/50 transition-colors">
                          {/* № */}
                          <td className="py-3 px-4 text-center font-mono font-bold text-slate-400">
                            {row.lineNo}
                          </td>

                          {/* Description */}
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              value={row.description}
                              onChange={(e) => handleUpdateOtherExpense(row.id, 'description', e.target.value)}
                              placeholder={lang === 'en' ? 'Please input description' : 'សូមបញ្ចូលការពិពណ៌នា'}
                              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
                            />
                          </td>

                          {/* Expense Date */}
                          <td className="py-3 px-4">
                            <input
                              type="date"
                              value={row.expenseDate}
                              onChange={(e) => handleUpdateOtherExpense(row.id, 'expenseDate', e.target.value)}
                              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
                            />
                          </td>

                          {/* Expense Amount */}
                          <td className="py-3 px-4 text-right">
                            <div className="relative">
                              <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 font-mono">
                                $
                              </span>
                              <input
                                type="number"
                                step="0.01"
                                value={row.expenseAmount}
                                onChange={(e) => handleUpdateOtherExpense(row.id, 'expenseAmount', e.target.value)}
                                placeholder="0.00"
                                className="w-full rounded-lg border border-slate-700 bg-slate-900 pl-6 pr-2 py-1.5 text-xs font-mono text-right text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
                              />
                            </div>
                          </td>

                          {/* Tax Amount */}
                          <td className="py-3 px-4 text-right">
                            <div className="relative">
                              <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 font-mono">
                                $
                              </span>
                              <input
                                type="number"
                                step="0.01"
                                value={row.taxAmount}
                                onChange={(e) => handleUpdateOtherExpense(row.id, 'taxAmount', e.target.value)}
                                placeholder="0.00"
                                className="w-full rounded-lg border border-slate-700 bg-slate-900 pl-6 pr-2 py-1.5 text-xs font-mono text-right text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
                              />
                            </div>
                          </td>

                          {/* Delete Button */}
                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleDeleteOtherExpense(row.id)}
                              title={lang === 'en' ? 'Delete row' : 'លុបជួរនេះ'}
                              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>

                  {/* Summary Footer Row */}
                  {otherExpenses.length > 0 && (
                    <tfoot>
                      <tr className="border-t-2 border-slate-700 bg-slate-900/90 font-bold text-white">
                        <td className="py-3.5 px-4 text-center font-black uppercase text-red-400">
                          Total
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-300">
                          {otherExpensesSummary.lineCount} Lines
                        </td>
                        <td className="py-3.5 px-4"></td>
                        <td className="py-3.5 px-4 text-right font-mono text-emerald-300 font-black text-sm">
                          ${otherExpensesSummary.totalAmount.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-amber-300 font-black text-sm">
                          ${otherExpensesSummary.totalTax.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4"></td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. BILL TOTAL SUMMARY BANNER & BOTTOM ACTIONS */}
      <div className="rounded-3xl border border-slate-800/90 bg-gradient-to-br from-slate-900 via-slate-950 to-black p-5 sm:p-7 shadow-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
        {/* Breakdown Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-3.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {lang === 'en' ? 'PO Receipts Total' : 'សរុបប័ណ្ណទទួល PO'}
            </span>
            <div className="mt-1 text-lg font-black text-white font-mono">
              ${receiptsSummary.total.toFixed(2)}
            </div>
            <span className="text-[10px] text-slate-500">
              {receiptsSummary.lineCount} {lang === 'en' ? 'receipts matched' : 'ប័ណ្ណទទួល'}
            </span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-3.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {lang === 'en' ? 'Other Expenses' : 'ចំណាយផ្សេងៗ'}
            </span>
            <div className="mt-1 text-lg font-black text-white font-mono">
              ${otherExpensesSummary.total.toFixed(2)}
            </div>
            <span className="text-[10px] text-slate-500">
              {otherExpensesSummary.lineCount} {lang === 'en' ? 'expense lines' : 'បន្ទាត់ចំណាយ'}
            </span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-3.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {lang === 'en' ? 'Adjust Amount' : 'ទឹកប្រាក់កែសម្រួល'}
            </span>
            <div className="mt-1 text-lg font-black text-amber-300 font-mono">
              -${parsedAdjust.toFixed(2)}
            </div>
            <span className="text-[10px] text-slate-500">
              {lang === 'en' ? 'Discount / deduction' : 'បញ្ចុះតម្លៃ'}
            </span>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-3.5 shadow-md">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              {lang === 'en' ? 'Net Balance Payable' : 'សមតុល្យត្រូវបង់សរុប'}
            </span>
            <div className="mt-1 text-xl font-black text-emerald-300 font-mono">
              ${netBalance.toFixed(2)}
            </div>
            <span className="text-[10px] text-emerald-500/80 font-semibold">
              ● {paymentTerm}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onCancel || (() => navigate('/admin/payable-management/enter-bill'))}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-700 transition active:scale-95"
          >
            {lang === 'en' ? 'Cancel' : 'បោះបង់'}
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={(e) => handleSubmitBill(e, false)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 px-6 py-3 text-xs font-black text-white transition-all shadow-xl shadow-red-600/30 active:scale-95"
          >
            <CheckIcon className="w-4 h-4" />
            <span>{submitting ? (lang === 'en' ? 'Saving...' : 'កំពុងរក្សាទុក...') : (lang === 'en' ? 'Save & Submit Bill' : 'រក្សាទុក និងបញ្ចូលប៊ីល')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
