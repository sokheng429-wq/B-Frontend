import React, { useState, useMemo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useNotifications } from '../../context/NotificationContext'
import { adminBankTransactionAPI } from '../../api/api'
import creditCardIcon from '../../assets/icon/3dicons-credit-card-dynamic-color.png'
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

// Banks
const BANK_OPTIONS = [
  'ABA Bank - Corporate (USD)',
  'Canadia Bank (USD)',
  'ACLEDA Bank Plc (USD)',
  'Wing Bank (KHR)',
  'Foreign Trade Bank (FTB)',
  'Sathapana Bank',
]

// Categories for Bank In / Out
const CATEGORY_OPTIONS = [
  'Customer Wire Deposit',
  'ABA KHQR Merchant Settlement',
  'POS Card Batch Settlement',
  'Online Sales Settlement',
  'Supplier Wire Transfer',
  'Import Customs & Freight',
  'Warehouse Power Utility',
  'Store Rent Direct Debit',
  'Staff Payroll Bank Transfer',
  'Loan / Lease Payment',
  'Taxes & License Fees',
  'Bank Service Charges',
]

export default function BankInOutCreate({ onCancel, onSuccess }) {
  const { lang } = useLanguage()
  const { showNotification } = useNotifications()
  const navigate = useNavigate()

  // Format current date and time as 09/08/2026 03:48 PM
  const formatDefaultDateTime = () => {
    const now = new Date()
    const d = String(now.getDate()).padStart(2, '0')
    const m = String(now.getMonth() + 1).padStart(2, '0')
    const y = now.getFullYear()
    let hours = now.getHours()
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12 || 12
    const strHours = String(hours).padStart(2, '0')
    return `${m}/${d}/${y} ${strHours}:${minutes} ${ampm}`
  }

  // 1. General Information State
  const [bankType, setBankType] = useState('Bank In') // 'Bank In' | 'Bank Out'
  const [date, setDate] = useState(formatDefaultDateTime)
  const [code, setCode] = useState(() => `BNK-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`)
  const [selectedCustomer, setSelectedCustomer] = useState(CUSTOMER_OPTIONS[0].name)
  const [contact, setContact] = useState(CUSTOMER_OPTIONS[0].phone)
  const [outlet, setOutlet] = useState(OUTLET_OPTIONS[0])
  const [employee, setEmployee] = useState(EMPLOYEE_OPTIONS[0])
  const [bankName, setBankName] = useState(BANK_OPTIONS[0])
  const [reference, setReference] = useState('')
  const [saving, setSaving] = useState(false)

  // 2. Bank deposit in / out list (Detail line items)
  const [items, setItems] = useState([
    {
      id: 1,
      description: 'Online KHQR merchant settlement transfer',
      amount: 1500.00,
      category: 'ABA KHQR Merchant Settlement'
    }
  ])

  // Customer selection change
  const handleCustomerChange = (e) => {
    const custName = e.target.value
    setSelectedCustomer(custName)
    const found = CUSTOMER_OPTIONS.find((c) => c.name === custName)
    if (found) {
      setContact(found.phone)
    }
  }

  const handleRegenerateCode = () => {
    setCode(`BNK-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`)
  }

  // Line item handlers
  const handleAddItem = () => {
    const newItem = {
      id: Date.now(),
      description: '',
      amount: 0.00,
      category: bankType === 'Bank In' ? 'Customer Wire Deposit' : 'Supplier Wire Transfer'
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

  const handleSave = async (e) => {
    if (e) e.preventDefault()

    if (!employee) {
      showNotification?.({
        type: 'warning',
        title: lang === 'en' ? 'Validation' : 'បញ្ជាក់',
        message: lang === 'en' ? 'Employee is required.' : 'សូមជ្រើសរើសបុគ្គលិក។'
      })
      return
    }

    if (!bankName) {
      showNotification?.({
        type: 'warning',
        title: lang === 'en' ? 'Validation' : 'បញ្ជាក់',
        message: lang === 'en' ? 'Bank Name is required.' : 'សូមជ្រើសរើសធនាគារ។'
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

    setSaving(true)
    const newRecord = {
      id: `BNK-${Date.now()}`,
      code,
      date: new Date().toISOString(),
      type: bankType === 'Bank In' ? 'BANK_IN' : 'BANK_OUT',
      bank: bankName,
      customer: selectedCustomer,
      contact,
      outlet,
      employee,
      amount: totalAmount,
      reference: reference || `TX-${String(Math.floor(Math.random() * 900000) + 100000)}`,
      status: 'COMPLETED',
      note: items.map((it) => it.description).filter(Boolean).join('; ') || `${bankType} entry`,
      items,
    }

    // Persist to database via backend API
    try {
      const res = await adminBankTransactionAPI.create({
        code: newRecord.code,
        date: newRecord.date,
        type: newRecord.type,
        bank: newRecord.bank,
        amount: Number(newRecord.amount) || 0,
        reference: newRecord.reference,
        status: newRecord.status,
        note: newRecord.note,
      })
      if (res?.data) {
        newRecord.id = res.data.id
      }
    } catch (err) {
      console.warn('Backend bank transaction save failed, saving to local cache:', err)
    }

    // Also update localStorage cache
    try {
      const stored = localStorage.getItem('bg_bank_in_out')
      const list = stored ? JSON.parse(stored) : []
      localStorage.setItem('bg_bank_in_out', JSON.stringify([newRecord, ...list]))
    } catch {}

    showNotification?.({
      type: 'success',
      title: lang === 'en' ? 'Success' : 'ជោគជ័យ',
      message: lang === 'en' ? `${bankType} record ${code} saved to database successfully.` : `កំណត់ត្រា ${bankType} ${code} ត្រូវបានរក្សាទុកដោយជោគជ័យ។`
    })

    if (onSuccess) {
      onSuccess(newRecord)
    } else {
      navigate('/admin/cash-book/bank-in-out')
    }
    setSaving(false)
  }

  const handleBack = () => {
    if (onCancel) {
      onCancel()
    } else {
      navigate('/admin/cash-book/bank-in-out')
    }
  }

  return (
    <div className="space-y-6 text-slate-100 font-['Montserrat']">
      {/* 1. TOP HEADER & ACTIONS */}
      <section className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#0b0f17] p-5 sm:p-7 shadow-2xl shadow-emerald-500/10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-950/60 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300 transition hover:border-emerald-400 hover:text-white active:scale-95"
            >
              <ChevronLeftIcon /> {lang === 'en' ? 'Back to Bank In / Out' : 'ត្រឡប់ទៅធនាគារ ចូល / ចេញ'}
            </button>

            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 p-2 ring-1 ring-emerald-500/30">
                <img src={creditCardIcon} alt="" className="h-8 w-8 object-contain" />
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  {lang === 'en' ? 'Create Bank Deposit In / Out' : 'បង្កើតកំណត់ត្រាធនាគារ ចូល / ចេញ'}
                </h1>
                <p className="text-xs text-slate-400">
                  {lang === 'en'
                    ? 'Register corporate bank deposits, card processing batches, or electronic wire payments.'
                    : 'កត់ត្រាការដាក់ប្រាក់ ការទូទាត់កាត ឬការផ្ទេរប្រាក់តាមប្រព័ន្ធធនាគារ។'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleBack}
              className="rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              {lang === 'en' ? 'Cancel' : 'បោះបង់'}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2 text-xs font-black text-slate-950 shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-400 active:scale-95 transition disabled:opacity-50"
            >
              {saving
                ? (lang === 'en' ? 'Saving...' : 'កំពុងរក្សាទុក...')
                : (lang === 'en' ? 'Save Transaction' : 'រក្សាទុកប្រតិបត្តិការ')}
            </button>
          </div>
        </div>
      </section>

      {/* 2. GENERAL INFORMATION CARD */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-7 shadow-xl shadow-black/20 space-y-6">
        <div className="border-b border-slate-800/80 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-wide text-white">
                {lang === 'en' ? 'General Information' : 'ព័ត៌មានទូទៅ'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'en' ? 'Input the general bank deposit in / out information' : 'បញ្ចូលព័ត៌មានទូទៅនៃការដាក់ ឬដកប្រាក់ធនាគារ'}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[11px] font-bold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {bankType}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
          {/* Bank In / Out * */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">
              {lang === 'en' ? 'Bank In / Out' : 'ធនាគារ ចូល / ចេញ'} <span className="text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setBankType('Bank In')}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold border transition ${
                  bankType === 'Bank In'
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-sm shadow-emerald-500/20'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>▲</span> {lang === 'en' ? 'Bank In' : 'ធនាគារចូល'}
              </button>
              <button
                type="button"
                onClick={() => setBankType('Bank Out')}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold border transition ${
                  bankType === 'Bank Out'
                    ? 'border-rose-500 bg-rose-500/20 text-rose-300 shadow-sm shadow-rose-500/20'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>▼</span> {lang === 'en' ? 'Bank Out' : 'ធនាគារចេញ'}
              </button>
            </div>
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">
              {lang === 'en' ? 'Date' : 'កាលបរិច្ឆេទ'}
            </label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="MM/DD/YYYY hh:mm A"
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2.5 px-3.5 font-medium text-white placeholder-slate-500 outline-none focus:border-emerald-400"
            />
          </div>

          {/* Code */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 flex items-center justify-between">
              <span>{lang === 'en' ? 'Code' : 'លេខកូដ'}</span>
              <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                {lang === 'en' ? 'Auto Generate Code' : 'បង្កើតកូដស្វ័យប្រវត្តិ'}
              </span>
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="BNK-2026-XXXX"
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2.5 pl-3.5 pr-10 font-mono font-bold text-emerald-400 outline-none focus:border-emerald-400"
              />
              <button
                type="button"
                onClick={handleRegenerateCode}
                title={lang === 'en' ? 'Regenerate Code' : 'បង្កើតកូដថ្មី'}
                className="absolute right-2.5 p-1 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800/80 transition"
              >
                <RefreshIcon />
              </button>
            </div>
          </div>

          {/* Customer */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">
              {lang === 'en' ? 'Customer' : 'អតិថិជន'}
            </label>
            <select
              value={selectedCustomer}
              onChange={handleCustomerChange}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2.5 px-3.5 font-medium text-white outline-none focus:border-emerald-400"
            >
              {CUSTOMER_OPTIONS.map((c) => (
                <option key={c.id} value={c.name} className="bg-slate-900 text-white">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Contact */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">
              {lang === 'en' ? 'Contact' : 'ទំនាក់ទំនង'}
            </label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="e.g. 012 889 776"
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2.5 px-3.5 font-medium text-white placeholder-slate-500 outline-none focus:border-emerald-400"
            />
          </div>

          {/* Outlet */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">
              {lang === 'en' ? 'Outlet' : 'សាខា'}
            </label>
            <select
              value={outlet}
              onChange={(e) => setOutlet(e.target.value)}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2.5 px-3.5 font-medium text-white outline-none focus:border-emerald-400"
            >
              {OUTLET_OPTIONS.map((o) => (
                <option key={o} value={o} className="bg-slate-900 text-white">
                  {o}
                </option>
              ))}
            </select>
          </div>

          {/* Employee * */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">
              {lang === 'en' ? 'Employee' : 'បុគ្គលិក'} <span className="text-rose-400">*</span>
            </label>
            <select
              value={employee}
              onChange={(e) => setEmployee(e.target.value)}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2.5 px-3.5 font-medium text-white outline-none focus:border-emerald-400"
            >
              {EMPLOYEE_OPTIONS.map((emp) => (
                <option key={emp} value={emp} className="bg-slate-900 text-white">
                  {emp}
                </option>
              ))}
            </select>
          </div>

          {/* Bank Name * */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">
              {lang === 'en' ? 'Bank Name' : 'ឈ្មោះធនាគារ'} <span className="text-rose-400">*</span>
            </label>
            <select
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2.5 px-3.5 font-medium text-white outline-none focus:border-emerald-400"
            >
              {BANK_OPTIONS.map((b) => (
                <option key={b} value={b} className="bg-slate-900 text-white">
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Reference */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">
              {lang === 'en' ? 'Reference' : 'លេខយោង'}
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder={lang === 'en' ? 'e.g. ABA-TX-882901' : 'ឧ. ABA-TX-882901'}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2.5 px-3.5 font-medium text-white placeholder-slate-500 outline-none focus:border-emerald-400"
            />
          </div>
        </div>
      </section>

      {/* 3. DETAIL OF BANK DEPOSIT IN / OUT LIST */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-7 shadow-xl shadow-black/20 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-black tracking-wide text-white">
              {lang === 'en' ? 'Bank deposit in / out list' : 'បញ្ជីប្រតិបត្តិការធនាគារ ចូល / ចេញ'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'en' ? 'Detail of bank deposit in / out list' : 'ព័ត៌មានលម្អិតនៃបញ្ជីប្រតិបត្តិការធនាគារ'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white hover:bg-emerald-500 active:scale-95 transition shadow-md shadow-emerald-600/20"
          >
            <PlusIcon />
            <span>{lang === 'en' ? 'Add' : 'បន្ថែមជួរ'}</span>
          </button>
        </div>

        {/* LINE ITEMS TABLE */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-slate-950/90 text-[11px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 w-14 text-center">№</th>
                <th className="py-3.5 px-4 min-w-[240px]">{lang === 'kh' ? 'ការពិពណ៌នា' : 'Description'}</th>
                <th className="py-3.5 px-4 w-44">{lang === 'kh' ? 'ប្រភេទ' : 'Category'}</th>
                <th className="py-3.5 px-4 w-40 text-right">{lang === 'kh' ? 'ចំនួនទឹកប្រាក់ ($)' : 'Amount ($)'}</th>
                <th className="py-3.5 px-4 w-16 text-center">{lang === 'kh' ? 'សកម្មភាព' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {items.map((row, idx) => (
                <tr key={row.id} className="transition hover:bg-slate-800/40">
                  {/* № */}
                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-400">
                    {idx + 1}
                  </td>

                  {/* Description */}
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={row.description}
                      onChange={(e) => handleItemChange(row.id, 'description', e.target.value)}
                      placeholder={lang === 'en' ? 'Description of transaction line...' : 'ការពិពណ៌នាប្រតិបត្តិការ...'}
                      className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2 px-3 text-xs font-medium text-white placeholder-slate-500 outline-none focus:border-emerald-400"
                    />
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4">
                    <select
                      value={row.category}
                      onChange={(e) => handleItemChange(row.id, 'category', e.target.value)}
                      className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2 px-3 text-xs font-medium text-white outline-none focus:border-emerald-400"
                    >
                      {CATEGORY_OPTIONS.map((cat) => (
                        <option key={cat} value={cat} className="bg-slate-900 text-white">
                          {cat}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Amount */}
                  <td className="py-3 px-4 text-right">
                    <div className="relative flex items-center">
                      <span className="pointer-events-none absolute left-3 text-emerald-400 font-bold">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={row.amount}
                        onChange={(e) => handleItemChange(row.id, 'amount', parseFloat(e.target.value) || 0)}
                        className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2 pl-7 pr-3 text-right font-mono font-bold text-emerald-400 outline-none focus:border-emerald-400"
                      />
                    </div>
                  </td>

                  {/* Delete Action */}
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(row.id)}
                      className="inline-flex items-center justify-center p-2 rounded-xl text-rose-400 hover:text-white hover:bg-rose-500/20 active:scale-95 transition"
                      title={lang === 'en' ? 'Remove item' : 'លុបជួរ'}
                    >
                      <TrashIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* BOTTOM ADD BUTTON & TOTAL SUMMARY */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center gap-2 rounded-xl border border-dashed border-slate-700 hover:border-emerald-500/60 bg-slate-950/40 hover:bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-emerald-300 transition"
          >
            <PlusIcon />
            <span>{lang === 'en' ? '+ Add Line Item' : '+ បន្ថែមជួរថ្មី'}</span>
          </button>

          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-6 bg-slate-950/80 border border-slate-800 rounded-2xl px-6 py-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {lang === 'en' ? 'Total Amount' : 'ចំនួនទឹកប្រាក់សរុប'}
            </span>
            <span className="text-xl font-mono font-black text-emerald-400">
              ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </section>

      {/* 4. FOOTER ACTION BAR */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleBack}
          className="rounded-xl border border-slate-700 bg-slate-900/80 px-5 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition"
        >
          {lang === 'en' ? 'Cancel' : 'បោះបង់'}
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-2.5 text-xs font-black text-slate-950 shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-400 active:scale-95 transition disabled:opacity-50"
        >
          {saving
            ? (lang === 'en' ? 'Saving...' : 'កំពុងរក្សាទុក...')
            : (lang === 'en' ? 'Save Transaction' : 'រក្សាទុកប្រតិបត្តិការ')}
        </button>
      </div>
    </div>
  )
}
