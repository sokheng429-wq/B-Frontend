import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import creditCardIcon from '../../assets/icon/3dicons-credit-card-dynamic-color.png'
import fileTextIcon from '../../assets/icon/3dicons-file-text-dynamic-color.png'
import walletIcon from '../../assets/icon/3dicons-wallet-dynamic-color.png'
import travelIcon from '../../assets/icon/3dicons-travel-dynamic-color.png'
import dollarIcon from '../../assets/icon/3dicons-dollar-dynamic-color.png'
import chartIcon from '../../assets/icon/3dicons-chart-dynamic-color.png'
import crownIcon from '../../assets/icon/3dicons-crown-dynamic-color.png'
import calculatorIcon from '../../assets/icon/3dicons-calculator-dynamic-color.png'
import './ProductsHub.css'

export const VENDOR_BILLING_MODULES = [
  {
    key: 'enter-bill',
    icon: fileTextIcon,
    en: 'Enter Vendor Bill',
    kh: 'បញ្ចូលប៊ីលអ្នកផ្គត់ផ្គង់',
    descEn: 'Match supplier invoices against received PO batches and register payable bills.',
    descKh: 'ផ្ទៀងផ្ទាត់វិក័យប័ត្រអ្នកផ្គត់ផ្គង់ជាមួយ PO និងបញ្ចូលប៊ីលត្រូវបង់។',
    color: '#3B82F6',
    bg: 'rgba(59, 130, 246, 0.12)',
    category: 'bills',
    tag: 'Core',
    route: '/admin/payable-management/enter-bill',
  },
  {
    key: 'bill',
    icon: creditCardIcon,
    en: 'Bills Management',
    kh: 'គ្រប់គ្រងប៊ីលទាំងអស់',
    descEn: 'Track open, partial, due and settled vendor invoices in one central ledger.',
    descKh: 'តាមដានប៊ីលមិនទាន់បង់ បង់មួយផ្នែក និងបានទូទាត់រួច។',
    color: '#06b6d4',
    bg: 'rgba(6, 182, 212, 0.12)',
    category: 'bills',
    tag: 'Ledger',
    route: '/admin/payable-management/bill',
  },
  {
    key: 'bill-payment',
    icon: walletIcon,
    en: 'Bill Payment',
    kh: 'ការបង់ប្រាក់ប៊ីល',
    descEn: 'Execute bank transfers, print payment vouchers, and clear vendor liabilities.',
    descKh: 'ផ្ទេរប្រាក់តាមធនាគារ បោះពុម្ពប័ណ្ណទូទាត់ និងកាត់កងបំណុល។',
    color: '#77BC1F',
    bg: 'rgba(119, 188, 31, 0.12)',
    category: 'bills',
    tag: 'Disbursement',
    route: '/admin/payable-management/bill-payment',
  },
  {
    key: 'enter-freight',
    icon: travelIcon,
    en: 'Freight Invoices',
    kh: 'វិក័យប័ត្រដឹកជញ្ជូន',
    descEn: 'Record shipping, port demurrage, and customs carrier charges.',
    descKh: 'កត់ត្រាថ្លៃដឹកជញ្ជូន ថ្លៃលើកដាក់កំពង់ផែ និងពន្ធគយ។',
    color: '#FF9900',
    bg: 'rgba(255, 153, 0, 0.12)',
    category: 'bills',
    route: '/admin/payable-management/enter-freight',
  },
]

export const VENDOR_ACCOUNT_MODULES = [
  {
    key: 'supplier-deposit',
    icon: crownIcon,
    en: 'Supplier Deposit',
    kh: 'ប្រាក់កក់អ្នកផ្គត់ផ្គង់',
    descEn: 'Advance procurement downpayments held with key producers and farmers.',
    descKh: 'ប្រាក់កក់មុនដែលបានបង់ជូនកសិករ និងរោងចក្រផលិត។',
    color: '#a855f7',
    bg: 'rgba(168, 85, 247, 0.12)',
    category: 'accounts',
    tag: 'Advance',
    route: '/admin/payable-management/supplier-deposit',
  },
  {
    key: 'supplier-refund',
    icon: dollarIcon,
    en: 'Supplier Refund',
    kh: 'ប្រាក់សងត្រឡប់ពីអ្នកផ្គត់ផ្គង់',
    descEn: 'Collect credits or refunds from vendors for returned or defective products.',
    descKh: 'ទទួលប្រាក់សងត្រឡប់ពីអ្នកផ្គត់ផ្គង់សម្រាប់ទំនិញខូច ឬប្រគល់វិញ។',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.12)',
    category: 'accounts',
    route: '/admin/payable-management/supplier-refund',
  },
  {
    key: 'ap-aging',
    icon: chartIcon,
    en: 'AP Aging Summary',
    kh: 'សង្ខេបបំណុលត្រូវសងតាមអាយុកាល',
    descEn: 'Accounts payable aging brackets to manage cash-flow outflows and credit terms.',
    descKh: 'តារាងបំណុលត្រូវសងតាមកាលកំណត់ ដើម្បីគ្រប់គ្រងលំហូរសាច់ប្រាក់។',
    color: '#ec4899',
    bg: 'rgba(236, 72, 153, 0.12)',
    category: 'accounts',
    tag: 'Audit',
    route: '/admin/report',
  },
  {
    key: 'vendor-statement',
    icon: calculatorIcon,
    en: 'Vendor Statements',
    kh: 'របាយការណ៍គណនីអ្នកផ្គត់ផ្គង់',
    descEn: 'Reconciliation statements of all POs, bills, debits and payments per vendor.',
    descKh: 'របាយការណ៍ផ្ទៀងផ្ទាត់ប៊ីល និងការទូទាត់ប្រាក់លម្អិតតាមអ្នកផ្គត់ផ្គង់។',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.12)',
    category: 'accounts',
    route: '/admin/payable-management',
  },
]

