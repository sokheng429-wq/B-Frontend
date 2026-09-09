import React, { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useNotifications } from '../../context/NotificationContext'
import { adminBankTransferAPI } from '../../api/api'
import { exportStyledExcel } from '../../utils/excelExport'
import toggleIcon from '../../assets/icon/3dicons-toggle-dynamic-color.png'
import { CASH_BOOK_CATEGORIES } from './CashInOutList'
import BankTransferCreate from './BankTransferCreate'
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

const SAMPLE_TRANSFERS = [
  { id: 1, code: 'TRF-2026-0001', date: '2026-09-08T09:00:00', fromAccount: 'Counter Till #1 (Main Store)', toAccount: 'Vault / Strongbox Safe', amount: 1200.00, reference: 'INT-TR-0012', status: 'COMPLETED', note: 'Mid-morning till cash sweep drop' },
  { id: 2, code: 'TRF-2026-0002', date: '2026-09-07T15:30:00', fromAccount: 'Vault / Strongbox Safe', toAccount: 'ABA Bank - Corporate (USD)', amount: 3500.00, reference: 'CIT-ABA-889', status: 'COMPLETED', note: 'Armored cash deposit transport to bank branch' },
  { id: 3, code: 'TRF-2026-0003', date: '2026-09-06T10:15:00', fromAccount: 'ABA Bank - Corporate (USD)', toAccount: 'Petty Cash Register BKK1', amount: 500.00, reference: 'ABA-WD-2210', status: 'COMPLETED', note: 'Petty cash float replenishment' },
  { id: 4, code: 'TRF-2026-0004', date: '2026-09-05T17:00:00', fromAccount: 'Counter Till #2 (Toul Kork)', toAccount: 'Vault / Strongbox Safe', amount: 850.00, reference: 'INT-TR-0011', status: 'COMPLETED', note: 'Daily closing till transfer to branch safe' },
]

