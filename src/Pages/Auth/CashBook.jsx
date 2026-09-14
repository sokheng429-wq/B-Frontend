import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useTheme } from '../../context/ThemeContext'
import folderIcon from '../../assets/icon/3dicons-folder-dynamic-color.png'
import moneyBagIcon from '../../assets/icon/3dicons-money-bag-dynamic-color.png'
import creditCardIcon from '../../assets/icon/3dicons-credit-card-dynamic-color.png'
import toggleIcon from '../../assets/icon/3dicons-toggle-dynamic-color.png'
import dollarIcon from '../../assets/icon/3dicons-dollar-dynamic-color.png'
import chartIcon from '../../assets/icon/3dicons-chart-dynamic-color.png'
import crownIcon from '../../assets/icon/3dicons-crown-dynamic-color.png'
import walletIcon from '../../assets/icon/3dicons-wallet-dynamic-color.png'
import './ProductsHub.css'

export const CASH_BANK_MODULES = [
  {
    key: 'cash-category',
    icon: folderIcon,
    en: 'Cash Category',
    kh: 'ក្រុមលុយសាច់',
    descEn: 'Configure cash voucher categories (operating expense, petty cash, owner draw).',
    descKh: 'កំណត់ប្រភេទចំណាយសាច់ប្រាក់ (ចំណាយប្រតិបត្តិការ លុយរាយ និងដកផ្ទាល់ខ្លួន)។',
    color: '#3B82F6',
    bg: 'rgba(59, 130, 246, 0.12)',
    category: 'cash',
    tag: 'Master',
    route: '/admin/cash-book/cash-category',
  },
  {
    key: 'cash-in-out',
    icon: moneyBagIcon,
    en: 'Cash In / Out Register',
    kh: 'លុយសាច់ ចូល/ចេញ',
    descEn: 'Record daily store cash receipts and petty cash counter disbursements.',
    descKh: 'កត់ត្រាការទទួលប្រាក់ចំណូល និងការចំណាយសាច់ប្រាក់រាយប្រចាំថ្ងៃ។',
    color: '#FF9900',
    bg: 'rgba(255, 153, 0, 0.12)',
    category: 'cash',
    tag: 'Core',
    route: '/admin/cash-book/cash-in-out',
  },
  {
    key: 'bank-in-out',
    icon: creditCardIcon,
    en: 'Bank In / Out Register',
    kh: 'ធនាគារ ចូល/ចេញ',
    descEn: 'Track bank deposits, withdrawals, online payment gateway settlements, and wire receipts.',
    descKh: 'តាមដានការដាក់ប្រាក់ ដកប្រាក់ និងការផ្ទេរប្រាក់តាមធនាគារ។',
    color: '#77BC1F',
    bg: 'rgba(119, 188, 31, 0.12)',
    category: 'cash',
    tag: 'Banking',
    route: '/admin/cash-book/bank-in-out',
  },
  {
    key: 'bank-transfer',
    icon: toggleIcon,
    en: 'Bank Transfer',
    kh: 'ផ្ទេរប្រាក់ផ្ទៃក្នុង',
    descEn: 'Move funds between store till registers, vaults, petty cash boxes and company bank accounts.',
    descKh: 'ផ្ទេរប្រាក់រវាងកុងទ័រលក់ ទូដែក និងគណនីធនាគារក្រុមហ៊ុន។',
    color: '#06b6d4',
    bg: 'rgba(6, 182, 212, 0.12)',
    category: 'cash',
    route: '/admin/cash-book/bank-transfer',
  },
]

