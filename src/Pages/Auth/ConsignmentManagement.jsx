import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import cubeIcon from '../../assets/icon/3dicons-cube-dynamic-color.png'
import travelIcon from '../../assets/icon/3dicons-travel-dynamic-color.png'
import bookmarkIcon from '../../assets/icon/3dicons-bookmark-fav-dynamic-color.png'
import chartIcon from '../../assets/icon/3dicons-chart-dynamic-color.png'
import moneyBagIcon from '../../assets/icon/3dicons-money-bag-dynamic-color.png'
import fileTextIcon from '../../assets/icon/3dicons-file-text-dynamic-color.png'
import creditCardIcon from '../../assets/icon/3dicons-credit-card-dynamic-color.png'
import clockIcon from '../../assets/icon/3dicons-clock-dynamic-color.png'
import './ProductsHub.css'

export const CONSIGNMENT_OPS = [
  {
    key: 'consignment-shipment',
    icon: travelIcon,
    en: 'Consignment Shipment',
    kh: 'ការដឹកជញ្ជូនបញ្ញើ',
    descEn: 'Issue and dispatch goods to third-party vendor stores on consignment basis.',
    descKh: 'ចេញ និងបញ្ជូនទំនិញទៅកាន់ហាងដៃគូលក់បញ្ញើ។',
    color: '#a855f7',
    bg: 'rgba(168, 85, 247, 0.12)',
    category: 'ops',
    tag: 'Core',
    route: '/admin/consignment-shipment',
  },
  {
    key: 'return-shipment-consignment',
    icon: creditCardIcon,
    en: 'Return Shipment',
    kh: 'ការប្រគល់ទំនិញបញ្ញើត្រឡប់',
    descEn: 'Receive unsold or expired consignment inventory back into central stock.',
    descKh: 'ទទួលទំនិញដែលលក់មិនទាន់អស់ ឬផុតកំណត់ត្រឡប់មកស្តុកកណ្តាល។',
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.12)',
    category: 'ops',
    tag: 'Returns',
    route: '/admin/return-shipment-consignment',
  },
  {
    key: 'consignment-stock',
    icon: cubeIcon,
    en: 'Partner Floor Stock',
    kh: 'ស្តុកនៅហាងដៃគូ',
    descEn: 'Track live stock quantities stationed at external partner locations.',
    descKh: 'តាមដានចំនួនស្តុកជាក់ស្តែងដែលមាននៅទីតាំងហាងដៃគូនានា។',
    color: '#06b6d4',
    bg: 'rgba(6, 182, 212, 0.12)',
    category: 'ops',
    route: '/admin/consignment',
  },
]

export const CONSIGNMENT_FINANCE = [
  {
    key: 'consignment-settlement',
    icon: moneyBagIcon,
    en: 'Sales Settlement',
    kh: 'ការទូទាត់លក់បញ្ញើ',
    descEn: 'Audit partner sold stock reports and compute periodic revenue splits.',
    descKh: 'ផ្ទៀងផ្ទាត់របាយការណ៍លក់ និងគណនាចំណែកប្រាក់ចំណូលតាមកាលកំណត់។',
    color: '#77BC1F',
    bg: 'rgba(119, 188, 31, 0.12)',
    category: 'finance',
    tag: 'Revenue',
    route: '/admin/consignment',
  },
  {
    key: 'consignment-contracts',
    icon: bookmarkIcon,
    en: 'Partner Agreements',
    kh: 'កិច្ចសន្យាដៃគូ',
    descEn: 'Define commission rates, return policies, and contractual billing terms.',
    descKh: 'កំណត់អត្រាកម្រៃជើងសារ គោលការណ៍ប្រគល់ត្រឡប់ និងលក្ខខណ្ឌកិច្ចសន្យា។',
    color: '#FF9900',
    bg: 'rgba(255, 153, 0, 0.12)',
    category: 'finance',
    route: '/admin/consignment',
  },
  {
    key: 'consignment-reports',
    icon: chartIcon,
    en: 'Consignment Audit',
    kh: 'របាយការណ៍សវនកម្មបញ្ញើ',
    descEn: 'Comprehensive reconciliation logs between dispatched, sold and returned batches.',
    descKh: 'របាយការណ៍ទូទាត់ផ្ទៀងផ្ទាត់រវាងទំនិញដឹកចេញ លក់រួច និងប្រគល់ត្រឡប់។',
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.12)',
    category: 'finance',
    tag: 'Analytics',
    route: '/admin/report',
  },
]

