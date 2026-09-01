import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import bagIcon from '../../assets/icon/3dicons-bag-dynamic-color.png'
import travelIcon from '../../assets/icon/3dicons-travel-dynamic-color.png'
import chartIcon from '../../assets/icon/3dicons-chart-dynamic-color.png'
import dollarIcon from '../../assets/icon/3dicons-dollar-dynamic-color.png'
import mailIcon from '../../assets/icon/3dicons-mail-dynamic-color.png'
import fileTextIcon from '../../assets/icon/3dicons-file-text-dynamic-color.png'
import bookmarkIcon from '../../assets/icon/3dicons-bookmark-fav-dynamic-color.png'
import rocketIcon from '../../assets/icon/3dicons-rocket-dynamic-color.png'
import toggleIcon from '../../assets/icon/3dicons-toggle-dynamic-color.png'
import creditCardIcon from '../../assets/icon/3dicons-credit-card-dynamic-color.png'
import clockIcon from '../../assets/icon/3dicons-clock-dynamic-color.png'
import './ProductsHub.css'

export const QUOTE_MODULES = [
  {
    key: 'quotation',
    icon: mailIcon,
    en: 'New Quotation',
    kh: 'សម្រង់តម្លៃថ្មី',
    descEn: 'Draft, negotiate and send professional price quotes to customers.',
    descKh: 'រៀបចំ ចរចា និងផ្ញើសម្រង់តម្លៃជូនអតិថិជន។',
    color: '#3B82F6',
    bg: 'rgba(59, 130, 246, 0.12)',
    category: 'quote',
    tag: 'Core',
    route: '/admin/quotation',
  },
  {
    key: 'quotation-list',
    icon: fileTextIcon,
    en: 'All Quotations',
    kh: 'សម្រង់តម្លៃទាំងអស់',
    descEn: 'Track quotation statuses, revisions, validity periods and approvals.',
    descKh: 'តាមដានស្ថានភាពសម្រង់តម្លៃ សុពលភាព និងការអនុម័ត។',
    color: '#0ea5e9',
    bg: 'rgba(14, 165, 233, 0.12)',
    category: 'quote',
    tag: 'List',
    route: '/admin/quotation',
  },
  {
    key: 'quotation-convert',
    icon: rocketIcon,
    en: 'Convert to Order',
    kh: 'បម្លែងទៅការបញ្ជាទិញ',
    descEn: 'Instantly convert approved customer quotations into confirmed sales orders.',
    descKh: 'បម្លែងសម្រង់តម្លៃដែលបានអនុម័តទៅជាការបញ្ជាទិញលក់ភ្លាមៗ។',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.12)',
    category: 'quote',
    tag: 'Fast',
    route: '/admin/sale-order',
  },
  {
    key: 'quotation-templates',
    icon: bookmarkIcon,
    en: 'Quote Templates',
    kh: 'គំរូសម្រង់តម្លៃ',
    descEn: 'Design and customize printable quote headers, terms, and layouts.',
    descKh: 'រចនា និងកំណត់ទម្រង់សម្រង់តម្លៃដែលអាចបោះពុម្ពបាន។',
    color: '#8b5cf6',
    bg: 'rgba(139, 92, 246, 0.12)',
    category: 'quote',
    route: '/admin/quotation',
  },
]

