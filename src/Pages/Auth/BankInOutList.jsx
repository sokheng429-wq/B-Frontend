import React, { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useNotifications } from '../../context/NotificationContext'
import { adminBankTransactionAPI } from '../../api/api'
import { exportStyledExcel } from '../../utils/excelExport'
import creditCardIcon from '../../assets/icon/3dicons-credit-card-dynamic-color.png'
import { CASH_BOOK_CATEGORIES } from './CashInOutList'
import BankInOutCreate from './BankInOutCreate'
import './ProductsHub.css'

function PlusIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}

function SearchIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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

function ChevronLeftIcon({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const SAMPLE_BANK_TRANSACTIONS = [
  { id: 1, code: 'BNK-2026-0001', date: '2026-09-08T09:30:00', type: 'BANK_IN', bank: 'ABA Bank - Corporate (USD)', amount: 4850.00, reference: 'ABA-TX-998124', status: 'COMPLETED', note: 'Online KHQR merchant store sales batch settlement' },
  { id: 2, code: 'BNK-2026-0002', date: '2026-09-08T11:00:00', type: 'BANK_OUT', bank: 'Canadia Bank (USD)', amount: 2400.00, reference: 'CAN-TR-443102', status: 'COMPLETED', note: 'Wire transfer for bulk dairy cold chain import' },
  { id: 3, code: 'BNK-2026-0003', date: '2026-09-07T14:15:00', type: 'BANK_IN', bank: 'ACLEDA Bank Plc (USD)', amount: 1950.00, reference: 'ACL-CD-112940', status: 'COMPLETED', note: 'Customer deposit wire transfer for wholesale reservation' },
  { id: 4, code: 'BNK-2026-0004', date: '2026-09-06T16:20:00', type: 'BANK_OUT', bank: 'ABA Bank - Corporate (USD)', amount: 620.00, reference: 'ABA-UT-781920', status: 'COMPLETED', note: 'Direct debit for Phnom Penh cold warehouse power utility' },
  { id: 5, code: 'BNK-2026-0005', date: '2026-09-05T10:45:00', type: 'BANK_IN', bank: 'Wing Bank (KHR)', amount: 800.00, reference: 'WNG-QR-665120', status: 'COMPLETED', note: 'Wing QR counter checkout daily settlement' },
]

export default function BankInOutList() {
  const { lang } = useLanguage()
  const { showNotification } = useNotifications()

  const [isCreateMode, setIsCreateMode] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')

  // Load from backend API with auto-sync from localStorage
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true)
      try {
        const res = await adminBankTransactionAPI.getAll()
        if (res?.data && res.data.length > 0) {
          setTransactions(res.data)
        } else {
          // Check local cache
          let localItems = []
          try {
            const stored = localStorage.getItem('bg_bank_in_out')
            if (stored) localItems = JSON.parse(stored)
          } catch {}

          if (localItems && localItems.length > 0) {
            const migrated = []
            for (const item of localItems) {
              try {
                const created = await adminBankTransactionAPI.create({
                  code: item.code,
                  date: item.date,
                  type: item.type,
                  bank: item.bank,
                  amount: Number(item.amount) || 0,
                  reference: item.reference,
                  status: item.status || 'COMPLETED',
                  note: item.note,
                })
                if (created?.data) migrated.push(created.data)
              } catch {
                migrated.push(item)
              }
            }
            setTransactions(migrated)
          } else {
            // Seed sample transactions
            const seeded = []
            for (const s of SAMPLE_BANK_TRANSACTIONS) {
              try {
                const created = await adminBankTransactionAPI.create(s)
                if (created?.data) seeded.push(created.data)
              } catch {}
            }
            setTransactions(seeded.length > 0 ? seeded : SAMPLE_BANK_TRANSACTIONS)
          }
        }
      } catch (err) {
        console.warn('Failed to load bank transactions from backend:', err)
        try {
          const stored = localStorage.getItem('bg_bank_in_out')
          if (stored) setTransactions(JSON.parse(stored))
          else setTransactions(SAMPLE_BANK_TRANSACTIONS)
        } catch {
          setTransactions(SAMPLE_BANK_TRANSACTIONS)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchTransactions()
  }, [])

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (typeFilter !== 'ALL' && tx.type !== typeFilter) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const inCode = tx.code.toLowerCase().includes(q)
        const inBank = tx.bank.toLowerCase().includes(q)
        const inRef = tx.reference.toLowerCase().includes(q)
        const inNote = tx.note.toLowerCase().includes(q)
        if (!inCode && !inBank && !inRef && !inNote) return false
      }
      return true
    })
  }, [transactions, searchQuery, typeFilter])

  const handleExport = () => {
    const headers = ['Code', 'Date', 'Type', 'Amount ($)', 'Bank Account', 'Reference', 'Status', 'Note']
    const dataRows = filtered.map((tx) => [
      tx.code,
      new Date(tx.date).toLocaleString(),
      tx.type === 'BANK_IN' ? 'Bank In' : 'Bank Out',
      tx.amount,
      tx.bank,
      tx.reference,
      tx.status,
      tx.note,
    ])
    exportStyledExcel({
      sheetName: 'Bank In Out',
      title: "B'Groceries - Bank In / Out Register",
      subtitle: `Exported on: ${new Date().toLocaleString()}`,
      headers,
      dataRows,
      fileName: `Bank_In_Out_${new Date().toISOString().slice(0, 10)}.xlsx`,
    })
    showNotification?.({ type: 'success', title: 'Export', message: 'Bank transactions exported to Excel.' })
  }

  if (isCreateMode) {
    return (
      <BankInOutCreate
        onCancel={() => setIsCreateMode(false)}
        onSuccess={(newRec) => {
          setTransactions((prev) => [newRec, ...prev])
          setIsCreateMode(false)
        }}
      />
    )
  }

  return (
    <div className="space-y-6 text-slate-100 font-['Montserrat']">
      {/* 1. HERO BREADCRUMB & BANNER */}
      <section className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#0b0f17] p-5 sm:p-7 shadow-2xl shadow-emerald-500/10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <Link
              to="/admin/cash-book"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-950/60 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300 transition hover:border-emerald-400 hover:text-white active:scale-95"
            >
              <ChevronLeftIcon /> {lang === 'en' ? 'Cash Book Hub' : 'សៀវភៅលុយ'}
            </Link>

            <div className="flex items-center gap-3.5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 p-2 ring-1 ring-emerald-500/30 shadow-lg shadow-emerald-500/20">
                <img src={creditCardIcon} alt="" className="h-9 w-9 object-contain drop-shadow-md" />
              </span>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-emerald-400">
                  {lang === 'en' ? 'Treasury & Bank Register' : 'កំណត់ត្រាធនាគារ'}
                </p>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {lang === 'en' ? 'Bank In / Out Register' : 'ធនាគារ ចូល / ចេញ'}
                </h1>
              </div>
            </div>

            <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-300">
              {lang === 'en'
                ? 'Track company bank deposits, credit card settlements, ABA KHQR gateway batch receipts, and electronic disbursements.'
                : 'តាមដានការដាក់ប្រាក់ ដកប្រាក់ ការផ្ទេរប្រាក់ និងការទូទាត់អេឡិចត្រូនិកតាមធនាគារ។'}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-center">
            <button
              type="button"
              onClick={() => setIsCreateMode(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-xs font-black text-slate-950 shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-400 active:scale-95 transition"
            >
              <PlusIcon />
              <span>{lang === 'en' ? 'Create Transaction' : 'បង្កើតប្រតិបត្តិការថ្មី'}</span>
            </button>
          </div>
        </div>

        {/* 8 CASH BOOK CATEGORY PILLS BAR */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            {lang === 'en' ? 'Cash Book Categories:' : 'ប្រភេទសៀវភៅលុយ៖'}
          </p>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {CASH_BOOK_CATEGORIES.map((cat) => {
              const isActive = cat.key === 'bank-in-out'
              return (
                <Link
                  key={cat.key}
                  to={cat.route}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/25 scale-[1.02]'
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

      {/* 2. SEARCH & LIST */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl shadow-black/20 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
              <SearchIcon />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'en' ? 'Search by code, bank account, ref...' : 'ស្វែងរកតាមលេខកូដ, ធនាគារ...'}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2 pl-10 pr-4 text-xs font-semibold text-white placeholder-slate-500 outline-none focus:border-emerald-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-xl border border-slate-700/80 bg-slate-950 py-2 px-3 text-xs font-semibold text-white outline-none focus:border-emerald-400"
            >
              <option value="ALL">{lang === 'en' ? 'All Types' : 'ប្រភេទទាំងអស់'}</option>
              <option value="BANK_IN">{lang === 'en' ? 'Bank In' : 'ធនាគារចូល'}</option>
              <option value="BANK_OUT">{lang === 'en' ? 'Bank Out' : 'ធនាគារចេញ'}</option>
            </select>

            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-black text-white hover:bg-emerald-500 active:scale-95 transition"
            >
              <DownloadIcon />
              <span>{lang === 'en' ? 'Export' : 'នាំចេញ'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCreateMode(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-3.5 py-2 text-xs font-black text-slate-950 shadow-md shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 active:scale-95 transition"
            >
              <PlusIcon />
              <span>{lang === 'en' ? 'Create' : 'បង្កើត'}</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-slate-950/90 text-[11px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">{lang === 'kh' ? 'លេខកូដ' : 'Code'}</th>
                <th className="py-3.5 px-4">{lang === 'kh' ? 'កាលបរិច្ឆេទ' : 'Date'}</th>
                <th className="py-3.5 px-4">{lang === 'kh' ? 'ប្រភេទ' : 'Type'}</th>
                <th className="py-3.5 px-4 text-right">{lang === 'kh' ? 'ចំនួនទឹកប្រាក់ ($)' : 'Amount ($)'}</th>
                <th className="py-3.5 px-4">{lang === 'kh' ? 'គណនីធនាគារ' : 'Bank Account'}</th>
                <th className="py-3.5 px-4">{lang === 'kh' ? 'លេខយោង' : 'Reference'}</th>
                <th className="py-3.5 px-4">{lang === 'kh' ? 'ស្ថានភាព' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {filtered.map((tx) => (
                <tr key={tx.id} className="transition hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-emerald-400">{tx.code}</td>
                  <td className="py-3 px-4 text-slate-300">{new Date(tx.date).toLocaleString()}</td>
                  <td className="py-3 px-4">
                    {tx.type === 'BANK_IN' ? (
                      <span className="inline-flex rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-black text-emerald-400">
                        ▲ Bank In
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 text-[10px] font-black text-rose-400">
                        ▼ Bank Out
                      </span>
                    )}
                  </td>
                  <td className={`py-3 px-4 text-right font-mono font-bold ${tx.type === 'BANK_IN' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {tx.type === 'BANK_IN' ? '+' : '-'}${Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-white font-medium">{tx.bank}</td>
                  <td className="py-3 px-4 font-mono text-yellow-300">{tx.reference}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      ● {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