export const SETTLEMENT_MODULES = [
  {
    key: 'customer-deposit',
    icon: walletIcon,
    en: 'Customer Deposit',
    kh: 'ទទួលប្រាក់កក់អតិថិជន',
    descEn: 'Receive customer advance funds directly into cash book ledger.',
    descKh: 'ទទួលប្រាក់កក់មុនពីអតិថិជនចូលទៅក្នុងសៀវភៅលុយ។',
    color: '#a855f7',
    bg: 'rgba(168, 85, 247, 0.12)',
    category: 'settlement',
    tag: 'AR Deposit',
    route: '/admin/cash-book/customer-deposit',
  },
  {
    key: 'ar-collection',
    icon: dollarIcon,
    en: 'AR Collection',
    kh: 'ការប្រមូលប្រាក់ទារបំណុល',
    descEn: 'Settle outstanding sales invoices and log cash receipts.',
    descKh: 'ទូទាត់វិក័យប័ត្រជំពាក់ និងកត់ត្រាប្រាក់ចំណូលចូលសៀវភៅ។',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.12)',
    category: 'settlement',
    tag: 'Collection',
    route: '/admin/cash-book/ar-collection',
  },
  {
    key: 'supplier-deposit',
    icon: crownIcon,
    en: 'Supplier Deposit',
    kh: 'ប្រាក់កក់អ្នកផ្គត់ផ្គង់',
    descEn: 'Disburse advance deposits for purchase orders to farms and vendors.',
    descKh: 'ទូទាត់ប្រាក់កក់មុនសម្រាប់បញ្ជាទិញទៅកសិដ្ឋាន និងអ្នកផ្គត់ផ្គង់។',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.12)',
    category: 'settlement',
    route: '/admin/cash-book/supplier-deposit',
  },
  {
    key: 'bill-payment',
    icon: chartIcon,
    en: 'Bill Payment',
    kh: 'ការទូទាត់ប៊ីលអ្នកផ្គត់ផ្គង់',
    descEn: 'Clear vendor accounts payable via cash vouchers or bank payments.',
    descKh: 'ទូទាត់ប៊ីលជំពាក់អ្នកផ្គត់ផ្គង់តាមប័ណ្ណទូទាត់ ឬផ្ទេរប្រាក់។',
    color: '#ec4899',
    bg: 'rgba(236, 72, 153, 0.12)',
    category: 'settlement',
    tag: 'AP Pay',
    route: '/admin/cash-book/bill-payment',
  },
]

export const ALL_CASH_MODULES = [...CASH_BANK_MODULES, ...SETTLEMENT_MODULES]

function ChevronLeftIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
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

function ModuleCard({ item, lang }) {
  const { isDark } = useTheme()

  return (
    <Link
      to={item.route || '/admin/cash-book'}
      className={`hub-card group relative overflow-hidden flex flex-col justify-between rounded-2xl border p-4 sm:p-5 text-left transition-all duration-300 hover:shadow-xl ${
        isDark
          ? 'border-slate-800 bg-[#141922]/90 hover:border-slate-700 hover:bg-[#1a2230] hover:shadow-black/40'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 shadow-md shadow-slate-200/50'
      }`}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-25"
        style={{ background: item.color }}
      />

      <div className="relative space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div
            className="hub-icon flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-xl ring-1 transition-all duration-300 group-hover:scale-110"
            style={{
              background: item.bg,
              borderColor: item.color + '40',
            }}
          >
            <img src={item.icon} alt="" className="h-7 w-7 sm:h-8 sm:w-8 object-contain drop-shadow" />
          </div>
          {item.tag && (
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider font-mono shadow-sm"
              style={{
                background: item.bg,
                color: item.color,
                border: `1px solid ${item.color}40`,
              }}
            >
              {item.tag}
            </span>
          )}
        </div>

        <div>
          <h3 className={`text-sm sm:text-base font-bold tracking-tight transition-colors font-['Montserrat'] ${
            isDark ? 'text-white group-hover:text-amber-300' : 'text-slate-950 group-hover:text-amber-600'
          }`}>
            {lang === 'kh' ? item.kh : item.en}
          </h3>
          <p className={`mt-1 text-xs leading-relaxed line-clamp-2 ${
            isDark ? 'text-slate-400' : 'text-slate-700 font-medium'
          }`}>
            {lang === 'kh' ? item.descKh : item.descEn}
          </p>
        </div>
      </div>

      <div
        className={`relative mt-4 flex items-center justify-between pt-3 border-t text-xs font-bold transition-all ${
          isDark ? 'border-slate-800/80' : 'border-slate-200'
        }`}
        style={{ color: item.color }}
      >
        <span>{lang === 'kh' ? 'បើកដំណើរការ' : 'Open Module'}</span>
        <span className="transform transition-transform duration-200 group-hover:translate-x-1">
          <ChevronIcon />
        </span>
      </div>
    </Link>
  )
}