export default function BankTransferList() {
  const { lang } = useLanguage()
  const { showNotification } = useNotifications()

  const [isCreateMode, setIsCreateMode] = useState(false)
  const [transfers, setTransfers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Load from backend API with auto-sync from localStorage
  useEffect(() => {
    const fetchTransfers = async () => {
      setLoading(true)
      try {
        const res = await adminBankTransferAPI.getAll()
        if (res?.data && res.data.length > 0) {
          setTransfers(res.data)
        } else {
          // Check local cache
          let localItems = []
          try {
            const stored = localStorage.getItem('bg_bank_transfers')
            if (stored) localItems = JSON.parse(stored)
          } catch {}

          if (localItems && localItems.length > 0) {
            const migrated = []
            for (const item of localItems) {
              try {
                const created = await adminBankTransferAPI.create({
                  code: item.code,
                  date: item.date,
                  fromAccount: item.fromAccount,
                  toAccount: item.toAccount,
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
            setTransfers(migrated)
          } else {
            // Seed sample transfers
            const seeded = []
            for (const s of SAMPLE_TRANSFERS) {
              try {
                const created = await adminBankTransferAPI.create(s)
                if (created?.data) seeded.push(created.data)
              } catch {}
            }
            setTransfers(seeded.length > 0 ? seeded : SAMPLE_TRANSFERS)
          }
        }
      } catch (err) {
        console.warn('Failed to load bank transfers from backend:', err)
        try {
          const stored = localStorage.getItem('bg_bank_transfers')
          if (stored) setTransfers(JSON.parse(stored))
          else setTransfers(SAMPLE_TRANSFERS)
        } catch {
          setTransfers(SAMPLE_TRANSFERS)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchTransfers()
  }, [])

  const filtered = useMemo(() => {
    return transfers.filter((tr) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const inCode = (tr.code || '').toLowerCase().includes(q)
        const inFrom = (tr.fromAccount || '').toLowerCase().includes(q)
        const inTo = (tr.toAccount || '').toLowerCase().includes(q)
        const inRef = (tr.reference || '').toLowerCase().includes(q)
        if (!inCode && !inFrom && !inTo && !inRef) return false
      }
      return true
    })
  }, [transfers, searchQuery])

  const handleExport = () => {
    const headers = ['Code', 'Date', 'From Account', 'To Account', 'Amount ($)', 'Reference', 'Status', 'Note']
    const dataRows = filtered.map((tr) => [
      tr.code,
      new Date(tr.date).toLocaleString(),
      tr.fromAccount,
      tr.toAccount,
      tr.amount,
      tr.reference,
      tr.status,
      tr.note,
    ])
    exportStyledExcel({
      sheetName: 'Bank Transfers',
      title: "B'Groceries - Internal Bank Transfers",
      subtitle: `Exported on: ${new Date().toLocaleString()}`,
      headers,
      dataRows,
      fileName: `Bank_Transfers_${new Date().toISOString().slice(0, 10)}.xlsx`,
    })
    showNotification?.({ type: 'success', title: 'Export', message: 'Bank transfers exported to Excel.' })
  }

  if (isCreateMode) {
    return (
      <BankTransferCreate
        onCancel={() => setIsCreateMode(false)}
        onSuccess={(newRec) => {
          setTransfers((prev) => [newRec, ...prev])
          setIsCreateMode(false)
        }}
      />
    )
  }

  return (
    <div className="space-y-6 text-slate-100 font-['Montserrat']">
      {/* 1. HERO BREADCRUMB & BANNER */}
      <section className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#0b0f17] p-5 sm:p-7 shadow-2xl shadow-cyan-500/10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <Link
              to="/admin/cash-book"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-950/60 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300 transition hover:border-cyan-400 hover:text-white active:scale-95"
            >
              <ChevronLeftIcon /> {lang === 'en' ? 'Cash Book Hub' : 'សៀវភៅលុយ'}
            </Link>

            <div className="flex items-center gap-3.5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/15 p-2 ring-1 ring-cyan-500/30 shadow-lg shadow-cyan-500/20">
                <img src={toggleIcon} alt="" className="h-9 w-9 object-contain drop-shadow-md" />
              </span>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-cyan-400">
                  {lang === 'en' ? 'Internal Fund Movement' : 'ការផ្ទេរប្រាក់ផ្ទៃក្នុង'}
                </p>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {lang === 'en' ? 'Bank Transfers' : 'ផ្ទេរប្រាក់ផ្ទៃក្នុង'}
                </h1>
              </div>
            </div>

            <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-300">
              {lang === 'en'
                ? 'Relocate cash and deposits between store till drawers, central branch vaults, and company bank accounts.'
                : 'ផ្ទេរប្រាក់រវាងកុងទ័រលក់ ទូដែកផ្ទុកសាច់ប្រាក់ និងគណនីធនាគាររបស់ក្រុមហ៊ុន។'}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-center">
            <button
              type="button"
              onClick={() => setIsCreateMode(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-3 text-xs font-black text-slate-950 shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-blue-400 active:scale-95 transition"
            >
              <PlusIcon />
              <span>{lang === 'en' ? 'Create Transfer' : 'បង្កើតការផ្ទេរប្រាក់'}</span>
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
              const isActive = cat.key === 'bank-transfer'
              return (
                <Link
                  key={cat.key}
                  to={cat.route}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/25 scale-[1.02]'
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
              placeholder={lang === 'en' ? 'Search by code, account, ref...' : 'ស្វែងរកតាមលេខកូដ, គណនី...'}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2 pl-10 pr-4 text-xs font-semibold text-white placeholder-slate-500 outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-600 px-3.5 py-2 text-xs font-black text-white hover:bg-cyan-500 active:scale-95 transition"
            >
              <DownloadIcon />
              <span>{lang === 'en' ? 'Export' : 'នាំចេញ'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCreateMode(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-3.5 py-2 text-xs font-black text-slate-950 shadow-md shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-400 active:scale-95 transition"
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
                <th className="py-3.5 px-4">{lang === 'kh' ? 'ពីគណនី / កុងទ័រ' : 'From Account / Till'}</th>
                <th className="py-3.5 px-4">{lang === 'kh' ? 'ទៅកាន់' : 'To Account'}</th>
                <th className="py-3.5 px-4 text-right">{lang === 'kh' ? 'ចំនួនទឹកប្រាក់ ($)' : 'Amount ($)'}</th>
                <th className="py-3.5 px-4">{lang === 'kh' ? 'លេខយោង' : 'Reference'}</th>
                <th className="py-3.5 px-4">{lang === 'kh' ? 'ស្ថានភាព' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {filtered.map((tr) => (
                <tr key={tr.id} className="transition hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400">{tr.code}</td>
                  <td className="py-3 px-4 text-slate-300">{new Date(tr.date).toLocaleString()}</td>
                  <td className="py-3 px-4 text-rose-300 font-medium">{tr.fromAccount}</td>
                  <td className="py-3 px-4 text-emerald-300 font-medium">{tr.toAccount}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-yellow-400">
                    ${Number(tr.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">{tr.reference}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      ● {tr.status}
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
