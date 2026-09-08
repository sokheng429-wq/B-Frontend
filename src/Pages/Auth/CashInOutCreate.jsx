import React, { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useNotifications } from '../../context/NotificationContext'
import { adminCashOperationAPI } from '../../api/api'
import moneyBagIcon from '../../assets/icon/3dicons-money-bag-dynamic-color.png'
import './ProductsHub.css'

function ChevronLeftIcon({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
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
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  )
}

// Customers catalog
const CUSTOMER_OPTIONS = [
  { id: 1, name: 'Phnom Penh Mart Supermarket', phone: '012 889 776', contact: 'Mr. Vanna Touch', mobile: '098 776 554' },
  { id: 2, name: 'Lucky Express - Toul Kork', phone: '015 992 113', contact: 'Ms. Sreymom Chan', mobile: '012 334 556' },
  { id: 3, name: 'Angkor Organic Grocers', phone: '098 443 221', contact: 'Mr. Sok Chea', mobile: '087 654 321' },
  { id: 4, name: 'BKK1 Daily Fresh Market', phone: '011 223 344', contact: 'Dara Heng', mobile: '016 789 012' },
  { id: 5, name: 'Siem Reap Wholesale Hub', phone: '070 556 677', contact: 'Sophea Kim', mobile: '093 112 233' },
  { id: 6, name: 'Sovannaphum Mart', phone: '089 123 456', contact: 'Mr. Sovanna', mobile: '092 887 654' },
  { id: 7, name: 'Battambang Organic Rice Ltd', phone: '015 992 113', contact: 'Ms. Sreymom Chan', mobile: '012 334 556' },
  { id: 8, name: 'Kirirom Dairy Co.', phone: '011 223 344', contact: 'Dara Heng', mobile: '016 789 012' },
]

// Outlets
const OUTLET_OPTIONS = [
  'Main Store Warehouse',
  'Central Cold Storage',
  'Express Mart BKK1',
  'Toul Kork Branch',
  'Chbar Ampov Depot',
  'Siem Reap Hub',
]

// Employees
const EMPLOYEE_OPTIONS = [
  'CashierDara',
  'CashierChann',
  'Sokheng',
  'Badmin',
  'Vanna Touch',
  'Dara Heng',
]

// Cash Categories
const CATEGORY_OPTIONS = [
  'Store Sales Intake',
  'POS Sales Receipt',
  'Customer Advance',
  'Customer Deposit',
  'AR Collection',
  'Supplier Advance',
  'Supplier Cash Settlement',
  'Petty Cash Expense',
  'Operating Expense',
  'Utility Expense',
  'Freight Charge',
  'Owner Drawings',
]