export const ALL_CONSIGNMENT_MODULES = [...CONSIGNMENT_OPS, ...CONSIGNMENT_FINANCE]

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
      to={item.route || '/admin/consignment'}
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
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight group-hover:text-purple-300 transition-colors font-['Montserrat']">
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

export default function ConsignmentManagement() {
  const { lang } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredModules = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    let list = ALL_CONSIGNMENT_MODULES

    if (activeCategory === 'ops') {
      list = CONSIGNMENT_OPS
    } else if (activeCategory === 'finance') {
      list = CONSIGNMENT_FINANCE
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

  const opsFiltered = useMemo(
    () => filteredModules.filter((s) => s.category === 'ops'),
    [filteredModules]
  )
  const financeFiltered = useMemo(
    () => filteredModules.filter((s) => s.category === 'finance'),
    [filteredModules]
  )

  return (
    <div className="space-y-6 text-slate-100" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      {/* 1. HERO BANNER WITH DYNAMIC GLOW & LIVE KPIS */}
      <section className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#0b0f17] p-5 sm:p-7 shadow-2xl shadow-purple-500/10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-purple-500/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 h-px w-2/3 bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-950/60 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-purple-300 transition hover:border-purple-400 hover:text-white active:scale-95"
            >
              <ChevronLeftIcon /> {lang === 'en' ? 'Dashboard' : 'ផ្ទាំងគ្រប់គ្រង'}
            </Link>

            <div className="flex items-center gap-3.5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-purple-500/15 p-2 ring-1 ring-purple-500/30 shadow-lg shadow-purple-500/20">
                <img src={cubeIcon} alt="" className="h-9 w-9 object-contain drop-shadow-md" />
              </span>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-purple-400">
                  {lang === 'en' ? "B'Groceries Vendor Consignments" : 'ការគ្រប់គ្រងទំនិញបញ្ញើ'}
                </p>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {lang === 'en' ? 'Consignment Management Hub' : 'មជ្ឈមណ្ឌលគ្រប់គ្រងការលក់បញ្ញើ'}
                </h1>
              </div>
            </div>

            <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-300">
              {lang === 'en'
                ? 'Centralized control for off-site consignment inventory — track dispatch shipments to partner outlets, process returned stock, calculate sales splits, and monitor floor quantities.'
                : 'ការគ្រប់គ្រងកណ្តាលសម្រាប់ស្តុកទំនិញបញ្ញើនៅក្រៅទីតាំង — តាមដានការដឹកជញ្ជូនទៅកាន់ហាងដៃគូ ដំណើរការទំនិញប្រគល់ត្រឡប់ គណនាប្រាក់ចំណូលលក់ និងតាមដានចំនួនស្តុកជាក់ស្តែង។'}
            </p>
          </div>

          {/* Quick Stats Widget */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:flex lg:flex-col shrink-0 min-w-[220px]">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 shadow-md">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{lang === 'en' ? 'Active Modules' : 'ម៉ូឌុលសកម្ម'}</span>
                <span className="text-purple-400">● Live</span>
              </div>
              <p className="mt-1 font-mono text-2xl font-black text-white">
                {ALL_CONSIGNMENT_MODULES.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 shadow-md">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{lang === 'en' ? 'Partner Settlement' : 'ការទូទាត់ដៃគូ'}</span>
                <span className="text-emerald-400">● Ready</span>
              </div>
              <p className="mt-1 font-mono text-xs font-semibold text-slate-300">
                Auto Reconciliation
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
                ? 'Search consignment shipments, returns, stock, settlements...'
                : 'ស្វែងរកការដឹកជញ្ជូនបញ្ញើ ការប្រគល់ត្រឡប់ ស្តុក ការទូទាត់...'
            }
            className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2 pl-9 pr-8 text-xs font-semibold text-white placeholder-slate-500 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
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
            { key: 'all', en: 'All Modules', kh: 'ទាំងអស់', count: ALL_CONSIGNMENT_MODULES.length },
            { key: 'ops', en: 'Operations', kh: 'ប្រតិបត្តិការ', count: CONSIGNMENT_OPS.length },
            { key: 'finance', en: 'Settlement & Audit', kh: 'ការទូទាត់ និងសវនកម្ម', count: CONSIGNMENT_FINANCE.length },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveCategory(tab.key)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition whitespace-nowrap active:scale-95 ${
                activeCategory === tab.key
                  ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-700/60 hover:text-white hover:border-slate-500'
              }`}
            >
              <span>{lang === 'kh' ? tab.kh : tab.en}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                  activeCategory === tab.key ? 'bg-slate-950 text-purple-300' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. FEATURED ACTION CARD */}
      {(!searchQuery || 'consignment shipment'.includes(searchQuery.toLowerCase())) && (
        <Link
          to="/admin/consignment-shipment"
          className="group relative overflow-hidden flex flex-col gap-3 rounded-2xl border border-purple-500/40 bg-gradient-to-r from-purple-500/15 via-indigo-500/10 to-slate-900/60 p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-500/10 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3.5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/20 text-2xl ring-1 ring-purple-400/40 shadow-md">
              📦
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white font-['Montserrat']">
                  {lang === 'en' ? 'Consignment Dispatch Center' : 'មជ្ឈមណ្ឌលដឹកជញ្ជូនបញ្ញើ'}
                </h3>
                <span className="rounded-full bg-purple-500 px-2 py-0.5 text-[10px] font-black text-white uppercase tracking-wider">
                  Outbound
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
                {lang === 'en'
                  ? 'Create outbound consignment dispatch notes, print carrier receipts, and assign delivery teams.'
                  : 'បង្កើតប័ណ្ណដឹកជញ្ជូនទំនិញបញ្ញើ បោះពុម្ពវិក័យប័ត្រដឹក និងចាត់តាំងក្រុមដឹកជញ្ជូន។'}
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 self-start sm:self-center text-xs font-bold text-purple-300 transition-transform group-hover:translate-x-1 shrink-0">
            <span>{lang === 'en' ? 'Open Dispatch' : 'បើកការដឹកជញ្ជូន'}</span>
            <ChevronIcon />
          </span>
        </Link>
      )}

      {/* 4. CONSIGNMENT OPERATIONS */}
      {opsFiltered.length > 0 && (
        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl shadow-black/20 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="h-5 w-1.5 rounded-full bg-purple-500" />
              <div>
                <h2 className="text-base font-bold text-white font-['Montserrat']">
                  {lang === 'en' ? 'Consignment Operations' : 'ប្រតិបត្តិការដឹកជញ្ជូនបញ្ញើ'}
                </h2>
                <p className="text-[11px] text-slate-400">
                  {lang === 'en' ? 'Shipments, partner warehouse movement, and returns' : 'ការដឹកជញ្ជូន ចលនាស្តុកដៃគូ និងការប្រគល់ត្រឡប់'}
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400">{opsFiltered.length} items</span>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {opsFiltered.map((item) => (
              <ModuleCard key={item.key} item={item} lang={lang} />
            ))}
          </div>
        </section>
      )}

      {/* 5. SETTLEMENT & AUDIT */}
      {financeFiltered.length > 0 && (
        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl shadow-black/20 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="h-5 w-1.5 rounded-full bg-[#77BC1F]" />
              <div>
                <h2 className="text-base font-bold text-white font-['Montserrat']">
                  {lang === 'en' ? 'Settlement & Partner Agreements' : 'ការទូទាត់ និងកិច្ចសន្យាដៃគូ'}
                </h2>
                <p className="text-[11px] text-slate-400">
                  {lang === 'en'
                    ? 'Sales reconciliations, commission splits, and contract records'
                    : 'ការផ្ទៀងផ្ទាត់ការលក់ ការគណនាកម្រៃជើងសារ និងកំណត់ត្រាកិច្ចសន្យា'}
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400">{financeFiltered.length} items</span>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {financeFiltered.map((item) => (
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