export const ALL_PAYABLE_MODULES = [...VENDOR_BILLING_MODULES, ...VENDOR_ACCOUNT_MODULES]

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
  return (
    <Link
      to={item.route || '/admin/payable-management'}
      className="hub-card group relative overflow-hidden flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#141922]/90 p-4 sm:p-5 text-left transition-all duration-300 hover:border-slate-700 hover:bg-[#1a2230] hover:shadow-xl hover:shadow-black/40"
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
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight group-hover:text-red-300 transition-colors font-['Montserrat']">
            {lang === 'kh' ? item.kh : item.en}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-400 line-clamp-2">
            {lang === 'kh' ? item.descKh : item.descEn}
          </p>
        </div>
      </div>

      <div
        className="relative mt-4 flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs font-bold transition-all"
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

export default function PayableManagement() {
  const { lang } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredModules = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    let list = ALL_PAYABLE_MODULES

    if (activeCategory === 'bills') {
      list = VENDOR_BILLING_MODULES
    } else if (activeCategory === 'accounts') {
      list = VENDOR_ACCOUNT_MODULES
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

  const billsFiltered = useMemo(
    () => filteredModules.filter((s) => s.category === 'bills'),
    [filteredModules]
  )
  const accountsFiltered = useMemo(
    () => filteredModules.filter((s) => s.category === 'accounts'),
    [filteredModules]
  )

  return (
    <div className="space-y-6 text-slate-100" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#0b0f17] p-5 sm:p-7 shadow-2xl shadow-red-500/10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-red-500/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 h-px w-2/3 bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-950/60 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-red-300 transition hover:border-red-400 hover:text-white active:scale-95"
            >
              <ChevronLeftIcon /> {lang === 'en' ? 'Dashboard' : 'ផ្ទាំងគ្រប់គ្រង'}
            </Link>

            <div className="flex items-center gap-3.5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-500/15 p-2 ring-1 ring-red-500/30 shadow-lg shadow-red-500/20">
                <img src={creditCardIcon} alt="" className="h-9 w-9 object-contain drop-shadow-md" />
              </span>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-red-400">
                  {lang === 'en' ? "B'Groceries Accounts Payable" : 'ការគ្រប់គ្រងបំណុល និងប៊ីលត្រូវសង'}
                </p>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {lang === 'en' ? 'Payable Management Hub' : 'មជ្ឈមណ្ឌលគ្រប់គ្រងថ្លៃត្រូវបង់'}
                </h1>
              </div>
            </div>

            <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-300">
              {lang === 'en'
                ? 'Accounts payable management — enter vendor bills, process payments, register supplier deposits, allocate freight, track refunds, and audit vendor ledger balances.'
                : 'គ្រប់គ្រងបំណុលត្រូវសង — បញ្ចូលប៊ីលអ្នកផ្គត់ផ្គង់ បង់ប្រាក់ ប្រាក់កក់មុន ថ្លៃដឹកជញ្ជូន ការសងប្រាក់វិញ និងរបាយការណ៍បំណុល។'}
            </p>
          </div>

          {/* Quick Stats Widget */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:flex lg:flex-col shrink-0 min-w-[220px]">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 shadow-md">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{lang === 'en' ? 'Payable Channels' : 'ម៉ូឌុលត្រូវសង'}</span>
                <span className="text-red-400">● Active</span>
              </div>
              <p className="mt-1 font-mono text-2xl font-black text-white">
                {ALL_PAYABLE_MODULES.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 shadow-md">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{lang === 'en' ? 'Cash Flow' : 'លំហូរសាច់ប្រាក់'}</span>
                <span className="text-emerald-400">● Managed</span>
              </div>
              <p className="mt-1 font-mono text-xs font-semibold text-slate-300">
                Automated Ledger
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SEARCH & CATEGORY FILTER BAR */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-800/80 bg-[#1e293b]/70 backdrop-blur-md p-3.5 shadow-lg">
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
                ? 'Search bills, payments, supplier deposits, freight invoices...'
                : 'ស្វែងរកប៊ីល ការបង់ប្រាក់ ប្រាក់កក់ វិក័យប័ត្រដឹក...'
            }
            className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2 pl-9 pr-8 text-xs font-semibold text-white placeholder-slate-500 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { key: 'all', en: 'All Modules', kh: 'ទាំងអស់', count: ALL_PAYABLE_MODULES.length },
            { key: 'bills', en: 'Vendor Bills & Payments', kh: 'ប៊ីល និងការបង់ប្រាក់', count: VENDOR_BILLING_MODULES.length },
            { key: 'accounts', en: 'Deposits & AP Aging', kh: 'ប្រាក់កក់ និងបំណុលចាស់', count: VENDOR_ACCOUNT_MODULES.length },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveCategory(tab.key)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition whitespace-nowrap active:scale-95 ${
                activeCategory === tab.key
                  ? 'bg-red-500 text-white shadow-md shadow-red-500/20 font-black'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-700/60 hover:text-white hover:border-slate-500'
              }`}
            >
              <span>{lang === 'kh' ? tab.kh : tab.en}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                  activeCategory === tab.key ? 'bg-slate-950 text-red-300' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. FEATURED ACTION CARD */}
      {(!searchQuery || 'enter bill'.includes(searchQuery.toLowerCase())) && (
        <Link
          to="/admin/payable-management/enter-bill"
          className="group relative overflow-hidden flex flex-col gap-3 rounded-2xl border border-red-500/40 bg-gradient-to-r from-red-500/15 via-pink-500/10 to-slate-900/60 p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:border-red-400 hover:shadow-xl hover:shadow-red-500/10 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3.5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-500/20 text-2xl ring-1 ring-red-400/40 shadow-md">
              💳
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white font-['Montserrat']">
                  {lang === 'en' ? 'Direct Vendor Bill Entry' : 'បញ្ចូលប៊ីលអ្នកផ្គត់ផ្គង់រហ័ស'}
                </h3>
                <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-black text-white uppercase tracking-wider">
                  New Entry
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
                {lang === 'en'
                  ? 'Record supplier invoices, match line items with purchase orders, apply tax deductions, and schedule due payments.'
                  : 'កត់ត្រាវិក័យប័ត្រអ្នកផ្គត់ផ្គង់ ផ្ទៀងផ្ទាត់ជាមួយការបញ្ជាទិញ កាត់ពន្ធ និងកំណត់កាលបរិច្ឆេទទូទាត់។'}
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 self-start sm:self-center text-xs font-bold text-red-300 transition-transform group-hover:translate-x-1 shrink-0">
            <span>{lang === 'en' ? 'Enter New Bill' : 'បញ្ចូលប៊ីលថ្មី'}</span>
            <ChevronIcon />
          </span>
        </Link>
      )}

      {/* 4. VENDOR BILLING SECTION */}
      {billsFiltered.length > 0 && (
        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl shadow-black/20 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="h-5 w-1.5 rounded-full bg-red-500" />
              <div>
                <h2 className="text-base font-bold text-white font-['Montserrat']">
                  {lang === 'en' ? 'Vendor Invoices & Disbursements' : 'ប៊ីលអ្នកផ្គត់ផ្គង់ និងការទូទាត់ប្រាក់'}
                </h2>
                <p className="text-[11px] text-slate-400">
                  {lang === 'en' ? 'Enter bills, manage payable ledger, process payments, and record freight' : 'បញ្ចូលប៊ីល គ្រប់គ្រងសៀវភៅបំណុល បង់ប្រាក់ និងកត់ត្រាថ្លៃដឹក'}
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400">{billsFiltered.length} items</span>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {billsFiltered.map((item) => (
              <ModuleCard key={item.key} item={item} lang={lang} />
            ))}
          </div>
        </section>
      )}

      {/* 5. VENDOR ACCOUNTS SECTION */}
      {accountsFiltered.length > 0 && (
        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl shadow-black/20 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="h-5 w-1.5 rounded-full bg-[#77BC1F]" />
              <div>
                <h2 className="text-base font-bold text-white font-['Montserrat']">
                  {lang === 'en' ? 'Deposits & AP Aging Analysis' : 'ប្រាក់កក់ និងវិភាគបំណុលត្រូវសង'}
                </h2>
                <p className="text-[11px] text-slate-400">
                  {lang === 'en'
                    ? 'Supplier advance deposits, refunds, aging bucket reports, and vendor statements'
                    : 'ប្រាក់កក់មុន ប្រាក់សងត្រឡប់ របាយការណ៍បំណុលចាស់ និងរបាយការណ៍គណនី'}
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400">{accountsFiltered.length} items</span>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {accountsFiltered.map((item) => (
              <ModuleCard key={item.key} item={item} lang={lang} />
            ))}
          </div>
        </section>
      )}

      {/* Empty Search State */}
      {filteredModules.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 p-12 text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-3xl">
            🔍
          </div>
          <p className="text-sm font-bold text-white">
            {lang === 'en' ? `No modules found matching "${searchQuery}"` : `រកមិនឃើញម៉ូឌុលដែលត្រូវនឹង "${searchQuery}" ទេ`}
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-slate-700"
          >
            {lang === 'en' ? 'Clear Search' : 'សម្អាតការស្វែងរក'}
          </button>
        </div>
      )}
    </div>
  )
}