export default function CashInOutCreate({ onCancel, onSuccess }) {
  const { lang } = useLanguage()
  const { showNotification } = useNotifications()
  const navigate = useNavigate()

  // 1. General Information State
  const [operationType, setOperationType] = useState('Cash in') // 'Cash in' | 'Cash Out'
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [code, setCode] = useState('')
  const [loadingCode, setLoadingCode] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(CUSTOMER_OPTIONS[0].name)
  const [contact, setContact] = useState(CUSTOMER_OPTIONS[0].phone)
  const [outlet, setOutlet] = useState(OUTLET_OPTIONS[0])
  const [employee, setEmployee] = useState(EMPLOYEE_OPTIONS[0])
  const [reference, setReference] = useState('')
  const [saving, setSaving] = useState(false)

  // 2. Cash In / Out List (Detail line items)
  const [items, setItems] = useState([
    { id: 1, description: 'Cash register counter intake', amount: 450.00, category: 'Store Sales Intake' }
  ])

  // Fetch Auto Generated Code based on Type
  const fetchNextCode = async (type) => {
    setLoadingCode(true)
    try {
      const apiType = type === 'Cash in' ? 'CASH_IN' : 'CASH_OUT'
      const res = await adminCashOperationAPI.getNextCode(apiType)
      if (res && res.code) {
        setCode(res.code)
      } else {
        const prefix = type === 'Cash in' ? 'CIN' : 'COUT'
        setCode(`${prefix}-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`)
      }
    } catch {
      const prefix = type === 'Cash in' ? 'CIN' : 'COUT'
      setCode(`${prefix}-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`)
    } finally {
      setLoadingCode(false)
    }
  }

  useEffect(() => {
    fetchNextCode(operationType)
  }, [operationType])

  // When Customer Changes, update contact options
  const handleCustomerChange = (custName) => {
    setSelectedCustomer(custName)
    const found = CUSTOMER_OPTIONS.find((c) => c.name === custName)
    if (found) {
      setContact(found.phone)
    }
  }

  // Contact options for selected customer
  const currentCustomerObj = useMemo(() => {
    return CUSTOMER_OPTIONS.find((c) => c.name === selectedCustomer) || CUSTOMER_OPTIONS[0]
  }, [selectedCustomer])

  const contactOptions = useMemo(() => {
    if (!currentCustomerObj) return []
    return [
      { label: `${currentCustomerObj.phone} (Primary Phone)`, value: currentCustomerObj.phone },
      { label: `${currentCustomerObj.contact} (Contact Person)`, value: currentCustomerObj.contact },
      { label: `${currentCustomerObj.mobile} (Mobile)`, value: currentCustomerObj.mobile },
    ]
  }, [currentCustomerObj])

  // Line Item actions
  const handleAddItem = () => {
    const newItem = {
      id: Date.now(),
      description: '',
      amount: 0.00,
      category: operationType === 'Cash in' ? 'Store Sales Intake' : 'Operating Expense'
    }
    setItems((prev) => [...prev, newItem])
  }

  const handleRemoveItem = (id) => {
    if (items.length <= 1) {
      showNotification?.({
        type: 'warning',
        title: lang === 'en' ? 'Validation' : 'បញ្ជាក់',
        message: lang === 'en' ? 'At least one line item is required.' : 'ត្រូវមានទំនិញយ៉ាងហោចណាស់ ១ ជួរ។'
      })
      return
    }
    setItems((prev) => prev.filter((it) => it.id !== id))
  }

  const handleItemChange = (id, field, value) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: value } : it))
    )
  }

  // Total Amount Calculation
  const totalAmount = useMemo(() => {
    return items.reduce((sum, it) => sum + Number(it.amount || 0), 0)
  }, [items])

  // Save / Submit to Backend
  const handleSave = async (e) => {
    if (e) e.preventDefault()

    if (!selectedCustomer) {
      showNotification?.({
        type: 'warning',
        title: lang === 'en' ? 'Validation' : 'បញ្ជាក់',
        message: lang === 'en' ? 'Customer is required.' : 'សូមជ្រើសរើសអតិថិជន។'
      })
      return
    }

    if (items.length === 0 || totalAmount <= 0) {
      showNotification?.({
        type: 'warning',
        title: lang === 'en' ? 'Validation' : 'បញ្ជាក់',
        message: lang === 'en' ? 'Total amount must be greater than $0.00' : 'ចំនួនទឹកប្រាក់សរុបត្រូវធំជាង $0.00'
      })
      return
    }

    const payload = {
      code,
      transactionDate: `${date}T${new Date().toTimeString().slice(0, 8)}`,
      type: operationType === 'Cash in' ? 'CASH_IN' : 'CASH_OUT',
      partyType: operationType === 'Cash in' ? 'CUSTOMER' : 'SUPPLIER',
      partyName: selectedCustomer,
      phone: currentCustomerObj.phone || contact,
      contact: contact,
      employee: employee,
      amount: totalAmount,
      outlet: outlet,
      status: 'NON_VOIDED',
      category: items[0]?.category || (operationType === 'Cash in' ? 'Store Sales Intake' : 'Operating Expense'),
      referenceNo: reference || '',
      description: items.map((it) => it.description).filter(Boolean).join('; ') || 'Cash transaction entry',
      username: employee,
      items: items,
    }

    setSaving(true)
    try {
      const res = await adminCashOperationAPI.create(payload)
      showNotification?.({
        type: 'success',
        title: lang === 'en' ? 'Success' : 'ជោគជ័យ',
        message: lang === 'en' ? `Cash operation ${res?.code || code} created successfully.` : `ប្រតិបត្តិការ ${code} ត្រូវបានបង្កើតដោយជោគជ័យ។`
      })

      if (onSuccess) {
        onSuccess(res)
      } else {
        navigate('/admin/cash-book/cash-in-out')
      }
    } catch (err) {
      console.error('Failed to create cash operation:', err)
      showNotification?.({
        type: 'error',
        title: lang === 'en' ? 'Error' : 'កំហុស',
        message: err.message || (lang === 'en' ? 'Failed to save cash operation.' : 'មិនអាចរក្សាទុកប្រតិបត្តិការសាច់ប្រាក់បានទេ។')
      })
    } finally {
      setSaving(false)
    }
  }

  const handleBack = () => {
    if (onCancel) {
      onCancel()
    } else {
      navigate('/admin/cash-book/cash-in-out')
    }
  }

  return (
    <div className="space-y-6 text-slate-100 font-['Montserrat']">
      {/* 1. TOP HEADER & ACTIONS */}
      <section className="relative overflow-hidden rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#0b0f17] p-5 sm:p-7 shadow-2xl shadow-yellow-500/10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-yellow-500/15 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-950/60 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-yellow-300 transition hover:border-yellow-400 hover:text-white active:scale-95"
            >
              <ChevronLeftIcon /> {lang === 'en' ? 'Back to Cash in / out list' : 'ត្រឡប់ទៅបញ្ជីលុយចូល/ចេញ'}
            </button>

            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-500/15 p-2 ring-1 ring-yellow-500/30">
                <img src={moneyBagIcon} alt="" className="h-8 w-8 object-contain" />
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  {lang === 'en' ? 'Create Cash In / Out Voucher' : 'បង្កើតប័ណ្ណលុយចូល / ចេញ'}
                </h1>
                <p className="text-xs text-slate-400">
                  {lang === 'en'
                    ? 'Record customer deposits, till intakes, or counter expense disbursements.'
                    : 'កត់ត្រាការទទួលប្រាក់ចំណូលសាច់ប្រាក់ ឬការចំណាយសាច់ប្រាក់រាយ។'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleBack}
              className="rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-bold text-slate-300 transition hover:bg-slate-700 hover:text-white"
            >
              {lang === 'en' ? 'Cancel' : 'បោះបង់'}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-yellow-500 px-6 py-2.5 text-xs font-black text-slate-950 shadow-lg shadow-yellow-500/25 transition hover:bg-yellow-400 active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                  <span>{lang === 'en' ? 'Saving...' : 'កំពុងរក្សាទុក...'}</span>
                </>
              ) : (
                <span>{lang === 'en' ? 'Save Voucher' : 'រក្សាទុកប័ណ្ណ'}</span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* 2. CARD 1: GENERAL INFORMATION */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl shadow-black/20 space-y-5">
        <div className="pb-3 border-b border-slate-800/80">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            {lang === 'en' ? 'General Information' : 'ព័ត៌មានទូទៅ'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'en' ? 'Input the general cash in / out information' : 'បញ្ចូលព័ត៌មានទូទៅនៃប្រតិបត្តិការសាច់ប្រាក់ចូល/ចេញ'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Cash In / Out Status * (Dropdown) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200">
              {lang === 'en' ? 'Cash In / Out Status *' : 'ប្រភេទសាច់ប្រាក់ ចូល / ចេញ *'}
            </label>
            <select
              value={operationType}
              onChange={(e) => setOperationType(e.target.value)}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950 py-2.5 px-3.5 text-xs font-semibold text-white outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
            >
              <option value="Cash in">Cash in (លុយចូល)</option>
              <option value="Cash Out">Cash Out (លុយចេញ)</option>
            </select>
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200">
              {lang === 'en' ? 'Date *' : 'កាលបរិច្ឆេទ *'}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950 py-2.5 px-3.5 text-xs font-semibold text-white outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
            />
          </div>

          {/* Code Auto Generate Code */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200">
              {lang === 'en' ? 'Code (Auto Generate Code)' : 'លេខកូដ (បង្កើតដោយស្វ័យប្រវត្តិ)'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="CIN-2026-XXXX"
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950 py-2.5 pl-3.5 pr-10 font-mono text-xs font-bold text-yellow-400 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
              />
              <button
                type="button"
                onClick={() => fetchNextCode(operationType)}
                title="Regenerate Code"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-yellow-400"
              >
                <RefreshIcon className={`w-4 h-4 ${loadingCode ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Customer * Dropdown visible */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200">
              {lang === 'en' ? 'Customer *' : 'អតិថិជន *'}
            </label>
            <select
              value={selectedCustomer}
              onChange={(e) => handleCustomerChange(e.target.value)}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950 py-2.5 px-3.5 text-xs font-semibold text-white outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
            >
              {CUSTOMER_OPTIONS.map((c) => (
                <option key={c.id} value={c.name} className="bg-slate-900 text-white">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Contact * (Dropdown) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200">
              {lang === 'en' ? 'Contact *' : 'ទំនាក់ទំនង *'}
            </label>
            <select
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950 py-2.5 px-3.5 text-xs font-semibold text-white outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
            >
              {contactOptions.map((opt, idx) => (
                <option key={idx} value={opt.value} className="bg-slate-900 text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Outlet (Dropdown) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200">
              {lang === 'en' ? 'Outlet' : 'សាខា / ឃ្លាំង'}
            </label>
            <select
              value={outlet}
              onChange={(e) => setOutlet(e.target.value)}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950 py-2.5 px-3.5 text-xs font-semibold text-white outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
            >
              {OUTLET_OPTIONS.map((out) => (
                <option key={out} value={out} className="bg-slate-900 text-white">
                  {out}
                </option>
              ))}
            </select>
          </div>

          {/* Employee (Dropdown) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200">
              {lang === 'en' ? 'Employee' : 'បុគ្គលិក'}
            </label>
            <select
              value={employee}
              onChange={(e) => setEmployee(e.target.value)}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950 py-2.5 px-3.5 text-xs font-semibold text-white outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
            >
              {EMPLOYEE_OPTIONS.map((emp) => (
                <option key={emp} value={emp} className="bg-slate-900 text-white">
                  {emp}
                </option>
              ))}
            </select>
          </div>

          {/* Reference (Textbox) */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-slate-200">
              {lang === 'en' ? 'Reference' : 'លេខយោង'}
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. REC-98214, VCH-00431, Invoice #489..."
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950 py-2.5 px-3.5 text-xs font-semibold text-white placeholder-slate-500 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
            />
          </div>
        </div>
      </section>

      {/* 3. CARD 2: CASH IN / OUT LIST (DETAIL TABLE) */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl shadow-black/20 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {lang === 'en' ? 'Cash in / out list' : 'បញ្ជីលុយចូល / ចេញ'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'en' ? 'Detail of cash in / out list' : 'ព័ត៌មានលម្អិតនៃបញ្ជីលុយចូល/ចេញ'}
            </p>
          </div>

          {/* Top + Add button */}
          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center gap-1.5 rounded-xl bg-yellow-500 px-3.5 py-2 text-xs font-black text-slate-950 shadow-md shadow-yellow-500/20 transition hover:bg-yellow-400 active:scale-95"
          >
            <PlusIcon />
            <span>{lang === 'en' ? 'Add' : 'បន្ថែម'}</span>
          </button>
        </div>

        {/* Dynamic Table: №, Description, Amount, Category */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-slate-950/90 text-[11px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 w-12 text-center">№</th>
                <th className="py-3 px-4 min-w-[240px]">{lang === 'kh' ? 'ការពិពណ៌នា' : 'Description'}</th>
                <th className="py-3 px-4 w-44 text-right">{lang === 'kh' ? 'ចំនួនទឹកប្រាក់ ($)' : 'Amount ($)'}</th>
                <th className="py-3 px-4 w-56">{lang === 'kh' ? 'ប្រភេទចំណាយ' : 'Category'}</th>
                <th className="py-3 px-4 w-16 text-center">{lang === 'kh' ? 'លុប' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {items.map((it, index) => (
                <tr key={it.id} className="transition hover:bg-slate-800/40">
                  {/* № */}
                  <td className="py-3 px-4 text-center font-bold text-slate-400">
                    {index + 1}
                  </td>

                  {/* Description */}
                  <td className="py-2.5 px-4">
                    <input
                      type="text"
                      value={it.description}
                      onChange={(e) => handleItemChange(it.id, 'description', e.target.value)}
                      placeholder={lang === 'en' ? 'Enter item description...' : 'បញ្ចូលការពិពណ៌នា...'}
                      className="w-full rounded-xl border border-slate-700/80 bg-slate-950 py-2 px-3 text-xs font-semibold text-white placeholder-slate-500 outline-none focus:border-yellow-400"
                    />
                  </td>

                  {/* Amount */}
                  <td className="py-2.5 px-4">
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-slate-400 font-bold">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={it.amount}
                        onChange={(e) => handleItemChange(it.id, 'amount', parseFloat(e.target.value) || 0)}
                        className="w-full rounded-xl border border-slate-700/80 bg-slate-950 py-2 pl-7 pr-3 text-right font-mono text-xs font-bold text-white outline-none focus:border-yellow-400"
                      />
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-2.5 px-4">
                    <select
                      value={it.category}
                      onChange={(e) => handleItemChange(it.id, 'category', e.target.value)}
                      className="w-full rounded-xl border border-slate-700/80 bg-slate-950 py-2 px-3 text-xs font-semibold text-white outline-none focus:border-yellow-400"
                    >
                      {CATEGORY_OPTIONS.map((cat) => (
                        <option key={cat} value={cat} className="bg-slate-900 text-white">
                          {cat}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Action Delete */}
                  <td className="py-2.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(it.id)}
                      title="Remove Row"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:border-rose-500 hover:bg-rose-500/10 hover:text-rose-400 transition"
                    >
                      <TrashIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom + Add button & Summary */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2 text-xs font-bold text-slate-200 transition hover:bg-slate-700 hover:text-white active:scale-95"
          >
            <PlusIcon />
            <span>{lang === 'en' ? 'Add' : 'បន្ថែម'}</span>
          </button>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950 px-5 py-3">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
              {lang === 'en' ? 'Total Amount:' : 'ចំនួនទឹកប្រាក់សរុប៖'}
            </span>
            <span className="font-mono text-xl font-black text-yellow-400">
              ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Bottom Save & Cancel */}
        <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-800/80">
          <button
            type="button"
            onClick={handleBack}
            className="rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-700"
          >
            {lang === 'en' ? 'Cancel' : 'បោះបង់'}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-yellow-500 px-7 py-2.5 text-xs font-black text-slate-950 shadow-lg shadow-yellow-500/25 hover:bg-yellow-400 active:scale-95 disabled:opacity-50"
          >
            {saving ? (lang === 'en' ? 'Saving...' : 'កំពុងរក្សាទុក...') : (lang === 'en' ? 'Save Voucher' : 'រក្សាទុកប័ណ្ណ')}
          </button>
        </div>
      </section>
    </div>
  )
}