export const SALES_ORDER_MODULES = [
  {
    key: 'sale-order',
    icon: bagIcon,
    en: 'Create Sale Order',
    kh: 'បង្កើតការបញ្ជាទិញលក់',
    descEn: 'Register direct B2B and retail sales orders with inventory reservation.',
    descKh: 'កត់ត្រាការបញ្ជាទិញលក់ B2B និងរាយ ជាមួយការបម្រុងទុកស្តុក។',
    color: '#77BC1F',
    bg: 'rgba(119, 188, 31, 0.12)',
    category: 'orders',
    tag: 'Core',
    route: '/admin/sale-order',
  },
  {
    key: 'so-list',
    icon: chartIcon,
    en: 'Sales Orders Hub',
    kh: 'មជ្ឈមណ្ឌលការបញ្ជាទិញ',
    descEn: 'Comprehensive overview of all open, processing, and completed sales orders.',
    descKh: 'ទិដ្ឋភាពទូទៅនៃរាល់ការបញ្ជាទិញលក់ដែលកំពុងដំណើរការ និងបានបញ្ចប់។',
    color: '#14b8a6',
    bg: 'rgba(20, 184, 166, 0.12)',
    category: 'orders',
    tag: 'Popular',
    route: '/admin/sale-order',
  },
  {
    key: 'so-fulfillment',
    icon: toggleIcon,
    en: 'Order Fulfillment',
    kh: 'ការផ្គត់ផ្គង់ការបញ្ជាទិញ',
    descEn: 'Pick, pack, verify barcode serials, and release stock for dispatch.',
    descKh: 'រើស ខ្ចប់ ផ្ទៀងផ្ទាត់ និងបញ្ចេញស្តុកសម្រាប់ការដឹកជញ្ជូន។',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.12)',
    category: 'orders',
    route: '/admin/shipment',
  },
  {
    key: 'so-invoices',
    icon: dollarIcon,
    en: 'Order Invoicing',
    kh: 'វិក័យប័ត្របញ្ជាទិញ',
    descEn: 'Generate official tax invoices and issue payment requests from orders.',
    descKh: 'បង្កើតវិក័យប័ត្រពន្ធផ្លូវការ និងស្នើសុំការទូទាត់។',
    color: '#ec4899',
    bg: 'rgba(236, 72, 153, 0.12)',
    category: 'orders',
    route: '/admin/sale-dashboard/sale-invoice',
  },
]

export const SHIPMENT_MODULES = [
  {
    key: 'web-order',
    icon: travelIcon,
    en: 'Web Orders',
    kh: 'ការបញ្ជាទិញលើវេបសាយ',
    descEn: 'Live customer orders streaming directly from the online supermarket storefront.',
    descKh: 'ការបញ្ជាទិញផ្ទាល់ពីអតិថិជនតាមរយៈគេហទំព័រផ្សារទំនើប។',
    color: '#FF9900',
    bg: 'rgba(255, 153, 0, 0.12)',
    category: 'shipments',
    tag: 'Live Sync',
    route: '/admin/web-order',
  },
  {
    key: 'shipment',
    icon: travelIcon,
    en: 'Dispatch & Shipment',
    kh: 'ការដឹកជញ្ជូនចេញ',
    descEn: 'Assign drivers, print shipping manifests, and track outbound parcels.',
    descKh: 'ចាត់តាំងអ្នកបើកបរ បោះពុម្ពប័ណ្ណដឹក និងតាមដានកញ្ចប់ទំនិញ។',
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.12)',
    category: 'shipments',
    tag: 'Core',
    route: '/admin/shipment',
  },
  {
    key: 'shipment-track',
    icon: clockIcon,
    en: 'Live Tracking',
    kh: 'តាមដានការដឹកជញ្ជូន',
    descEn: 'Real-time delivery milestones, recipient signature proof, and ETA statuses.',
    descKh: 'ស្ថានភាពដឹកជញ្ជូនជាក់ស្តែង ការបញ្ជាក់ហត្ថលេខា និងពេលវេលាដល់។',
    color: '#06b6d4',
    bg: 'rgba(6, 182, 212, 0.12)',
    category: 'shipments',
    route: '/admin/shipment',
  },
  {
    key: 'return-shipment',
    icon: creditCardIcon,
    en: 'Return Shipments',
    kh: 'ការបញ្ជូនត្រឡប់',
    descEn: 'Process customer returns, damaged goods inspection, and replacement shipping.',
    descKh: 'ដំណើរការការប្រគល់ទំនិញត្រឡប់ និងការពិនិត្យទំនិញខូចខាត។',
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.12)',
    category: 'shipments',
    route: '/admin/return-shipment',
  },
]

export const ALL_ORDER_MODULES = [...QUOTE_MODULES, ...SALES_ORDER_MODULES, ...SHIPMENT_MODULES]

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
      to={item.route || '/admin/order-management'}
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
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight group-hover:text-green-300 transition-colors font-['Montserrat']">
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