export default function CashBook() {
  const { lang } = useLanguage()
  const { isDark } = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredModules = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    let list = ALL_CASH_MODULES

    if (activeCategory === 'cash') {
      list = CASH_BANK_MODULES
    } else if (activeCategory === 'settlement') {
      list = SETTLEMENT_MODULES
    }

    if (!q) return list

    return list.filter((s) => {
      const en = (s.en || '').toLowerCase()
      const kh = (s.kh || '').toLowerCase()
      const descEn = (s.descEn || '').toLowerCase()
      const descKh = (s.descKh || '').toLowerCase()
      const key = (s.key || '').toLowerCase()
      return en.includes(q) || kh.includes(q) || descEn.includes(q) || descKh.includes(q) || key.includes(q)
    })
  }, [searchQuery, activeCategory])

  const cashFiltered = useMemo(
    () => filteredModules.filter((s) => s.category === 'cash'),
    [filteredModules]
  )
  const settlementFiltered = useMemo(
    () => filteredModules.filter((s) => s.category === 'settlement'),
    [filteredModules]
  )

  return (
    <div className={`space-y-6 ${isDark ? 'text-slate-100' : 'text-slate-900'}`} style={{ fontFamily: 'Montserrat, sans-serif' }}>
      {/* 1. HERO BANNER */}
      <section className={`relative overflow-hidden rounded-3xl border p-5 sm:p-7 shadow-2xl transition-colors duration-300 ${
        isDark
          ? 'border-yellow-500/20 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#0b0f17] shadow-yellow-500/10'
          : 'border-amber-200/80 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/50 shadow-amber-900/5'
      }`}>
        <div className={`pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full blur-3xl ${
          isDark ? 'bg-yellow-500/15' : 'bg-yellow-500/10'
        }`} />
        <div className="pointer-events-none absolute bottom-0 left-1/4 h-px w-2/3 bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <Link
              to="/admin"
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] transition active:scale-95 ${
                isDark
                  ? 'border-slate-700/80 bg-slate-950/60 text-yellow-300 hover:border-yellow-400 hover:text-white'
                  : 'border-amber-200 bg-white text-amber-700 hover:border-amber-300 hover:text-amber-900 shadow-xs'
              }`}
            >
              <ChevronLeftIcon /> {lang === 'en' ? 'Dashboard' : 'ផ្ទាំងគ្រប់គ្រង'}
            </Link>

            <div className="flex items-center gap-3.5">
              <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl p-2 ring-1 shadow-lg ${
                isDark
                  ? 'bg-yellow-500/15 ring-yellow-500/30 shadow-yellow-500/20'
                  : 'bg-amber-500/15 ring-amber-500/30 shadow-amber-500/10'
              }`}>
                <img src={moneyBagIcon} alt="" className="h-9 w-9 object-contain drop-shadow-md" />
              </span>
              <div>
                <p className={`text-[11px] font-black uppercase tracking-[0.25em] ${isDark ? 'text-yellow-400' : 'text-amber-600'}`}>
                  {lang === 'en' ? "B'Groceries Treasury & Banking" : 'រតនាគារ និងសៀវភៅលុយ'}
                </p>
                <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>
                  {lang === 'en' ? 'Cash Book & Treasury Hub' : 'មជ្ឈមណ្ឌលសៀវភៅលុយ និងធនាគារ'}
                </h1>
              </div>
            </div>

            <p className={`max-w-2xl text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700 font-medium'}`}>
              {lang === 'en'
                ? 'Treasury and cash flow management — track store cash register entries, bank deposits, internal vault transfers, customer payments and supplier settlements.'
                : 'គ្រប់គ្រងរតនាគារ និងលំហូរសាច់ប្រាក់ — តាមដានចំណូលចំណាយសាច់ប្រាក់កុងទ័រ ប្រតិបត្តិការធនាគារ ការផ្ទេរប្រាក់ផ្ទៃក្នុង និងការទូទាត់បំណុល។'}
            </p>
          </div>

          {/* Quick Stats Widget */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:flex lg:flex-col shrink-0 min-w-[220px]">
            <div className={`rounded-2xl border p-3.5 shadow-md ${
              isDark ? 'border-slate-800 bg-slate-950/80' : 'border-slate-200 bg-white shadow-slate-200/60'
            }`}>
              <div className={`flex items-center justify-between text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                <span>{lang === 'en' ? 'Treasury Channels' : 'ម៉ូឌុលរតនាគារ'}</span>
                <span className={isDark ? 'text-yellow-400' : 'text-amber-600 font-bold'}>● Active</span>
              </div>
              <p className={`mt-1 font-mono text-2xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
                {ALL_CASH_MODULES.length}
              </p>
            </div>

            <div className={`rounded-2xl border p-3.5 shadow-md ${
              isDark ? 'border-slate-800 bg-slate-950/80' : 'border-slate-200 bg-white shadow-slate-200/60'
            }`}>
              <div className={`flex items-center justify-between text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                <span>{lang === 'en' ? 'Daily Reconciliation' : 'ការផ្ទៀងផ្ទាត់ប្រចាំថ្ងៃ'}</span>
                <span className="text-emerald-500 font-bold">● Balanced</span>
              </div>
              <p className={`mt-1 font-mono text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Multi-Currency Ready
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SEARCH & CATEGORY FILTER BAR */}
      <div className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border backdrop-blur-md p-3.5 shadow-lg ${
        isDark ? 'border-slate-800/80 bg-[#1e293b]/70' : 'border-slate-200 bg-white shadow-slate-200/50'
      }`}>
        <div className="relative flex-1 max-w-md">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              lang === 'en'
                ? 'Search cash vouchers, bank transfers, collections, settlements...'
                : 'ស្វែងរកប័ណ្ណសាច់ប្រាក់ ផ្ទេរធនាគារ ការប្រមូលប្រាក់...'
            }
            className={`w-full rounded-xl border py-2 pl-9 pr-8 text-xs font-semibold outline-none transition ${
              isDark
                ? 'border-slate-700/80 bg-slate-950/90 text-white placeholder-slate-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20'
                : 'border-slate-300 bg-slate-50 text-slate-950 placeholder-slate-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
            }`}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${
                isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-950'
              }`}
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { key: 'all', en: 'All Modules', kh: 'ទាំងអស់', count: ALL_CASH_MODULES.length },
            { key: 'cash', en: 'Cash & Banking', kh: 'លុយសាច់ និងធនាគារ', count: CASH_BANK_MODULES.length },
            { key: 'settlement', en: 'Settlements & Counter', kh: 'ការទូទាត់ និងកុងទ័រ', count: SETTLEMENT_MODULES.length },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveCategory(tab.key)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition whitespace-nowrap active:scale-95 ${
                activeCategory === tab.key
                  ? isDark
                    ? 'bg-yellow-500 text-slate-950 shadow-md shadow-yellow-500/20 font-black'
                    : 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 font-black'
                  : isDark
                    ? 'bg-slate-900/80 text-slate-400 border border-slate-700/60 hover:text-white hover:border-slate-500'
                    : 'bg-slate-100 text-slate-700 border border-slate-200 hover:text-slate-950 hover:bg-slate-200/70'
              }`}
            >
              <span>{lang === 'kh' ? tab.kh : tab.en}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                  activeCategory === tab.key
                    ? 'bg-slate-950 text-amber-300 font-bold'
                    : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. FEATURED ACTION CARD (Daily Cash In / Out Register) */}
      {(!searchQuery || 'cash in out'.includes(searchQuery.toLowerCase())) && (
        <Link
          to="/admin/cash-book/cash-in-out"
          className={`hub-hero-card group relative overflow-hidden flex flex-col gap-4 rounded-3xl border p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 sm:flex-row sm:items-center sm:justify-between shadow-xl ${
            isDark
              ? 'border-[#FF9900]/30 bg-gradient-to-r from-[#FF9900]/15 via-amber-900/10 to-[#1e293b]/70 hover:border-[#FF9900]/60 hover:shadow-[#FF9900]/10 shadow-black/20'
              : 'border-[#FF9900]/40 bg-gradient-to-r from-amber-50 via-white to-orange-50/60 hover:border-[#FF9900]/80 hover:shadow-orange-500/15 shadow-slate-200/60'
          }`}
        >
          <div className="flex items-center gap-3.5 sm:gap-4">
            <span className={`flex h-13 w-13 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl text-2xl ring-1 shadow-lg transition-transform duration-300 group-hover:scale-105 ${
              isDark
                ? 'bg-[#FF9900]/20 text-white ring-[#FF9900]/40 shadow-[#FF9900]/10'
                : 'bg-amber-100/80 text-slate-950 ring-[#FF9900]/50 shadow-amber-500/10'
            }`}>
              💸
            </span>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className={`text-base sm:text-lg font-black tracking-tight font-['Montserrat'] ${
                  isDark ? 'text-white' : 'text-slate-950'
                }`}>
                  {lang === 'en' ? 'Daily Cash In / Out Register' : 'កត់ត្រាលុយសាច់ ចូល/ចេញ ប្រចាំថ្ងៃ'}
                </h3>
                <span className="hero-tag rounded-full bg-[#FF9900] px-2.5 py-0.5 text-[10px] font-black text-slate-950 uppercase tracking-wider shadow-xs">
                  Live Register
                </span>
              </div>
              <p className={`text-xs sm:text-sm max-w-2xl leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-700 font-medium'
              }`}>
                {lang === 'en'
                  ? 'Issue petty cash vouchers, record store counter proceeds, and audit evening closing cash drawer tallies.'
                  : 'ចេញប័ណ្ណចំណាយរាយ កត់ត្រាប្រាក់ចំណូលកុងទ័រ និងផ្ទៀងផ្ទាត់សមតុល្យលុយពេលបិទវេន។'}
              </p>
            </div>
          </div>

          <div className={`inline-flex items-center gap-2 self-start sm:self-center rounded-xl px-4 py-2.5 text-xs font-black transition-all duration-300 shrink-0 shadow-sm ${
            isDark
              ? 'bg-[#FF9900]/20 text-[#FF9900] ring-1 ring-[#FF9900]/40 group-hover:bg-[#FF9900] group-hover:text-slate-950 group-hover:shadow-md group-hover:shadow-[#FF9900]/20'
              : 'bg-[#FF9900] text-slate-950 ring-1 ring-[#FF9900]/60 group-hover:bg-[#e68a00] group-hover:shadow-md group-hover:shadow-orange-600/20'
          }`}>
            <span>{lang === 'en' ? 'Open Cash Register' : 'បើកបញ្ជីសាច់ប្រាក់'}</span>
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </div>
        </Link>
      )}

      {/* 4. CASH & BANKING SECTION */}
      {cashFiltered.length > 0 && (
        <section className={`rounded-3xl border p-5 sm:p-6 shadow-xl space-y-4 ${
          isDark ? 'border-slate-800 bg-slate-900/80 shadow-black/20' : 'border-slate-200 bg-white shadow-slate-200/50'
        }`}>
          <div className={`flex items-center justify-between pb-2 border-b ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
            <div className="flex items-center gap-3">
              <div className="h-5 w-1.5 rounded-full bg-[#FF9900]" />
              <div>
                <h2 className={`text-base font-bold font-['Montserrat'] ${isDark ? 'text-white' : 'text-slate-950'}`}>
                  {lang === 'en' ? 'Cash & Banking Operations' : 'ប្រតិបត្តិការសាច់ប្រាក់ និងធនាគារ'}
                </h2>
                <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                  {lang === 'en' ? 'Cash voucher categories, store registers, bank in/out, and internal fund transfers' : 'ក្រុមលុយសាច់ សៀវភៅលុយចូល/ចេញ ធនាគារ និងការផ្ទេរប្រាក់ផ្ទៃក្នុង'}
                </p>
              </div>
            </div>
            <span className={`text-xs font-mono font-medium ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
              {cashFiltered.length} items
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cashFiltered.map((item) => (
              <ModuleCard key={item.key} item={item} lang={lang} />
            ))}
          </div>
        </section>
      )}

      {/* 5. SETTLEMENT & COUNTER SECTION */}
      {settlementFiltered.length > 0 && (
        <section className={`rounded-3xl border p-5 sm:p-6 shadow-xl space-y-4 ${
          isDark ? 'border-slate-800 bg-slate-900/80 shadow-black/20' : 'border-slate-200 bg-white shadow-slate-200/50'
        }`}>
          <div className={`flex items-center justify-between pb-2 border-b ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
            <div className="flex items-center gap-3">
              <div className="h-5 w-1.5 rounded-full bg-[#77BC1F]" />
              <div>
                <h2 className={`text-base font-bold font-['Montserrat'] ${isDark ? 'text-white' : 'text-slate-950'}`}>
                  {lang === 'en' ? 'Counter Collections & Settlements' : 'ការប្រមូលប្រាក់ និងទូទាត់បំណុល'}
                </h2>
                <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                  {lang === 'en'
                    ? 'Customer deposits, sales invoice receipts, supplier downpayments and vendor bill payouts'
                    : 'ប្រាក់កក់អតិថិជន ការទទួលប្រាក់លក់ ប្រាក់កក់អ្នកផ្គត់ផ្គង់ និងការបង់ប៊ីល'}
                </p>
              </div>
            </div>
            <span className={`text-xs font-mono font-medium ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
              {settlementFiltered.length} items
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {settlementFiltered.map((item) => (
              <ModuleCard key={item.key} item={item} lang={lang} />
            ))}
          </div>
        </section>
      )}

      {/* Empty Search State */}
      {filteredModules.length === 0 && (
        <div className={`rounded-2xl border border-dashed p-12 text-center space-y-3 ${
          isDark ? 'border-slate-700 bg-slate-950/60' : 'border-slate-300 bg-slate-50'
        }`}>
          <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-3xl ${
            isDark ? 'bg-slate-900' : 'bg-slate-200'
          }`}>
            🔍
          </div>
          <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>
            {lang === 'en' ? `No modules found matching "${searchQuery}"` : `រកមិនឃើញម៉ូឌុលដែលត្រូវនឹង "${searchQuery}" ទេ`}
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className={`rounded-xl border px-4 py-1.5 text-xs font-bold transition ${
              isDark ? 'border-slate-700 bg-slate-800 text-white hover:bg-slate-700' : 'border-slate-300 bg-white text-slate-950 hover:bg-slate-100 shadow-xs'
            }`}
          >
            {lang === 'en' ? 'Clear Search' : 'សម្អាតការស្វែងរក'}
          </button>
        </div>
      )}
    </div>
  )
}