export default function OrderManagement() {
  const { lang } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredModules = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    let list = ALL_ORDER_MODULES

    if (activeCategory === 'quote') {
      list = QUOTE_MODULES
    } else if (activeCategory === 'orders') {
      list = SALES_ORDER_MODULES
    } else if (activeCategory === 'shipments') {
      list = SHIPMENT_MODULES
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

  const quoteFiltered = useMemo(
    () => filteredModules.filter((s) => s.category === 'quote'),
    [filteredModules]
  )
  const ordersFiltered = useMemo(
    () => filteredModules.filter((s) => s.category === 'orders'),
    [filteredModules]
  )
  const shipmentsFiltered = useMemo(
    () => filteredModules.filter((s) => s.category === 'shipments'),
    [filteredModules]
  )

  return (
    <div className="space-y-6 text-slate-100" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      {/* 1. HERO BANNER WITH DYNAMIC GLOW & LIVE KPIS */}
      <section className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#0b0f17] p-5 sm:p-7 shadow-2xl shadow-blue-500/10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 h-px w-2/3 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-950/60 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-blue-300 transition hover:border-blue-400 hover:text-white active:scale-95"
            >
              <ChevronLeftIcon /> {lang === 'en' ? 'Dashboard' : 'ផ្ទាំងគ្រប់គ្រង'}
            </Link>

            <div className="flex items-center gap-3.5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-500/15 p-2 ring-1 ring-blue-500/30 shadow-lg shadow-blue-500/20">
                <img src={travelIcon} alt="" className="h-9 w-9 object-contain drop-shadow-md" />
              </span>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-blue-400">
                  {lang === 'en' ? "B'Groceries Sales & Fulfillment" : 'ការលក់ និងការដឹកជញ្ជូន'}
                </p>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {lang === 'en' ? 'Order Management Hub' : 'មជ្ឈមណ្ឌលគ្រប់គ្រងការបញ្ជាទិញ'}
                </h1>
              </div>
            </div>

            <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-300">
              {lang === 'en'
                ? 'End-to-end sales lifecycle — prepare price quotations, confirm B2B sales orders, process web store orders, dispatch courier deliveries and manage returns.'
                : 'វដ្តការលក់ពេញលេញ — រៀបចំសម្រង់តម្លៃ បញ្ជាក់ការបញ្ជាទិញលក់ B2B ដំណើរការការបញ្ជាទិញលើគេហទំព័រ ចាត់ចែងការដឹកជញ្ជូន និងគ្រប់គ្រងការត្រឡប់។'}
            </p>
          </div>

          {/* Quick Stats Widget */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:flex lg:flex-col shrink-0 min-w-[220px]">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 shadow-md">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{lang === 'en' ? 'Order Pipelines' : 'ដំណើរការបញ្ជាទិញ'}</span>
                <span className="text-blue-400">● Active</span>
              </div>
              <p className="mt-1 font-mono text-2xl font-black text-white">
                {ALL_ORDER_MODULES.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 shadow-md">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{lang === 'en' ? 'Web Sync' : 'សមស្របតាមគេហទំព័រ'}</span>
                <span className="text-emerald-400">● Online</span>
              </div>
              <p className="mt-1 font-mono text-xs font-semibold text-slate-300">
                24/7 Automated
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
                ? 'Search orders, quotes, shipments, web orders...'
                : 'ស្វែងរកការបញ្ជាទិញ សម្រង់តម្លៃ ការដឹកជញ្ជូន...'
            }
            className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2 pl-9 pr-8 text-xs font-semibold text-white placeholder-slate-500 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
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
            { key: 'all', en: 'All Modules', kh: 'ទាំងអស់', count: ALL_ORDER_MODULES.length },
            { key: 'quote', en: 'Quotations', kh: 'សម្រង់តម្លៃ', count: QUOTE_MODULES.length },
            { key: 'orders', en: 'Sales Orders', kh: 'ការបញ្ជាទិញលក់', count: SALES_ORDER_MODULES.length },
            { key: 'shipments', en: 'Shipments', kh: 'ការដឹកជញ្ជូន', count: SHIPMENT_MODULES.length },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveCategory(tab.key)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition whitespace-nowrap active:scale-95 ${
                activeCategory === tab.key
                  ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-700/60 hover:text-white hover:border-slate-500'
              }`}
            >
              <span>{lang === 'kh' ? tab.kh : tab.en}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                  activeCategory === tab.key ? 'bg-slate-950 text-blue-300' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. FEATURED QUICK ACTION CARD */}
      {(!searchQuery || 'create sale order'.includes(searchQuery.toLowerCase())) && (
        <Link
          to="/admin/sale-order"
          className="group relative overflow-hidden flex flex-col gap-3 rounded-2xl border border-blue-500/40 bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-slate-900/60 p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3.5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/20 text-2xl ring-1 ring-blue-400/40 shadow-md">
              🛒
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white font-['Montserrat']">
                  {lang === 'en' ? 'Direct Sales Order Creation' : 'បង្កើតការបញ្ជាទិញលក់ផ្ទាល់'}
                </h3>
                <span className="rounded-full bg-blue-500 px-2 py-0.5 text-[10px] font-black text-white uppercase tracking-wider">
                  Quick Create
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
                {lang === 'en'
                  ? 'Launch order form, attach customer accounts, calculate VAT, reserve warehouse inventory, and issue invoice.'
                  : 'បើកទម្រង់បញ្ជាទិញ ភ្ជាប់គណនីអតិថិជន គណនាពន្ធ បម្រុងទុកស្តុក និងចេញវិក័យប័ត្រ។'}
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 self-start sm:self-center text-xs font-bold text-blue-300 transition-transform group-hover:translate-x-1 shrink-0">
            <span>{lang === 'en' ? 'Create Order' : 'បង្កើតការបញ្ជាទិញ'}</span>
            <ChevronIcon />
          </span>
        </Link>
      )}

      {/* 4. QUOTE MANAGEMENT SECTION */}
      {quoteFiltered.length > 0 && (
        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl shadow-black/20 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="h-5 w-1.5 rounded-full bg-blue-500" />
              <div>
                <h2 className="text-base font-bold text-white font-['Montserrat']">
                  {lang === 'en' ? 'Quote Management' : 'ការគ្រប់គ្រងសម្រង់តម្លៃ'}
                </h2>
                <p className="text-[11px] text-slate-400">
                  {lang === 'en' ? 'Draft, manage and convert customer price quotes' : 'រៀបចំ គ្រប់គ្រង និងបម្លែងសម្រង់តម្លៃជូនអតិថិជន'}
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400">{quoteFiltered.length} items</span>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {quoteFiltered.map((item) => (
              <ModuleCard key={item.key} item={item} lang={lang} />
            ))}
          </div>
        </section>
      )}

      {/* 5. SALES ORDERS SECTION */}
      {ordersFiltered.length > 0 && (
        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl shadow-black/20 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="h-5 w-1.5 rounded-full bg-[#77BC1F]" />
              <div>
                <h2 className="text-base font-bold text-white font-['Montserrat']">
                  {lang === 'en' ? 'Sales Orders & Fulfillment' : 'ការបញ្ជាទិញលក់ និងការផ្គត់ផ្គង់'}
                </h2>
                <p className="text-[11px] text-slate-400">
                  {lang === 'en'
                    ? 'Confirmed sales orders, barcode item picking, packing, and billing'
                    : 'ការបញ្ជាទិញដែលបានបញ្ជាក់ ការរើសទំនិញតាមបារកូដ ការវេចខ្ចប់ និងការចេញវិក័យប័ត្រ'}
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400">{ordersFiltered.length} items</span>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {ordersFiltered.map((item) => (
              <ModuleCard key={item.key} item={item} lang={lang} />
            ))}
          </div>
        </section>
      )}

      {/* 6. WEB ORDERS & SHIPMENT SECTION */}
      {shipmentsFiltered.length > 0 && (
        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl shadow-black/20 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="h-5 w-1.5 rounded-full bg-[#FF9900]" />
              <div>
                <h2 className="text-base font-bold text-white font-['Montserrat']">
                  {lang === 'en' ? 'Web Orders & Shipment Logistics' : 'ការបញ្ជាទិញលើវេបសាយ និងការដឹកជញ្ជូន'}
                </h2>
                <p className="text-[11px] text-slate-400">
                  {lang === 'en'
                    ? 'Online storefront orders, courier assignment, live tracking and return processing'
                    : 'ការបញ្ជាទិញពីវេបសាយ ការចាត់ចែងអ្នកដឹកជញ្ជូន ការតាមដានជាក់ស្តែង និងការប្រគល់ត្រឡប់'}
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400">{shipmentsFiltered.length} items</span>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {shipmentsFiltered.map((item) => (
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
          <p className="text-xs text-slate-400">
            {lang === 'en' ? 'Try searching for quotation, sales order, web order or shipment.' : 'សូមសាកល្បងស្វែងរកសម្រង់តម្លៃ ការបញ្ជាទិញ ឬការដឹកជញ្ជូន។'}
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
